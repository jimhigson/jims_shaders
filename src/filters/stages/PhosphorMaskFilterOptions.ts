import type { UniformData } from "pixi.js";

/**
 * Simulates the RGB phosphor dot pattern of CRT displays by creating vertical red, green, and blue stripes.
 * Only a slot mask is supported, since this was the most common type used in TVs and arcades.
 */
export type PhosphorMaskFilterOptions = {
  /** Width of phosphor mask pixels */
  pixelWidth?: number;
  /**
   * Brightness of the mask pattern (0-1). This is the brightness of the 'off' pixels - a value of 1
   * turns the phosphor mask effect off entirely. A value of 0 means only pure red, green, and blue
   * pixels will be on */
  maskBrightness?: number;
  /**
   * Number of samples for antialiasing (1 = off, 2-8 recommended). Setting this higher can
   * avoid Moire patterns, but is slower to render. Try adjusting in combination with the transition
   * width to get a good compromise.
   */
  numSamples?: number;
  /**
   * how smooth is the transition between R,G,B phosphors.
   * 0 = hard edge, 1 = very smooth
   *
   * A hard edge (0) is more authentic, but can produce moire patterns,
   * especially with small pixelWidth and a low number of samples.
   */
  transitionWidth?: number;
};

export const defaultPhosphorMaskOptions: Required<PhosphorMaskFilterOptions> = {
  pixelWidth: 4,
  maskBrightness: 0.7,
  numSamples: 4,
  transitionWidth: 0.3,
};

/** the phosphor mask stage's uniforms, named as its glsl declares them */
export const phosphorMaskUniforms = (
  options: PhosphorMaskFilterOptions,
): Record<string, UniformData> => {
  const finalOptions = { ...defaultPhosphorMaskOptions, ...options };
  return {
    uPhosphorMaskPixelWidth: { value: finalOptions.pixelWidth, type: "f32" },
    uPhosphorMaskMaskBrightness: {
      value: finalOptions.maskBrightness,
      type: "f32",
    },
    uPhosphorMaskTransitionWidth: {
      value: finalOptions.transitionWidth,
      type: "f32",
    },
  };
};
