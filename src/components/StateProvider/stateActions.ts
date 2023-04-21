import { StateValue } from './types';

export enum StateActions {
  RESET = 'RESET',
  SET_BLUR = 'SET_BLUR',
  SET_GRID_SIZE = 'SET_GRID_SIZE',
  SET_LOADING = 'SET_LOADING',
  SET_PIXELATE = 'SET_PIXELATE',
  SET_SHOW_CANVAS = 'SET_SHOW_CANVAS',
  SET_SHOW_GRID_LINES = 'SET_SHOW_GRID_LINES',
  SET_VALID = 'SET_VALID',
}

export type StateActionReset = {
  type: StateActions.RESET;
};

export type StateActionSetBlur = {
  type: StateActions.SET_BLUR;
  blur: StateValue['blur'];
};

export type StateActionSetGridSize = {
  type: StateActions.SET_GRID_SIZE;
  gridSize: StateValue['gridSize'];
};

export type StateActionSetLoading = {
  type: StateActions.SET_LOADING;
  loading: StateValue['loading'];
};

export type StateActionSetPixelate = {
  type: StateActions.SET_PIXELATE;
  pixelate?: StateValue['pixelate'];
};

export type StateActionSetShowCanvas = {
  type: StateActions.SET_SHOW_CANVAS;
  showCanvas?: StateValue['showCanvas'];
};

export type StateActionSetShowGridLines = {
  type: StateActions.SET_SHOW_GRID_LINES;
  showGridLines?: StateValue['showGridLines'];
};

export type StateActionSetValid = {
  type: StateActions.SET_VALID;
  valid?: StateValue['valid'];
};

export type StateAction =
  | StateActionReset
  | StateActionSetBlur
  | StateActionSetGridSize
  | StateActionSetLoading
  | StateActionSetPixelate
  | StateActionSetShowCanvas
  | StateActionSetShowGridLines
  | StateActionSetValid;
