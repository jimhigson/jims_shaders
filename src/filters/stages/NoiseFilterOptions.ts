import type { UniformData } from "pixi.js";

/**
 * Adds animated noise to simulate analog video interference and screen grain
 */
export type NoiseFilterOptions = {
  /** Noise intensity */
  intensity?: number;
  /** Noise scale - larger values create bigger noise pixels */
  scale?: number;
  /** Noise FPS - frequency at which the noise updates per second */
  fps?: number;
};

export const defaultNoiseUniforms: Required<NoiseFilterOptions> = {
  intensity: 0.04,
  scale: 6,
  fps: 30,
};

/** the noise stage's uniforms, named as its glsl declares them - its time is set every frame */
export const noiseUniforms = (
  options: NoiseFilterOptions,
): Record<string, UniformData> => {
  const finalOptions = { ...defaultNoiseUniforms, ...options };
  return {
    uNoiseIntensity: { value: finalOptions.intensity, type: "f32" },
    uNoiseScale: { value: finalOptions.scale, type: "f32" },
    uNoiseFPS: { value: finalOptions.fps, type: "f32" },
    uNoiseTime: { value: 0, type: "f32" },
  };
};
