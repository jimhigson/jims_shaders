import type { UniformData } from "pixi.js";

/**
 * Darkens the edges of the screen to simulate the natural light falloff on CRT displays
 */
export type VignetteFilterOptions = {
  /** Vignette intensity */
  intensity?: number;
  /** Radius from center where vignette starts */
  radius?: number;
};

export const defaultVignetteUniforms: Required<VignetteFilterOptions> = {
  intensity: 0.4,
  radius: 0.8,
};

/** the vignette stage's uniforms, named as its glsl declares them */
export const vignetteUniforms = (
  options: VignetteFilterOptions,
): Record<string, UniformData> => {
  const finalOptions = { ...defaultVignetteUniforms, ...options };
  return {
    uVignetteIntensity: { value: finalOptions.intensity, type: "f32" },
    uVignetteRadius: { value: finalOptions.radius, type: "f32" },
  };
};
