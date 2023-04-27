import { FlexProps, ThemeProps } from '@phork/phorkit';

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
  width,
  ...props
}: FileUploadPreviewProps): JSX.Element {
  return (
    <div style={{ ...style, height: containerHeight || height, width: containerWidth || width }} {...props}>
      <img alt="preview" height={height} src={source} width={width} />
    </div>
  );
}

FileUploadPreview.displayName = 'FileUploadPreview';
