import { cx } from '@emotion/css';
import { useCallback, useEffect, useContext } from 'react';
import { FlexProps, IconToast, ThemeProps, TimesIcon, ToastContext } from '@phork/phorkit';
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
  const { createNotification } = useContext(ToastContext);

  const displayErrorToast = useCallback(
    (title: string, content: string) => {
      createNotification(
        <IconToast icon={TimesIcon} iconSize={20} level="danger" title={title}>
          {content}
        </IconToast>,
      );
    },
    [createNotification],
  );

  const validateImage = useCallback(
    (image: HTMLImageElement) => {
      if (image) {
        if (image.naturalWidth && image.naturalHeight) {
          if (image.naturalWidth === image.naturalHeight) {
            return onValidate(true);
          } else {
            onValidate(false);
            displayErrorToast(
              'Invalid image size',
              `The image must be square. The size of the uploaded image is ${image.naturalWidth}x${image.naturalHeight}.`,
            );
          }
          onValidate(false);
        } else {
          displayErrorToast('Invalid image size', 'Unable to determine the image size of the uploaded image.');
        }
        onValidate(false);
      } else {
        displayErrorToast('Missing images', 'Unable to find the canvas.');
      }
      onValidate(false);
    },
    [displayErrorToast, onValidate],
  );

  // validate the image when the source changes
  useEffect(() => {
    if (source) {
      const image = new Image();
      image.src = source;
      image.onload = function () {
        validateImage(image);
      };
    }
  }, [source, validateImage]);

  return (
    <div className={cx(styles.container, className)} style={{ ...style, height: width, width }} {...props}>
      <img alt="preview" src={source} width={width} />
    </div>
  );
}

FileUploadPreview.displayName = 'FileUploadPreview';
