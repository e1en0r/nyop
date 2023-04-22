import { cx } from '@emotion/css';
import React, { useState } from 'react';
import { useThemeId } from '@phork/phorkit';
import styles from './SizePickerItem.module.css';

export type SizePickerItemProps = React.HTMLAttributes<HTMLDivElement> & {
  customizable?: boolean;
  filledX: number;
  filledY: number;
  renderedX: number;
  renderedY: number;
};

export function SizePickerItem({
  className,
  customizable,
  filledX,
  filledY,
  renderedX,
  renderedY,
  ...props
}: SizePickerItemProps): JSX.Element {
  const themeId = useThemeId();
  const totalGridItems = renderedX * renderedY;
  const [filled, setFilled] = useState({ x: filledX, y: filledY });

  const items = Array(totalGridItems)
    .fill(null)
    .map((_, i) => {
      const itemX = i % renderedY;
      const itemY = Math.floor(i / renderedX);
      return {
        x: itemX,
        y: itemY,
        filled: itemX < filled.x && itemY < filled.y,
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
      {items.map(item => (
        <div
          className={cx(styles.item, item.filled && styles['item--filled'], themeId && styles[`item--${themeId}`])}
          key={`${item.x}x${item.y}`}
          onClick={() => setFilled({ x: item.x + 1, y: item.y + 1 })}
          onKeyDown={event => event.key === 'Enter' && setFilled({ x: item.x, y: item.y })}
          role={customizable ? 'button' : undefined}
          tabIndex={0}
        />
      ))}
    </div>
  );
}

SizePickerItem.displayName = 'SizePickerItem';
