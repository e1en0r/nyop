import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { SvgIconProps, useIconSize } from '@phork/phorkit';

export function CodeIcon({ title, titleId = uuid(), ...initProps }: SvgIconProps): React.ReactElement<SVGElement> {
  const props = useIconSize(initProps);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" aria-labelledby={titleId} {...props}>
      {title === undefined ? <title id={titleId}>{'Code'}</title> : title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="currentColor"
        d="M118.6 86.3c-4.4-4.2-11.4-4-15.5.4L3.2 192.4c-4 4.3-4 10.9 0 15.1l99.9 105.8c2.1 2.3 5 3.4 7.9 3.4 2.8 0 5.5-1 7.6-3 4.4-4.1 4.6-11.1.4-15.5L26.3 200l92.7-98.2c4.2-4.4 4-11.4-.4-15.5zm278.2 106.2L296.9 86.7c-4.1-4.4-11.1-4.6-15.5-.4-4.4 4.1-4.6 11.1-.4 15.5l92.7 98.2-92.7 98.2c-4.2 4.4-4 11.4.4 15.5 2.1 2 4.8 3 7.5 3 3 0 5.9-1.1 8-3.4l99.9-105.7c4-4.2 4-10.9 0-15.1zM244 85.4c-5.7-2.2-12 .6-14.2 6.3l-80.1 208.7c-2.2 5.7.6 12 6.3 14.2 1.3.5 2.6.7 3.9.7 4.5 0 8.6-2.6 10.3-7l80.1-208.7c2.2-5.7-.7-12-6.3-14.2z"
      />
    </svg>
  );
}

CodeIcon.displayName = 'CodeIcon';
