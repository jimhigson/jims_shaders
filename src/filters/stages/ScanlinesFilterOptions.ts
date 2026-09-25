import type { UniformData } from "pixi.js";

/**
 * Creates horizontal scanlines to simulate CRT display raster lines
 */
export type ScanlinesFilterOptions = {
  /** Height of each scanline in pixels */
  pixelHeight?: number;
  /**
   * Brightness of the gap between scanlines (0-1). Setting this to 1 turns scanlines off entirely.
   * Setting to 0 makes hard, dark scanlines.
   */
  gapBrightness?: number;
};

export const defaultScanlinesUniforms: Required<ScanlinesFilterOptions> = {
  pixelHeight: 4,
  gapBrightness: 0.7,
};

/** the scanlines stage's uniforms, named as its glsl declares them */
export const scanlinesUniforms = (
  options: ScanlinesFilterOptions,
): Record<string, UniformData> => {
  const finalOptions = { ...defaultScanlinesUniforms, ...options };
  return {
    uScanlinesPixelHeight: { value: finalOptions.pixelHeight, type: "f32" },
    uScanlinesGapBrightness: { value: finalOptions.gapBrightness, type: "f32" },
  };
};
