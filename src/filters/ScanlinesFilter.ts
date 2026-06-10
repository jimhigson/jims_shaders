import type { FilterSystem, RenderTexture, Texture } from "pixi.js";

import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import fragment from "./scanlines.frag";

export type ScanlinesFilterOptions = {
  /** Height of each scanline in pixels */
  pixelHeight?: number;
  /**
   * Brightness of the gap between scanlines (0-1). Setting this to 1 turns scanlines off entirely.
   * Setting to 0 makes hard, dark scanlines.
   */
  gapBrightness?: number;
};

export const defaultScanlinesUniforms: Required<ScanlinesFilterOptions> = {
  pixelHeight: 4,
  gapBrightness: 0.7,
};

/**
 * Creates horizontal scanlines to simulate CRT display raster lines
 */
export class ScanlinesFilter extends Filter {
  public uniforms: {
    uPixelHeight: number;
    uResolution: Float32Array;
    uGapBrightness: number;
  };

  constructor(uniforms: ScanlinesFilterOptions = {}) {
    const finalUniforms = { ...defaultScanlinesUniforms, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultFilterVert,
      fragment,
      name: "scanlines-filter",
    });

    super({
      glProgram,
      resources: {
        scanlinesUniforms: {
          uPixelHeight: {
            value: finalUniforms.pixelHeight,
            type: "f32",
          },
          uResolution: { value: new Float32Array(2), type: "vec2<f32>" },
          uGapBrightness: {
            value: finalUniforms.gapBrightness,
            type: "f32",
          },
        },
      },
    });

    this.uniforms = this.resources.scanlinesUniforms.uniforms;
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
