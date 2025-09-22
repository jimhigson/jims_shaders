import type { Meta, StoryObj } from "@storybook/react";

import { Application, extend } from "@pixi/react";
import { useArgs } from "@storybook/preview-api";
import { Container, Graphics, Sprite } from "pixi.js";
import { useState } from "react";

import type { ExampleMediaId } from "./exampleMedia";

import { DraggableSplitter } from "./DraggableSplitter";
import { MediaSelector } from "./MediaSelector";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

import { defaultBloomUniforms } from "../filters/BloomFilter";
import { defaultColorAdjustmentUniforms } from "../filters/ColorAdjustmentFilter";
import { defaultCurvatureOptions } from "../filters/CurvatureFilter";
import { defaultPhosphorMaskOptions } from "../filters/PhosphorMaskFilter";
import { defaultRoundedCornersUniforms } from "../filters/RoundedCornersFilter";
import { defaultScanlinesUniforms } from "../filters/ScanlinesFilter";
import { defaultVignetteUniforms } from "../filters/VignetteFilter";
import { Example } from "./Example";
import filterDocs from "./filterDocs.json";

export interface CRTFiltersProps {
  imageSource: ExampleMediaId;
  // Rounded corners filter (first)
  roundedCorners: boolean;
  cornerRadius: number;
  // Scanlines filter
  scanlines: boolean;
  pixelHeight: number;
  gapBrightness: number;
  // Phosphor mask filter
  phosphorMask: boolean;
  pixelWidth: number;
  maskBrightness: number;
  phosphorMaskNumSamples: number;
  transitionWidth: number;
  // Bloom filter
  bloom: boolean;
  intensity: number;
  radius: number;
  cutoff: number;
  edgeBlur: number;
  // Curvature filter
  curvature: boolean;
  curvatureX: number;
  curvatureY: number;
  multisampling: boolean;
  // Vignette filter
  vignette: boolean;
  vignetteIntensity: number;
  vignetteRadius: number;
  // Color adjustment filter
  colorAdjustment: boolean;
  gamma: number;
  saturation: number;
  brightness: number;
}

const CRTFiltersDemo = (props: CRTFiltersProps) => {
  const [splitPosition, setSplitPosition] = useState(window.innerWidth / 2);

  return (
    <>
      <Application
        backgroundColor={0x000000}
        antialias={true}
        resizeTo={window}
        autoStart
        roundPixels
      >
        <Example {...props} splitPosition={splitPosition} />
      </Application>
      <DraggableSplitter
        onPositionChange={setSplitPosition}
        initialPosition={splitPosition}
      />
    </>
  );
};

