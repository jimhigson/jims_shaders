import type { FilterSystem, RenderTexture, Texture } from "pixi.js";

import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import { replacePlaceholders } from "../utils/replacePlaceholders";
import fragment from "./screenGeometry.frag";

export type ScreenGeometryFilterOptions = {
  /** Horizontal curvature amount (0-1, typically 0.15) */
  curvatureX?: number;
  /** Vertical curvature amount (0-1, typically 0.15) */
  curvatureY?: number;
  /**
   * Enable multisampling (FSAA) for smoother curvature, but also slower rendering.
   * Also add some blurring.
   */
  multisampling?: boolean;
  /**
   * How far oversized the raster is drawn, as a fraction of the screen, so that the edges of the
   * picture fall outside the glass. Animate this to open the picture out onto the screen
   */
  overscan?: number;
  /**
   * How much wider a fully lit line is drawn than a black one. The beam current of a bright line
   * loads the high voltage supply, and a beam accelerated by less voltage is thrown further by the
   * same deflection current, so the raster expands with the brightness of what is on it
   */
  rowStretch?: number;
  /**
   * How far bright material shifts the rest of its own line along, as a fraction of the screen's
   * width. The supply sags as the line is drawn, so this builds up left to right rather than
   * applying to the line evenly
   */
  lineLag?: number;
  /**
   * How many lines back the supply is still recovering over, which sets how quickly the stretch can
   * change down the picture. Too few and the picture jitters line to line on fine detail, which no
   * real supply is quick enough to do
   */
  sagLines?: number;
  /**
   * How many points along each line the beam current is measured at. More follows the picture more
   * closely at the cost of that many texture reads per pixel; the supply is slow enough that a
   * coarse measurement is close to the truth
   */
  loadTaps?: number;
};

export const defaultScreenGeometryOptions: Required<ScreenGeometryFilterOptions> =
  {
    curvatureX: 0.15,
    curvatureY: 0.15,
    multisampling: true,
    overscan: 0,
    rowStretch: 0.012,
    lineLag: 0.004,
    sagLines: 24,
    loadTaps: 16,
  };

/**
 * Puts the picture where the beam would actually have drawn it: oversized by however far the raster
 * overshoots the glass, stretched by the sag of the high voltage under the beam current the picture
 * itself is drawing, and curved by the shape of the screen.
 *
 * These are one filter rather than three because they are all the same kind of thing - a change to
 * where a point of the picture is sampled from - and composing them into a single coordinate costs
 * one resample instead of three, which matters on an upscaled picture that each resample softens.
 */
export class ScreenGeometryFilter extends Filter {
  public uniforms: {
    uCurvatureX: number;
    uCurvatureY: number;
    uOverscan: number;
    uRowStretch: number;
    uLineLag: number;
    uSagLines: number;
    uResolution: Float32Array;
  };

  constructor(options: ScreenGeometryFilterOptions = {}) {
    const finalOptions = { ...defaultScreenGeometryOptions, ...options };

    const processedFragment = replacePlaceholders(fragment, {
      MULTISAMPLE: finalOptions.multisampling,
      LOAD_TAPS: finalOptions.loadTaps,
    });

    const glProgram = GlProgram.from({
      vertex: defaultFilterVert,
      fragment: processedFragment,
      name: "screen-geometry-filter",
    });

    super({
      glProgram,
      resources: {
        screenGeometryUniforms: {
          uCurvatureX: {
            value: finalOptions.curvatureX,
            type: "f32",
          },
          uCurvatureY: {
            value: finalOptions.curvatureY,
            type: "f32",
          },
          uOverscan: {
            value: finalOptions.overscan,
            type: "f32",
          },
          uRowStretch: {
            value: finalOptions.rowStretch,
            type: "f32",
          },
          uLineLag: {
            value: finalOptions.lineLag,
            type: "f32",
          },
          uSagLines: {
            value: finalOptions.sagLines,
            type: "f32",
          },
          uResolution: { value: new Float32Array(2), type: "vec2<f32>" },
        },
      },
    });

    this.uniforms = this.resources.screenGeometryUniforms.uniforms;
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
