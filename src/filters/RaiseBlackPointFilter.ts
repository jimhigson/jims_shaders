import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import fragment from "./raiseBlackPoint.frag";

export type RaiseBlackPointFilterOptions = {
  /**
   * Simulates how older screens couldn't make perfect blacks by compressing the dynamic range slightly.
   * 0 means no effect (same as not having the filter, whereas a value like 0.1 would be a very strong effect.
   * This is the lift in the middle of the dome, ie the least the image is lifted anywhere
   */
  blackPoint?: number;
  /**
   * Horizontal centre of the dome, as a fraction of the screen's width
   */
  domeCentreX?: number;
  /**
   * Vertical centre of the dome, as a fraction of the screen's height
   */
  domeCentreY?: number;
  /**
   * Distance from the centre at which the full domeEdgeLift is reached, where 1 is the middle
   * of the screen's edges and the corners are further out by an amount that depends on
   * domeSuperellipse. The dome follows the shape of the screen, so this is not corrected for
   * the aspect ratio.
   */
  domeRadius?: number;
  /**
   * How much more than blackPoint the image is lifted at domeRadius, as if looking through the
   * thicker glass towards the edge of a curved tube. 0 lifts evenly everywhere, ie no dome
   */
  domeEdgeLift?: number;
  /**
   * How the extra lift ramps up from the centre out to domeRadius. 1 is linear, 2 is quadratic,
   * and higher values keep the middle flatter while turning up more sharply near the edge
   */
  domeFalloff?: number;
  /**
   * Shape of the dome's contours, as the exponent of a superellipse. 2 gives an ellipse, and
   * higher values push the corners outwards towards a rectangle with rounded corners, so that
   * the lift hugs the edges of the screen rather than bulging out of the middle of them
   */
  domeSuperellipse?: number;
  /**
   * Hue of the lift in degrees around the colour wheel, so 0 is red, 30 orange, 120 green and
   * 240 blue. A running tube's floor is cool - it is ambient light scattering off the phosphor
   * layer and halation from a blue-white raster, not the brown of the dead glass. Only has an
   * effect while liftSaturation is above 0
   */
  liftHue?: number;
  /**
   * How strongly the lift is tinted towards liftHue, from 0 for a neutral grey lift up to 1.
   * Since the lift's brightest channel is unchanged, saturating darkens the other two, so a
   * strongly saturated lift is dimmer as well as more colourful
   */
  liftSaturation?: number;
};

export const defaultRaiseBlackPointUniforms: Required<RaiseBlackPointFilterOptions> =
  {
    blackPoint: 0.03,
    domeCentreX: 0.5,
    domeCentreY: 0.5,
    domeRadius: 1.2,
    domeEdgeLift: 0.07,
    domeFalloff: 2,
    domeSuperellipse: 4,
    liftHue: 220,
    liftSaturation: 0.2,
  };

/**
 * Raises the black point of the image, simulating how older CRT screens couldn't produce perfect
 * blacks. The lift is domed - weakest in the middle and strongest towards the edges - as if looking
 * through the glass of a curved tube - and slightly cool, as the scattered light of a running tube
 * is. Alpha is passed through unchanged.
 */
export class RaiseBlackPointFilter extends Filter {
  public uniforms: {
    uBlackPoint: number;
    uDomeCentre: Float32Array;
    uDomeRadius: number;
    uDomeEdgeLift: number;
    uDomeFalloff: number;
    uDomeSuperellipse: number;
    uLiftHue: number;
    uLiftSaturation: number;
  };

  constructor(uniforms: RaiseBlackPointFilterOptions = {}) {
    const finalUniforms = { ...defaultRaiseBlackPointUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultFilterVert,
      fragment,
      name: "raise-black-point-filter",
    });

    super({
      glProgram,
      resources: {
        raiseBlackPointUniforms: {
          uBlackPoint: {
            value: finalUniforms.blackPoint,
            type: "f32",
          },
          uDomeCentre: {
            value: new Float32Array([
              finalUniforms.domeCentreX,
              finalUniforms.domeCentreY,
            ]),
            type: "vec2<f32>",
          },
          uDomeRadius: {
            value: finalUniforms.domeRadius,
            type: "f32",
          },
          uDomeEdgeLift: {
            value: finalUniforms.domeEdgeLift,
            type: "f32",
          },
          uDomeFalloff: {
            value: finalUniforms.domeFalloff,
            type: "f32",
          },
          uDomeSuperellipse: {
            value: finalUniforms.domeSuperellipse,
            type: "f32",
          },
          uLiftHue: {
            value: finalUniforms.liftHue,
            type: "f32",
          },
          uLiftSaturation: {
            value: finalUniforms.liftSaturation,
            type: "f32",
          },
        },
      },
    });

    this.uniforms = this.resources.raiseBlackPointUniforms.uniforms;
  }
}
