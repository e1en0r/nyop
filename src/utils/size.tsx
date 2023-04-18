import { ALERT_IMAGE_DEFAULT_SIZE, ALERT_IMAGE_MINIMUM_SIZE } from 'config/sizes';

export const getImageSize = (width?: number): number =>
  Math.max(
    ALERT_IMAGE_MINIMUM_SIZE,
    width ? Math.min(width * 0.8, ALERT_IMAGE_DEFAULT_SIZE) : ALERT_IMAGE_MINIMUM_SIZE,
  );
