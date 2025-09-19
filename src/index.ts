// CRT Filter library for Pixi.js v8
// Export all filters and their types

// Filters
export { BloomFilter } from "./filters/BloomFilter";
export type { BloomFilterUniforms } from "./filters/BloomFilter";

export { ColorAdjustmentFilter } from "./filters/ColorAdjustmentFilter";
export type { ColorAdjustmentFilterUniforms } from "./filters/ColorAdjustmentFilter";

export { CurvatureFilter } from "./filters/CurvatureFilter";
export type { CurvatureFilterOptions } from "./filters/CurvatureFilter";

export { PhosphorMaskFilter } from "./filters/PhosphorMaskFilter";
export type { PhosphorMaskFilterOptions } from "./filters/PhosphorMaskFilter";

export { RoundedCornersFilter } from "./filters/RoundedCornersFilter";
export type { RoundedCornersFilterUniforms } from "./filters/RoundedCornersFilter";

export { ScanlinesFilter } from "./filters/ScanlinesFilter";
export type { ScanlinesFilterUniforms } from "./filters/ScanlinesFilter";

export { VignetteFilter } from "./filters/VignetteFilter";
export type { VignetteFilterUniforms } from "./filters/VignetteFilter";

// Default uniforms/options
export { defaultBloomUniforms } from "./filters/BloomFilter";
export { defaultColorAdjustmentUniforms } from "./filters/ColorAdjustmentFilter";
export { defaultCurvatureOptions } from "./filters/CurvatureFilter";
export { defaultPhosphorMaskOptions } from "./filters/PhosphorMaskFilter";
export { defaultRoundedCornersUniforms } from "./filters/RoundedCornersFilter";
export { defaultScanlinesUniforms } from "./filters/ScanlinesFilter";
export { defaultVignetteUniforms } from "./filters/VignetteFilter";

// Utility functions
export { crtFilters as createCrtFilterPipeline } from "./filters/crtFilters";
export type { CrtFilterPipelineOptions } from "./filters/crtFilters";

// Fragment shader source code exports
export { default as bloomFragmentSource } from "./filters/bloom.frag?raw";
export { default as colorAdjustmentFragmentSource } from "./filters/colorAdjustment.frag?raw";
export { default as curvatureFragmentSource } from "./filters/curvature.frag?raw";
export { default as phosphorMaskFragmentSource } from "./filters/phosphorMask.frag?raw";
export { default as roundedCornersFragmentSource } from "./filters/roundedCorners.frag?raw";
export { default as scanlinesFragmentSource } from "./filters/scanlines.frag?raw";
export { default as vignetteFragmentSource } from "./filters/vignette.frag?raw";

// Utility for replacing placeholders in shader source
export { replacePlaceholders } from "./utils/replacePlaceholders";
