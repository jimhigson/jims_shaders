import type { Filter } from "pixi.js";

import type { BloomFilterOptions } from "./BloomFilter";
import type { ColorAdjustmentFilterOptions } from "./ColorAdjustmentFilter";
import type { CurvatureFilterOptions } from "./CurvatureFilter";
import type { NoiseFilterOptions } from "./NoiseFilter";
import type { PhosphorMaskFilterOptions } from "./PhosphorMaskFilter";
import type { RaiseBlackPointFilterOptions } from "./RaiseBlackPointFilter";
import type { RoundedCornersFilterOptions } from "./RoundedCornersFilter";
import type { ScanlinesFilterOptions } from "./ScanlinesFilter";
import type { VignetteFilterOptions } from "./VignetteFilter";

import { BloomFilter } from "./BloomFilter";
import { ColorAdjustmentFilter } from "./ColorAdjustmentFilter";
import { CurvatureFilter } from "./CurvatureFilter";
import { NoiseFilter } from "./NoiseFilter";
import { PhosphorMaskFilter } from "./PhosphorMaskFilter";
import { RaiseBlackPointFilter } from "./RaiseBlackPointFilter";
import { RoundedCornersFilter } from "./RoundedCornersFilter";
import { ScanlinesFilter } from "./ScanlinesFilter";
import { VignetteFilter } from "./VignetteFilter";

export interface CrtFilterPipelineOptions {
  noise?: false | NoiseFilterOptions | undefined;
  /** Rounded corners filter options, undefined to use defaults, false to disable */
  roundedCorners?: false | RoundedCornersFilterOptions | undefined;
  /** Scanlines filter options, undefined to use defaults, false to disable */
  scanlines?: false | ScanlinesFilterOptions | undefined;
  /** Phosphor mask filter options, undefined to use defaults, false to disable */
  phosphorMask?: false | PhosphorMaskFilterOptions | undefined;
  /** Bloom filter options, undefined to use defaults, false to disable */
  bloom?: BloomFilterOptions | false | undefined;
  /** Curvature filter options, undefined to use defaults, false to disable */
  curvature?: CurvatureFilterOptions | false | undefined;
  /** Vignette filter options, undefined to use defaults, false to disable */
  vignette?: false | undefined | VignetteFilterOptions;
  /** Raise black point filter options, undefined to use defaults, false to disable */
  raiseBlackPoint?: false | RaiseBlackPointFilterOptions | undefined;
  /** Color adjustment filter options, undefined to use defaults, false to disable */
  colorAdjustment?: ColorAdjustmentFilterOptions | false | undefined;
}

export const crtFilters = ({
  noise,
  roundedCorners,
  scanlines,
  phosphorMask,
  bloom,
  curvature,
  vignette,
  raiseBlackPoint,
  colorAdjustment,
}: CrtFilterPipelineOptions): Filter[] => {
  const filters = [];

  if (noise !== false) {
    filters.push(new NoiseFilter(noise));
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

  // Rounded corners first to clip the input - must be after raising the black point
  // or the drawn-on corners will be dark grey, not black
  if (roundedCorners !== false) {
    filters.push(new RoundedCornersFilter(roundedCorners));
  }

  // Then curvature (curves everything including scanlines)
  if (curvature !== false) {
    filters.push(new CurvatureFilter(curvature));
  }

  // Color adjustment at the end
  if (colorAdjustment !== false) {
    filters.push(new ColorAdjustmentFilter(colorAdjustment));
  }

  return filters;
};
