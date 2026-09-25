import type { UniformData } from "pixi.js";

/**
 * Adds animated noise to simulate analog video interference and screen grain
 */
export type NoiseFilterOptions = {
  /** Noise intensity */
  intensity?: number;
  /** Height of each grain of noise in pixels - one scanline, so match the scanlines' pixelHeight */
  pixelHeight?: number;
  /** Width of each grain as a multiple of its height - how far a speck streaks along the beam */
  widthRatio?: number;
  /** Noise FPS - frequency at which the noise updates per second */
  fps?: number;
};

export const defaultNoiseUniforms: Required<NoiseFilterOptions> = {
  intensity: 0.04,
  pixelHeight: 4,
  widthRatio: 2,
  fps: 30,
};

/** the noise stage's uniforms, named as its glsl declares them - its time is set every frame */
export const noiseUniforms = (
  options: NoiseFilterOptions,
): Record<string, UniformData> => {
  const finalOptions = { ...defaultNoiseUniforms, ...options };
  return {
    uNoiseIntensity: { value: finalOptions.intensity, type: "f32" },
    uNoisePixelHeight: { value: finalOptions.pixelHeight, type: "f32" },
    uNoiseWidthRatio: { value: finalOptions.widthRatio, type: "f32" },
    uNoiseFPS: { value: finalOptions.fps, type: "f32" },
    uNoiseTime: { value: 0, type: "f32" },
  };
};
