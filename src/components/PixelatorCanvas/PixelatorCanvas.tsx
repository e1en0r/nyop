import { cx } from '@emotion/css';
import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { ThemeProps, useThemeId } from '@phork/phorkit';
import { getAveragePixelRgb, getOpaquePixelRgb } from 'utils/color';
import { getPixelationFactor } from 'utils/size';
import { GridSize, Pixel, PixelationFactor } from 'utils/types';
import styles from './PixelatorCanvas.module.css';
import { PixelatorCanvasHandles } from './types';

export type PixelatorCanvasProps = React.HTMLAttributes<HTMLDivElement> &
  ThemeProps & {
    /** This will get the average of the pixel and its neighbors */
    blur?: number;
    /** This is in multiples of PIXELS_PER_GRID, not just pixels */
    gridSize: GridSize;
    height: number;
    /** Whether to render the grid lines */
    lined?: boolean;
    onError?: (error: string) => void;
    onRenderEnd?: () => void;
    onRenderStart?: () => void;
    /** The generated pixels can be used by the parent component */
    setPixels?: (p: Pixel[]) => void;
    source: string;
    width: number;
  };

export const PixelatorCanvas = React.forwardRef(function PixelatorCanvas(
  {
    blur = 0,
    className,
    gridSize,
    height,
    lined,
    onError,
    onRenderEnd,
    onRenderStart,
    setPixels,
    source,
    style,
    themeId: initThemeId,
    unthemed,
    width,
    ...props
  }: PixelatorCanvasProps,
  forwardedRef: React.ForwardedRef<PixelatorCanvasHandles | undefined>,
): JSX.Element {
  const themeId = useThemeId(initThemeId);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // the parent component can call forwardedRef.current.canvas
  useImperativeHandle(forwardedRef, () => ({
    get canvas(): HTMLCanvasElement | null {
      return canvasRef.current;
    },
  }));

  const getContext = useCallback(
    (canvas: HTMLCanvasElement) => canvas.getContext('2d', { willReadFrequently: true }),
    [],
  );

  // https://stackoverflow.com/a/45969661
  const getAverageOpaquePixelRgb = useCallback(
    (
      originalImageData: Uint8ClampedArray,
      pixelationFactor: number,
      width: number,
      height: number,
      x: number,
      y: number,
      blur: number,
    ) => {
      const neighborRange = Math.round(pixelationFactor * (blur / 100));

      const pixels = [];
      if (neighborRange) {
        const numRows = height / pixelationFactor;
        const numColumns = width / pixelationFactor;
        const startX = Math.max(0, x - 4 * neighborRange);
        const startY = Math.max(0, y - 4 * neighborRange);
        const stopX = Math.min((numColumns - 1) * pixelationFactor, x + 4 * neighborRange);
        const stopY = Math.min((numRows - 1) * pixelationFactor, y + 4 * neighborRange);

        for (let pixelX = startX; pixelX < stopX; pixelX += 1) {
          for (let pixelY = startY; pixelY < stopY; pixelY += 1) {
            pixels.push(getOpaquePixelRgb(originalImageData, (pixelX + pixelY * width) * 4));
          }
        }
      } else {
        pixels.push(getOpaquePixelRgb(originalImageData, (x + y * width) * 4));
      }

      return getAveragePixelRgb(pixels);
    },
    [],
  );

  const renderPixelation = useCallback(
    (
      destinationContext: CanvasRenderingContext2D,
      destinationPixelation: PixelationFactor,
      sourceContext: CanvasRenderingContext2D,
      sourcePixelation: PixelationFactor,
    ) => {
      if (destinationContext && destinationPixelation) {
        const pixels = [];
        const originalImageData = sourceContext.getImageData(
          0,
          0,
          sourcePixelation.factoredWidth,
          sourcePixelation.factoredHeight,
        ).data;

        for (let y = 0; y < sourcePixelation.factoredHeight; y += sourcePixelation.pixelationFactor) {
          for (let x = 0; x < sourcePixelation.factoredWidth; x += sourcePixelation.pixelationFactor) {
            const { red, green, blue, alpha } = blur
              ? getAverageOpaquePixelRgb(
                  originalImageData,
                  sourcePixelation.pixelationFactor,
                  sourcePixelation.factoredWidth,
                  sourcePixelation.factoredHeight,
                  x,
                  y,
                  blur,
                )
              : getOpaquePixelRgb(originalImageData, (x + y * sourcePixelation.factoredWidth) * 4);

            // the pixels can be used by the parent component if they've passed `setPixels`
            if (setPixels) {
              pixels.push({
                location: { x: x / sourcePixelation.pixelationFactor, y: y / sourcePixelation.pixelationFactor },
                color: {
                  red,
                  green,
                  blue,
                },
              });
            }

            destinationContext.fillStyle = `rgba(
              ${red},
              ${green},
              ${blue},
              ${alpha}
            )`;

            destinationContext.fillRect(
              (x / sourcePixelation.pixelationFactor) * destinationPixelation.pixelationFactor,
              (y / sourcePixelation.pixelationFactor) * destinationPixelation.pixelationFactor,
              destinationPixelation.pixelationFactor,
              destinationPixelation.pixelationFactor,
            );
          }
        }

        setPixels?.(pixels);
      }
    },
    [blur, getAverageOpaquePixelRgb, setPixels],
  );

  const renderGridLines = useCallback(
    (destinationContext: CanvasRenderingContext2D, destinationPixelation: PixelationFactor) => {
      if (destinationContext && destinationPixelation) {
        destinationContext.strokeStyle = 'lightgrey';
        destinationContext.beginPath();

        for (let x = 0; x <= destinationPixelation.factoredWidth; x += destinationPixelation.pixelationFactor) {
          destinationContext.moveTo(x, 0);
          destinationContext.lineTo(x, destinationPixelation.factoredHeight);
        }
        for (let y = 0; y <= destinationPixelation.factoredHeight; y += destinationPixelation.pixelationFactor) {
          destinationContext.moveTo(0, y);
          destinationContext.lineTo(destinationPixelation.factoredWidth, y);
        }

        destinationContext.stroke();
      }
    },
    [],
  );

  const render = useCallback(() => {
    if (canvasRef.current) {
      onRenderStart?.();

      const onScreenContext = getContext(canvasRef.current);
      if (onScreenContext) {
        const image = new Image();
        image.onload = () => {
          const destinationCanvas = document.createElement('canvas');
          const destinationContext = getContext(destinationCanvas);
          const destinationPixelation = getPixelationFactor(width, height, gridSize) || {};
          destinationCanvas.width = destinationPixelation.factoredWidth;
          destinationCanvas.height = destinationPixelation.factoredHeight;

          if (destinationContext) {
            // copy the source image to an off-screen canvas at (or near) its actual size
            const sourceCanvas = document.createElement('canvas');
            const sourceContext = getContext(sourceCanvas);
            const sourcePixelation = getPixelationFactor(image.naturalWidth, image.naturalHeight, gridSize) || {};
            sourceCanvas.width = sourcePixelation.factoredWidth;
            sourceCanvas.height = sourcePixelation.factoredHeight;

            if (sourceContext) {
              sourceContext.drawImage(
                image,
                0,
                0,
                image.naturalWidth,
                image.naturalHeight,
                0,
                0,
                sourcePixelation.factoredWidth,
                sourcePixelation.factoredHeight,
              );

              // draw an off-screen pixelated image at the final rendered size
              renderPixelation(destinationContext, destinationPixelation, sourceContext, sourcePixelation);
            } else {
              return onError?.('Unable to get source context.');
            }

            if (lined) {
              renderGridLines(destinationContext, destinationPixelation);
            }

            // copy the off-screen image to the on-screen canvas
            onScreenContext.drawImage(
              destinationCanvas,
              0,
              0,
              destinationPixelation.factoredWidth,
              destinationPixelation.factoredHeight,
              0,
              0,
              width,
              height,
            );
            onScreenContext.save();

            onRenderEnd?.();
          } else {
            return onError?.('Unable to get destination context.');
          }
        };
        image.src = source;
      } else {
        return onError?.('Unable to get on screen context.');
      }
    }
  }, [
    getContext,
    gridSize,
    height,
    lined,
    onError,
    onRenderEnd,
    onRenderStart,
    renderGridLines,
    renderPixelation,
    source,
    width,
  ]);

  // render the image when the properties change
  useEffect(render, [render]);

  return (
    <div
      className={cx(styles.container, themeId && !unthemed && styles[`container--${themeId}`], className)}
      style={{ width, height, ...style }}
      {...props}
    >
      <canvas className={styles.canvas} height={height} ref={canvasRef} width={width} />
    </div>
  );
});

PixelatorCanvas.displayName = 'PixelatorCanvas';
