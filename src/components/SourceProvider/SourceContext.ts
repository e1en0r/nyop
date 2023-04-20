import { createContext } from 'react';

export type ImageSource =
  | undefined
  | {
      src: string;
      width: number;
      height: number;
    };

export type SourceContextValue = [ImageSource, (source: ImageSource) => void];

export const SourceContext = createContext<SourceContextValue>([undefined, () => undefined]);
