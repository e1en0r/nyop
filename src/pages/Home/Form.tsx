import { useCallback, useContext, useMemo, useState } from 'react';
import {
  Button,
  Divider,
  Flex,
  Footer,
  Header,
  IconButton,
  IconToast,
  InlineTextTooltip,
  Rhythm,
  SpinnerIcon,
  TimesIcon,
  ToastContext,
  Toggle,
  ToggleProps,
  Typography,
  useGetWidth,
  useSafeTimeout,
} from '@phork/phorkit';
import { PIXELS_PER_GRID } from 'config/sizes';
import { FileUpload, FileUploadPreview } from 'components/FileUpload';
import { InputContainer } from 'components/InputContainer';
import { SizePicker, SizePickerProps } from 'components/SizePicker';
import { useGetSource } from 'components/SourceProvider';
import { useStateContext } from 'components/StateProvider';
import { getFormWidth } from 'utils/size';
import { Pixel } from 'utils/types';
import { createImageUploader } from 'utils/upload';
import { HelpIcon } from 'icons/HelpIcon';

export function Form(): JSX.Element {
  const { setSafeTimeout } = useSafeTimeout();
  const [, setPixels] = useState<Pixel[]>();
  const [source, setSource] = useGetSource();

  const {
    state,
    reset: resetState,
    setGridSize,
    setLoading,
    setShowCanvas,
    setShowGridLines,
    setPixelate,
    setValid,
  } = useStateContext();
  const { gridSize, showGridLines, loading, pixelate, valid } = state;

  const viewportWidth = useGetWidth() || 0;
  const formWidth = getFormWidth(viewportWidth);
  const formHeight = formWidth; // for now only square images are supported

  const reset = useCallback(() => {
    resetState();
    setPixels(undefined);
    setSource(undefined);
    setValid(false);
  }, [resetState, setSource, setValid]);

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

  const handleFiles = useMemo(
    () =>
      createImageUploader({
        setSource: source => {
          if (source) {
            const image = new Image();
            image.onload = () => {
              if (image.naturalWidth && image.naturalHeight) {
                if (image.naturalWidth === image.naturalHeight) {
                  setValid(true);
                  setSource({
                    src: source,
                    width: image.naturalWidth,
                    height: image.naturalHeight,
                  });
                } else {
                  setValid(false);
                  displayErrorToast(
                    'Invalid image size',
                    `The image must be square. The size of the uploaded image is ${image.naturalWidth}x${image.naturalHeight}.`,
                  );
                }
              } else {
                setValid(false);
                displayErrorToast('Invalid image size', 'Unable to determine the image size of the uploaded image.');
              }
            };
            image.src = source;
          }
        },
        handleError: displayErrorToast,
      }),
    [displayErrorToast, setSource, setValid],
  );

  // [TODO]: find non-blocking way to render canvas; until then use a timeout to show the spinner
  const handleSubmit = useCallback(() => {
    setLoading(true);
    setSafeTimeout(() => setShowCanvas(true), 200);
  }, [setLoading, setSafeTimeout, setShowCanvas]);

  const handleGridSizeChange = useCallback<SizePickerProps['onChange']>(
    (_event, value) => {
      setGridSize(value);
    },
    [setGridSize],
  );

  const toggleLined = useCallback<ToggleProps['onChange']>(
    (_event, checked) => {
      setShowGridLines(checked);
    },
    [setShowGridLines],
  );

  const togglePixelate = useCallback<ToggleProps['onChange']>(
    (_event, checked) => {
      setPixelate(!checked);
    },
    [setPixelate],
  );

  return (
    <Flex alignItems="center" direction="column" justifyContent="center" style={{ width: formWidth }}>
      {source ? (
        <FileUploadPreview onValidate={setValid} source={source.src} width={formWidth} />
      ) : (
        <FileUpload
          accept="image/x-png,image/gif,image/jpeg, image/svg+xml"
          handleFiles={handleFiles}
          height={formHeight}
          title="Drag and drop a square image here"
        />
      )}

      <Rhythm grouped mt={9} style={{ width: formWidth }}>
        <Rhythm px={8} py={6}>
          <InputContainer bordered full color="transparent">
            <Header>
              <Typography color="primary" size="5xlarge">
                Choose your NYOP layout
              </Typography>

              <InlineTextTooltip
                hoverable
                withoutTogglerFocusStyle
                closeDelay={500}
                layout="vertical"
                position="left-top"
                toggler={
                  <Rhythm mx={1}>
                    <IconButton color="neutral">
                      <HelpIcon scale="large" />
                    </IconButton>
                  </Rhythm>
                }
                triangleBorderWidth={2}
              >
                <Typography size="xlarge">
                  <p>
                    Each NYOP square is {`${PIXELS_PER_GRID}x${PIXELS_PER_GRID}`}. If you have a block of squares you
                    can draw a more detailed image.
                  </p>
                  <p>
                    If your image is already pixelated you can choose to not pixelate it and just use the tool to copy
                    the colors.
                  </p>
                </Typography>
              </InlineTextTooltip>
            </Header>
            <Rhythm mt={5}>
              <SizePicker full onChange={handleGridSizeChange} value={gridSize} />
            </Rhythm>

            <Rhythm my={4}>
              <Divider orientation="horizontal" variant="primary" />
            </Rhythm>

            <Flex wrap direction="row" justifyContent="space-between">
              <Rhythm my={2}>
                <Toggle checked={showGridLines} onChange={toggleLined}>
                  {`Show grid lines`}
                </Toggle>

                <Toggle checked={!pixelate} onChange={togglePixelate}>
                  {`Don't pixelate the image`}
                </Toggle>
              </Rhythm>
            </Flex>
          </InputContainer>
        </Rhythm>
      </Rhythm>

      <Rhythm mt={9}>
        <Footer>
          <Typography<'div'> as="div" size="4xlarge">
            <Button color="neutral" onClick={reset} shape="brick" size="relative" weight="inline">
              Reset
            </Button>
          </Typography>
          <Typography<'div'> as="div" size="4xlarge">
            <Button
              color="primary"
              disabled={!valid}
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
