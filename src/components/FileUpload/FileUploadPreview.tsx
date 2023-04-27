import { cx } from '@emotion/css';
import { FlexProps, ThemeProps, useThemeId } from '@phork/phorkit';
import styles from './FileUploadPreview.module.css';

export type FileUploadPreviewProps = Omit<FlexProps, 'onChange'> &
  ThemeProps & {
    containerHeight?: number;
    containerWidth?: number;
    height: number;
    onValidate: (valid: boolean) => void;
    source: string;
    width: number;
  };

export function FileUploadPreview({
  className,
  containerHeight,
  containerWidth,
  height,
  onValidate,
  source,
  style,
  themeId: initThemeId,
  unthemed,
  width,
  ...props
}: FileUploadPreviewProps): JSX.Element {
  const themeId = useThemeId(initThemeId);

  return (
    <div
      className={cx(styles.container, themeId && styles[`container--${themeId}`], className)}
      style={{ ...style, height: containerHeight || height, width: containerWidth || width }}
      {...props}
    >
      <img alt="preview" height={height} src={source} width={width} />
    </div>
  );
}

FileUploadPreview.displayName = 'FileUploadPreview';
