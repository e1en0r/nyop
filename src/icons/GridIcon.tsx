import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { SvgIconProps, useIconSize } from '@phork/phorkit';

export function GridIcon({ title, titleId = uuid(), ...initProps }: SvgIconProps): React.ReactElement<SVGElement> {
  const props = useIconSize(initProps);
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" aria-labelledby={titleId} {...props}>
      {title === undefined ? <title id={titleId}>{'Grid'}</title> : title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="currentColor"
        d="M13.3 0H388q.7.1 1.3.3.5.1.9.3.7.1 1.3.4.2 0 .4.1l.8.4q.2.1.3.2.4.2.9.4.2.1.4.3l.2.2q.3.2.5.3.1.2.2.3.4.3.7.6v.1q.2.1.3.1.9.9 1.5 1.8.1.2.2.3.4.6.7 1.3.3.6.5 1.2.2.4.3.9l.2.4.2 1.2q.1.4.2.9V388.1q-.1.4-.2.9 0 .3-.1.6-.1.5-.3 1v.1q-.1.2-.1.4-.2.4-.3.7l-.4 1q-.1 0-.2.1v.1q-.2.5-.5.9-.2.2-.3.4-.3.4-.5.7-.1.1-.2.3l-.7.7q-.4.5-1 .9 0 .1-.1.2-.1 0-.1.1-.2.1-.3.1-.3.3-.6.5-.1 0-.2.1-.6.4-1.2.7-1 .5-2.2.8-.1.1-.3.2-.8.2-1.8.2-.3.1-.7.2H12.4q-.5-.1-.9-.2-.2.1-.4 0-.2 0-.4-.1-.5 0-1-.1-.1-.1-.3-.2-.4-.1-.9-.2-.2-.1-.3-.2l-1-.4q-.1-.1-.3-.1l-.8-.6q-.1-.1-.3-.1 0-.1-.1-.2-.1 0-.1-.1-.5-.3-.9-.6l-.7-.7-.2-.2q-.3-.4-.6-.7-.1-.2-.3-.3-.1-.1-.1-.3-.1 0-.2-.1l-.4-.4q-.3-.6-.5-1.1l-.6-1.2q-.1-.2-.1-.4l-.4-.8v-.1q-.2-.7-.3-1.3-.1-.1-.2-.3v-.4-.3q0-.3-.1-.7v-124-1.4-123-1.4V13.3q0-1.7.4-3.4.4-1.3 1-2.5.3-.7.7-1.3l.8-1q.4-.5.9-1.1.4-.4.9-.8l1-.8q.6-.4 1.2-.7l1.2-.6Q8.7.8 9.3.6q1.3-.4 2.6-.6h1.4zm13.4 124.5h97.7V26.7H26.7zm124.4 0h97.8V26.7h-97.8zm124.4 0h97.8V26.7h-97.8zM26.7 249h97.7v-97.8H26.7zm124.4 0h97.8v-97.8h-97.8zm124.4 0h97.8v-97.8h-97.8zM26.7 373.5h97.8v-97.8H26.7zm124.4 0h97.8v-97.8h-97.8zm124.5 0h97.7v-97.8h-97.7z"
      />
    </svg>
  );
}

GridIcon.displayName = 'GridIcon';
