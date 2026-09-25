import type {
  FilterSystem,
  RenderTexture,
  Texture,
  UniformData,
} from "pixi.js";

import { CrtPhaseFilter } from "./CrtPhaseFilter";
import fragment from "./raster.frag";
import { FlickerClock } from "./stages/FlickerClock";
import {
  type FlickerFilterOptions,
  flickerUniforms,
} from "./stages/FlickerFilterOptions";
import {
  defaultPhosphorMaskOptions,
  type PhosphorMaskFilterOptions,
  phosphorMaskUniforms,
} from "./stages/PhosphorMaskFilterOptions";
import {
  type ScanlinesFilterOptions,
  scanlinesUniforms,
} from "./stages/ScanlinesFilterOptions";

/** Each stage's options, or false (or left out) to leave that stage out */
export type RasterFilterOptions = {
  scanlines?: false | ScanlinesFilterOptions;
  phosphorMask?: false | PhosphorMaskFilterOptions;
  flicker?: false | FlickerFilterOptions;
};

/**
 * The picture as the beam lays it down on the phosphors: in scanlines, through the slot mask, and
 * dying away between passes of the beam.
 */
export class RasterFilter extends CrtPhaseFilter {
  /** the flicker's timing, undefined when the flicker is left out */
  readonly flickerClock: FlickerClock | undefined;

  constructor({ scanlines, phosphorMask, flicker }: RasterFilterOptions = {}) {
    const uniforms: Record<string, UniformData> = {
      ...(scanlines ? scanlinesUniforms(scanlines) : {}),
      ...(phosphorMask ? phosphorMaskUniforms(phosphorMask) : {}),
      ...(flicker ? flickerUniforms() : {}),
    };

    super({
      name: "raster-filter",
      fragment,
      defines: {
        SCANLINES: Boolean(scanlines),
        PHOSPHOR_MASK: Boolean(phosphorMask),
        FLICKER: Boolean(flicker),
        PHOSPHOR_MASK_SAMPLES:
          phosphorMask ?
            (phosphorMask.numSamples ?? defaultPhosphorMaskOptions.numSamples)
          : 1,
      },
      uniforms,
    });

    this.flickerClock = flicker ? new FlickerClock(flicker) : undefined;
  }

  override apply(
    filterSystem: FilterSystem,
    input: Texture,
    output: RenderTexture,
    clearMode: boolean,
  ): void {
    if (this.flickerClock !== undefined) {
      this.uniforms.uFlickerBrightness =
        this.flickerClock.nextFrameBrightness();
    }
    super.apply(filterSystem, input, output, clearMode);
  }
}
