import { cx } from '@emotion/css';
import { FlexProps, ThemeProps } from '@phork/phorkit';
import styles from './FileUploadPreview.module.css';

export type FileUploadPreviewProps = Omit<FlexProps, 'onChange'> &
  ThemeProps & {
    onValidate: (valid: boolean) => void;
    source: string;
    width: number;
  };

export function FileUploadPreview({
  className,
  onValidate,
  source,
  style,
  themeId: initThemeId,
  unthemed,
  width,
  ...props
}: FileUploadPreviewProps): JSX.Element {
  return (
    <div className={cx(styles.container, className)} style={{ ...style, height: width, width }} {...props}>
      <img alt="preview" src={source} width={width} />
    </div>
  );
}

FileUploadPreview.displayName = 'FileUploadPreview';
