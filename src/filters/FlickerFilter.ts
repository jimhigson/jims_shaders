import type { FilterSystem, RenderTexture, Texture } from "pixi.js";

import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import fragment from "./flicker.frag";

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

/** How many frame times are kept to work out what the display is actually doing */
const measuredFrames = 32;

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
export class FlickerFilter extends Filter {
  public uniforms: {
    uBrightness: number;
  };

  #options: Required<FlickerFilterOptions>;
  #frameTimes: number[];
  #lastFrameAt: number;
  #frame: number;
  #framesPerRefresh: number;

  constructor(options: FlickerFilterOptions = {}) {
    const finalOptions = { ...defaultFlickerOptions, ...options };

    const glProgram = GlProgram.from({
      vertex: defaultFilterVert,
      fragment,
      name: "flicker-filter",
    });

    super({
      glProgram,
      resources: {
        flickerUniforms: {
          uBrightness: {
            value: 1,
            type: "f32",
          },
        },
      },
    });

    this.uniforms = this.resources.flickerUniforms.uniforms;
    this.#options = finalOptions;
    this.#frameTimes = [];
    this.#lastFrameAt = 0;
    this.#frame = 0;
    this.#framesPerRefresh = 1;
  }

  /**
   * What the display's refresh rate has been measured as, in hertz, or 0 until enough frames have
   * gone by to say
   */
  get measuredRefreshHz(): number {
    if (this.#frameTimes.length < measuredFrames) {
      return 0;
    }

    // the median rejects the occasional long frame, which would drag a mean upwards
    const sorted = this.#frameTimes.slice().sort((a, b) => a - b);

    return 1_000 / sorted[sorted.length >> 1];
  }

  /**
   * How many of the display's frames each emulated refresh is spread over. 1 means the display is
   * close enough to the rate asked for that there is nothing to show
   */
  get framesPerRefresh(): number {
    return this.#framesPerRefresh;
  }

  /** The rate actually being flickered at, in hertz, which the display's refresh has to divide by */
  get flickerHz(): number {
    return this.measuredRefreshHz / this.#framesPerRefresh;
  }

  #recordFrame(): void {
    const now = performance.now();

    if (this.#lastFrameAt !== 0) {
      this.#frameTimes.push(now - this.#lastFrameAt);

      if (this.#frameTimes.length > measuredFrames) {
        this.#frameTimes.shift();
      }
    }

    this.#lastFrameAt = now;
    this.#frame++;
  }

  #brightness(): number {
    const refreshHz = this.measuredRefreshHz;

    if (refreshHz === 0) {
      return 1;
    }

    this.#framesPerRefresh = Math.max(
      1,
      Math.round(refreshHz / this.#options.hz),
    );

    // 0 on the frame the beam relights the phosphors, approaching 1 just before the next
    const sinceRefresh =
      (this.#frame % this.#framesPerRefresh) / this.#framesPerRefresh;
    const remaining = Math.exp(-sinceRefresh / this.#options.persistence);

    return 1 - this.#options.depth * (1 - remaining);
  }

  override apply(
    filterSystem: FilterSystem,
    input: Texture,
    output: RenderTexture,
    clearMode: boolean,
  ): void {
    this.#recordFrame();
    this.uniforms.uBrightness = this.#brightness();
    super.apply(filterSystem, input, output, clearMode);
  }
}
