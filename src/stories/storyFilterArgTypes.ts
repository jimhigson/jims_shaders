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
import { defaultSharpenUniforms } from "../filters/SharpenFilter";
import { defaultSwitchOnOptions } from "../filters/SwitchOnFilter";
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

export const sharpenArgTypes = {
  sharpen: {
    control: "boolean",
    description: filterDocs.SharpenFilter.description,
    table: {
      category: "Sharpen",
    },
  },
  sharpenAmount: {
    control: { type: "range", min: 0, max: 2, step: 0.05 },
    description: filterDocs.SharpenFilterOptions.properties.amount.description,
    if: { arg: "sharpen", truthy: true },
    table: {
      category: "Sharpen",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultSharpenUniforms.amount}` },
    },
  },
  sharpenRadius: {
    control: { type: "range", min: 0.5, max: 8, step: 0.1 },
    description: filterDocs.SharpenFilterOptions.properties.radius.description,
    if: { arg: "sharpen", truthy: true },
    table: {
      category: "Sharpen",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultSharpenUniforms.radius}` },
    },
  },
  sharpenSignalBlur: {
    control: { type: "range", min: 0, max: 1, step: 0.05 },
    description:
      filterDocs.SharpenFilterOptions.properties.signalBlur.description,
    if: { arg: "sharpen", truthy: true },
    table: {
      category: "Sharpen",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultSharpenUniforms.signalBlur}` },
    },
  },
  sharpenAsymmetry: {
    control: { type: "range", min: 0, max: 1, step: 0.05 },
    description:
      filterDocs.SharpenFilterOptions.properties.asymmetry.description,
    if: { arg: "sharpen", truthy: true },
    table: {
      category: "Sharpen",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultSharpenUniforms.asymmetry}` },
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
  domeEdgeLift: {
    control: { type: "range", min: 0, max: 0.2, step: 0.005 },
    description:
      filterDocs.RaiseBlackPointFilterOptions.properties.domeEdgeLift
        .description,
    if: { arg: "raiseBlackPoint", truthy: true },
    table: {
      category: "Raise Black Point",
      subcategory: "Dome",
      defaultValue: {
        summary: `${defaultRaiseBlackPointUniforms.domeEdgeLift}`,
      },
    },
  },
  domeRadius: {
    control: { type: "range", min: 0.1, max: 2, step: 0.05 },
    description:
      filterDocs.RaiseBlackPointFilterOptions.properties.domeRadius.description,
    if: { arg: "raiseBlackPoint", truthy: true },
    table: {
      category: "Raise Black Point",
      subcategory: "Dome",
      defaultValue: {
        summary: `${defaultRaiseBlackPointUniforms.domeRadius}`,
      },
    },
  },
  domeFalloff: {
    control: { type: "range", min: 0.5, max: 6, step: 0.1 },
    description:
      filterDocs.RaiseBlackPointFilterOptions.properties.domeFalloff
        .description,
    if: { arg: "raiseBlackPoint", truthy: true },
    table: {
      category: "Raise Black Point",
      subcategory: "Dome",
      defaultValue: {
        summary: `${defaultRaiseBlackPointUniforms.domeFalloff}`,
      },
    },
  },
  domeSuperellipse: {
    control: { type: "range", min: 2, max: 10, step: 0.1 },
    description:
      filterDocs.RaiseBlackPointFilterOptions.properties.domeSuperellipse
        .description,
    if: { arg: "raiseBlackPoint", truthy: true },
    table: {
      category: "Raise Black Point",
      subcategory: "Dome",
      defaultValue: {
        summary: `${defaultRaiseBlackPointUniforms.domeSuperellipse}`,
      },
    },
  },
  liftHue: {
    control: { type: "range", min: 0, max: 360, step: 1 },
    description:
      filterDocs.RaiseBlackPointFilterOptions.properties.liftHue.description,
    if: { arg: "raiseBlackPoint", truthy: true },
    table: {
      category: "Raise Black Point",
      subcategory: "Tint",
      defaultValue: {
        summary: `${defaultRaiseBlackPointUniforms.liftHue}`,
      },
    },
  },
  liftSaturation: {
    control: { type: "range", min: 0, max: 1, step: 0.05 },
    description:
      filterDocs.RaiseBlackPointFilterOptions.properties.liftSaturation
        .description,
    if: { arg: "raiseBlackPoint", truthy: true },
    table: {
      category: "Raise Black Point",
      subcategory: "Tint",
      defaultValue: {
        summary: `${defaultRaiseBlackPointUniforms.liftSaturation}`,
      },
    },
  },
  domeCentreX: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    description:
      filterDocs.RaiseBlackPointFilterOptions.properties.domeCentreX
        .description,
    if: { arg: "raiseBlackPoint", truthy: true },
    table: {
      category: "Raise Black Point",
      subcategory: "Dome",
      defaultValue: {
        summary: `${defaultRaiseBlackPointUniforms.domeCentreX}`,
      },
    },
  },
  domeCentreY: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    description:
      filterDocs.RaiseBlackPointFilterOptions.properties.domeCentreY
        .description,
    if: { arg: "raiseBlackPoint", truthy: true },
    table: {
      category: "Raise Black Point",
      subcategory: "Dome",
      defaultValue: {
        summary: `${defaultRaiseBlackPointUniforms.domeCentreY}`,
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

export const switchOnArgTypes = {
  switchOn: {
    control: "boolean",
    description: filterDocs.SwitchOnFilter.description,
    table: {
      category: "Switch On",
    },
  },
  switchOnPaused: {
    control: "boolean",
    description:
      "Hold the switch-on still instead of letting it play, so it can be scrubbed through with the elapsed control",
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Switch On",
      subcategory: "Scrub",
    },
  },
  switchOnElapsed: {
    control: { type: "range", min: 0, max: 6_000, step: 10 },
    description: "Point in the switch-on to hold, in milliseconds",
    if: { arg: "switchOnPaused", truthy: true },
    table: {
      category: "Switch On",
      subcategory: "Scrub",
    },
  },
  switchOnWarmUpDelay: {
    control: { type: "range", min: 0, max: 4_000, step: 50 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.warmUpDelay.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Switch On",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultSwitchOnOptions.warmUpDelay}` },
    },
  },
  switchOnDuration: {
    control: { type: "range", min: 100, max: 6_000, step: 50 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.duration.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Switch On",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultSwitchOnOptions.duration}` },
    },
  },
  switchOnOvershoot: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.overshoot.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Switch On",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultSwitchOnOptions.overshoot}` },
    },
  },
  switchOnCastHue: {
    control: { type: "range", min: 0, max: 360, step: 1 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.castHue.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Switch On",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultSwitchOnOptions.castHue}` },
    },
  },
  switchOnCastStrength: {
    control: { type: "range", min: 0, max: 1, step: 0.05 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.castStrength.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Switch On",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultSwitchOnOptions.castStrength}` },
    },
  },
  switchOnOverscan: {
    control: { type: "range", min: 0, max: 0.3, step: 0.005 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.overscan.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Switch On",
      subcategory: "Settings",
      defaultValue: { summary: `${defaultSwitchOnOptions.overscan}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;
