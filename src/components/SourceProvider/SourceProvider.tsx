import React, { useState } from 'react';
import { ImageSource, SourceContext } from './SourceContext';

export type SourceProviderProps = {
  children: React.ReactElement;
};

export function SourceProvider({ children }: SourceProviderProps): JSX.Element {
  const state = useState<ImageSource>();

  return <SourceContext.Provider value={state}>{children}</SourceContext.Provider>;
}

SourceProvider.displayName = 'SourceProvider';
