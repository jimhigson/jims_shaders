import type { Filter } from "pixi.js";

import type { BloomFilterOptions } from "./stages/BloomFilterOptions";
import type { ColorAdjustmentFilterOptions } from "./stages/ColorAdjustmentFilterOptions";
import type { FlickerFilterOptions } from "./stages/FlickerFilterOptions";
import type { NoiseFilterOptions } from "./stages/NoiseFilterOptions";
import type { PhosphorMaskFilterOptions } from "./stages/PhosphorMaskFilterOptions";
import type { RaiseBlackPointFilterOptions } from "./stages/RaiseBlackPointFilterOptions";
import type { RoundedCornersFilterOptions } from "./stages/RoundedCornersFilterOptions";
import type { ScanlinesFilterOptions } from "./stages/ScanlinesFilterOptions";
import type { ScreenGeometryFilterOptions } from "./stages/ScreenGeometryFilterOptions";
import type { SharpenFilterOptions } from "./stages/SharpenFilterOptions";
import type { SwitchOnFilterOptions } from "./stages/SwitchOnFilterOptions";
import type { VignetteFilterOptions } from "./stages/VignetteFilterOptions";

import { GlowFilter } from "./GlowFilter";
import { RasterFilter } from "./RasterFilter";
import { SignalFilter } from "./SignalFilter";
import { TubeFilter } from "./TubeFilter";

export interface CrtFilterPipelineOptions {
  /** Colour adjustment at the start of the signal, undefined or false to leave out */
  signalColorAdjustment?: ColorAdjustmentFilterOptions | false | undefined;
  /** Noise stage options, undefined to use defaults, false to disable */
  noise?: false | NoiseFilterOptions | undefined;
  /** Sharpen stage options, undefined to use defaults, false to disable */
  sharpen?: false | SharpenFilterOptions | undefined;
  /** Rounded corners stage options, undefined to use defaults, false to disable */
  roundedCorners?: false | RoundedCornersFilterOptions | undefined;
  /** Scanlines stage options, undefined to use defaults, false to disable */
  scanlines?: false | ScanlinesFilterOptions | undefined;
  /** Phosphor mask stage options, undefined to use defaults, false to disable */
  phosphorMask?: false | PhosphorMaskFilterOptions | undefined;
  /** Flicker stage options, undefined to use defaults, false to disable */
  flicker?: false | FlickerFilterOptions | undefined;
  /** Bloom stage options, undefined to use defaults, false to disable */
  bloom?: BloomFilterOptions | false | undefined;
  /** Screen geometry stage options, undefined to use defaults, false to disable */
  screenGeometry?: false | ScreenGeometryFilterOptions | undefined;
  /** Vignette stage options, undefined to use defaults, false to disable */
  vignette?: false | undefined | VignetteFilterOptions;
  /** Raise black point stage options, undefined to use defaults, false to disable */
  raiseBlackPoint?: false | RaiseBlackPointFilterOptions | undefined;
  /** Switch on stage options, undefined to use defaults, false to disable */
  switchOn?: false | SwitchOnFilterOptions | undefined;
  /** Colour adjustment at the end of the tube, undefined to use defaults, false to disable */
  colorAdjustment?: ColorAdjustmentFilterOptions | false | undefined;
}

/** a stage's options as the phases take them: undefined here means the stage's defaults */
const withDefaults = <Options extends object>(
  options: false | Options | undefined,
): false | Options => options ?? ({} as Options);

export const crtFilters = ({
  signalColorAdjustment,
  noise,
  sharpen,
  roundedCorners,
  scanlines,
  phosphorMask,
  flicker,
  bloom,
  screenGeometry,
  vignette,
  raiseBlackPoint,
  switchOn,
  colorAdjustment,
}: CrtFilterPipelineOptions): Filter[] => {
  const filters: Filter[] = [];

  // The signal first: its levels, the noise it picks up, and the peaking of the set's luminance
  // amplifier all happen before anything that models the beam and the phosphors
  const signal = {
    colorAdjustment: signalColorAdjustment ?? false,
    noise: withDefaults(noise),
    sharpen: withDefaults(sharpen),
  };
  if (Object.values(signal).some(Boolean)) {
    filters.push(new SignalFilter(signal));
  }

  // Then the beam laying the picture onto the phosphors, on the flat image
  const raster = {
    scanlines: withDefaults(scanlines),
    phosphorMask: withDefaults(phosphorMask),
    flicker: withDefaults(flicker),
  };
  if (Object.values(raster).some(Boolean)) {
    filters.push(new RasterFilter(raster));
  }

  // The light of the phosphors - the black point is raised before the picture is curved, or the
  // area outside the curved screen is lifted too
  const glow = {
    bloom: withDefaults(bloom),
    vignette: withDefaults(vignette),
    raiseBlackPoint: withDefaults(raiseBlackPoint),
  };
  if (Object.values(glow).some(Boolean)) {
    filters.push(new GlowFilter(glow));
  }

  // The tube: switch-on within the screen's shape, then the corners, then all of the geometry at
  // once - which curves everything including the scanlines - and the colour adjustment at the end
  const tube = {
    switchOn: withDefaults(switchOn),
    roundedCorners: withDefaults(roundedCorners),
    screenGeometry: withDefaults(screenGeometry),
    colorAdjustment: withDefaults(colorAdjustment),
  };
  if (Object.values(tube).some(Boolean)) {
    filters.push(new TubeFilter(tube));
  }

  return filters;
};
