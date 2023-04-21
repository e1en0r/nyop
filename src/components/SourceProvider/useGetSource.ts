import { useContext } from 'react';
import { SourceContext, SourceContextValue } from './SourceContext';

export const useGetSource = (): SourceContextValue => {
  return useContext<SourceContextValue>(SourceContext);
};
