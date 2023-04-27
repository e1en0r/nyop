export type Pixel = {
  location: {
    x: number;
    y: number;
  };
  color: {
    red: number;
    green: number;
    blue: number;
  };
};

export type PixelationFactor = { pixelationFactor: number; factoredWidth: number; factoredHeight: number };

export type GridSize = { x: number; y: number };
