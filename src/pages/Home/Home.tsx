import { Fragment, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  ArrowLeftIcon,
  Button,
  Divider,
  Flex,
  Footer,
  Header,
  IconButton,
  IconTextButton,
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
import { PAGE_MIN_WIDTH } from 'config/sizes';
import { APP_NAME } from 'config/strings';
import { ColorPreview } from 'components/ColorPreview';
import { Coords } from 'components/Coords';
import { FileUpload, FileUploadPreview, FileUploadPreviewProps } from 'components/FileUpload';
import { InputContainer } from 'components/InputContainer';
import { PagePaper } from 'components/PagePaper';
import { PixelatorCanvas, PixelatorCanvasHandles, useMouseEvents } from 'components/PixelatorCanvas';
import { SizePicker, SizePickerProps, SizePickerValue } from 'components/SizePicker';
import { getPaperSideOffset } from 'utils/size';
import { createImageUploader } from 'utils/upload';
import { HelpIcon } from 'icons/HelpIcon';
import { InfoIcon } from 'icons/InfoIcon';

const FORM_MAX_WIDTH = 500;
const PREVIEW_MAX_WIDTH = 1200;
const PIXELS_PER_GRID = 25;

export function Home(): JSX.Element {
  const { setSafeTimeout } = useSafeTimeout();
  const canvasRef = useRef<PixelatorCanvasHandles | undefined>();
  const [gridSize, setGridSize] = useState<SizePickerValue>({ x: 1, y: 1 });
  const [lined, setLined] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pixelate, setPixelate] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [source, setSource] = useState<string | undefined>();
  const [valid, setValid] = useState<boolean>();

  const viewportWidth = useGetWidth() || 0;
  const sideOffsetWidth = getPaperSideOffset(viewportWidth) * 2;
  const formWidth = Math.max(PAGE_MIN_WIDTH, Math.min(FORM_MAX_WIDTH, viewportWidth - sideOffsetWidth || 0));
  const formHeight = formWidth; // for now only square images are supported

  const previewWidth = Math.max(PAGE_MIN_WIDTH, Math.min(PREVIEW_MAX_WIDTH, viewportWidth - sideOffsetWidth || 0));
  const previewHeight = previewWidth; // for now only square images are supported

  const pixelationFactor =
    valid && gridSize
      ? Math.min(
          Math.floor(previewWidth / (gridSize.x * PIXELS_PER_GRID)),
          Math.floor(previewHeight / (gridSize.y * PIXELS_PER_GRID)),
        )
      : undefined;

  const {
    color,
    coords,
    handleCanvasClick,
    handleCanvasMove,
    handleCanvasExit,
    reset: resetMouseData,
  } = useMouseEvents({ canvasRef, pixelationFactor });

  const { createNotification } = useContext(ToastContext);

  const reset = useCallback(() => {
    resetMouseData();
    setShowCanvas(false);
    setSource(undefined);
    setValid(false);
  }, [resetMouseData]);

  const setHideCanvas = useCallback(() => {
    resetMouseData();
    setLoading(false);
    setShowCanvas(false);
  }, [resetMouseData]);

  const toggleLined = useCallback<ToggleProps['onChange']>((_event, checked) => {
    setLined(checked);
  }, []);

  const togglePixelate = useCallback<ToggleProps['onChange']>((_event, checked) => {
    setPixelate(!checked);
  }, []);

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
    () => createImageUploader({ setSource, handleError: displayErrorToast }),
    [displayErrorToast],
  );

  const handleGridSizeChange = useCallback<SizePickerProps['onChange']>((_event, value) => {
    setGridSize(value);
  }, []);

  const handleOnValidateImageChange = useCallback<FileUploadPreviewProps['onValidate']>(value => {
    setValid(value);
  }, []);

  // [TODO]: find non-blocking way to render canvas; until then use a timeout to show the spinner
  const handleSubmit = useCallback(() => {
    setLoading(true);
    setSafeTimeout(() => setShowCanvas(true), 200);
  }, [setSafeTimeout]);

  return (
    <Fragment>
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>

      <Fragment>
        <PagePaper centered flexible role="main">
          {showCanvas && source ? (
            <Flex alignItems="center" direction="column" justifyContent="center" style={{ width: previewWidth }}>
              <Rhythm mb={4}>
                <Header>
                  <Typography<'div'> as="div" size="2xlarge">
                    <IconTextButton
                      color="neutral"
                      icon={<ArrowLeftIcon scale="medium" />}
                      onClick={setHideCanvas}
                      shape="brick"
                      size="relative"
                      weight="inline"
                    >
                      Back
                    </IconTextButton>
                  </Typography>

                  <Flex alignItems="center" direction="row">
                    <Rhythm ml={3}>
                      {coords && <Coords x={coords.x} y={coords.y} />}
                      {color && <ColorPreview color={`#${color}`} />}

                      <InlineTextTooltip
                        hoverable
                        withoutTogglerFocusStyle
                        closeDelay={500}
                        layout="vertical"
                        position="left-top"
                        toggler={
                          <Rhythm mx={1}>
                            <IconButton color="neutral">
                              <InfoIcon scale="large" />
                            </IconButton>
                          </Rhythm>
                        }
                        triangleBorderWidth={2}
                      >
                        <Typography size="xlarge">
                          Clicking anywhere in the canvas will copy its color to your clipboard
                        </Typography>
                      </InlineTextTooltip>
                    </Rhythm>
                  </Flex>
                </Header>
              </Rhythm>

              <PixelatorCanvas
                height={previewHeight}
                lined={lined}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMove}
                onMouseOut={handleCanvasExit}
                pixelate={pixelate}
                pixelationFactor={pixelationFactor}
                ref={canvasRef}
                source={source}
                width={previewWidth}
              />
            </Flex>
          ) : (
            <Flex alignItems="center" direction="column" justifyContent="center" style={{ width: formWidth }}>
              {source ? (
                <FileUploadPreview onValidate={handleOnValidateImageChange} source={source} width={formWidth} />
              ) : (
                <FileUpload
                  accept="image/x-png,image/gif,image/jpeg"
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
                            Each NYOP square is {`${PIXELS_PER_GRID}x${PIXELS_PER_GRID}`}. If you have a block of
                            squares you can draw a more detailed image.
                          </p>
                          <p>
                            If your image is already pixelated you can choose to not pixelate it and just use the tool
                            to copy the colors.
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
                        <Toggle checked={lined} onChange={toggleLined}>
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
          )}
        </PagePaper>
      </Fragment>
    </Fragment>
  );
}
