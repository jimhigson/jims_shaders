import type { Filter } from "pixi.js";

import type { BloomFilterOptions } from "./BloomFilter";
import type { ColorAdjustmentFilterOptions } from "./ColorAdjustmentFilter";
import type { NoiseFilterOptions } from "./NoiseFilter";
import type { PhosphorMaskFilterOptions } from "./PhosphorMaskFilter";
import type { RaiseBlackPointFilterOptions } from "./RaiseBlackPointFilter";
import type { RoundedCornersFilterOptions } from "./RoundedCornersFilter";
import type { ScanlinesFilterOptions } from "./ScanlinesFilter";
import type { ScreenGeometryFilterOptions } from "./ScreenGeometryFilter";
import type { SharpenFilterOptions } from "./SharpenFilter";
import type { SwitchOnFilterOptions } from "./SwitchOnFilter";
import type { VignetteFilterOptions } from "./VignetteFilter";

import { BloomFilter } from "./BloomFilter";
import { ColorAdjustmentFilter } from "./ColorAdjustmentFilter";
import { NoiseFilter } from "./NoiseFilter";
import { PhosphorMaskFilter } from "./PhosphorMaskFilter";
import { RaiseBlackPointFilter } from "./RaiseBlackPointFilter";
import { RoundedCornersFilter } from "./RoundedCornersFilter";
import { ScanlinesFilter } from "./ScanlinesFilter";
import { ScreenGeometryFilter } from "./ScreenGeometryFilter";
import { SharpenFilter } from "./SharpenFilter";
import { SwitchOnFilter } from "./SwitchOnFilter";
import { VignetteFilter } from "./VignetteFilter";

export interface CrtFilterPipelineOptions {
  noise?: false | NoiseFilterOptions | undefined;
  /** Sharpen filter options, undefined to use defaults, false to disable */
  sharpen?: false | SharpenFilterOptions | undefined;
  /** Rounded corners filter options, undefined to use defaults, false to disable */
  roundedCorners?: false | RoundedCornersFilterOptions | undefined;
  /** Scanlines filter options, undefined to use defaults, false to disable */
  scanlines?: false | ScanlinesFilterOptions | undefined;
  /** Phosphor mask filter options, undefined to use defaults, false to disable */
  phosphorMask?: false | PhosphorMaskFilterOptions | undefined;
  /** Bloom filter options, undefined to use defaults, false to disable */
  bloom?: BloomFilterOptions | false | undefined;
  /** Screen geometry filter options, undefined to use defaults, false to disable */
  screenGeometry?: false | ScreenGeometryFilterOptions | undefined;
  /** Vignette filter options, undefined to use defaults, false to disable */
  vignette?: false | undefined | VignetteFilterOptions;
  /** Raise black point filter options, undefined to use defaults, false to disable */
  raiseBlackPoint?: false | RaiseBlackPointFilterOptions | undefined;
  /** Switch on filter options, undefined to use defaults, false to disable */
  switchOn?: false | SwitchOnFilterOptions | undefined;
  /** Color adjustment filter options, undefined to use defaults, false to disable */
  colorAdjustment?: ColorAdjustmentFilterOptions | false | undefined;
}

export const crtFilters = ({
  noise,
  sharpen,
  roundedCorners,
  scanlines,
  phosphorMask,
  bloom,
  screenGeometry,
  vignette,
  raiseBlackPoint,
  switchOn,
  colorAdjustment,
}: CrtFilterPipelineOptions): Filter[] => {
  const filters = [];

  if (noise !== false) {
    filters.push(new NoiseFilter(noise));
  }

  // Sharpening happens in the set's luminance amplifier, so before anything that models
  // the beam and the phosphors
  if (sharpen !== false) {
    filters.push(new SharpenFilter(sharpen));
  }

  // Scanlines and phosphor mask (applied to flat image)
  if (scanlines !== false) {
    filters.push(new ScanlinesFilter(scanlines));
  }

  if (phosphorMask !== false) {
    filters.push(new PhosphorMaskFilter(phosphorMask));
  }

  // Bloom
  if (bloom !== false) {
    filters.push(new BloomFilter(bloom));
  }

  // Vignette
  if (vignette !== false) {
    filters.push(new VignetteFilter(vignette));
  }

  // Raise black point - must come before curvature or the area outside the curved
  // screen is effected too
  if (raiseBlackPoint !== false) {
    filters.push(new RaiseBlackPointFilter(raiseBlackPoint));
  }

  // The tube coming up to temperature dims and tints everything the signal chain has
  // produced, including the glow of the black point, but happens inside the screen's
  // shape so it comes before the corners are clipped and the picture is curved
  if (switchOn !== false) {
    filters.push(new SwitchOnFilter(switchOn));
  }

  // Rounded corners first to clip the input - must be after raising the black point
  // or the drawn-on corners will be dark grey, not black
  if (roundedCorners !== false) {
    filters.push(new RoundedCornersFilter(roundedCorners));
  }

  // Then all of the geometry at once - overscan, the sag of the high voltage, and the curve of
  // the glass - which curves everything including the scanlines
  if (screenGeometry !== false) {
    filters.push(new ScreenGeometryFilter(screenGeometry));
  }

  // Color adjustment at the end
  if (colorAdjustment !== false) {
    filters.push(new ColorAdjustmentFilter(colorAdjustment));
  }

  return filters;
};
