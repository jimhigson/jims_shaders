import type { FilterSystem, RenderTexture, Texture } from "pixi.js";

import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import fragment from "./switchOn.frag";

export type SwitchOnFilterOptions = {
  /**
   * How long the heaters take to reach emission temperature, in milliseconds, during which the
   * screen stays black. A set switched on from cold takes longer than one switched straight back on
   */
  warmUpDelay?: number;
  /**
   * How long the picture then takes to come up, in milliseconds
   */
  duration?: number;
  /**
   * How far past its final brightness the picture goes before falling back, as the beam limiter and
   * the supplies settle. 0 comes up cleanly with no bloom at all
   */
  overshoot?: number;
  /**
   * Hue in degrees of the cast the picture has while the guns are still warming, since they do not
   * all reach temperature together. Around 150 gives the green cast of a set that is still cold
   */
  castHue?: number;
  /**
   * How strong that cast is when the picture first appears, from 0 for none to 1 for a fully
   * saturated one. It works its way back to neutral over the rest of the switch-on
   */
  castStrength?: number;
  /**
   * How far oversized the raster starts, as a fraction of the screen, shrinking onto it as the EHT
   * comes up
   */
  overscan?: number;
};

export const defaultSwitchOnOptions: Required<SwitchOnFilterOptions> = {
  warmUpDelay: 700,
  duration: 1_800,
  overshoot: 0.18,
  castHue: 150,
  castStrength: 0.3,
  overscan: 0.04,
};

/**
 * Brings the picture up the way a CRT does when it is switched on: nothing at all while the heaters
 * warm, then an eased fade-up that overshoots and settles, tinted while the guns are still coming
 * up to temperature, with the raster shrinking onto the screen as the EHT rises.
 *
 * This is not a switch-off played backwards - a set being switched off collapses to a line and then
 * a dot, which has no counterpart here.
 *
 * The animation runs from the moment the filter is constructed. Call `restart` to play it again.
 */
export class SwitchOnFilter extends Filter {
  public uniforms: {
    uElapsed: number;
    uWarmUpDelay: number;
    uDuration: number;
    uOvershoot: number;
    uCastHue: number;
    uCastStrength: number;
    uOverscan: number;
  };

  #startTime: number;
  #heldAt: number;
  #autoAdvancing: boolean;

  constructor(uniforms: SwitchOnFilterOptions = {}) {
    const finalUniforms = { ...defaultSwitchOnOptions, ...uniforms };

    const glProgram = GlProgram.from({
      vertex: defaultFilterVert,
      fragment,
      name: "switch-on-filter",
    });

    super({
      glProgram,
      resources: {
        switchOnUniforms: {
          uElapsed: {
            value: 0,
            type: "f32",
          },
          uWarmUpDelay: {
            value: finalUniforms.warmUpDelay,
            type: "f32",
          },
          uDuration: {
            value: finalUniforms.duration,
            type: "f32",
          },
          uOvershoot: {
            value: finalUniforms.overshoot,
            type: "f32",
          },
          uCastHue: {
            value: finalUniforms.castHue,
            type: "f32",
          },
          uCastStrength: {
            value: finalUniforms.castStrength,
            type: "f32",
          },
          uOverscan: {
            value: finalUniforms.overscan,
            type: "f32",
          },
        },
      },
    });

    this.uniforms = this.resources.switchOnUniforms.uniforms;
    this.#startTime = performance.now();
    this.#heldAt = 0;
    this.#autoAdvancing = true;
  }

  /**
   * How far through the switch-on the picture currently is, in milliseconds. This advances on its
   * own from the moment the filter is made, so nothing has to drive it - but assigning to it holds
   * the picture at that point instead, which is how a consumer scrubs through the animation or
   * drives it from a clock of its own
   */
  get elapsed(): number {
    return this.#autoAdvancing ?
        performance.now() - this.#startTime
      : this.#heldAt;
  }

  set elapsed(ms: number) {
    this.#heldAt = ms;
    this.#autoAdvancing = false;
  }

  /**
   * Whether the picture has finished coming up, after which this filter does nothing to it and can
   * be taken out of the chain
   */
  get finished(): boolean {
    return this.elapsed >= this.uniforms.uWarmUpDelay + this.uniforms.uDuration;
  }

  /**
   * Plays the switch-on again from the beginning, advancing on its own again if it had been held
   */
  restart(): void {
    this.#startTime = performance.now();
    this.#autoAdvancing = true;
  }

  override apply(
    filterSystem: FilterSystem,
    input: Texture,
    output: RenderTexture,
    clearMode: boolean,
  ): void {
    this.uniforms.uElapsed = this.elapsed;
    super.apply(filterSystem, input, output, clearMode);
  }
}
