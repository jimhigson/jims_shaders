import type { FilterSystem, RenderTexture, Texture } from "pixi.js";

import { Filter, GlProgram } from "pixi.js";

import { defaultVertex } from "../utils/defaultVertex";
import fragment from "./noise.frag";

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

/**
 * Adds animated noise to simulate analog video interference and screen grain
 */
export class NoiseFilter extends Filter {
  public uniforms: {
    uIntensity: number;
    uScale: number;
    uFPS: number;
    uTime: number;
  };

  private startTime: number;

  constructor(uniforms: NoiseFilterOptions = {}) {
    const finalUniforms = { ...defaultNoiseUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultVertex,
      fragment,
      name: "noise-filter",
    });

    super({
      glProgram,
      resources: {
        noiseUniforms: {
          uIntensity: {
            value: finalUniforms.intensity,
            type: "f32",
          },
          uScale: {
            value: finalUniforms.scale,
            type: "f32",
          },
          uFPS: {
            value: finalUniforms.fps,
            type: "f32",
          },
          uTime: {
            value: 0,
            type: "f32",
          },
        },
      },
    });

    this.uniforms = this.resources.noiseUniforms.uniforms;
    this.startTime = performance.now();
  }

  override apply(
    filterSystem: FilterSystem,
    input: Texture,
    output: RenderTexture,
    clearMode: boolean,
  ): void {
    // Update time uniform before each render (in milliseconds)
    this.uniforms.uTime = performance.now() - this.startTime;
    super.apply(filterSystem, input, output, clearMode);
  }
}
