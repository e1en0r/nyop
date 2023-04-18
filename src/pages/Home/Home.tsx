import copy from 'copy-to-clipboard';
import { Fragment, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  ArrowLeftIcon,
  Button,
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
  Typography,
  useGetWidth,
  useSafeTimeout,
} from '@phork/phorkit';
import { PAGE_MIN_WIDTH } from 'config/sizes';
import { APP_NAME } from 'config/strings';
import { ColorPreview } from 'components/ColorPreview/ColorPreview';
import { FileUpload, FileUploadPreview, FileUploadPreviewProps } from 'components/FileUpload';
import { InputContainer } from 'components/InputContainer';
import { PagePaper } from 'components/PagePaper';
import { PixelatorCanvas, PixelatorCanvasHandles, PixelatorCanvasProps } from 'components/PixelatorCanvas';
import { SizePicker, SizePickerProps, SizePickerValue } from 'components/SizePicker';
import { getPaperSideOffset } from 'utils/size';
import { createImageUploader } from 'utils/upload';
import { HelpIcon } from 'icons/HelpIcon';
import { InfoIcon } from 'icons/InfoIcon';

const FORM_MAX_WIDTH = 500;
const PREVIEW_MAX_WIDTH = 1200;
const PIXELS_PER_GRID = 25;

const rgbToHex = (r: number, g: number, b: number): string => {
  if (r > 255 || g > 255 || b > 255) throw 'Invalid color component';
  return ((r << 16) | (g << 8) | b).toString(16);
};

export function Home(): JSX.Element {
  const { setSafeTimeout } = useSafeTimeout();
  const canvasRef = useRef<PixelatorCanvasHandles | undefined>();
  const [color, setColor] = useState<string>();
  const [gridSize, setGridSize] = useState<SizePickerValue>({ x: 1, y: 1 });
  const [loading, setLoading] = useState(false);
  const [showPixelated, setShowPixelated] = useState(false);
  const [source, setSource] = useState<string | undefined>();
  const [valid, setValid] = useState<boolean>();

  const viewportWidth = useGetWidth() || 0;
  const sideOffsetWidth = getPaperSideOffset(viewportWidth) * 2;
  const formWidth = Math.max(PAGE_MIN_WIDTH, Math.min(FORM_MAX_WIDTH, viewportWidth - sideOffsetWidth || 0));
  const formHeight = formWidth; // for now only square images are supported

  const previewWidth = Math.max(PAGE_MIN_WIDTH, Math.min(PREVIEW_MAX_WIDTH, viewportWidth - sideOffsetWidth || 0));
  const previewHeight = previewWidth; // for now only square images are supported

  const { createNotification } = useContext(ToastContext);

  const reset = useCallback(() => {
    setSource(undefined);
    setShowPixelated(false);
    setValid(false);
    setColor(undefined);
  }, []);

  const hidePixelated = useCallback(() => {
    setLoading(false);
    setShowPixelated(false);
    setColor(undefined);
  }, []);

  // by showing on a timeout we can show the spinner before the canvas halts everything
  const handleSubmit = useCallback(() => {
    setLoading(true);
    setSafeTimeout(() => setShowPixelated(true), 200);
  }, [setSafeTimeout]);

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

  const handleOnValidateImageChange = useCallback<FileUploadPreviewProps['onValidate']>(value => {
    setValid(value);
  }, []);

  const handleGridSizeChange = useCallback<SizePickerProps['onChange']>((_event, value) => {
    setGridSize(value);
  }, []);

  const handleCanvasMove = useCallback<NonNullable<PixelatorCanvasProps['onMouseMove']>>(event => {
    const canvas = canvasRef.current?.canvas;
    if (canvas) {
      const context = canvasRef.current?.canvas?.getContext('2d', { willReadFrequently: true });
      if (context) {
        const rect = canvas.getBoundingClientRect();
        const pixelData = context.getImageData(event.clientX - rect.left, event.clientY - rect.top, 1, 1).data;
        setColor('#' + ('000000' + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6));
      }
    }
  }, []);

  const handleCanvasClick = useCallback<NonNullable<PixelatorCanvasProps['onClick']>>(() => {
    copy(color || '');
  }, [color]);

  return (
    <Fragment>
      <Helmet>
        <title>{APP_NAME}</title>
      </Helmet>

      <Fragment>
        <PagePaper centered flexible role="main">
          {showPixelated && source ? (
            <Flex alignItems="center" direction="column" justifyContent="center" style={{ width: previewWidth }}>
              <Rhythm mb={4}>
                <Header>
                  <Typography<'div'> as="div" size="2xlarge">
                    <IconTextButton
                      color="neutral"
                      icon={<ArrowLeftIcon scale="medium" />}
                      onClick={hidePixelated}
                      shape="brick"
                      size="relative"
                      weight="inline"
                    >
                      Back
                    </IconTextButton>
                  </Typography>

                  <Flex alignItems="center" direction="row">
                    {color && <ColorPreview color={color} />}

                    <Rhythm ml={3}>
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
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMove}
                pixelationFactor={
                  valid && gridSize
                    ? Math.min(
                        Math.floor(previewWidth / (gridSize.x * PIXELS_PER_GRID)),
                        Math.floor(previewHeight / (gridSize.y * PIXELS_PER_GRID)),
                      )
                    : undefined
                }
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
                          Each NYOP square is ${`${PIXELS_PER_GRID}x${PIXELS_PER_GRID}`}. If you have a block of squares
                          you can draw a more detailed image.
                        </Typography>
                      </InlineTextTooltip>
                    </Header>
                    <Rhythm mt={5}>
                      <SizePicker full onChange={handleGridSizeChange} value={gridSize} />
                    </Rhythm>
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
                      Pixelate
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
