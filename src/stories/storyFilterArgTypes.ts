import type { ArgTypes } from "@storybook/react";

import type { CRTFiltersProps } from "./CRTFilters.stories";

import { defaultBloomUniforms } from "../filters/stages/BloomFilterOptions";
import { defaultColorAdjustmentUniforms } from "../filters/stages/ColorAdjustmentFilterOptions";
import { defaultFlickerOptions } from "../filters/stages/FlickerFilterOptions";
import { defaultNoiseUniforms } from "../filters/stages/NoiseFilterOptions";
import { defaultPhosphorMaskOptions } from "../filters/stages/PhosphorMaskFilterOptions";
import { defaultRaiseBlackPointUniforms } from "../filters/stages/RaiseBlackPointFilterOptions";
import { defaultRoundedCornersUniforms } from "../filters/stages/RoundedCornersFilterOptions";
import { defaultScanlinesUniforms } from "../filters/stages/ScanlinesFilterOptions";
import {
  defaultScreenGeometryOptions,
  pixelAspectRatios,
} from "../filters/stages/ScreenGeometryFilterOptions";
import { defaultSharpenUniforms } from "../filters/stages/SharpenFilterOptions";
import { defaultSwitchOnOptions } from "../filters/stages/SwitchOnFilterOptions";
import { defaultVignetteUniforms } from "../filters/stages/VignetteFilterOptions";
import filterDocs from "./filterDocs.json";

