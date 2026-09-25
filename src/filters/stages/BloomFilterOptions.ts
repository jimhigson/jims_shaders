import type { UniformData } from "pixi.js";

/**
 * Creates a bloom/glow effect around bright areas to simulate light bleeding
 */
export type BloomFilterOptions = {
  /** Blur radius in pixels */
  radius?: number;
  /** Brightness threshold for bloom (0-1) */
  cutoff?: number;
  /** Bloom intensity multiplier */
  intensity?: number;
  /**
   * How much more should the edge/corner of the screen blur? This reproduces CRT screens which would be
   * well focussed in the middle and slightly unfocused in the corners
   */
  edgeBlur?: number;
};

export const defaultBloomUniforms: Required<BloomFilterOptions> = {
  radius: 1.2,
  cutoff: 0.88,
  intensity: 0.14,
  edgeBlur: 0.5,
};

/** the bloom stage's uniforms, named as its glsl declares them */
export const bloomUniforms = (
  options: BloomFilterOptions,
): Record<string, UniformData> => {
  const finalOptions = { ...defaultBloomUniforms, ...options };
  return {
    uBloomRadius: { value: finalOptions.radius, type: "f32" },
    uBloomCutoff: { value: finalOptions.cutoff, type: "f32" },
    uBloomIntensity: { value: finalOptions.intensity, type: "f32" },
    uBloomEdgeBlur: { value: finalOptions.edgeBlur, type: "f32" },
  };
};
