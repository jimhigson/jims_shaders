import { Filter, GlProgram } from "pixi.js";

import { defaultVertex } from "../utils/defaultVertex";
import fragment from "./vignette.frag?raw";

export type VignetteFilterOptions = {
  /** Vignette intensity */
  intensity?: number;
  /** Radius from center where vignette starts */
  radius?: number;
};

export const defaultVignetteUniforms: Required<VignetteFilterOptions> = {
  intensity: 0.4,
  radius: 0.8,
};

/**
 * Darkens the edges of the screen to simulate the natural light falloff on CRT displays
 */
export class VignetteFilter extends Filter {
  public uniforms: {
    uIntensity: number;
    uRadius: number;
  };

  constructor(uniforms: VignetteFilterOptions = {}) {
    const finalUniforms = { ...defaultVignetteUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultVertex,
      fragment,
      name: "vignette-filter",
    });

    super({
      glProgram,
      resources: {
        vignetteUniforms: {
          uIntensity: {
            value: finalUniforms.intensity,
            type: "f32",
          },
          uRadius: {
            value: finalUniforms.radius,
            type: "f32",
          },
        },
      },
    });

    this.uniforms = this.resources.vignetteUniforms.uniforms;
  }
}
