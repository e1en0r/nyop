import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { SvgIconProps, useIconSize } from '@phork/phorkit';

export function UploadIcon({ title, titleId = uuid(), ...initProps }: SvgIconProps): React.ReactElement<SVGElement> {
  const props = useIconSize(initProps);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" aria-labelledby={titleId} {...props}>
      {title === undefined ? (
        <title id={titleId}>{'Upload'}</title>
      ) : title ? (
        <title id={titleId}>{title}</title>
      ) : null}
      <path
        fill="currentColor"
        d="M238.5 0c3.4 0 6.7 1.4 9.2 3.7.4.4 1 .4 1.4.8l106.4 106.4c1.7 1.7 2.7 3.8 3.3 6.1.1.5.2 1 .3 1.6 0 .6.3 1.1.3 1.8v225.5c0 29.5-23.9 53.4-53.3 53.4H93.3c-29.4 0-53.3-23.9-53.3-53.4V53.3C40 23.9 63.9 0 93.3 0zM66.7 53.3v292.6c0 14.8 12 26.8 26.7 26.8h212.7c14.7 0 26.7-12 26.7-26.8V133.7h-53.5c-29.2 0-52.9-23.8-52.9-53V26.6h-133c-14.7 0-26.7 12-26.7 26.7zM253 80.7c0 14.5 11.8 26.3 26.3 26.3h34.6C295.4 88.6 271 64.3 253 46.4zm11.6 164c3.6 0 7.1 1.5 9.6 4.1l40.3 41.5-19 18.5-17.5-17.9v55.5h-26.6v-55L235 308.7l-19.3-18.3 39.3-41.5c2.4-2.6 5.9-4.2 9.6-4.2z"
      />
    </svg>
  );
}

UploadIcon.displayName = 'UploadIcon';
