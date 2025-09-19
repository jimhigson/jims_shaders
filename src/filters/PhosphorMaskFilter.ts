import type { FilterSystem, RenderTexture, Texture } from "pixi.js";

import { Filter, GlProgram } from "pixi.js";

import { defaultVertex } from "../utils/defaultVertex";
import { replacePlaceholders } from "../utils/replacePlaceholders";
import fragment from "./phosphorMask.frag?raw";

export type PhosphorMaskFilterOptions = {
  /** Width of phosphor mask pixels */
  pixelWidth?: number;
  /** Brightness of the mask pattern (0-1) */
  maskBrightness?: number;
  /** Number of samples for antialiasing (1 = off, 2-8 recommended) */
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

export class PhosphorMaskFilter extends Filter {
  public uniforms: {
    uPixelWidth: number;
    uMaskBrightness: number;
    uResolution: Float32Array;
    uTransitionWidth: number;
  };

  constructor(options: PhosphorMaskFilterOptions = {}) {
    const finalOptions = { ...defaultPhosphorMaskOptions, ...options };

    // Replace placeholders in the shader
    const processedFragment = replacePlaceholders(fragment, {
      NUM_SAMPLES: finalOptions.numSamples,
    });

    const glProgram = GlProgram.from({
      vertex: defaultVertex,
      fragment: processedFragment,
      name: "phosphor-mask-filter",
    });

    super({
      glProgram,
      resources: {
        phosphorMaskUniforms: {
          uPixelWidth: {
            value: finalOptions.pixelWidth,
            type: "f32",
          },
          uMaskBrightness: {
            value: finalOptions.maskBrightness,
            type: "f32",
          },
          uResolution: { value: new Float32Array(2), type: "vec2<f32>" },
          uTransitionWidth: {
            value: finalOptions.transitionWidth,
            type: "f32",
          },
        },
      },
    });

    this.uniforms = this.resources.phosphorMaskUniforms.uniforms;
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
