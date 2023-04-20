import { DEFAULT_STATE } from './config';
import { StateActions as ACTIONS, StateAction } from './stateActions';
import { StateValue } from './types';

export function StateReducer(state: StateValue, action: StateAction): StateValue {
  switch (action.type) {
    case ACTIONS.RESET:
      return {
        ...DEFAULT_STATE,
      };

    case ACTIONS.SET_BLUR:
      return {
        ...state,
        blur: action.blur,
      };

    case ACTIONS.SET_GRID_SIZE:
      return {
        ...state,
        gridSize: action.gridSize,
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };

    case ACTIONS.SET_PIXELATE:
      return {
        ...state,
        pixelate: action.pixelate,
      };

    case ACTIONS.SET_PIXELATION_FACTOR:
      return {
        ...state,
        pixelationFactor: action.pixelationFactor,
      };

    case ACTIONS.SET_SHOW_CANVAS:
      return {
        ...state,
        showCanvas: action.showCanvas,
      };

    case ACTIONS.SET_SHOW_GRID_LINES:
      return {
        ...state,
        showGridLines: action.showGridLines,
      };

    case ACTIONS.SET_VALID:
      return {
        ...state,
        valid: action.valid,
      };

    default:
      return state;
  }
}
