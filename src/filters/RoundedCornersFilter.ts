import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import fragment from "./roundedCorners.frag";

export type RoundedCornersFilterOptions = {
  /** Corner radius as proportion of screen size (0-0.1) */
  cornerRadius?: number;
  /**
   * How far in from every edge the picture fades up from black, as a proportion of the screen, so
   * 0.01 is a band of a hundredth of the way in. Small values are enough: the point is only to stop
   * the edge being a hard line, which shows up as aliasing once the picture is curved
   */
  edgeFade?: number;
};

export const defaultRoundedCornersUniforms: Required<RoundedCornersFilterOptions> =
  {
    cornerRadius: 0.025,
    edgeFade: 0.01,
  };

/**
 * Adds rounded corners to the screen edges to simulate the physical shape of CRT displays, fading
 * the picture up from black over a band just inside every edge so that curving it afterwards does
 * not leave a hard, aliased line.
 */
export class RoundedCornersFilter extends Filter {
  public uniforms: {
    uCornerRadius: number;
    uEdgeFade: number;
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
          uEdgeFade: {
            value: finalUniforms.edgeFade,
            type: "f32",
          },
        },
      },
    });

    this.uniforms = this.resources.roundedCornersUniforms.uniforms;
  }
}
