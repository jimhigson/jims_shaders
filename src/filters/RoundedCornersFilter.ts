import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import fragment from "./roundedCorners.frag";

export type RoundedCornersFilterOptions = {
  /** Corner radius as proportion of screen size (0-0.1) */
  cornerRadius?: number;
};

export const defaultRoundedCornersUniforms: Required<RoundedCornersFilterOptions> =
  {
    cornerRadius: 0.025,
  };

/**
 * Adds rounded corners to the screen edges to simulate the physical shape of CRT displays.
 * This is separate from, but related to, the CurvatureFilter, which distorts the image to simulate the curved glass screen.
 */
export class RoundedCornersFilter extends Filter {
  public uniforms: {
    uCornerRadius: number;
  };

  constructor(uniforms: RoundedCornersFilterOptions = {}) {
    const finalUniforms = { ...defaultRoundedCornersUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultFilterVert,
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
