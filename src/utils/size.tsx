import {
  ALERT_IMAGE_DEFAULT_SIZE,
  ALERT_IMAGE_MINIMUM_SIZE,
  FORM_MAX_WIDTH,
  PAGE_MIN_WIDTH,
  PAPER_SIDE_OFFSET,
  PIXELS_PER_GRID,
  PREVIEW_MAX_WIDTH,
  SMALL_PAPER_SIDE_OFFSET,
} from 'config/sizes';
import { viewports } from 'config/viewports';

export const getImageSize = (width?: number): number =>
  Math.max(
    ALERT_IMAGE_MINIMUM_SIZE,
    width ? Math.min(width * 0.8, ALERT_IMAGE_DEFAULT_SIZE) : ALERT_IMAGE_MINIMUM_SIZE,
  );

export const getPaperSideOffset = (width: number): number =>
  width <= viewports.small.max ? SMALL_PAPER_SIDE_OFFSET : PAPER_SIDE_OFFSET;

export const getFormWidth = (width: number): number =>
  Math.max(PAGE_MIN_WIDTH, Math.min(FORM_MAX_WIDTH, width - getPaperSideOffset(width) * 2 || 0));

export const getPreviewWidth = (width: number, height: number): number =>
  Math.max(PAGE_MIN_WIDTH, Math.min(PREVIEW_MAX_WIDTH, height * 0.8, width - getPaperSideOffset(width) * 2 || 0));

export const getPixelationFactor = (width: number, height: number, gridSize?: { x: number; y: number }): number =>
  gridSize
    ? Math.min(Math.floor(width / (gridSize.x * PIXELS_PER_GRID)), Math.floor(height / (gridSize.y * PIXELS_PER_GRID)))
    : 0;
