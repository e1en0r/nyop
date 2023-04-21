import React, { useCallback, useMemo, useReducer, Reducer } from 'react';
import { StateContext, StateContextValue } from './StateContext';
import { DEFAULT_STATE } from './config';
import { StateActions as ACTIONS, StateAction } from './stateActions';
import { StateReducer as reducer } from './stateReducer';
import { StateValue } from './types';

export type StateProviderProps = {
  children: React.ReactNode;
};

export function StateProvider({ children }: StateProviderProps): JSX.Element {
  const [state, dispatch] = useReducer<Reducer<StateValue, StateAction>>(reducer, DEFAULT_STATE);

  const setBlur = useCallback<StateContextValue['setBlur']>(
    blur =>
      dispatch({
        type: ACTIONS.SET_BLUR,
        blur,
      }),
    [],
  );

  const setGridSize = useCallback<StateContextValue['setGridSize']>(
    gridSize =>
      dispatch({
        type: ACTIONS.SET_GRID_SIZE,
        gridSize,
      }),
    [],
  );

  const setLoading = useCallback<StateContextValue['setLoading']>(
    loading =>
      dispatch({
        type: ACTIONS.SET_LOADING,
        loading,
      }),
    [],
  );

  const setPixelate = useCallback<StateContextValue['setPixelate']>(
    pixelate =>
      dispatch({
        type: ACTIONS.SET_PIXELATE,
        pixelate,
      }),
    [],
  );

  const setShowCanvas = useCallback<StateContextValue['setShowCanvas']>(
    showCanvas =>
      dispatch({
        type: ACTIONS.SET_SHOW_CANVAS,
        showCanvas,
      }),
    [],
  );

  const setShowGridLines = useCallback<StateContextValue['setShowGridLines']>(
    showGridLines =>
      dispatch({
        type: ACTIONS.SET_SHOW_GRID_LINES,
        showGridLines,
      }),
    [],
  );

  const setValid = useCallback<StateContextValue['setValid']>(valid => {
    dispatch({
      type: ACTIONS.SET_VALID,
      valid,
    });
  }, []);

  const reset = useCallback<StateContextValue['reset']>(
    () =>
      dispatch({
        type: ACTIONS.RESET,
      }),
    [],
  );

  const value = useMemo(
    () => ({
      reset,
      setBlur,
      setGridSize,
      setLoading,
      setPixelate,
      setShowCanvas,
      setShowGridLines,
      setValid,
      state,
    }),
    [reset, setBlur, setGridSize, setLoading, setPixelate, setShowCanvas, setShowGridLines, setValid, state],
  );

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

StateProvider.displayName = 'StateProvider';
