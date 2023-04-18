import { cx } from '@emotion/css';
import React, { useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { ThemeProps, useThemeId } from '@phork/phorkit';
import styles from './PixelatorCanvas.module.css';

export type PixelatorCanvasHandles = {
  canvas: HTMLCanvasElement | null;
};

export type PixelatorCanvasProps = React.HTMLAttributes<HTMLDivElement> &
  ThemeProps & {
    height: number;
    lined?: boolean;
    loaderSize?: number;
    onRenderEnd?: () => void;
    onRenderStart?: () => void;
    pixelate?: boolean;
    /** If the pixelation factor is undefined then the image won't be pixelated */
    pixelationFactor: number | undefined;
    source: string;
    width: number;
  };

export const PixelatorCanvas = React.forwardRef(function PixelatorCanvas(
  {
    className,
    height,
    lined,
    loaderSize,
    onRenderEnd,
    onRenderStart,
    pixelate,
    pixelationFactor,
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

  const renderCanvasImage = useCallback(
    (context: CanvasRenderingContext2D) => {
      const image = new Image(width, height);
      image.src = source;

      if (image.naturalWidth && image.naturalHeight) {
        context?.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, width, height);
      }
    },
    [width, height, source],
  );

  const renderPixelation = useCallback(
    (context: CanvasRenderingContext2D) => {
      if (context && pixelationFactor) {
        for (let y = 0; y < height; y += pixelationFactor) {
          for (let x = 0; x < width; x += pixelationFactor) {
            const originalImageData = context.getImageData(0, 0, width, height).data;
            const pixelIndexPosition = (x + y * width) * 4;

            context.fillStyle = `rgba(
              ${originalImageData[pixelIndexPosition]},
              ${originalImageData[pixelIndexPosition + 1]},
              ${originalImageData[pixelIndexPosition + 2]},
              ${originalImageData[pixelIndexPosition + 3]}
            )`;

            context.fillRect(x, y, pixelationFactor, pixelationFactor);
          }
        }
      }
    },
    [height, pixelationFactor, width],
  );

  const renderLines = useCallback(
    (context: CanvasRenderingContext2D) => {
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
    [height, pixelationFactor, width],
  );

  const render = useCallback(() => {
    if (canvasRef.current) {
      onRenderStart?.();

      const offScreenCanvas = document.createElement('canvas');
      offScreenCanvas.width = canvasRef.current.width;
      offScreenCanvas.height = canvasRef.current.height;

      const offScreenContext = getContext(offScreenCanvas);
      if (offScreenContext) {
        renderCanvasImage(offScreenContext);
        pixelate && renderPixelation(offScreenContext);
        lined && renderLines(offScreenContext);

        const onScreenContext = getContext(canvasRef.current);
        if (onScreenContext) {
          onScreenContext.drawImage(offScreenCanvas, 0, 0);
          onScreenContext.save();
        }
      }

      onRenderEnd?.();
    }
  }, [renderCanvasImage, getContext, lined, onRenderEnd, onRenderStart, pixelate, renderLines, renderPixelation]);

  // render the image when the pixelation factor or the source changes
  useEffect(() => {
    render();
  }, [render, pixelationFactor, pixelate, lined, source]);

  return (
    <div
      className={cx(styles.imageContainer, themeId && !unthemed && styles[`imageContainer--${themeId}`], className)}
      style={{ width, height, ...style }}
      {...props}
    >
      <canvas className={styles.resultImage} height={height} ref={canvasRef} width={width} />
    </div>
  );
});

PixelatorCanvas.displayName = 'PixelatorCanvas';