const meta = {
  title: "CRT Filters/All Filters",
  component: CRTFiltersDemo,
  decorators: [
    (Story, context) => {
      const [, updateArgs] = useArgs();

      const handleImageSourceChange = (newImageSource: ExampleMediaId) => {
        updateArgs({ imageSource: newImageSource });
      };

      return (
        <div className="h-screen flex flex-col">
          <div className="flex-1">
            <Story />
          </div>
          <MediaSelector
            value={context.args.imageSource}
            onChange={handleImageSourceChange}
          />
        </div>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
    controls: {
      expanded: true,
      panelPosition: "right",
    },
  },
  argTypes: {
    // General
    imageSource: {
      control: {
        type: "inline-radio",
        labels: {
          moonbase: "🌙 Moonbase",
          sonic: "🦔 Sonic",
          metalSlug: "🔫 Metal Slug",
          speedball: "⚽ Speedball",
          amigaHoh: "🎮 Head Over Heels",
          testcard: "📺 Test Card",
          beast: "👾 Beast",
          microMachines: "🏎️ Micro Machines",
          wipeout: "🏁 Wipeout",
          yosi: "🦖 Yosi",
          rickroll: "🎵 Video",
        },
      },
      options: [
        "moonbase",
        "sonic",
        "metalSlug",
        "speedball",
        "amigaHoh",
        "testcard",
        "beast",
        "microMachines",
        "wipeout",
        "yosi",
        "rickroll",
      ],
      table: {
        category: "General",
        disable: true, // Hide from controls panel
      },
    },

    // Screen Shape (first to clip the input)
    roundedCorners: {
      control: "boolean",
      table: {
        category: "Screen Shape",
      },
    },
    cornerRadius: {
      control: { type: "range", min: 0, max: 0.2, step: 0.01 },
      if: { arg: "roundedCorners", truthy: true },
      description:
        filterDocs.RoundedCornersFilterUniforms.properties.cornerRadius
          .description,
      table: {
        category: "Screen Shape",
        subcategory: "Settings",
        defaultValue: {
          summary: `${defaultRoundedCornersUniforms.cornerRadius}`,
        },
      },
    },

    // Scanlines
    scanlines: {
      control: "boolean",
      description: "Enable scanlines",
      table: {
        category: "Scanlines",
      },
    },
    pixelHeight: {
      control: { type: "range", min: 2, max: 8, step: 0.1 },
      description:
        filterDocs.ScanlinesFilterUniforms.properties.pixelHeight.description,
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
        filterDocs.ScanlinesFilterUniforms.properties.gapBrightness.description,
      if: { arg: "scanlines", truthy: true },
      table: {
        category: "Scanlines",
        subcategory: "Settings",
        defaultValue: { summary: `${defaultScanlinesUniforms.gapBrightness}` },
      },
    },

    // Phosphor Mask
    phosphorMask: {
      control: "boolean",
      description: "Enable phosphor mask",
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

    // Bloom Filter
    bloom: {
      control: "boolean",
      description: "Enable bloom filter",
      table: {
        category: "Bloom Filter",
      },
    },
    intensity: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description:
        filterDocs.BloomFilterUniforms.properties.intensity.description,
      if: { arg: "bloom", truthy: true },
      table: {
        category: "Bloom Filter",
        subcategory: "Settings",
        defaultValue: { summary: `${defaultBloomUniforms.intensity}` },
      },
    },
    radius: {
      control: { type: "range", min: 1, max: 10, step: 0.5 },
      description: filterDocs.BloomFilterUniforms.properties.radius.description,
      if: { arg: "bloom", truthy: true },
      table: {
        category: "Bloom Filter",
        subcategory: "Settings",
        defaultValue: { summary: `${defaultBloomUniforms.radius}` },
      },
    },
    cutoff: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description: filterDocs.BloomFilterUniforms.properties.cutoff.description,
      if: { arg: "bloom", truthy: true },
      table: {
        category: "Bloom Filter",
        subcategory: "Settings",
        defaultValue: { summary: `${defaultBloomUniforms.cutoff}` },
      },
    },
    edgeBlur: {
      control: { type: "range", min: 0, max: 5, step: 0.1 },
      description:
        filterDocs.BloomFilterUniforms.properties.edgeBlur.description,
      if: { arg: "bloom", truthy: true },
      table: {
        category: "Bloom Filter",
        subcategory: "Settings",
        defaultValue: { summary: `${defaultBloomUniforms.edgeBlur}` },
      },
    },

    // Screen Curvature
    curvature: {
      control: "boolean",
      description: "Enable screen curvature",
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

    // Vignette
    vignette: {
      control: "boolean",
      description: "Enable vignette",
      table: {
        category: "Vignette",
      },
    },
    vignetteIntensity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description:
        filterDocs.VignetteFilterUniforms.properties.intensity.description,
      if: { arg: "vignette", truthy: true },
      table: {
        category: "Vignette",
        subcategory: "Settings",
        defaultValue: { summary: `${defaultVignetteUniforms.intensity}` },
      },
    },
    vignetteRadius: {
      control: { type: "range", min: 0, max: 2, step: 0.1 },
      description:
        filterDocs.VignetteFilterUniforms.properties.radius.description,
      if: { arg: "vignette", truthy: true },
      table: {
        category: "Vignette",
        subcategory: "Settings",
        defaultValue: { summary: `${defaultVignetteUniforms.radius}` },
      },
    },

    // Color Adjustment (at the end)
    colorAdjustment: {
      control: "boolean",
      description: "Enable color adjustment",
      table: {
        category: "Color Adjustment",
      },
    },
    gamma: {
      control: { type: "range", min: 0.5, max: 2, step: 0.1 },
      description:
        filterDocs.ColorAdjustmentFilterUniforms.properties.gamma.description,
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
        filterDocs.ColorAdjustmentFilterUniforms.properties.saturation
          .description,
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
        filterDocs.ColorAdjustmentFilterUniforms.properties.brightness
          .description,
      if: { arg: "colorAdjustment", truthy: true },
      table: {
        category: "Color Adjustment",
        subcategory: "Settings",
        defaultValue: {
          summary: `${defaultColorAdjustmentUniforms.brightness}`,
        },
      },
    },
  },
} satisfies Meta<typeof CRTFiltersDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageSource: "moonbase",
    roundedCorners: true,
    cornerRadius: 0.06, //defaultRoundedCornersUniforms.cornerRadius,
    scanlines: true,
    pixelHeight: 4, // defaultScanlinesUniforms.pixelHeight,
    gapBrightness: 0.3, //defaultScanlinesUniforms.gapBrightness,
    phosphorMask: true,
    pixelWidth: 4.5, // defaultPhosphorMaskUniforms.pixelWidth,
    maskBrightness: 0.3, // defaultPhosphorMaskUniforms.maskBrightness,
    phosphorMaskNumSamples: 6, // defaultPhosphorMaskOptions.numSamples,
    transitionWidth: 0.3, // defaultPhosphorMaskOptions.transitionWidth,
    bloom: true,
    intensity: defaultBloomUniforms.intensity,
    radius: 6.5, // defaultBloomUniforms.radius,
    cutoff: defaultBloomUniforms.cutoff,
    edgeBlur: defaultBloomUniforms.edgeBlur,
    curvature: true,
    curvatureX: 0.35, // defaultCurvatureOptions.curvatureX,
    curvatureY: 0.35, // defaultCurvatureOptions.curvatureY,
    multisampling: defaultCurvatureOptions.multisampling,
    vignette: true,
    vignetteIntensity: 0.6, //defaultVignetteUniforms.intensity,
    vignetteRadius: 1.3, // defaultVignetteUniforms.radius,
    colorAdjustment: true,
    gamma: 1, //defaultColorAdjustmentUniforms.gamma,
    saturation: 1.2, // defaultColorAdjustmentUniforms.saturation,
    brightness: 1.5, //defaultColorAdjustmentUniforms.brightness,
  },
};
