import type { ArgTypes } from "@storybook/react";

import type { CRTFiltersProps } from "./CRTFilters.stories";

import { defaultBloomUniforms } from "../filters/BloomFilter";
import { defaultColorAdjustmentUniforms } from "../filters/ColorAdjustmentFilter";
import { defaultCurvatureOptions } from "../filters/CurvatureFilter";
import { defaultNoiseUniforms } from "../filters/NoiseFilter";
import { defaultPhosphorMaskOptions } from "../filters/PhosphorMaskFilter";
import { defaultRaiseBlackPointUniforms } from "../filters/RaiseBlackPointFilter";
import { defaultRoundedCornersUniforms } from "../filters/RoundedCornersFilter";
import { defaultScanlinesUniforms } from "../filters/ScanlinesFilter";
import { defaultVignetteUniforms } from "../filters/VignetteFilter";
import filterDocs from "./filterDocs.json";

export const noiseArgTypes = {
  noise: {
    control: "boolean",
    description: filterDocs.NoiseFilter.description,
    table: {
      category: "Noise",
    },
  },
  noiseIntensity: {
    control: { type: "range", min: 0, max: 0.5, step: 0.01 },
    description: "Noise intensity",
    if: { arg: "noise", truthy: true },
    table: {
      category: "Noise",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultNoiseUniforms.intensity}` },
    },
  },
  noiseScale: {
    control: { type: "range", min: 1, max: 10, step: 1 },
    description: "Noise scale - larger values create bigger noise pixels",
    if: { arg: "noise", truthy: true },
    table: {
      category: "Noise",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultNoiseUniforms.scale}` },
    },
  },
  noiseFPS: {
    control: { type: "range", min: 12, max: 120, step: 1 },
    description:
      "Noise FPS - frequency at which the noise updates per second. Set to 30 to emulate NTSC, or 25 for PAL.",
    if: { arg: "noise", truthy: true },
    table: {
      category: "Noise",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultNoiseUniforms.fps}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const scanlinesArgTypes = {
  scanlines: {
    control: "boolean",
    description: filterDocs.ScanlinesFilter.description,
    table: {
      category: "Scanlines",
    },
  },
  pixelHeight: {
    control: { type: "range", min: 2, max: 8, step: 0.1 },
    description:
      filterDocs.ScanlinesFilterOptions.properties.pixelHeight.description,
    if: { arg: "scanlines", truthy: true },
    table: {
      category: "Scanlines",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultScanlinesUniforms.pixelHeight}` },
    },
  },
  gapBrightness: {
    control: { type: "range", min: 0, max: 1, step: 0.1 },
    description:
      filterDocs.ScanlinesFilterOptions.properties.gapBrightness.description,
    if: { arg: "scanlines", truthy: true },
    table: {
      category: "Scanlines",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultScanlinesUniforms.gapBrightness}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const phosphorMaskArgTypes = {
  phosphorMask: {
    control: "boolean",
    description: filterDocs.PhosphorMaskFilter.description,
    table: {
      category: "Phosphor Mask",
    },
  },
  pixelWidth: {
    control: { type: "range", min: 3, max: 12, step: 0.05 },
    description:
      filterDocs.PhosphorMaskFilterOptions.properties.pixelWidth.description,
    if: { arg: "phosphorMask", truthy: true },
    table: {
      category: "Phosphor Mask",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultPhosphorMaskOptions.pixelWidth}` },
    },
  },
  maskBrightness: {
    control: { type: "range", min: 0, max: 1, step: 0.1 },
    description:
      filterDocs.PhosphorMaskFilterOptions.properties.maskBrightness
        .description,
    if: { arg: "phosphorMask", truthy: true },
    table: {
      category: "Phosphor Mask",
      subcategory: "Settings",
      defaultValue: {
        summary: `${defaultPhosphorMaskOptions.maskBrightness}`,
      },
    },
  },
  phosphorMaskNumSamples: {
    control: { type: "range", min: 1, max: 16, step: 1 },
    description:
      filterDocs.PhosphorMaskFilterOptions.properties.numSamples.description,
    if: { arg: "phosphorMask", truthy: true },
    table: {
      category: "Phosphor Mask",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultPhosphorMaskOptions.numSamples}` },
    },
  },
  transitionWidth: {
    control: { type: "range", min: 0, max: 1, step: 0.05 },
    description:
      filterDocs.PhosphorMaskFilterOptions.properties.transitionWidth
        .description,
    if: { arg: "phosphorMask", truthy: true },
    table: {
      category: "Phosphor Mask",
      subcategory: "Settings",
      defaultValue: {
        summary: `${defaultPhosphorMaskOptions.transitionWidth}`,
      },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const bloomArgTypes = {
  bloom: {
    control: "boolean",
    description: filterDocs.BloomFilter.description,
    table: {
      category: "Bloom Filter",
    },
  },
  bloomIntensity: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    description: filterDocs.BloomFilterOptions.properties.intensity.description,
    if: { arg: "bloom", truthy: true },
    table: {
      category: "Bloom Filter",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultBloomUniforms.intensity}` },
    },
  },
  radius: {
    control: { type: "range", min: 1, max: 5, step: 0.1 },
    description: filterDocs.BloomFilterOptions.properties.radius.description,
    if: { arg: "bloom", truthy: true },
    table: {
      category: "Bloom Filter",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultBloomUniforms.radius}` },
    },
  },
  cutoff: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    description: filterDocs.BloomFilterOptions.properties.cutoff.description,
    if: { arg: "bloom", truthy: true },
    table: {
      category: "Bloom Filter",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultBloomUniforms.cutoff}` },
    },
  },
  edgeBlur: {
    control: { type: "range", min: 0, max: 1, step: 0.1 },
    description: filterDocs.BloomFilterOptions.properties.edgeBlur.description,
    if: { arg: "bloom", truthy: true },
    table: {
      category: "Bloom Filter",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultBloomUniforms.edgeBlur}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const vignetteArgTypes = {
  vignette: {
    control: "boolean",
    description: filterDocs.VignetteFilter.description,
    table: {
      category: "Vignette",
    },
  },
  vignetteIntensity: {
    control: { type: "range", min: 0, max: 1, step: 0.1 },
    description:
      filterDocs.VignetteFilterOptions.properties.intensity.description,
    if: { arg: "vignette", truthy: true },
    table: {
      category: "Vignette",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultVignetteUniforms.intensity}` },
    },
  },
  vignetteRadius: {
    control: { type: "range", min: 0, max: 2, step: 0.1 },
    description: filterDocs.VignetteFilterOptions.properties.radius.description,
    if: { arg: "vignette", truthy: true },
    table: {
      category: "Vignette",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultVignetteUniforms.radius}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const raiseBlackPointArgTypes = {
  raiseBlackPoint: {
    control: "boolean",
    description: filterDocs.RaiseBlackPointFilter.description,
    table: {
      category: "Raise Black Point",
    },
  },
  blackPoint: {
    control: { type: "range", min: 0, max: 0.1, step: 0.005 },
    description:
      filterDocs.RaiseBlackPointFilterOptions.properties.blackPoint.description,
    if: { arg: "raiseBlackPoint", truthy: true },
    table: {
      category: "Raise Black Point",
      subcategory: "Settings",
      defaultValue: {
        summary: `${defaultRaiseBlackPointUniforms.blackPoint}`,
      },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const roundedCornersArgTypes = {
  roundedCorners: {
    control: "boolean",
    description: filterDocs.RoundedCornersFilter.description,
    table: {
      category: "Screen Shape",
    },
  },
  cornerRadius: {
    control: { type: "range", min: 0, max: 0.2, step: 0.01 },
    if: { arg: "roundedCorners", truthy: true },
    description:
      filterDocs.RoundedCornersFilterOptions.properties.cornerRadius
        .description,
    table: {
      category: "Screen Shape",
      subcategory: "Settings",
      defaultValue: {
        summary: `${defaultRoundedCornersUniforms.cornerRadius}`,
      },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const curvatureArgTypes = {
  curvature: {
    control: "boolean",
    description: filterDocs.CurvatureFilter.description,
    table: {
      category: "Screen Curvature",
    },
  },
  curvatureX: {
    control: { type: "range", min: 0, max: 0.6, step: 0.01 },
    description:
      filterDocs.CurvatureFilterOptions.properties.curvatureX.description,
    if: { arg: "curvature", truthy: true },
    table: {
      category: "Screen Curvature",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultCurvatureOptions.curvatureX}` },
    },
  },
  curvatureY: {
    control: { type: "range", min: 0, max: 0.6, step: 0.01 },
    description:
      filterDocs.CurvatureFilterOptions.properties.curvatureY.description,
    if: { arg: "curvature", truthy: true },
    table: {
      category: "Screen Curvature",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultCurvatureOptions.curvatureY}` },
    },
  },
  multisampling: {
    control: "boolean",
    description:
      filterDocs.CurvatureFilterOptions.properties.multisampling.description,
    if: { arg: "curvature", truthy: true },
    table: {
      category: "Screen Curvature",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultCurvatureOptions.multisampling}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const colorAdjustmentArgTypes = {
  colorAdjustment: {
    control: "boolean",
    description: filterDocs.ColorAdjustmentFilter.description,
    table: {
      category: "Color Adjustment",
    },
  },
  gamma: {
    control: { type: "range", min: 0.5, max: 2, step: 0.1 },
    description:
      filterDocs.ColorAdjustmentFilterOptions.properties.gamma.description,
    if: { arg: "colorAdjustment", truthy: true },
    table: {
      category: "Color Adjustment",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultColorAdjustmentUniforms.gamma}` },
    },
  },
  saturation: {
    control: { type: "range", min: 0, max: 2, step: 0.1 },
    description:
      filterDocs.ColorAdjustmentFilterOptions.properties.saturation.description,
    if: { arg: "colorAdjustment", truthy: true },
    table: {
      category: "Color Adjustment",
      subcategory: "Settings",
      defaultValue: {
        summary: `${defaultColorAdjustmentUniforms.saturation}`,
      },
    },
  },
  brightness: {
    control: { type: "range", min: 0, max: 2, step: 0.1 },
    description:
      filterDocs.ColorAdjustmentFilterOptions.properties.brightness.description,
    if: { arg: "colorAdjustment", truthy: true },
    table: {
      category: "Color Adjustment",
      subcategory: "Settings",
      defaultValue: {
        summary: `${defaultColorAdjustmentUniforms.brightness}`,
      },
    },
  },
  brightnessBottom: {
    control: { type: "range", min: -1, max: 1, step: 0.05 },
    description:
      filterDocs.ColorAdjustmentFilterOptions.properties.brightnessBottom
        .description,
    if: { arg: "colorAdjustment", truthy: true },
    table: {
      category: "Color Adjustment",
      subcategory: "Settings",
      defaultValue: {
        summary: `${defaultColorAdjustmentUniforms.brightnessBottom}`,
      },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;
