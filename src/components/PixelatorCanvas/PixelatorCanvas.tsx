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
    loaderSize?: number;
    onRenderEnd?: () => void;
    onRenderStart?: () => void;
    /** If the pixelation factor is undefined then the image won't be pixelated */
    pixelationFactor: number | undefined;
    source: string;
    width: number;
  };

export const PixelatorCanvas = React.forwardRef(function PixelatorCanvas(
  {
    className,
    height,
    loaderSize,
    onRenderEnd,
    onRenderStart,
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

  const createCanvasImage = useCallback(() => {
    if (canvasRef.current) {
      const image = new Image(width, height);
      image.src = source;

      if (image.naturalWidth && image.naturalHeight) {
        const context = canvasRef.current.getContext('2d', { willReadFrequently: true });
        context?.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, width, height);

        return context;
      }
    }
    return undefined;
  }, [width, height, source]);

  const pixelateImage = useCallback(() => {
    if (canvasRef.current) {
      onRenderStart?.();

      const context = createCanvasImage();
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

      onRenderEnd?.();
    }
  }, [createCanvasImage, height, onRenderEnd, onRenderStart, pixelationFactor, width]);

  // pixelate the image when the loading state changes to true
  useEffect(() => {
    pixelateImage();
  }, [pixelateImage, pixelationFactor, source]);

  return (
    <div
      className={cx(styles.imageContainer, themeId && !unthemed && styles[`imageContainer--${themeId}`], className)}
      style={{ width, height, ...style }}
      {...props}
    >
      {pixelationFactor ? (
        <canvas className={styles.resultImage} height={height} ref={canvasRef} width={width} />
      ) : (
        <img alt="source" height={height} src={source} width={width} />
      )}
    </div>
  );
});

PixelatorCanvas.displayName = 'PixelatorCanvas';
