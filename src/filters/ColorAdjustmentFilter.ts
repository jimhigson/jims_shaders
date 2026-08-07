import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import fragment from "./colorAdjustment.frag";

export type ColorAdjustmentFilterOptions = {
  /** Gamma correction (0.5-2.0, 1.0 = no correction) */
  gamma?: number;
  /** Color saturation (0-2, 0 = grayscale, 1 = normal) */
  saturation?: number;
  /** Brightness level (0-2, 1 = normal) */
  brightness?: number;
  /**
   * Extra brightness at bottom of screen (-1 to 1, 0 = no gradient). Positive values brighten the bottom, negative darken it,
   * simulates variable brightness on the round tube.
   */
  brightnessBottom?: number;
  /**
   * How far colours are pushed away from the neutral axis, standing in for a tube's phosphor
   * primaries sitting outside sRGB. Anchored on that axis, so white and grey are untouched and a
   * colour moves in proportion to how saturated it already is
   */
  phosphorExpansion?: number;
  /**
   * How much further than the others the red channel is pushed. The red phosphor is a narrow
   * emission line far outside sRGB, so saturated reds on a tube are more extreme than anything the
   * signal asked for - which is what makes them look boosted against a cool black
   */
  phosphorRedExtra?: number;
  /**
   * How far the white point is tilted towards red and away from blue. The cool floor and the
   * out-of-gamut red primary both drag a picture cool, more so the less red the content already
   * has, so a little of this brings the balance back across a range of material. It warms greys
   * as well, which is unavoidable in anything that adds red regardless of what is on screen
   */
  warmth?: number;
};

export const defaultColorAdjustmentUniforms: Required<ColorAdjustmentFilterOptions> =
  {
    gamma: 1.0,
    saturation: 1.0,
    brightness: 1.0,
    brightnessBottom: 0.0,
    phosphorExpansion: 0.1,
    phosphorRedExtra: 0.25,
    warmth: 0.023,
  };

/**
 * Adjusts gamma, saturation, and brightness for final color calibration. Can be put anywhere
 * in the filters chain. One use is to counter-act if the other filters such as phosphor mask filter
 * have had an overall desaturating effect
 */
export class ColorAdjustmentFilter extends Filter {
  public uniforms: {
    uGamma: number;
    uSaturation: number;
    uBrightness: number;
    uBrightnessBottom: number;
    uPhosphorExpansion: number;
    uPhosphorRedExtra: number;
    uWarmth: number;
  };

  constructor(uniforms: ColorAdjustmentFilterOptions = {}) {
    const finalUniforms = { ...defaultColorAdjustmentUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultFilterVert,
      fragment,
      name: "color-adjustment-filter",
    });

    super({
      glProgram,
      resources: {
        colorAdjustmentUniforms: {
          uGamma: {
            value: finalUniforms.gamma,
            type: "f32",
          },
          uSaturation: {
            value: finalUniforms.saturation,
            type: "f32",
          },
          uBrightness: {
            value: finalUniforms.brightness,
            type: "f32",
          },
          uPhosphorExpansion: {
            value: finalUniforms.phosphorExpansion,
            type: "f32",
          },
          uPhosphorRedExtra: {
            value: finalUniforms.phosphorRedExtra,
            type: "f32",
          },
          uWarmth: {
            value: finalUniforms.warmth,
            type: "f32",
          },
          uBrightnessBottom: {
            value: finalUniforms.brightnessBottom,
            type: "f32",
          },
        },
      },
    });

    this.uniforms = this.resources.colorAdjustmentUniforms.uniforms;
  }
}
