// CRT Filter library for Pixi.js v8
// Export all filters and their types

// Filters
export { BloomFilter } from "./filters/BloomFilter";
export type { BloomFilterOptions } from "./filters/BloomFilter";

export { ColorAdjustmentFilter } from "./filters/ColorAdjustmentFilter";
export type { ColorAdjustmentFilterOptions } from "./filters/ColorAdjustmentFilter";

export { CurvatureFilter } from "./filters/CurvatureFilter";
export type { CurvatureFilterOptions } from "./filters/CurvatureFilter";

export { NoiseFilter } from "./filters/NoiseFilter";
export type { NoiseFilterOptions } from "./filters/NoiseFilter";

export { PhosphorMaskFilter } from "./filters/PhosphorMaskFilter";
export type { PhosphorMaskFilterOptions } from "./filters/PhosphorMaskFilter";

export { RoundedCornersFilter } from "./filters/RoundedCornersFilter";
export type { RoundedCornersFilterOptions } from "./filters/RoundedCornersFilter";

export { ScanlinesFilter } from "./filters/ScanlinesFilter";
export type { ScanlinesFilterOptions } from "./filters/ScanlinesFilter";

export { VignetteFilter } from "./filters/VignetteFilter";
export type { VignetteFilterOptions } from "./filters/VignetteFilter";

export { RaiseBlackPointFilter } from "./filters/RaiseBlackPointFilter";
export type { RaiseBlackPointFilterOptions } from "./filters/RaiseBlackPointFilter";

// Default uniforms/options
export { defaultBloomUniforms } from "./filters/BloomFilter";
export { defaultColorAdjustmentUniforms } from "./filters/ColorAdjustmentFilter";
export { defaultCurvatureOptions } from "./filters/CurvatureFilter";
export { defaultNoiseUniforms } from "./filters/NoiseFilter";
export { defaultPhosphorMaskOptions } from "./filters/PhosphorMaskFilter";
export { defaultRoundedCornersUniforms } from "./filters/RoundedCornersFilter";
export { defaultScanlinesUniforms } from "./filters/ScanlinesFilter";
export { defaultVignetteUniforms } from "./filters/VignetteFilter";
export { defaultRaiseBlackPointUniforms } from "./filters/RaiseBlackPointFilter";

// Utility functions
export { crtFilters as createCrtFilterPipeline } from "./filters/crtFilters";
export type { CrtFilterPipelineOptions } from "./filters/crtFilters";

// Fragment shader source code exports
export { default as bloomFragmentSource } from "./filters/bloom.frag?raw";
export { default as colorAdjustmentFragmentSource } from "./filters/colorAdjustment.frag?raw";
export { default as curvatureFragmentSource } from "./filters/curvature.frag?raw";
export { default as noiseFragmentSource } from "./filters/noise.frag?raw";
export { default as phosphorMaskFragmentSource } from "./filters/phosphorMask.frag?raw";
export { default as roundedCornersFragmentSource } from "./filters/roundedCorners.frag?raw";
export { default as scanlinesFragmentSource } from "./filters/scanlines.frag?raw";
export { default as vignetteFragmentSource } from "./filters/vignette.frag?raw";
export { default as raiseBlackPointFragmentSource } from "./filters/raiseBlackPoint.frag?raw";

// Utility for replacing placeholders in shader source
export { replacePlaceholders } from "./utils/replacePlaceholders";
