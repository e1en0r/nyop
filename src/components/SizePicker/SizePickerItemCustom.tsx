import { cx } from '@emotion/css';
import { useCallback, useState } from 'react';
import { useSafeTimeout } from '@phork/phorkit';
import { SizePickerItem, SizePickerItemCoords, SizePickerItemProps } from './SizePickerItem';
import styles from './SizePickerItem.module.css';

const SAFE_TIMEOUT_ID = 'hoverCoords';

export type SizePickerItemCustomProps = SizePickerItemProps & {
  onChange: (filled: SizePickerItemCoords) => void;
};

export function SizePickerItemCustom({ filled, onChange, ...props }: SizePickerItemProps): JSX.Element {
  const [hovered, setHovered] = useState<SizePickerItemCoords>();
  const { setSafeTimeout, clearSafeTimeout } = useSafeTimeout();

  const clearHover = useCallback(
    () => setSafeTimeout(() => setHovered(undefined), 200, SAFE_TIMEOUT_ID),
    [setSafeTimeout],
  );

  const getItemProps = useCallback<NonNullable<SizePickerItemProps['getItemProps']>>(
    item => ({
      //className: hovered
      //  ? (item.x < hovered?.x && item.y < hovered?.y && styles['item--hovered']) || undefined
      //  : (item.x < filled.x && item.y < filled.y && styles['item--filled']) || undefined,
      className: cx({
        [styles['item--hovered']]: hovered && item.x < hovered?.x && item.y < hovered?.y,
        [styles['item--filled']]: item.x < filled.x && item.y < filled.y,
      }),
      onBlur: clearHover,
      onClick: () => onChange?.({ x: item.x + 1, y: item.y + 1 }),
      onFocus: () => {
        clearSafeTimeout(SAFE_TIMEOUT_ID);
        setHovered({ x: item.x + 1, y: item.y + 1 });
      },
      onKeyDown: event => event.key === 'Enter' && onChange?.({ x: item.x, y: item.y }),
      onMouseOut: clearHover,
      onMouseOver: () => {
        clearSafeTimeout(SAFE_TIMEOUT_ID);
        setHovered({ x: item.x + 1, y: item.y + 1 });
      },
      role: 'button',
      tabIndex: 0,
    }),
    [clearHover, clearSafeTimeout, filled.x, filled.y, hovered, onChange],
  );

  return <SizePickerItem filled={filled} getItemProps={getItemProps} {...props} />;
}

SizePickerItemCustom.displayName = 'SizePickerItemCustom';
