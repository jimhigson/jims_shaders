import type { FilterSystem, RenderTexture, Texture } from "pixi.js";

import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import fragment from "./sharpen.frag";

export type SharpenFilterOptions = {
  /**
   * How strongly the high frequencies are boosted. 0 is no sharpening at all, around 0.5 is the
   * moderate peaking of a late-80s consumer set, and much above 1 gives the hard white fringes of
   * a set with its sharpness control wound all the way up
   */
  amount?: number;
  /**
   * How far from each pixel the peaking taps are taken, in output pixels. This stands in for the
   * luminance bandwidth of the set - a wider radius resolves less detail and rings more broadly
   */
  radius?: number;
  /**
   * How much of the ringing falls on the trailing side of an edge rather than the leading side,
   * from 0 for an evenly balanced preshoot and overshoot up to 1 for all overshoot
   */
  asymmetry?: number;
  /**
   * How far the signal is band-limited before the boost is applied, from 0 to leave it alone up to
   * 1 for a full 1-2-1 roll-off over the same taps the peaking uses. This is the loss of high
   * frequencies through the signal chain that the peaking exists to compensate for, so a little of
   * it keeps the sharpening from looking like it is acting on an impossibly perfect signal
   */
  signalBlur?: number;
};

export const defaultSharpenUniforms: Required<SharpenFilterOptions> = {
  amount: 0.5,
  radius: 2.5,
  asymmetry: 0.35,
  signalBlur: 0.25,
};

/**
 * Sharpens along the scan direction only, in the manner of the peaking (aperture correction) in a
 * CRT set's luminance amplifier, and of the scan velocity modulation that many sets of the same era
 * added on top of it. Both put a dark preshoot before a luminance edge and a bright overshoot after
 * it. Only the luminance is sharpened, and the overshoot clips at white. The signal is optionally
 * band-limited along the same axis first, standing in for what the chain rolled off before the
 * peaking got to it.
 */
export class SharpenFilter extends Filter {
  public uniforms: {
    uAmount: number;
    uRadius: number;
    uAsymmetry: number;
    uSignalBlur: number;
    uResolution: Float32Array;
  };

  constructor(uniforms: SharpenFilterOptions = {}) {
    const finalUniforms = { ...defaultSharpenUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultFilterVert,
      fragment,
      name: "sharpen-filter",
    });

    super({
      glProgram,
      resources: {
        sharpenUniforms: {
          uAmount: {
            value: finalUniforms.amount,
            type: "f32",
          },
          uRadius: {
            value: finalUniforms.radius,
            type: "f32",
          },
          uAsymmetry: {
            value: finalUniforms.asymmetry,
            type: "f32",
          },
          uSignalBlur: {
            value: finalUniforms.signalBlur,
            type: "f32",
          },
          uResolution: { value: new Float32Array(2), type: "vec2<f32>" },
        },
      },
    });

    this.uniforms = this.resources.sharpenUniforms.uniforms;
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
