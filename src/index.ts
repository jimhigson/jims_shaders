// CRT Filter library for Pixi.js v8
// Export all filters and their types

// The four phases of the CRT effect, each one pass carrying out several stages
export { SignalFilter } from "./filters/SignalFilter";
export type { SignalFilterOptions } from "./filters/SignalFilter";

export { RasterFilter } from "./filters/RasterFilter";
export type { RasterFilterOptions } from "./filters/RasterFilter";

export { GlowFilter } from "./filters/GlowFilter";
export type { GlowFilterOptions } from "./filters/GlowFilter";

export { TubeFilter } from "./filters/TubeFilter";
export type { TubeFilterOptions } from "./filters/TubeFilter";

export { CrtPhaseFilter } from "./filters/CrtPhaseFilter";
export type { CrtPhaseFilterOptions } from "./filters/CrtPhaseFilter";

// Each stage's options
export type { BloomFilterOptions } from "./filters/stages/BloomFilterOptions";
export type { ColorAdjustmentFilterOptions } from "./filters/stages/ColorAdjustmentFilterOptions";
export type { FlickerFilterOptions } from "./filters/stages/FlickerFilterOptions";
export type { NoiseFilterOptions } from "./filters/stages/NoiseFilterOptions";
export type { PhosphorMaskFilterOptions } from "./filters/stages/PhosphorMaskFilterOptions";
export type { RaiseBlackPointFilterOptions } from "./filters/stages/RaiseBlackPointFilterOptions";
export type { RoundedCornersFilterOptions } from "./filters/stages/RoundedCornersFilterOptions";
export type { ScanlinesFilterOptions } from "./filters/stages/ScanlinesFilterOptions";
export type {
  PixelAspect,
  PixelAspectRatioName,
  ScreenGeometryFilterOptions,
} from "./filters/stages/ScreenGeometryFilterOptions";
export type { SharpenFilterOptions } from "./filters/stages/SharpenFilterOptions";
export type { SwitchOnFilterOptions } from "./filters/stages/SwitchOnFilterOptions";
export type { VignetteFilterOptions } from "./filters/stages/VignetteFilterOptions";

export { pixelAspectRatios } from "./filters/stages/ScreenGeometryFilterOptions";

// Timing for the stages that change from frame to frame
export { FlickerClock } from "./filters/stages/FlickerClock";
export { SwitchOnClock } from "./filters/stages/SwitchOnClock";

// Default uniforms/options
export { defaultBloomUniforms } from "./filters/stages/BloomFilterOptions";
export { defaultColorAdjustmentUniforms } from "./filters/stages/ColorAdjustmentFilterOptions";
export { defaultFlickerOptions } from "./filters/stages/FlickerFilterOptions";
export { defaultNoiseUniforms } from "./filters/stages/NoiseFilterOptions";
export { defaultPhosphorMaskOptions } from "./filters/stages/PhosphorMaskFilterOptions";
export { defaultRoundedCornersUniforms } from "./filters/stages/RoundedCornersFilterOptions";
export { defaultScanlinesUniforms } from "./filters/stages/ScanlinesFilterOptions";
export { defaultScreenGeometryOptions } from "./filters/stages/ScreenGeometryFilterOptions";
export { defaultSharpenUniforms } from "./filters/stages/SharpenFilterOptions";
export { defaultSwitchOnOptions } from "./filters/stages/SwitchOnFilterOptions";
export { defaultVignetteUniforms } from "./filters/stages/VignetteFilterOptions";
export { defaultRaiseBlackPointUniforms } from "./filters/stages/RaiseBlackPointFilterOptions";

// Utility functions
export { crtFilters as createCrtFilterPipeline } from "./filters/crtFilters";
export type { CrtFilterPipelineOptions } from "./filters/crtFilters";

// Fragment shader source code exports, with {{PLACEHOLDERS}} for each phase's defines
export { default as signalFragmentSource } from "./filters/signal.frag";
export { default as rasterFragmentSource } from "./filters/raster.frag";
export { default as glowFragmentSource } from "./filters/glow.frag";
export { default as tubeFragmentSource } from "./filters/tube.frag";

// Utility for replacing placeholders in shader source
export { replacePlaceholders } from "./utils/replacePlaceholders";
