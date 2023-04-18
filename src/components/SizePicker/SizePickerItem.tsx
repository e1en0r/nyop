import { cx } from '@emotion/css';
import React from 'react';
import { useThemeId } from '@phork/phorkit';
import styles from './SizePickerItem.module.css';

export type SizePickerItemProps = React.HTMLAttributes<HTMLDivElement> & {
  filledX: number;
  filledY: number;
  renderedX: number;
  renderedY: number;
};

export function SizePickerItem({
  className,
  filledX,
  filledY,
  renderedX,
  renderedY,
  ...props
}: SizePickerItemProps): JSX.Element {
  const themeId = useThemeId();
  const totalGridItems = renderedX * renderedY;

  const items = Array(totalGridItems)
    .fill(null)
    .map((_, i) => {
      const itemX = i % renderedY;
      const itemY = Math.floor(i / renderedX);
      return {
        x: itemX,
        y: itemY,
        filled: itemX < filledX && itemY < filledY,
      };
    });

  return (
    <div
      className={cx(styles.container, className)}
      style={{
        gridTemplateColumns: `repeat(${renderedX}, 1fr)`,
        gridTemplateRows: `repeat(${renderedY}, 1fr)`,
      }}
      {...props}
    >
      {items.map(({ x, y, filled }) => (
        <div
          className={cx(styles.item, filled && styles['item--filled'], themeId && styles[`item--${themeId}`])}
          key={`${x}x${y}`}
        />
      ))}
    </div>
  );
}

SizePickerItem.displayName = 'SizePickerItem';