export const noiseArgTypes = {
  noise: {
    control: "boolean",
    description: filterDocs.NoiseFilterOptions.description,
    table: {
      category: "Signal",
      subcategory: "Noise",
    },
  },
  noiseIntensity: {
    control: { type: "range", min: 0, max: 0.5, step: 0.01 },
    description: "Noise intensity",
    if: { arg: "noise", truthy: true },
    table: {
      category: "Signal",
      subcategory: "Noise",
      defaultValue: { summary: `${defaultNoiseUniforms.intensity}` },
    },
  },
  noisePixelHeight: {
    control: { type: "range", min: 1, max: 16, step: 0.5 },
    description:
      filterDocs.NoiseFilterOptions.properties.pixelHeight.description,
    if: { arg: "noise", truthy: true },
    table: {
      category: "Signal",
      subcategory: "Noise",
      defaultValue: { summary: `${defaultNoiseUniforms.pixelHeight}` },
    },
  },
  noiseWidthRatio: {
    control: { type: "range", min: 0.25, max: 32, step: 0.25 },
    description:
      filterDocs.NoiseFilterOptions.properties.widthRatio.description,
    if: { arg: "noise", truthy: true },
    table: {
      category: "Signal",
      subcategory: "Noise",
      defaultValue: { summary: `${defaultNoiseUniforms.widthRatio}` },
    },
  },
  noiseFPS: {
    control: { type: "range", min: 12, max: 120, step: 1 },
    description:
      "Noise FPS - frequency at which the noise updates per second. Set to 30 to emulate NTSC, or 25 for PAL.",
    if: { arg: "noise", truthy: true },
    table: {
      category: "Signal",
      subcategory: "Noise",
      defaultValue: { summary: `${defaultNoiseUniforms.fps}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const sharpenArgTypes = {
  sharpen: {
    control: "boolean",
    description: filterDocs.SharpenFilterOptions.description,
    table: {
      category: "Signal",
      subcategory: "Sharpen",
    },
  },
  sharpenAmount: {
    control: { type: "range", min: 0, max: 2, step: 0.05 },
    description: filterDocs.SharpenFilterOptions.properties.amount.description,
    if: { arg: "sharpen", truthy: true },
    table: {
      category: "Signal",
      subcategory: "Sharpen",
      defaultValue: { summary: `${defaultSharpenUniforms.amount}` },
    },
  },
  sharpenRadius: {
    control: { type: "range", min: 0.5, max: 8, step: 0.1 },
    description: filterDocs.SharpenFilterOptions.properties.radius.description,
    if: { arg: "sharpen", truthy: true },
    table: {
      category: "Signal",
      subcategory: "Sharpen",
      defaultValue: { summary: `${defaultSharpenUniforms.radius}` },
    },
  },
  sharpenSignalBlur: {
    control: { type: "range", min: 0, max: 1, step: 0.05 },
    description:
      filterDocs.SharpenFilterOptions.properties.signalBlur.description,
    if: { arg: "sharpen", truthy: true },
    table: {
      category: "Signal",
      subcategory: "Sharpen",
      defaultValue: { summary: `${defaultSharpenUniforms.signalBlur}` },
    },
  },
  sharpenAsymmetry: {
    control: { type: "range", min: 0, max: 1, step: 0.05 },
    description:
      filterDocs.SharpenFilterOptions.properties.asymmetry.description,
    if: { arg: "sharpen", truthy: true },
    table: {
      category: "Signal",
      subcategory: "Sharpen",
      defaultValue: { summary: `${defaultSharpenUniforms.asymmetry}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const flickerArgTypes = {
  flicker: {
    control: "boolean",
    description: filterDocs.FlickerFilterOptions.description,
    table: {
      category: "Raster",
      subcategory: "Flicker",
    },
  },
  flickerHz: {
    control: { type: "range", min: 10, max: 100, step: 1 },
    description: filterDocs.FlickerFilterOptions.properties.hz.description,
    if: { arg: "flicker", truthy: true },
    table: {
      category: "Raster",
      subcategory: "Flicker",
      defaultValue: { summary: `${defaultFlickerOptions.hz}` },
    },
  },
  flickerDepth: {
    control: { type: "range", min: 0, max: 1, step: 0.05 },
    description: filterDocs.FlickerFilterOptions.properties.depth.description,
    if: { arg: "flicker", truthy: true },
    table: {
      category: "Raster",
      subcategory: "Flicker",
      defaultValue: { summary: `${defaultFlickerOptions.depth}` },
    },
  },
  flickerPersistence: {
    control: { type: "range", min: 0.05, max: 2, step: 0.05 },
    description:
      filterDocs.FlickerFilterOptions.properties.persistence.description,
    if: { arg: "flicker", truthy: true },
    table: {
      category: "Raster",
      subcategory: "Flicker",
      defaultValue: { summary: `${defaultFlickerOptions.persistence}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const scanlinesArgTypes = {
  scanlines: {
    control: "boolean",
    description: filterDocs.ScanlinesFilterOptions.description,
    table: {
      category: "Raster",
      subcategory: "Scanlines",
    },
  },
  pixelHeight: {
    control: { type: "range", min: 2, max: 8, step: 0.1 },
    description:
      filterDocs.ScanlinesFilterOptions.properties.pixelHeight.description,
    if: { arg: "scanlines", truthy: true },
    table: {
      category: "Raster",
      subcategory: "Scanlines",
      defaultValue: { summary: `${defaultScanlinesUniforms.pixelHeight}` },
    },
  },
  gapBrightness: {
    control: { type: "range", min: 0, max: 1, step: 0.1 },
    description:
      filterDocs.ScanlinesFilterOptions.properties.gapBrightness.description,
    if: { arg: "scanlines", truthy: true },
    table: {
      category: "Raster",
      subcategory: "Scanlines",
      defaultValue: { summary: `${defaultScanlinesUniforms.gapBrightness}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const phosphorMaskArgTypes = {
  phosphorMask: {
    control: "boolean",
    description: filterDocs.PhosphorMaskFilterOptions.description,
    table: {
      category: "Raster",
      subcategory: "Phosphor Mask",
    },
  },
  pixelWidth: {
    control: { type: "range", min: 3, max: 12, step: 0.05 },
    description:
      filterDocs.PhosphorMaskFilterOptions.properties.pixelWidth.description,
    if: { arg: "phosphorMask", truthy: true },
    table: {
      category: "Raster",
      subcategory: "Phosphor Mask",
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
      category: "Raster",
      subcategory: "Phosphor Mask",
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
      category: "Raster",
      subcategory: "Phosphor Mask",
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
      category: "Raster",
      subcategory: "Phosphor Mask",
      defaultValue: {
        summary: `${defaultPhosphorMaskOptions.transitionWidth}`,
      },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const bloomArgTypes = {
  bloom: {
    control: "boolean",
    description: filterDocs.BloomFilterOptions.description,
    table: {
      category: "Glow",
      subcategory: "Bloom",
    },
  },
  bloomIntensity: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    description: filterDocs.BloomFilterOptions.properties.intensity.description,
    if: { arg: "bloom", truthy: true },
    table: {
      category: "Glow",
      subcategory: "Bloom",
      defaultValue: { summary: `${defaultBloomUniforms.intensity}` },
    },
  },
  radius: {
    control: { type: "range", min: 1, max: 5, step: 0.1 },
    description: filterDocs.BloomFilterOptions.properties.radius.description,
    if: { arg: "bloom", truthy: true },
    table: {
      category: "Glow",
      subcategory: "Bloom",
      defaultValue: { summary: `${defaultBloomUniforms.radius}` },
    },
  },
  cutoff: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    description: filterDocs.BloomFilterOptions.properties.cutoff.description,
    if: { arg: "bloom", truthy: true },
    table: {
      category: "Glow",
      subcategory: "Bloom",
      defaultValue: { summary: `${defaultBloomUniforms.cutoff}` },
    },
  },
  edgeBlur: {
    control: { type: "range", min: 0, max: 1, step: 0.1 },
    description: filterDocs.BloomFilterOptions.properties.edgeBlur.description,
    if: { arg: "bloom", truthy: true },
    table: {
      category: "Glow",
      subcategory: "Bloom",
      defaultValue: { summary: `${defaultBloomUniforms.edgeBlur}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const vignetteArgTypes = {
  vignette: {
    control: "boolean",
    description: filterDocs.VignetteFilterOptions.description,
    table: {
      category: "Glow",
      subcategory: "Vignette",
    },
  },
  vignetteIntensity: {
    control: { type: "range", min: 0, max: 1, step: 0.1 },
    description:
      filterDocs.VignetteFilterOptions.properties.intensity.description,
    if: { arg: "vignette", truthy: true },
    table: {
      category: "Glow",
      subcategory: "Vignette",
      defaultValue: { summary: `${defaultVignetteUniforms.intensity}` },
    },
  },
  vignetteRadius: {
    control: { type: "range", min: 0, max: 2, step: 0.1 },
    description: filterDocs.VignetteFilterOptions.properties.radius.description,
    if: { arg: "vignette", truthy: true },
    table: {
      category: "Glow",
      subcategory: "Vignette",
      defaultValue: { summary: `${defaultVignetteUniforms.radius}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const raiseBlackPointArgTypes = {
  raiseBlackPoint: {
    control: "boolean",
    description: filterDocs.RaiseBlackPointFilterOptions.description,
    table: {
      category: "Glow",
      subcategory: "Raise Black Point",
    },
  },
  blackPoint: {
    control: { type: "range", min: 0, max: 0.1, step: 0.005 },
    description:
      filterDocs.RaiseBlackPointFilterOptions.properties.blackPoint.description,
    if: { arg: "raiseBlackPoint", truthy: true },
    table: {
      category: "Glow",
      subcategory: "Raise Black Point",
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
      category: "Glow",
      subcategory: "Raise Black Point: Dome",
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
      category: "Glow",
      subcategory: "Raise Black Point: Dome",
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
      category: "Glow",
      subcategory: "Raise Black Point: Dome",
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
      category: "Glow",
      subcategory: "Raise Black Point: Dome",
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
      category: "Glow",
      subcategory: "Raise Black Point: Tint",
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
      category: "Glow",
      subcategory: "Raise Black Point: Tint",
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
      category: "Glow",
      subcategory: "Raise Black Point: Dome",
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
      category: "Glow",
      subcategory: "Raise Black Point: Dome",
      defaultValue: {
        summary: `${defaultRaiseBlackPointUniforms.domeCentreY}`,
      },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const roundedCornersArgTypes = {
  roundedCorners: {
    control: "boolean",
    description: filterDocs.RoundedCornersFilterOptions.description,
    table: {
      category: "Tube",
      subcategory: "Rounded Corners",
    },
  },
  cornerRadius: {
    control: { type: "range", min: 0, max: 0.2, step: 0.01 },
    if: { arg: "roundedCorners", truthy: true },
    description:
      filterDocs.RoundedCornersFilterOptions.properties.cornerRadius
        .description,
    table: {
      category: "Tube",
      subcategory: "Rounded Corners",
      defaultValue: {
        summary: `${defaultRoundedCornersUniforms.cornerRadius}`,
      },
    },
  },
  edgeFade: {
    control: { type: "range", min: 0, max: 0.1, step: 0.002 },
    description:
      filterDocs.RoundedCornersFilterOptions.properties.edgeFade.description,
    if: { arg: "roundedCorners", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Rounded Corners",
      defaultValue: {
        summary: `${defaultRoundedCornersUniforms.edgeFade}`,
      },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const screenGeometryArgTypes = {
  screenGeometry: {
    control: "boolean",
    description: filterDocs.ScreenGeometryFilterOptions.description,
    table: {
      category: "Tube",
      subcategory: "Screen Geometry",
    },
  },
  curvatureX: {
    control: { type: "range", min: 0, max: 0.6, step: 0.01 },
    description:
      filterDocs.ScreenGeometryFilterOptions.properties.curvatureX.description,
    if: { arg: "screenGeometry", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Screen Geometry",
      defaultValue: { summary: `${defaultScreenGeometryOptions.curvatureX}` },
    },
  },
  curvatureY: {
    control: { type: "range", min: 0, max: 0.6, step: 0.01 },
    description:
      filterDocs.ScreenGeometryFilterOptions.properties.curvatureY.description,
    if: { arg: "screenGeometry", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Screen Geometry",
      defaultValue: { summary: `${defaultScreenGeometryOptions.curvatureY}` },
    },
  },
  curvatureExponent: {
    control: { type: "range", min: 1.6, max: 16, step: 0.1 },
    description:
      filterDocs.ScreenGeometryFilterOptions.properties.curvatureExponent
        .description,
    if: { arg: "screenGeometry", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Screen Geometry",
      defaultValue: {
        summary: `${defaultScreenGeometryOptions.curvatureExponent}`,
      },
    },
  },
  screenOverscan: {
    control: { type: "range", min: 0, max: 0.2, step: 0.005 },
    description:
      filterDocs.ScreenGeometryFilterOptions.properties.overscan.description,
    if: { arg: "screenGeometry", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Screen Geometry",
      defaultValue: { summary: `${defaultScreenGeometryOptions.overscan}` },
    },
  },
  pixelAspect: {
    control: { type: "select" },
    options: Object.keys(pixelAspectRatios),
    description:
      filterDocs.ScreenGeometryFilterOptions.properties.pixelAspect.description,
    if: { arg: "screenGeometry", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Screen Geometry",
      defaultValue: { summary: `${defaultScreenGeometryOptions.pixelAspect}` },
    },
  },
  rowStretch: {
    control: { type: "range", min: 0, max: 0.1, step: 0.001 },
    description:
      filterDocs.ScreenGeometryFilterOptions.properties.rowStretch.description,
    if: { arg: "screenGeometry", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Screen Geometry: High voltage sag",
      defaultValue: { summary: `${defaultScreenGeometryOptions.rowStretch}` },
    },
  },
  lineLag: {
    control: { type: "range", min: 0, max: 0.05, step: 0.001 },
    description:
      filterDocs.ScreenGeometryFilterOptions.properties.lineLag.description,
    if: { arg: "screenGeometry", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Screen Geometry: High voltage sag",
      defaultValue: { summary: `${defaultScreenGeometryOptions.lineLag}` },
    },
  },
  sagLines: {
    control: { type: "range", min: 1, max: 100, step: 1 },
    description:
      filterDocs.ScreenGeometryFilterOptions.properties.sagLines.description,
    if: { arg: "screenGeometry", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Screen Geometry: High voltage sag",
      defaultValue: { summary: `${defaultScreenGeometryOptions.sagLines}` },
    },
  },
  multisampling: {
    control: "boolean",
    description:
      filterDocs.ScreenGeometryFilterOptions.properties.multisampling
        .description,
    if: { arg: "screenGeometry", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Screen Geometry",
      defaultValue: {
        summary: `${defaultScreenGeometryOptions.multisampling}`,
      },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const colorAdjustmentArgTypes = {
  colorAdjustment: {
    control: "boolean",
    description: filterDocs.ColorAdjustmentFilterOptions.description,
    table: {
      category: "Tube",
      subcategory: "Color Adjustment",
    },
  },
  gamma: {
    control: { type: "range", min: 0.5, max: 2, step: 0.1 },
    description:
      filterDocs.ColorAdjustmentFilterOptions.properties.gamma.description,
    if: { arg: "colorAdjustment", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Color Adjustment",
      defaultValue: { summary: `${defaultColorAdjustmentUniforms.gamma}` },
    },
  },
  saturation: {
    control: { type: "range", min: 0, max: 2, step: 0.1 },
    description:
      filterDocs.ColorAdjustmentFilterOptions.properties.saturation.description,
    if: { arg: "colorAdjustment", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Color Adjustment",
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
      category: "Tube",
      subcategory: "Color Adjustment",
      defaultValue: {
        summary: `${defaultColorAdjustmentUniforms.brightness}`,
      },
    },
  },
  phosphorExpansion: {
    control: { type: "range", min: 0, max: 0.6, step: 0.01 },
    description:
      filterDocs.ColorAdjustmentFilterOptions.properties.phosphorExpansion
        .description,
    if: { arg: "colorAdjustment", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Color Adjustment: Phosphor primaries",
      defaultValue: {
        summary: `${defaultColorAdjustmentUniforms.phosphorExpansion}`,
      },
    },
  },
  phosphorRedExtra: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    description:
      filterDocs.ColorAdjustmentFilterOptions.properties.phosphorRedExtra
        .description,
    if: { arg: "colorAdjustment", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Color Adjustment: Phosphor primaries",
      defaultValue: {
        summary: `${defaultColorAdjustmentUniforms.phosphorRedExtra}`,
      },
    },
  },
  warmth: {
    control: { type: "range", min: -0.2, max: 0.2, step: 0.005 },
    description:
      filterDocs.ColorAdjustmentFilterOptions.properties.warmth.description,
    if: { arg: "colorAdjustment", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Color Adjustment: Phosphor primaries",
      defaultValue: { summary: `${defaultColorAdjustmentUniforms.warmth}` },
    },
  },
  brightnessBottom: {
    control: { type: "range", min: -1, max: 1, step: 0.05 },
    description:
      filterDocs.ColorAdjustmentFilterOptions.properties.brightnessBottom
        .description,
    if: { arg: "colorAdjustment", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Color Adjustment",
      defaultValue: {
        summary: `${defaultColorAdjustmentUniforms.brightnessBottom}`,
      },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;

export const switchOnArgTypes = {
  switchOn: {
    control: "boolean",
    description: filterDocs.SwitchOnFilterOptions.description,
    table: {
      category: "Tube",
      subcategory: "Switch On",
    },
  },
  switchOnPaused: {
    control: "boolean",
    description:
      "Hold the switch-on still instead of letting it play, so it can be scrubbed through with the elapsed control",
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On: Scrub",
    },
  },
  switchOnElapsed: {
    control: { type: "range", min: 0, max: 6_000, step: 10 },
    description: "Point in the switch-on to hold, in milliseconds",
    if: { arg: "switchOnPaused", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On: Scrub",
    },
  },
  switchOnWarmUpDelay: {
    control: { type: "range", min: 0, max: 4_000, step: 50 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.warmUpDelay.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.warmUpDelay}` },
    },
  },
  switchOnRiseDuration: {
    control: { type: "range", min: 100, max: 6_000, step: 50 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.riseDuration.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.riseDuration}` },
    },
  },
  switchOnDecayDuration: {
    control: { type: "range", min: 0, max: 6_000, step: 50 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.decayDuration.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.decayDuration}` },
    },
  },
  switchOnOvershoot: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.overshoot.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.overshoot}` },
    },
  },
  switchOnCastHue: {
    control: { type: "range", min: 0, max: 360, step: 1 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.castHue.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.castHue}` },
    },
  },
  switchOnCastStrength: {
    control: { type: "range", min: 0, max: 1, step: 0.05 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.castStrength.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.castStrength}` },
    },
  },
  switchOnOverscan: {
    control: { type: "range", min: 0, max: 0.3, step: 0.005 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.overscan.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.overscan}` },
    },
  },
  switchOnBloomAmount: {
    control: { type: "range", min: 0, max: 0.3, step: 0.005 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.bloomAmount.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.bloomAmount}` },
    },
  },
  switchOnScanlinesPixelHeight: {
    control: { type: "range", min: 1, max: 12, step: 0.5 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.scanlinesPixelHeight
        .description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: {
        summary: `${defaultSwitchOnOptions.scanlinesPixelHeight}`,
      },
    },
  },
  switchOnScanlinesGapBrightness: {
    control: { type: "range", min: 0, max: 1, step: 0.05 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.scanlinesGapBrightness
        .description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: {
        summary: `${defaultSwitchOnOptions.scanlinesGapBrightness}`,
      },
    },
  },
  switchOnDegaussAmount: {
    control: { type: "range", min: 0, max: 0.05, step: 0.001 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.degaussAmount.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.degaussAmount}` },
    },
  },
  switchOnDegaussDecay: {
    control: { type: "range", min: 0, max: 2_000, step: 10 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.degaussDecay.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.degaussDecay}` },
    },
  },
  switchOnRollAmount: {
    control: { type: "range", min: 0, max: 0.05, step: 0.001 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.rollAmount.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.rollAmount}` },
    },
  },
  switchOnRollDecay: {
    control: { type: "range", min: 0, max: 2_000, step: 10 },
    description:
      filterDocs.SwitchOnFilterOptions.properties.rollDecay.description,
    if: { arg: "switchOn", truthy: true },
    table: {
      category: "Tube",
      subcategory: "Switch On",
      defaultValue: { summary: `${defaultSwitchOnOptions.rollDecay}` },
    },
  },
} as const satisfies Partial<ArgTypes<CRTFiltersProps>>;
