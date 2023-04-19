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
  useGetHeight,
  useGetWidth,
  useSafeTimeout,
} from '@phork/phorkit';
import positionStyles from '@phork/phorkit/styles/modules/common/Position.module.css';
import { PIXELS_PER_GRID } from 'config/sizes';
import { APP_NAME } from 'config/strings';
import { ColorPreview } from 'components/ColorPreview';
import { Coords } from 'components/Coords';
import { FileUpload, FileUploadPreview, FileUploadPreviewProps } from 'components/FileUpload';
import { HighlightSquare } from 'components/HighlightSquare';
import { InputContainer } from 'components/InputContainer';
import { PagePaper } from 'components/PagePaper';
import { PixelatorCanvas, PixelatorCanvasHandles, useMouseEvents } from 'components/PixelatorCanvas';
import { ShowCodeButton } from 'components/ShowCodeButton/ShowCodeButton';
import { SizePicker, SizePickerProps, SizePickerValue } from 'components/SizePicker';
import { getFormWidth, getPixelationFactor, getPreviewWidth } from 'utils/size';
import { Pixel } from 'utils/types';
import { createImageUploader } from 'utils/upload';
import { CodeIcon } from 'icons/CodeIcon';
import { HelpIcon } from 'icons/HelpIcon';
import { InfoIcon } from 'icons/InfoIcon';

export function Home(): JSX.Element {
  const { setSafeTimeout } = useSafeTimeout();
  const canvasRef = useRef<PixelatorCanvasHandles | undefined>();
  const [gridSize, setGridSize] = useState<SizePickerValue>({ x: 1, y: 1 });
  const [lined, setLined] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pixelate, setPixelate] = useState(true);
  const [pixels, setPixels] = useState<Pixel[]>();
  const [showCanvas, setShowCanvas] = useState(false);
  const [source, setSource] = useState<string | undefined>();
  const [valid, setValid] = useState<boolean>();

  const viewportHeight = useGetHeight() || 0;
  const viewportWidth = useGetWidth() || 0;

  const formWidth = getFormWidth(viewportWidth);
  const formHeight = formWidth; // for now only square images are supported

  // this is the ideal size but because the pixelization factor gets rounded it's not the actual size used
  const tempPreviewWidth = getPreviewWidth(viewportWidth, viewportHeight);
  const tempPreviewHeight = tempPreviewWidth; // for now only square images are supported

  const pixelationFactor = valid
    ? Math.floor(getPixelationFactor(tempPreviewWidth, tempPreviewHeight, gridSize))
    : undefined;

  // use the rounded pixelation factor to get the actual preview size
  const previewWidth = pixelationFactor !== undefined ? pixelationFactor * gridSize.x * PIXELS_PER_GRID : undefined;
  const previewHeight = pixelationFactor !== undefined ? pixelationFactor * gridSize.y * PIXELS_PER_GRID : undefined;

  const {
    color,
    coords,
    highlight,
    handleCanvasClick,
    handleCanvasMove,
    handleCanvasExit,
    reset: resetMouseData,
  } = useMouseEvents({ canvasRef, pixelationFactor });

  const { createNotification } = useContext(ToastContext);

  const reset = useCallback(() => {
    resetMouseData();
    setPixels(undefined);
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
          {showCanvas && source && previewWidth && previewHeight ? (
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

                      <Flex alignItems="center" direction="row">
                        <Rhythm ml={3}>
                          <ShowCodeButton code={pixels}>
                            <IconButton color="neutral">
                              <CodeIcon scale="xlarge" />
                            </IconButton>
                          </ShowCodeButton>

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
                    </Rhythm>
                  </Flex>
                </Header>
              </Rhythm>

              <div className={positionStyles['position-relative']}>
                <PixelatorCanvas
                  height={previewHeight}
                  lined={lined}
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMove}
                  onMouseOut={handleCanvasExit}
                  pixelate={pixelate}
                  pixelationFactor={pixelationFactor}
                  ref={canvasRef}
                  setPixels={setPixels}
                  source={source}
                  width={previewWidth}
                />
                {highlight && pixelationFactor && (
                  <HighlightSquare height={pixelationFactor} width={pixelationFactor} x={highlight.x} y={highlight.y} />
                )}
              </div>
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
