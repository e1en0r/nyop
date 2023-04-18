import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { SvgIconProps, useIconSize } from '@phork/phorkit';

export function InfoIcon({ title, titleId = uuid(), ...initProps }: SvgIconProps): React.ReactElement<SVGElement> {
  const props = useIconSize(initProps);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" aria-labelledby={titleId} {...props}>
      {title === undefined ? <title id={titleId}>{'Info'}</title> : title ? <title id={titleId}>{title}</title> : null}
      <g fill="currenColor">
        <path d="M200.4 399c-39.5 0-78.1-11.7-111-33.6-32.8-21.9-58.4-53.1-73.5-89.5C.7 239.4-3.2 199.3 4.5 160.6c7.7-38.8 26.7-74.3 54.6-102.2 28-27.9 63.5-47 102.3-54.6 38.7-7.7 78.9-3.8 115.4 11.3 36.5 15.1 67.6 40.7 89.6 73.5 21.9 32.9 33.6 71.5 33.6 110.9-.1 52.9-21.1 103.6-58.5 141A200.29 200.29 0 01200.4 399zm0-370.1c-33.8 0-66.8 10-94.9 28.7-28.1 18.8-50 45.4-62.9 76.6-12.9 31.2-16.3 65.5-9.7 98.6 6.5 33.1 22.8 63.5 46.7 87.3 23.9 23.9 54.3 40.2 87.4 46.8 33.1 6.5 67.4 3.2 98.6-9.7 31.2-12.9 57.9-34.8 76.7-62.9 18.7-28 28.8-61 28.8-94.8C371 154.3 353 110.9 321 79c-32-32-75.3-50-120.6-50.1z" />
        <path d="M200.4 154.7c-12.8 0-23.2-10.3-23.2-23.1s10.4-23.2 23.2-23.2c12.8 0 23.2 10.4 23.2 23.2 0 12.8-10.4 23.1-23.2 23.1zM182.4 172.5h35.9v118.1h-35.9z" />
      </g>
    </svg>
  );
}

InfoIcon.displayName = 'InfoIcon';
