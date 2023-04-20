import { Fragment, useCallback, useRef, useState } from 'react';
import {
  ArrowLeftIcon,
  Flex,
  Header,
  IconButton,
  IconTextButton,
  InlineTextTooltip,
  Rhythm,
  Slider,
  SliderProps,
  Typography,
  useGetHeight,
  useGetWidth,
} from '@phork/phorkit';
import positionStyles from '@phork/phorkit/styles/modules/common/Position.module.css';
import { PIXELS_PER_GRID } from 'config/sizes';
import { ColorPreview } from 'components/ColorPreview';
import { Coords } from 'components/Coords';
import { HighlightSquare } from 'components/HighlightSquare';
import { PixelatorCanvas, PixelatorCanvasHandles, useMouseEvents } from 'components/PixelatorCanvas';
import { ShowCodeButton } from 'components/ShowCodeButton/ShowCodeButton';
import { useGetSource } from 'components/SourceProvider';
import { useStateContext } from 'components/StateProvider';
import { getPixelationFactor, getPreviewWidth } from 'utils/size';
import { Pixel } from 'utils/types';
import { CodeIcon } from 'icons/CodeIcon';
import { InfoIcon } from 'icons/InfoIcon';

export function Canvas(): JSX.Element {
  const canvasRef = useRef<PixelatorCanvasHandles | undefined>();
  const [pixels, setPixels] = useState<Pixel[]>();
  const [source] = useGetSource();

  const { state, setShowCanvas, setBlur, setLoading } = useStateContext();
  const { showGridLines, blur, gridSize, pixelate, valid } = state;

  const viewportHeight = useGetHeight() || 0;
  const viewportWidth = useGetWidth() || 0;

  // this is the ideal size but because the pixelation factor gets rounded it's not the actual size used
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

  const handleBlurChange = useCallback<NonNullable<SliderProps['onChange']>>(
    (_event, value) => {
      setBlur(value);
    },
    [setBlur],
  );

  const setHideCanvas = useCallback(() => {
    resetMouseData();
    setLoading(false);
    setShowCanvas(false);
  }, [resetMouseData, setLoading, setShowCanvas]);

  return (
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
                      Clicking anywhere in the canvas will copy its color to your clipboard
                    </Typography>
                  </InlineTextTooltip>
                </Rhythm>
              </Flex>
            </Rhythm>
          </Flex>
        </Header>
      </Rhythm>

      {source && previewWidth && previewHeight && (
        <Fragment>
          <div className={positionStyles['position-relative']}>
            <PixelatorCanvas
              blur={blur}
              height={previewHeight}
              lined={showGridLines}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMove}
              onMouseOut={handleCanvasExit}
              pixelate={pixelate}
              pixelationFactor={pixelationFactor}
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
            <Rhythm my={5}>
              <Slider
                aria-label="Blur"
                disabled={!pixelate}
                max={20}
                min={0}
                onChange={handleBlurChange}
                step={1}
                value={pixelate ? blur : 0}
                width="100%"
              >
                <Typography size="2xlarge">Blur</Typography>
              </Slider>
            </Rhythm>
          )}
        </Fragment>
      )}
    </Flex>
  );
}
