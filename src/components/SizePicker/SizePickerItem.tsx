import { cx } from '@emotion/css';
import React from 'react';
import { useThemeId } from '@phork/phorkit';
import styles from './SizePickerItem.module.css';

export type SizePickerItemCoords = { x: number; y: number };
export type SizePickerSize = 'small' | 'medium';

export type SizePickerItemProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  filled: SizePickerItemCoords;
  getItemProps?: (coords: SizePickerItemCoords) => Partial<React.HTMLAttributes<HTMLDivElement>> | undefined;
  onChange?: (filled: SizePickerItemCoords) => void;
  rendered: SizePickerItemCoords;
  size?: SizePickerSize;
};

export function SizePickerItem({
  className,
  filled,
  getItemProps: initGetItemProps,
  onChange,
  rendered,
  size,
  ...props
}: SizePickerItemProps): JSX.Element {
  const themeId = useThemeId();
  const totalGridItems = rendered.x * rendered.y;

  const getItemProps: NonNullable<SizePickerItemProps['getItemProps']> =
    initGetItemProps ||
    (item => {
      if (item.x < filled.x && item.y < filled.y) {
        return { className: styles['item--filled'] };
      }
      return undefined;
    });

  const items = Array(totalGridItems)
    .fill(null)
    .map((_, i) => {
      const x = i % rendered.y;
      const y = Math.floor(i / rendered.x);
      return {
        x,
        y,
        ...getItemProps({ x, y }),
      };
    });

  return (
    <div
      className={cx(styles.container, size && styles[`container--${size}`], className)}
      style={{
        gridTemplateColumns: `repeat(${rendered.x}, 1fr)`,
        gridTemplateRows: `repeat(${rendered.y}, 1fr)`,
      }}
      {...props}
    >
      {items.map(({ className, x, y, ...item }) => (
        <div
          className={cx(styles.item, themeId && styles[`item--${themeId}`], className)}
          key={`${x}x${y}`}
          {...item}
        />
      ))}
    </div>
  );
}

SizePickerItem.displayName = 'SizePickerItem';
