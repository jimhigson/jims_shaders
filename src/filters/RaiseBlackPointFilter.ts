import { Filter, GlProgram } from "pixi.js";

import { defaultVertex } from "../utils/defaultVertex";
import fragment from "./raiseBlackPoint.frag?raw";

export type RaiseBlackPointFilterOptions = {
  /**
   * Simulates how older screens couldn't make perfect blacks by compressing the dynamic range slightly.
   * 0 means no effect (same as not having the filter, whereas a value like 0.1 would be a very strong effect
   */
  blackPoint?: number;
};

export const defaultRaiseBlackPointUniforms: Required<RaiseBlackPointFilterOptions> =
  {
    blackPoint: 0.04,
  };

/**
 * Raises the black point of the image, simulating how older CRT screens couldn't produce perfect blacks
 */
export class RaiseBlackPointFilter extends Filter {
  public uniforms: {
    uBlackPoint: number;
  };

  constructor(uniforms: RaiseBlackPointFilterOptions = {}) {
    const finalUniforms = { ...defaultRaiseBlackPointUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultVertex,
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
        },
      },
    });

    this.uniforms = this.resources.raiseBlackPointUniforms.uniforms;
  }
}
