import { useCallback, useContext, useMemo, useState } from 'react';
import {
  Button,
  Flex,
  Footer,
  IconToast,
  Rhythm,
  SpinnerIcon,
  TimesIcon,
  ToastContext,
  Typography,
  useGetWidth,
  useSafeTimeout,
} from '@phork/phorkit';
import { PIXELS_PER_GRID } from 'config/sizes';
import { FileUpload, FileUploadPreview } from 'components/FileUpload';
import { InputContainer } from 'components/InputContainer';
import { SizePickerItemCustom, SizePickerItemCustomProps } from 'components/SizePicker';
import { useGetSource } from 'components/SourceProvider';
import { StateValue, useStateContext } from 'components/StateProvider';
import { getFormWidth, getHeightFromGridSize, getWidthFromGridSize } from 'utils/size';
import { Pixel } from 'utils/types';
import { createImageUploader } from 'utils/upload';

const GRID_SIZE = 5;
const ERROR_TOAST_ID = 'image-error';

export function Form(): JSX.Element {
  const { setSafeTimeout } = useSafeTimeout();
  const [, setPixels] = useState<Pixel[]>();
  const [source, setSource] = useGetSource();

  const { state, reset: resetState, setGridSize, setLoading, setShowCanvas, setValid } = useStateContext();
  const { gridSize, loading, valid } = state;

  const viewportWidth = useGetWidth() || 0;
  const formWidth = getFormWidth(viewportWidth);

  const previewWidth = getWidthFromGridSize(formWidth, gridSize);
  const previewHeight = getHeightFromGridSize(formWidth, gridSize);

  const submitDisabled = !gridSize || !source;

  const reset = useCallback(() => {
    resetState();
    setPixels(undefined);
    setSource(undefined);
    setValid(false);
  }, [resetState, setSource, setValid]);

  const { createNotification, removeNotification } = useContext(ToastContext);

  const displayErrorToast = useCallback(
    (title: string, content: string, level: 'warning' | 'danger' = 'danger') => {
      createNotification(
        <IconToast contextId={ERROR_TOAST_ID} icon={TimesIcon} iconSize={20} level={level} title={title}>
          {content}
        </IconToast>,
      );
    },
    [createNotification],
  );

  const validateProportions = useCallback(
    (gridSize: StateValue['gridSize'], imageWidth?: number, imageHeight?: number): boolean => {
      if (imageWidth && imageHeight) {
        if (imageWidth === imageHeight * (gridSize.x / gridSize.y)) {
          removeNotification(ERROR_TOAST_ID);
          return true;
        } else {
          displayErrorToast(
            'Invalid image proportions',
            `The proportions for the uploaded image don't match the proportions required by the chosen layout. The end result will be skewed.`,
            'warning',
          );
        }
      } else {
        displayErrorToast('Invalid image size', 'Unable to determine the image size of the uploaded image.');
      }
      return false;
    },
    [displayErrorToast, removeNotification],
  );

  const handleFiles = useMemo(
    () =>
      createImageUploader({
        setSource: source => {
          if (source) {
            const image = new Image();
            image.onload = () => {
              if (image.naturalWidth && image.naturalHeight) {
                setSource({
                  src: source,
                  width: image.naturalWidth,
                  height: image.naturalHeight,
                });

                setValid(validateProportions(gridSize, image.naturalWidth, image.naturalHeight));
              } else {
                setValid(false);
              }
            };
            image.src = source;
          }
        },
        handleError: displayErrorToast,
      }),
    [displayErrorToast, gridSize, setSource, setValid, validateProportions],
  );

  const handleGridSizeChange = useCallback<SizePickerItemCustomProps['onChange']>(
    gridSize => {
      setGridSize(gridSize);
      setValid(source?.width && source?.height ? validateProportions(gridSize, source?.width, source?.height) : false);
    },
    [setGridSize, setValid, source?.height, source?.width, validateProportions],
  );

  // [TODO]: find non-blocking way to render canvas; until then use a timeout to show the spinner
  const handleSubmit = useCallback(() => {
    setLoading(true);
    setSafeTimeout(() => setShowCanvas(true), 200);
  }, [setLoading, setSafeTimeout, setShowCanvas]);

  return (
    <Flex alignItems="center" direction="column" justifyContent="center" style={{ width: formWidth }}>
      <Rhythm grouped mb={9} style={{ width: formWidth }}>
        <Rhythm px={8} py={10}>
          <InputContainer bordered full color="transparent">
            <Flex alignItems="center" direction="row" justifyContent="space-between">
              <Flex direction="column">
                <Typography color="primary" size="5xlarge">
                  Choose your NYOP layout
                </Typography>

                <Rhythm mt={4}>
                  <Typography size="xlarge" variants={['line-height-comfy']} volume="quiet">
                    Each NYOP square is {`${PIXELS_PER_GRID}x${PIXELS_PER_GRID}`}. If you have a block of squares you
                    can draw a more detailed image.
                  </Typography>
                </Rhythm>
              </Flex>

              <Rhythm ml={8}>
                <Flex inflexible>
                  <SizePickerItemCustom
                    filled={gridSize}
                    onChange={handleGridSizeChange}
                    rendered={{ x: GRID_SIZE, y: GRID_SIZE }}
                    size="medium"
                  />
                </Flex>
              </Rhythm>
            </Flex>
          </InputContainer>
        </Rhythm>
      </Rhythm>

      {source ? (
        <FileUploadPreview
          containerHeight={formWidth}
          containerWidth={formWidth}
          height={previewHeight}
          onValidate={setValid}
          source={source.src}
          width={previewWidth}
        />
      ) : (
        <FileUpload
          accept="image/x-png,image/gif,image/jpeg, image/svg+xml"
          handleFiles={handleFiles}
          height={formWidth}
          title="Drag and drop an image here"
        />
      )}

      <Rhythm mt={9}>
        <Footer>
          <Typography<'div'> as="div" size="4xlarge">
            <Button color="neutral" onClick={reset} shape="brick" size="relative" weight="inline">
              Reset
            </Button>
          </Typography>
          <Typography<'div'> as="div" size="4xlarge">
            <Button
              color={valid || submitDisabled ? 'primary' : 'warning'}
              disabled={submitDisabled}
              loader={<SpinnerIcon scale="xlarge" />}
              loading={loading}
              onClick={handleSubmit}
              shape="brick"
              size="relative"
              weight="outlined"
            >
              Submit
            </Button>
          </Typography>
        </Footer>
      </Rhythm>
    </Flex>
  );
}
