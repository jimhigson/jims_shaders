import type { FilterSystem, RenderTexture, Texture } from "pixi.js";

import { Filter, GlProgram } from "pixi.js";

import { defaultVertex } from "../utils/defaultVertex";
import { replacePlaceholders } from "../utils/replacePlaceholders";
import fragment from "./curvature.frag?raw";

export type CurvatureFilterOptions = {
  /** Horizontal curvature amount (0-1, typically 0.15) */
  curvatureX?: number;
  /** Vertical curvature amount (0-1, typically 0.15) */
  curvatureY?: number;
  /**
   * Enable multisampling (FSAA) for smoother curvature, but also slower rendering.
   * Also add some blurring.
   */
  multisampling?: boolean;
};

export const defaultCurvatureOptions: Required<CurvatureFilterOptions> = {
  curvatureX: 0.15,
  curvatureY: 0.15,
  multisampling: true,
};

export class CurvatureFilter extends Filter {
  public uniforms: {
    uCurvatureX: number;
    uCurvatureY: number;
    uResolution: Float32Array;
  };

  constructor(options: CurvatureFilterOptions = {}) {
    const finalOptions = { ...defaultCurvatureOptions, ...options };

    // Replace placeholders in the shader
    const processedFragment = replacePlaceholders(fragment, {
      MULTISAMPLE: finalOptions.multisampling,
    });

    const glProgram = GlProgram.from({
      vertex: defaultVertex,
      fragment: processedFragment,
      name: "curvature-filter",
    });

    super({
      glProgram,
      resources: {
        curvatureUniforms: {
          uCurvatureX: {
            value: finalOptions.curvatureX,
            type: "f32",
          },
          uCurvatureY: {
            value: finalOptions.curvatureY,
            type: "f32",
          },
          uResolution: { value: new Float32Array(2), type: "vec2<f32>" },
        },
      },
    });

    this.uniforms = this.resources.curvatureUniforms.uniforms;
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
