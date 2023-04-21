/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';
import { DEFAULT_STATE } from './config';
import { StateValue } from './types';

export type StateContextValue = {
  state: StateValue;
  reset: () => void;
  setBlur: (blur: StateValue['blur']) => void;
  setGridSize: (gridSize: StateValue['gridSize']) => void;
  setLoading: (loading: StateValue['loading']) => void;
  setPixelate: (pixelate?: StateValue['pixelate']) => void;
  setShowCanvas: (showCanvas?: StateValue['showCanvas']) => void;
  setShowGridLines: (showGridLines?: StateValue['showGridLines']) => void;
  setValid: (valid?: boolean) => void;
};

export const StateContext = createContext<StateContextValue>({
  state: DEFAULT_STATE,
  reset: () => undefined,
  setBlur: blur_ => undefined,
  setGridSize: gridSize_ => undefined,
  setLoading: loading_ => undefined,
  setPixelate: pixelate_ => undefined,
  setShowCanvas: showCanvas_ => undefined,
  setShowGridLines: showGridLines_ => undefined,
  setValid: valid_ => undefined,
});
