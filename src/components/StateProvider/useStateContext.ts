import { useContext } from 'react';
import { StateContext, StateContextValue } from './StateContext';

export const useStateContext = (): StateContextValue => {
  return useContext<StateContextValue>(StateContext);
};
