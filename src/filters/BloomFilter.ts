import type { FilterSystem, RenderTexture, Texture } from "pixi.js";

import { Filter, GlProgram } from "pixi.js";

import { defaultVertex } from "../utils/defaultVertex";
import fragment from "./bloom.frag?raw";

export type BloomFilterUniforms = {
  /** Blur radius in pixels */
  radius?: number;
  /** Brightness threshold for bloom (0-1) */
  cutoff?: number;
  /** Bloom intensity multiplier */
  intensity?: number;
  /** Edge blur amount for smooth transitions */
  edgeBlur?: number;
};

export const defaultBloomUniforms: Required<BloomFilterUniforms> = {
  radius: 3.0,
  cutoff: 0.88,
  intensity: 0.14,
  edgeBlur: 1.5,
};

export class BloomFilter extends Filter {
  public uniforms: {
    uRadius: number;
    uCutoff: number;
    uIntensity: number;
    uEdgeBlur: number;
    uResolution: Float32Array;
  };

  constructor(uniforms: BloomFilterUniforms = {}) {
    const finalUniforms = { ...defaultBloomUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultVertex,
      fragment,
      name: "bloom-filter",
    });

    super({
      glProgram,
      resources: {
        bloomUniforms: {
          uRadius: {
            value: finalUniforms.radius,
            type: "f32",
          },
          uCutoff: {
            value: finalUniforms.cutoff,
            type: "f32",
          },
          uIntensity: {
            value: finalUniforms.intensity,
            type: "f32",
          },
          uEdgeBlur: {
            value: finalUniforms.edgeBlur,
            type: "f32",
          },
          uResolution: { value: new Float32Array(2), type: "vec2<f32>" },
        },
      },
    });

    this.uniforms = this.resources.bloomUniforms.uniforms;
  }

  override apply(
    filterSystem: FilterSystem,
    input: Texture,
    output: RenderTexture,
    clearMode: boolean,
  ): void {
    this.uniforms.uResolution[0] = input.frame.width;
    this.uniforms.uResolution[1] = input.frame.height;
    super.apply(filterSystem, input, output, clearMode);
  }
}
