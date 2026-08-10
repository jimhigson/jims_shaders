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
   * How long the picture then takes to reach its brightest, most bloomed point, in milliseconds
   */
  riseDuration?: number;
  /**
   * How long the picture then takes to settle from that peak down to its steady state, in
   * milliseconds
   */
  decayDuration?: number;
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
  /**
   * How much further the raster grows at the brightness peak, as the same rising beam current that
   * overshoots the brightness also loads the high voltage and blooms the raster. 0 has the raster
   * shrink straight onto its resting size with no bloom at all
   */
  bloomAmount?: number;
  /**
   * Height of scanline virtual pixels while this filter is active - pass the same value given to
   * ScanlinesFilter elsewhere in the chain, since that filter is left out while this one plays
   */
  scanlinesPixelHeight?: number;
  /**
   * Brightness of scanline gaps while this filter is active - pass the same value given to
   * ScanlinesFilter elsewhere in the chain, since that filter is left out while this one plays
   */
  scanlinesGapBrightness?: number;
  /**
   * How far the degaussing coil's decaying field displaces the picture just after switch-on. 0
   * plays no degauss ripple at all
   */
  degaussAmount?: number;
  /**
   * How long the degauss ripple takes to decay away, in milliseconds
   */
  degaussDecay?: number;
  /**
   * How far the vertical oscillator's hunting for lock displaces the picture while the set is cold.
   * 0 plays no vertical roll at all
   */
  rollAmount?: number;
  /**
   * How long the vertical roll takes to settle as the oscillator reaches thermal lock, in
   * milliseconds
   */
  rollDecay?: number;
};

export const defaultSwitchOnOptions: Required<SwitchOnFilterOptions> = {
  warmUpDelay: 700,
  riseDuration: 1_200,
  decayDuration: 1_800,
  overshoot: 0.18,
  castHue: 150,
  castStrength: 0.3,
  overscan: 0.04,
  bloomAmount: 0.03,
  scanlinesPixelHeight: 4,
  scanlinesGapBrightness: 0.7,
  degaussAmount: 0.008,
  degaussDecay: 400,
  rollAmount: 0.004,
  rollDecay: 600,
};

/**
 * Brings the picture up the way a CRT does when it is switched on: nothing at all while the heaters
 * warm, then an eased brightness rise that overshoots and settles, tinted while the guns are still
 * coming up to temperature, with the raster shrinking onto the screen as the EHT rises and blooming
 * again at the brightness peak. Also plays a fast degauss-coil ripple and a slower cold-vertical-
 * oscillator roll, and renders scanlines itself (in the raster's own scaled coordinate space) so
 * they shrink and wobble onto the screen with the picture rather than staying screen-space-fixed -
 * leave ScanlinesFilter out of the chain elsewhere while this filter is active.
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
    uRiseDuration: number;
    uDecayDuration: number;
    uOvershoot: number;
    uCastHue: number;
    uCastStrength: number;
    uOverscan: number;
    uBloomAmount: number;
    uScanlinesPixelHeight: number;
    uScanlinesGapBrightness: number;
    uResolution: Float32Array;
    uDegaussAmount: number;
    uDegaussDecay: number;
    uRollAmount: number;
    uRollDecay: number;
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
          uRiseDuration: {
            value: finalUniforms.riseDuration,
            type: "f32",
          },
          uDecayDuration: {
            value: finalUniforms.decayDuration,
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
          uBloomAmount: {
            value: finalUniforms.bloomAmount,
            type: "f32",
          },
          uScanlinesPixelHeight: {
            value: finalUniforms.scanlinesPixelHeight,
            type: "f32",
          },
          uScanlinesGapBrightness: {
            value: finalUniforms.scanlinesGapBrightness,
            type: "f32",
          },
          uResolution: { value: new Float32Array(2), type: "vec2<f32>" },
          uDegaussAmount: {
            value: finalUniforms.degaussAmount,
            type: "f32",
          },
          uDegaussDecay: {
            value: finalUniforms.degaussDecay,
            type: "f32",
          },
          uRollAmount: {
            value: finalUniforms.rollAmount,
            type: "f32",
          },
          uRollDecay: {
            value: finalUniforms.rollDecay,
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
    const { uWarmUpDelay, uRiseDuration, uDecayDuration } = this.uniforms;
    return this.elapsed >= uWarmUpDelay + uRiseDuration + uDecayDuration;
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
    this.uniforms.uResolution[0] = input.frame.width;
    this.uniforms.uResolution[1] = input.frame.height;
    super.apply(filterSystem, input, output, clearMode);
  }
}
