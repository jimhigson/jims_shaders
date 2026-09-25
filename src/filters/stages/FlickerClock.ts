import {
  defaultFlickerOptions,
  type FlickerFilterOptions,
} from "./FlickerFilterOptions";

/** How many frame times are kept to work out what the display is actually doing */
const measuredFrames = 32;

/**
 * Works out, frame by frame, how lit the phosphors are for the flicker stage. The display's refresh
 * is not something the page can ask for, so it is measured from the time between frames, and the
 * flicker is spread over the whole number of those frames that comes closest to the rate asked for.
 */
export class FlickerClock {
  #options: Required<FlickerFilterOptions>;
  #frameTimes: number[] = [];
  #lastFrameAt = 0;
  #frame = 0;
  #framesPerRefresh = 1;

  constructor(options: FlickerFilterOptions) {
    this.#options = { ...defaultFlickerOptions, ...options };
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

  /** Records that a frame is being drawn, and returns how lit the phosphors are for it */
  nextFrameBrightness(): number {
    this.#recordFrame();
    return this.#brightness();
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
}
