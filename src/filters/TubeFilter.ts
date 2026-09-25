import type {
  FilterSystem,
  RenderTexture,
  Texture,
  UniformData,
} from "pixi.js";

import { CrtPhaseFilter } from "./CrtPhaseFilter";
import {
  type ColorAdjustmentFilterOptions,
  colorAdjustmentUniforms,
} from "./stages/ColorAdjustmentFilterOptions";
import {
  type RoundedCornersFilterOptions,
  roundedCornersUniforms,
} from "./stages/RoundedCornersFilterOptions";
import {
  defaultScreenGeometryOptions,
  type ScreenGeometryFilterOptions,
  screenGeometryUniforms,
} from "./stages/ScreenGeometryFilterOptions";
import { SwitchOnClock } from "./stages/SwitchOnClock";
import {
  type SwitchOnFilterOptions,
  switchOnUniforms,
} from "./stages/SwitchOnFilterOptions";
import fragment from "./tube.frag";

/** Each stage's options, or false (or left out) to leave that stage out */
export type TubeFilterOptions = {
  switchOn?: false | SwitchOnFilterOptions;
  /**
   * the switch-on's timing, to carry on a switch-on that is already playing - eg in a tube filter
   * made to replace one that was playing it. A fresh switch-on starts if this is left out
   */
  switchOnClock?: SwitchOnClock;
  roundedCorners?: false | RoundedCornersFilterOptions;
  screenGeometry?: false | ScreenGeometryFilterOptions;
  /** final levels and colour of the picture as it leaves the glass */
  colorAdjustment?: ColorAdjustmentFilterOptions | false;
};

/**
 * The tube itself: coming up to temperature when switched on, the shape of its face, the geometry
 * of the beam and the curve of the glass, and the calibration of the finished picture.
 */
export class TubeFilter extends CrtPhaseFilter {
  /** the switch-on's timing, undefined when the switch-on is left out */
  readonly switchOnClock: SwitchOnClock | undefined;

  constructor({
    switchOn,
    switchOnClock,
    roundedCorners,
    screenGeometry,
    colorAdjustment,
  }: TubeFilterOptions = {}) {
    const uniforms: Record<string, UniformData> = {
      ...(switchOn ? switchOnUniforms(switchOn) : {}),
      ...(roundedCorners ? roundedCornersUniforms(roundedCorners) : {}),
      ...(screenGeometry ? screenGeometryUniforms(screenGeometry) : {}),
      ...(colorAdjustment ? colorAdjustmentUniforms(colorAdjustment) : {}),
    };

    const { multisampling, loadTaps } = {
      ...defaultScreenGeometryOptions,
      ...(screenGeometry || {}),
    };

    super({
      name: "tube-filter",
      fragment,
      defines: {
        SWITCH_ON: Boolean(switchOn),
        ROUNDED_CORNERS: Boolean(roundedCorners),
        SCREEN_GEOMETRY: Boolean(screenGeometry),
        COLOR_ADJUSTMENT: Boolean(colorAdjustment),
        SCREEN_GEOMETRY_MULTISAMPLE: multisampling,
        SCREEN_GEOMETRY_LOAD_TAPS: loadTaps,
      },
      uniforms,
    });

    this.switchOnClock =
      switchOn ? (switchOnClock ?? new SwitchOnClock(switchOn)) : undefined;
  }

  override apply(
    filterSystem: FilterSystem,
    input: Texture,
    output: RenderTexture,
    clearMode: boolean,
  ): void {
    if (this.switchOnClock !== undefined) {
      this.uniforms.uSwitchOnElapsed = this.switchOnClock.elapsed;
    }
    super.apply(filterSystem, input, output, clearMode);
  }
}
