import { Fragment, useCallback, useRef, useState } from 'react';
import {
  ArrowLeftIcon,
  Flex,
  IconButton,
  IconTextButton,
  InlineTextTooltip,
  Paper,
  Rhythm,
  Slider,
  SliderProps,
  Typography,
  useGetHeight,
  useGetWidth,
} from '@phork/phorkit';
import positionStyles from '@phork/phorkit/styles/modules/common/Position.module.css';
import { viewports } from 'config/viewports';
import { ColorPreview } from 'components/ColorPreview';
import { Coords } from 'components/Coords';
import { HighlightSquare } from 'components/HighlightSquare';
import { PixelatorCanvas, PixelatorCanvasHandles, useMouseEvents } from 'components/PixelatorCanvas';
import { ShowCodeButton } from 'components/ShowCodeButton/ShowCodeButton';
import { useGetSource } from 'components/SourceProvider';
import { useStateContext } from 'components/StateProvider';
import { getPixelationFactor, getPreviewWidth, getHeightFromGridSize, getWidthFromGridSize } from 'utils/size';
import { Pixel } from 'utils/types';
import { CodeIcon } from 'icons/CodeIcon';
import { GridIcon } from 'icons/GridIcon';
import { InfoIcon } from 'icons/InfoIcon';

const MOBILE_BREAKPOINT = viewports.xsmall.max;

export function Canvas(): JSX.Element {
  const canvasRef = useRef<PixelatorCanvasHandles | undefined>();
  const [pixels, setPixels] = useState<Pixel[]>();
  const [source] = useGetSource();

  const { state, setShowCanvas, setShowGridLines, setBlur, setLoading } = useStateContext();
  const { showGridLines, blur, gridSize, pixelate } = state;

  const viewportHeight = useGetHeight() || 0;
  const viewportWidth = useGetWidth() || 0;

  // this is the ideal size but because the pixelation factor gets rounded it's not the actual size used
  const previewBaseWidth = getPreviewWidth(viewportWidth, viewportHeight);
  const tempPreviewWidth = getWidthFromGridSize(previewBaseWidth, gridSize);
  const tempPreviewHeight = getHeightFromGridSize(previewBaseWidth, gridSize);

  const {
    pixelationFactor,
    factoredWidth: previewWidth,
    factoredHeight: previewHeight,
  } = getPixelationFactor(tempPreviewWidth, tempPreviewHeight, gridSize) || {};

  const {
    color,
    coords,
    highlight,
    handleCanvasClick,
    handleCanvasMove,
    handleCanvasExit,
    reset: resetMouseData,
  } = useMouseEvents({ canvasRef, pixelationFactor });

  const handleBlurChange = useCallback<NonNullable<SliderProps['onChange']>>(
    (_event, value) => {
      setBlur(value);
    },
    [setBlur],
  );

  const toggleGridLines = useCallback(() => {
    setShowGridLines(!showGridLines);
  }, [setShowGridLines, showGridLines]);

  const setHideCanvas = useCallback(() => {
    resetMouseData();
    setLoading(false);
    setShowCanvas(false);
  }, [resetMouseData, setLoading, setShowCanvas]);

  return (
    <Flex
      alignItems="center"
      direction="column"
      justifyContent="center"
      style={{ width: Math.max(previewWidth, previewHeight) }}
    >
      <Rhythm mb={4}>
        <Flex full alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" direction="row" justifyContent="flex-start">
            <IconTextButton
              color="neutral"
              icon={<ArrowLeftIcon scale="medium" />}
              onClick={setHideCanvas}
              shape="brick"
              size="relative"
              weight="inline"
            >
              <Typography<'div'> as="div" size="2xlarge">
                Back
              </Typography>
            </IconTextButton>
          </Flex>

          {viewportWidth >= MOBILE_BREAKPOINT && (
            <Flex alignItems="center" direction="row" justifyContent="center">
              <Rhythm ml={3}>
                {coords && <Coords x={coords.x} y={coords.y} />}
                {color && <ColorPreview color={`#${color}`} />}
              </Rhythm>
            </Flex>
          )}

          <Flex alignItems="center" direction="row" justifyContent="flex-end">
            <Rhythm ml={3}>
              <ShowCodeButton code={pixels}>
                <IconButton color="neutral" title="Get code">
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
                  Clicking anywhere in the canvas will copy its color to your clipboard.
                  <br />
                  <br />
                  The <strong>&lt;/&gt;</strong> icon will start the process that allows you to copy the image to the
                  NYOP canvas.
                </Typography>
              </InlineTextTooltip>
            </Rhythm>
          </Flex>
        </Flex>
      </Rhythm>

      {source && previewWidth && previewHeight && (
        <Fragment>
          <div className={positionStyles['position-relative']}>
            <PixelatorCanvas
              blur={blur}
              gridSize={gridSize}
              height={previewHeight}
              lined={showGridLines}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMove}
              onMouseOut={handleCanvasExit}
              pixelate={pixelate}
              ref={canvasRef}
              setPixels={setPixels}
              source={source.src}
              width={previewWidth}
            />
            {highlight && pixelationFactor && (
              <HighlightSquare height={pixelationFactor} width={pixelationFactor} x={highlight.x} y={highlight.y} />
            )}
          </div>

          {pixelate && (
            <Rhythm mb={4} mt={5}>
              <Flex full alignItems="center" direction="row" justifyContent="space-between">
                <Rhythm mr={10}>
                  <Slider
                    aria-label="Blur"
                    disabled={!pixelate}
                    max={60}
                    min={0}
                    onChange={handleBlurChange}
                    step={5}
                    value={pixelate ? blur : 0}
                    width="100%"
                  >
                    <Typography size="2xlarge">Blur</Typography>
                  </Slider>
                </Rhythm>

                <IconButton
                  color={showGridLines ? 'primary' : 'neutral'}
                  onClick={toggleGridLines}
                  shape="square"
                  title="Show grid lines"
                  weight="shaded"
                >
                  <GridIcon scale="medium" />
                </IconButton>
              </Flex>
            </Rhythm>
          )}

          {viewportWidth < MOBILE_BREAKPOINT && (
            <Rhythm my={4} p={3}>
              <Paper full color={color || coords ? 'secondary' : 'transparent'} style={{ height: 50 }}>
                <Flex full alignItems="center" direction="row" justifyContent="space-around">
                  {coords && <Coords x={coords.x} y={coords.y} />}
                  {color && <ColorPreview color={`#${color}`} />}
                </Flex>
              </Paper>
            </Rhythm>
          )}
        </Fragment>
      )}
    </Flex>
  );
}
