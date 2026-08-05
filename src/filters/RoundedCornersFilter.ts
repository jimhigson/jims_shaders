import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import fragment from "./roundedCorners.frag";

export type RoundedCornersFilterOptions = {
  /**
   * Corner radius as proportion of screen size (0-0.1). The shape drawn is a superellipse rather
   * than a rectangle with circular corners, which is both closer to the face of a real tube and
   * lets the whole edge be one contour - so the fade can follow the corners as well as the sides.
   * The radius given is approximated by the superellipse that reaches as far into the corner
   */
  cornerRadius?: number;
  /**
   * How far in from every edge the picture fades up from black, as a proportion of the screen, so
   * 0.01 is a band of a hundredth of the way in. Small values are enough: the point is only to stop
   * the edge being a hard line, which shows up as aliasing once the picture is curved
   */
  edgeFade?: number;
};

/**
 * The screen's shape is drawn as a superellipse, which has an exponent where a rounded rectangle
 * has a corner radius - so the radius asked for is matched by the exponent whose corner reaches
 * the same distance from the centre along the diagonal, which holds the two shapes close over the
 * whole corner.
 */
const cornerExponentFor = (
  /** Corner radius over the whole screen, as the option gives it */
  cornerRadius: number,
): number => {
  // the superellipse is drawn in a space running from -1 to 1, so it spans twice the radius
  const radius = Math.min(Math.max(cornerRadius * 2, 0.0001), 1);
  const reach = 1 - radius * (1 - Math.SQRT1_2);

  return Math.min(Math.max(Math.LN2 / -Math.log(reach), 2), 64);
};

export const defaultRoundedCornersUniforms: Required<RoundedCornersFilterOptions> =
  {
    cornerRadius: 0.025,
    edgeFade: 0.01,
  };

/**
 * Cuts the picture to the shape of a CRT's face, fading it up from black over a band just inside
 * the edge so that curving it afterwards does not leave a hard, aliased line. The shape and the
 * fade are contours of one superellipse, so the fade follows the corners as evenly as it does the
 * sides.
 */
export class RoundedCornersFilter extends Filter {
  public uniforms: {
    uCornerExponent: number;
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
          uCornerExponent: {
            value: cornerExponentFor(finalUniforms.cornerRadius),
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
