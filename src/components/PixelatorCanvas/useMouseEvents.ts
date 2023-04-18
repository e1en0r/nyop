import copy from 'copy-to-clipboard';
import { useCallback, useMemo, useState } from 'react';
import { rgbToHex } from 'utils/color';
import { PixelatorCanvasHandles } from './types';

type CanvasMouseEventCoords = { x: number; y: number };

export type UseMouseEventsProps = {
  canvasRef: React.MutableRefObject<PixelatorCanvasHandles | undefined>;
  pixelationFactor: number | undefined;
};

export type UseMouseEventsResponse = {
  color?: string;
  coords?: CanvasMouseEventCoords;
  highlight?: CanvasMouseEventCoords;
  handleCanvasClick: React.MouseEventHandler<HTMLDivElement>;
  handleCanvasMove: React.MouseEventHandler<HTMLDivElement>;
  handleCanvasExit: React.MouseEventHandler<HTMLDivElement>;
  reset: () => void;
};

export function useMouseEvents({ canvasRef, pixelationFactor }: UseMouseEventsProps): UseMouseEventsResponse {
  const [color, setColor] = useState<string>();
  const [coords, setCoords] = useState<CanvasMouseEventCoords>();
  const [highlight, setHighlight] = useState<CanvasMouseEventCoords>();

  const getCanvasEventCoords = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = canvasRef.current?.canvas?.getBoundingClientRect();
      if (rect) {
        const gridX = event.clientX - rect.left;
        const gridY = event.clientY - rect.top;

        return {
          gridX,
          gridY,
          x: pixelationFactor && gridX !== undefined ? Math.floor(gridX / pixelationFactor) : undefined,
          y: pixelationFactor && gridY !== undefined ? Math.floor(gridY / pixelationFactor) : undefined,
        };
      }
      return undefined;
    },
    [canvasRef, pixelationFactor],
  );

  const getCanvasCoordsColor = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const canvas = canvasRef?.current;
      if (canvas) {
        const context = canvasRef?.current?.canvas?.getContext('2d', { willReadFrequently: true });
        if (context) {
          const { gridX, gridY } = getCanvasEventCoords(event) || {};
          if (gridX !== undefined && gridY !== undefined) {
            const pixelData = context.getImageData(gridX, gridY, 1, 1).data;
            return ('000000' + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6).toUpperCase();
          }
        }
      }
      return undefined;
    },
    [canvasRef, getCanvasEventCoords],
  );

  const handleCanvasClick = useCallback<React.MouseEventHandler<HTMLDivElement>>(
    event => {
      const { x, y } = getCanvasEventCoords(event) || {};
      setHighlight(currentHighlight => {
        if (currentHighlight?.x === x && currentHighlight?.y === y) {
          return undefined;
        }
        if (x !== undefined && y !== undefined) {
          return { x, y };
        }
        return undefined;
      });

      copy(getCanvasCoordsColor(event) || '');
    },
    [getCanvasCoordsColor, getCanvasEventCoords],
  );

  const handleCanvasMove = useCallback<React.MouseEventHandler<HTMLDivElement>>(
    event => {
      setColor(getCanvasCoordsColor(event));

      const { x, y } = getCanvasEventCoords(event) || {};
      setCoords(currentCoords => {
        if (currentCoords?.x === x && currentCoords?.y === y) {
          return currentCoords;
        }
        if (x !== undefined && y !== undefined) {
          return { x, y };
        }
        return undefined;
      });
    },
    [getCanvasCoordsColor, getCanvasEventCoords],
  );

  const handleCanvasExit = useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
    setCoords(undefined);
    setColor(undefined);
  }, []);

  const reset = useCallback(() => {
    setColor(undefined);
    setCoords(undefined);
  }, []);

  return useMemo(
    () => ({
      color,
      coords,
      highlight,
      handleCanvasClick,
      handleCanvasMove,
      handleCanvasExit,
      reset,
    }),
    [color, coords, highlight, handleCanvasClick, handleCanvasExit, handleCanvasMove, reset],
  );
}
