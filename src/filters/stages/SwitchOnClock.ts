import {
  defaultSwitchOnOptions,
  type SwitchOnFilterOptions,
} from "./SwitchOnFilterOptions";

/**
 * How far through the switch-on the picture is. Starts from the moment it is made and advances on
 * its own, so nothing has to drive it - but it can be held at a point instead, which is how a
 * consumer scrubs through the animation or drives it from a clock of its own.
 */
export class SwitchOnClock {
  #startTime = performance.now();
  #heldAt = 0;
  #autoAdvancing = true;
  #totalDuration: number;

  constructor(options: SwitchOnFilterOptions) {
    const { warmUpDelay, riseDuration, decayDuration } = {
      ...defaultSwitchOnOptions,
      ...options,
    };
    this.#totalDuration = warmUpDelay + riseDuration + decayDuration;
  }

  /** How far through the switch-on the picture currently is, in milliseconds */
  get elapsed(): number {
    return this.#autoAdvancing ?
        performance.now() - this.#startTime
      : this.#heldAt;
  }

  /** Holds the picture at this many milliseconds through the switch-on */
  set elapsed(ms: number) {
    this.#heldAt = ms;
    this.#autoAdvancing = false;
  }

  /**
   * Whether the picture has finished coming up, after which the switch-on does nothing to it and
   * can be left out
   */
  get finished(): boolean {
    return this.elapsed >= this.#totalDuration;
  }

  /** Plays the switch-on again from the beginning, advancing on its own again if it had been held */
  restart(): void {
    this.#startTime = performance.now();
    this.#autoAdvancing = true;
  }
}
