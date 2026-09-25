import type { UniformData } from "pixi.js";

/**
 * Fades the picture between refreshes, the way a phosphor does between the passes of the beam that
 * relight it.
 *
 * Every frame is still drawn - this does not hold the frame rate down to the rate being emulated,
 * it only dims the frames that fall between refreshes. Because the pattern has to repeat over a
 * whole number of the display's frames, the rate actually shown is the display's own refresh
 * divided by however many frames come closest to the rate asked for: a 120Hz display asked for 30Hz
 * flickers every 4th frame, and asked for 24Hz every 5th. Rates that do not divide are not
 * approximated, since a pattern that does not repeat evenly beats against the display and looks far
 * worse than no flicker at all. The display's refresh is not something the page can ask for, so it
 * is measured from the time between frames.
 */
export type FlickerFilterOptions = {
  /**
   * The refresh rate to flicker at, in hertz. This is only ever approached, never met exactly: the
   * flicker has to land on a whole number of the display's own frames, so 50 on a 60Hz display
   * cannot be shown at all and 50 on a 120Hz one comes out at 60
   */
  hz?: number;
  /**
   * How far the picture fades between refreshes, from 0 for no flicker at all up to 1 for frames
   * that go fully black. The fade is deliberately partial - a full blank is far harsher than any
   * set ever looked, and painful at the rates this runs at
   */
  depth?: number;
  /**
   * How long the phosphors hold their light, as a fraction of the gap between refreshes. Small
   * values drop away sharply after each refresh, larger ones hold most of their brightness
   * across the whole gap
   */
  persistence?: number;
};

export const defaultFlickerOptions: Required<FlickerFilterOptions> = {
  hz: 50,
  depth: 0.2,
  persistence: 0.3,
};

/** the flicker stage's uniforms, named as its glsl declares them - its brightness is set every frame */
export const flickerUniforms = (): Record<string, UniformData> => ({
  uFlickerBrightness: { value: 1, type: "f32" },
});
