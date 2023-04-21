import { cx } from '@emotion/css';
import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { ThemeProps, useThemeId } from '@phork/phorkit';
import { getAveragePixelRgb, getOpaquePixelRgb } from 'utils/color';
import { Pixel } from 'utils/types';
import { getPixelationFactor } from '../../utils/size';
import styles from './PixelatorCanvas.module.css';
import { PixelatorCanvasHandles } from './types';

export type PixelatorCanvasProps = React.HTMLAttributes<HTMLDivElement> &
  ThemeProps & {
    /** This will get the average of the pixel and its neighbors */
    blur?: number;
    /** This is in multiples of PIXELS_PER_GRID, not just pixels */
    gridSize: { x: number; y: number };
    height: number;
    lined?: boolean;
    onRenderEnd?: () => void;
    onRenderStart?: () => void;
    pixelate?: boolean;
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
    onRenderEnd,
    onRenderStart,
    pixelate,
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
    (context: CanvasRenderingContext2D, pixelationFactor: number, width: number, height: number) => {
      if (context && pixelationFactor) {
        const originalImageData = context.getImageData(0, 0, width, height).data;
        const pixels = [];

        for (let y = 0; y < height; y += pixelationFactor) {
          for (let x = 0; x < width; x += pixelationFactor) {
            const { red, green, blue, alpha } = blur
              ? getAverageOpaquePixelRgb(originalImageData, pixelationFactor, width, height, x, y, blur)
              : getOpaquePixelRgb(originalImageData, (x + y * width) * 4);

            pixels.push({
              location: { x: x / pixelationFactor, y: y / pixelationFactor },
              color: {
                red,
                green,
                blue,
              },
            });

            context.fillStyle = `rgba(
              ${red},
              ${green},
              ${blue},
              ${alpha}
            )`;

            context.fillRect(x, y, pixelationFactor, pixelationFactor);
          }
        }

        setPixels?.(pixels);
      }
    },
    [blur, getAverageOpaquePixelRgb, setPixels],
  );

  const renderLines = useCallback(
    (context: CanvasRenderingContext2D, pixelationFactor: number, width: number, height: number) => {
      if (context && pixelationFactor) {
        context.strokeStyle = 'lightgrey';
        context.beginPath();

        for (let x = 0; x <= width; x += pixelationFactor) {
          context.moveTo(x, 0);
          context.lineTo(x, height);
        }
        for (let y = 0; y <= height; y += pixelationFactor) {
          context.moveTo(0, y);
          context.lineTo(width, y);
        }

        context.stroke();
      }
    },
    [],
  );

  const render = useCallback(() => {
    if (canvasRef.current) {
      onRenderStart?.();

      const offScreenCanvas = document.createElement('canvas');
      const offScreenContext = getContext(offScreenCanvas);
      const onScreenContext = getContext(canvasRef.current);

      if (offScreenContext && onScreenContext) {
        const image = new Image();
        image.onload = () => {
          const { pixelationFactor, factoredWidth, factoredHeight } =
            getPixelationFactor(image.naturalWidth, image.naturalHeight, gridSize) || {};

          offScreenCanvas.width = factoredWidth;
          offScreenCanvas.height = factoredHeight;

          // draw everything offscreen at the actual image size for the best quality when determining blur
          offScreenContext?.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            factoredWidth,
            factoredHeight,
          );
          pixelate && renderPixelation(offScreenContext, pixelationFactor, factoredWidth, factoredHeight);
          lined && renderLines(offScreenContext, pixelationFactor, factoredWidth, factoredHeight);

          // render the on screen drawing at the requested size
          onScreenContext.drawImage(offScreenCanvas, 0, 0, factoredWidth, factoredHeight, 0, 0, width, height);
          onScreenContext.save();
        };
        image.src = source;
      }

      onRenderEnd?.();
    }
  }, [
    onRenderStart,
    getContext,
    onRenderEnd,
    source,
    gridSize,
    pixelate,
    renderPixelation,
    lined,
    renderLines,
    width,
    height,
  ]);

  // render the image when the properties change
  useEffect(() => {
    render();
  }, [render, pixelate, lined, source]);

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
