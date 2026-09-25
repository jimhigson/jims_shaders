import type {
  FilterSystem,
  RenderTexture,
  Texture,
  UniformData,
} from "pixi.js";

import { CrtPhaseFilter } from "./CrtPhaseFilter";
import fragment from "./signal.frag";
import {
  type ColorAdjustmentFilterOptions,
  colorAdjustmentUniforms,
} from "./stages/ColorAdjustmentFilterOptions";
import {
  type NoiseFilterOptions,
  noiseUniforms,
} from "./stages/NoiseFilterOptions";
import {
  type SharpenFilterOptions,
  sharpenUniforms,
} from "./stages/SharpenFilterOptions";

/** Each stage's options, or false (or left out) to leave that stage out */
export type SignalFilterOptions = {
  /** levels and colour of the signal before anything else happens to it */
  colorAdjustment?: ColorAdjustmentFilterOptions | false;
  noise?: false | NoiseFilterOptions;
  sharpen?: false | SharpenFilterOptions;
};

/**
 * The video signal on its way to the tube: its levels, the noise it picks up, and the peaking of
 * the set's luminance amplifier - everything that happens before the beam draws the picture.
 */
export class SignalFilter extends CrtPhaseFilter {
  #startTime = performance.now();
  #hasNoise: boolean;

  constructor({ colorAdjustment, noise, sharpen }: SignalFilterOptions = {}) {
    const uniforms: Record<string, UniformData> = {
      ...(colorAdjustment ? colorAdjustmentUniforms(colorAdjustment) : {}),
      ...(noise ? noiseUniforms(noise) : {}),
      ...(sharpen ? sharpenUniforms(sharpen) : {}),
    };

    super({
      name: "signal-filter",
      fragment,
      defines: {
        COLOR_ADJUSTMENT: Boolean(colorAdjustment),
        NOISE: Boolean(noise),
        SHARPEN: Boolean(sharpen),
      },
      uniforms,
    });

    this.#hasNoise = Boolean(noise);
  }

  override apply(
    filterSystem: FilterSystem,
    input: Texture,
    output: RenderTexture,
    clearMode: boolean,
  ): void {
    if (this.#hasNoise) {
      this.uniforms.uNoiseTime = performance.now() - this.#startTime;
    }
    super.apply(filterSystem, input, output, clearMode);
  }
}
