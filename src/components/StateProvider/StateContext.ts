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
  setShowCanvas: (showCanvas?: StateValue['showCanvas']) => void;
  setShowGridLines: (showGridLines?: StateValue['showGridLines']) => void;
  setValid: (valid?: boolean) => void;
};

export const StateContext = createContext<StateContextValue>({
  state: DEFAULT_STATE,
  reset: () => undefined,
  setBlur: (/* blur */) => undefined,
  setGridSize: (/* gridSize */) => undefined,
  setLoading: (/* loading */) => undefined,
  setShowCanvas: (/* showCanvas */) => undefined,
  setShowGridLines: (/* showGridLines */) => undefined,
  setValid: (/* valid */) => undefined,
});
