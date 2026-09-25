import type { UniformData } from "pixi.js";

/**
 * Brings the picture up the way a CRT does when it is switched on: nothing at all while the heaters
 * warm, then an eased brightness rise that overshoots and settles, tinted while the guns are still
 * coming up to temperature, with the raster shrinking onto the screen as the EHT rises and blooming
 * again at the brightness peak. Also plays a fast degauss-coil ripple and a slower cold-vertical-
 * oscillator roll, and renders scanlines itself (in the raster's own scaled coordinate space) so
 * they shrink and wobble onto the screen with the picture rather than staying screen-space-fixed -
 * the raster phase's own scanlines can be turned off while this plays.
 *
 * This is not a switch-off played backwards - a set being switched off collapses to a line and then
 * a dot, which has no counterpart here.
 *
 * The animation runs from the moment the tube filter is constructed, and can be restarted or held.
 */
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
   * Height of scanline virtual pixels while the switch-on plays - pass the same value given to the
   * raster phase's scanlines, which match these once the switch-on is over
   */
  scanlinesPixelHeight?: number;
  /**
   * Brightness of scanline gaps while the switch-on plays - pass the same value given to the
   * raster phase's scanlines, which match these once the switch-on is over
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

/** the switch-on stage's uniforms, named as its glsl declares them - its elapsed time is set every frame */
export const switchOnUniforms = (
  options: SwitchOnFilterOptions,
): Record<string, UniformData> => {
  const finalOptions = { ...defaultSwitchOnOptions, ...options };
  return {
    uSwitchOnElapsed: { value: 0, type: "f32" },
    uSwitchOnWarmUpDelay: { value: finalOptions.warmUpDelay, type: "f32" },
    uSwitchOnRiseDuration: { value: finalOptions.riseDuration, type: "f32" },
    uSwitchOnDecayDuration: { value: finalOptions.decayDuration, type: "f32" },
    uSwitchOnOvershoot: { value: finalOptions.overshoot, type: "f32" },
    uSwitchOnCastHue: { value: finalOptions.castHue, type: "f32" },
    uSwitchOnCastStrength: { value: finalOptions.castStrength, type: "f32" },
    uSwitchOnOverscan: { value: finalOptions.overscan, type: "f32" },
    uSwitchOnBloomAmount: { value: finalOptions.bloomAmount, type: "f32" },
    uSwitchOnScanlinesPixelHeight: {
      value: finalOptions.scanlinesPixelHeight,
      type: "f32",
    },
    uSwitchOnScanlinesGapBrightness: {
      value: finalOptions.scanlinesGapBrightness,
      type: "f32",
    },
    uSwitchOnDegaussAmount: { value: finalOptions.degaussAmount, type: "f32" },
    uSwitchOnDegaussDecay: { value: finalOptions.degaussDecay, type: "f32" },
    uSwitchOnRollAmount: { value: finalOptions.rollAmount, type: "f32" },
    uSwitchOnRollDecay: { value: finalOptions.rollDecay, type: "f32" },
  };
};
