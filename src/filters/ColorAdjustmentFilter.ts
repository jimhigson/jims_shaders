import { Filter, GlProgram } from "pixi.js";

import { defaultVertex } from "../utils/defaultVertex";
import fragment from "./colorAdjustment.frag?raw";

export type ColorAdjustmentFilterUniforms = {
  /** Gamma correction (0.5-2.0, 1.0 = no correction) */
  gamma?: number;
  /** Color saturation (0-2, 0 = grayscale, 1 = normal) */
  saturation?: number;
  /** Brightness level (0-2, 1 = normal) */
  brightness?: number;
};

export const defaultColorAdjustmentUniforms: Required<ColorAdjustmentFilterUniforms> =
  {
    gamma: 1.0,
    saturation: 1.0,
    brightness: 1.0,
  };

export class ColorAdjustmentFilter extends Filter {
  public uniforms: {
    uGamma: number;
    uSaturation: number;
    uBrightness: number;
  };

  constructor(uniforms: ColorAdjustmentFilterUniforms = {}) {
    const finalUniforms = { ...defaultColorAdjustmentUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultVertex,
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
        },
      },
    });

    this.uniforms = this.resources.colorAdjustmentUniforms.uniforms;
  }
}
