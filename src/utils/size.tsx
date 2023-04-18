import {
  ALERT_IMAGE_DEFAULT_SIZE,
  ALERT_IMAGE_MINIMUM_SIZE,
  PAPER_SIDE_OFFSET,
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
