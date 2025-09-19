import type { Filter } from "pixi.js";

import type { BloomFilterUniforms } from "./BloomFilter";
import type { ColorAdjustmentFilterUniforms } from "./ColorAdjustmentFilter";
import type { CurvatureFilterOptions } from "./CurvatureFilter";
import type { PhosphorMaskFilterOptions } from "./PhosphorMaskFilter";
import type { RoundedCornersFilterUniforms } from "./RoundedCornersFilter";
import type { ScanlinesFilterUniforms } from "./ScanlinesFilter";
import type { VignetteFilterUniforms } from "./VignetteFilter";

import { BloomFilter } from "./BloomFilter";
import { ColorAdjustmentFilter } from "./ColorAdjustmentFilter";
import { CurvatureFilter } from "./CurvatureFilter";
import { PhosphorMaskFilter } from "./PhosphorMaskFilter";
import { RoundedCornersFilter } from "./RoundedCornersFilter";
import { ScanlinesFilter } from "./ScanlinesFilter";
import { VignetteFilter } from "./VignetteFilter";

export interface CrtFilterPipelineOptions {
  /** Rounded corners filter options, undefined to use defaults, false to disable */
  roundedCorners?: false | Partial<RoundedCornersFilterUniforms> | undefined;
  /** Scanlines filter options, undefined to use defaults, false to disable */
  scanlines?: false | Partial<ScanlinesFilterUniforms> | undefined;
  /** Phosphor mask filter options, undefined to use defaults, false to disable */
  phosphorMask?: false | Partial<PhosphorMaskFilterOptions> | undefined;
  /** Bloom filter options, undefined to use defaults, false to disable */
  bloom?: false | Partial<BloomFilterUniforms> | undefined;
  /** Curvature filter options, undefined to use defaults, false to disable */
  curvature?: false | Partial<CurvatureFilterOptions> | undefined;
  /** Vignette filter options, undefined to use defaults, false to disable */
  vignette?: false | Partial<VignetteFilterUniforms> | undefined;
  /** Color adjustment filter options, undefined to use defaults, false to disable */
  colorAdjustment?: false | Partial<ColorAdjustmentFilterUniforms> | undefined;
}

export const crtFilters = ({
  roundedCorners,
  scanlines,
  phosphorMask,
  bloom,
  curvature,
  vignette,
  colorAdjustment,
}: CrtFilterPipelineOptions): Filter[] => {
  const filters = [];

  // Rounded corners first to clip the input
  if (roundedCorners !== false) {
    filters.push(new RoundedCornersFilter(roundedCorners));
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

  // Then curvature (curves everything including scanlines)
  if (curvature !== false) {
    filters.push(new CurvatureFilter(curvature));
  }

  // Vignette
  if (vignette !== false) {
    filters.push(new VignetteFilter(vignette));
  }

  // Color adjustment at the end
  if (colorAdjustment !== false) {
    filters.push(new ColorAdjustmentFilter(colorAdjustment));
  }

  return filters;
};
