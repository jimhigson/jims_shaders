import { Filter, GlProgram } from "pixi.js";

import { defaultVertex } from "../utils/defaultVertex";
import fragment from "./roundedCorners.frag?raw";

export type RoundedCornersFilterUniforms = {
  /** Corner radius as proportion of screen size (0-0.1) */
  cornerRadius?: number;
};

export const defaultRoundedCornersUniforms: Required<RoundedCornersFilterUniforms> =
  {
    cornerRadius: 0.025,
  };

export class RoundedCornersFilter extends Filter {
  public uniforms: {
    uCornerRadius: number;
  };

  constructor(uniforms: RoundedCornersFilterUniforms = {}) {
    const finalUniforms = { ...defaultRoundedCornersUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultVertex,
      fragment,
      name: "rounded-corners-filter",
    });

    super({
      glProgram,
      resources: {
        roundedCornersUniforms: {
          uCornerRadius: {
            value: finalUniforms.cornerRadius,
            type: "f32",
          },
        },
      },
    });

    this.uniforms = this.resources.roundedCornersUniforms.uniforms;
  }
}
