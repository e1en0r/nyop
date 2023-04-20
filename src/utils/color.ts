export type Rgba = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  if (r > 255 || g > 255 || b > 255) throw 'Invalid color component';
  return ((r << 16) | (g << 8) | b).toString(16);
};

export const getOpaquePixelRgb = (originalImageData: Uint8ClampedArray, pixelIndexPosition: number): Rgba => {
  const rgba = {
    red: originalImageData[pixelIndexPosition],
    green: originalImageData[pixelIndexPosition + 1],
    blue: originalImageData[pixelIndexPosition + 2],
    alpha: originalImageData[pixelIndexPosition + 3],
  };

  if (rgba.alpha !== 255) {
    const alpha = rgba.alpha / 255;
    rgba.red = rgba.red * alpha + 255 * (1 - alpha);
    rgba.green = rgba.green * alpha + 255 * (1 - alpha);
    rgba.blue = rgba.blue * alpha + 255 * (1 - alpha);
    rgba.alpha = 255;
  }

  return rgba;
};

// https://sighack.com/post/averaging-rgb-colors-the-right-way
export const getAveragePixelRgb = (pixels: Rgba[]): Rgba => {
  const totalPixels = pixels.length;
  const sums = pixels.reduce(
    (acc, { red, green, blue, alpha }) => {
      acc.red += red * red;
      acc.green += green * green;
      acc.blue += blue * blue;
      acc.alpha += alpha * alpha;
      return acc;
    },
    {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 0,
    },
  );

  return {
    red: Math.round(Math.sqrt(sums.red / totalPixels)),
    green: Math.round(Math.sqrt(sums.green / totalPixels)),
    blue: Math.round(Math.sqrt(sums.blue / totalPixels)),
    alpha: Math.round(Math.sqrt(sums.alpha / totalPixels)),
  };
};
