import { cx } from '@emotion/css';
import { ThemeProps, useThemeId } from '@phork/phorkit';
import styles from './HighlightSquare.module.css';

export type HighlightSquareProps = React.HTMLAttributes<HTMLDivElement> &
  ThemeProps & {
    width: number;
    height: number;
    x: number;
    y: number;
  };

export function HighlightSquare({
  className,
  height,
  style,
  x,
  y,
  themeId: initThemeId,
  width,
  ...props
}: HighlightSquareProps): JSX.Element {
  const themeId = useThemeId(initThemeId);

  return (
    <div
      className={cx(styles.highlightSquare, themeId && styles[`highlightSquare--${themeId}`], className)}
      style={{
        left: x * height,
        top: y * width,
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
}

HighlightSquare.displayName = 'HighlightSquare';
