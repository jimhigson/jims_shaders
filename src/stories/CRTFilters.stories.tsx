import type { Meta, StoryObj } from "@storybook/react";

import { extend, Application as PixiApplication } from "@pixi/react";
import { useArgs } from "@storybook/preview-api";
import { Container, Graphics, Sprite } from "pixi.js";
import { useEffect, useState } from "react";

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
import { defaultNoiseUniforms } from "../filters/NoiseFilter";
import { defaultRaiseBlackPointUniforms } from "../filters/RaiseBlackPointFilter";
import { defaultSharpenUniforms } from "../filters/SharpenFilter";
import { defaultSwitchOnOptions } from "../filters/SwitchOnFilter";
import { Example } from "./Example";
import { exampleMedia } from "./exampleMedia";
import {
  bloomArgTypes,
  colorAdjustmentArgTypes,
  curvatureArgTypes,
  noiseArgTypes,
  phosphorMaskArgTypes,
  raiseBlackPointArgTypes,
  roundedCornersArgTypes,
  scanlinesArgTypes,
  sharpenArgTypes,
  switchOnArgTypes,
  vignetteArgTypes,
} from "./storyFilterArgTypes";

export interface CRTFiltersProps {
  imageSource: ExampleMediaId;
  // Noise filter (first)
  noise: boolean;
  noiseIntensity: number;
  noiseScale: number;
  noiseFPS: number;
  // Sharpen filter
  sharpen: boolean;
  sharpenAmount: number;
  sharpenRadius: number;
  sharpenAsymmetry: number;
  sharpenSignalBlur: number;
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
  bloomIntensity: number;
  radius: number;
  cutoff: number;
  edgeBlur: number;
  // Vignette filter
  vignette: boolean;
  vignetteIntensity: number;
  vignetteRadius: number;
  // Raise black point filter
  raiseBlackPoint: boolean;
  blackPoint: number;
  domeEdgeLift: number;
  domeRadius: number;
  domeFalloff: number;
  domeSuperellipse: number;
  domeCentreX: number;
  domeCentreY: number;
  liftHue: number;
  liftSaturation: number;
  // Rounded corners filter
  roundedCorners: boolean;
  cornerRadius: number;
  // Curvature filter
  curvature: boolean;
  curvatureX: number;
  curvatureY: number;
  multisampling: boolean;
  // Switch on filter
  switchOn: boolean;
  switchOnPaused: boolean;
  switchOnElapsed: number;
  switchOnWarmUpDelay: number;
  switchOnDuration: number;
  switchOnOvershoot: number;
  switchOnCastHue: number;
  switchOnCastStrength: number;
  switchOnOverscan: number;
  // Color adjustment filter
  colorAdjustment: boolean;
  gamma: number;
  saturation: number;
  brightness: number;
  brightnessBottom: number;
}

const CRTFiltersDemo = (props: CRTFiltersProps) => {
  const [container, setContainer] = useState<HTMLDivElement | null>();
  const [splitPosition, setSplitPosition] = useState(0);

  // Bumping this rebuilds the filters, which starts the switch-on animation from the top
  const [switchOnKey, setSwitchOnKey] = useState(0);
  const turnOn = () => setSwitchOnKey((key) => key + 1);

  const { imageSource } = props;
  useEffect(() => {
    setSwitchOnKey((key) => key + 1);
  }, [imageSource]);

  return (
    <div className="w-full h-full relative" ref={setContainer}>
      {container && (
        <>
          <PixiApplication
            backgroundColor={0x000000}
            antialias={true}
            resizeTo={container}
            autoStart
            roundPixels
          >
            <Example
              {...props}
              splitPosition={splitPosition}
              switchOnKey={switchOnKey}
            />
          </PixiApplication>
          <DraggableSplitter
            onPositionChange={setSplitPosition}
            initialPosition={0}
          />
          <button
            type="button"
            onClick={turnOn}
            className="absolute left-0 top-0 z-splitter m-4 px-6 py-3 text-2xl text-white bg-black border-2 border-white cursor-pointer"
          >
            Turn on
          </button>
          <div className="absolute right-0 bottom-0 text-white text-4xl [&_a]:text-primary [&_a]:underline">
            {exampleMedia[props.imageSource].description}
          </div>
        </>
      )}
    </div>
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
        <div className="h-screen flex flex-row">
          <div className="flex-grow-0">
            <MediaSelector
              value={context.args.imageSource}
              onChange={handleImageSourceChange}
            />
          </div>
          <div className="flex-grow">
            <Story />
          </div>
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

    ...noiseArgTypes,
    ...sharpenArgTypes,
    ...scanlinesArgTypes,
    ...phosphorMaskArgTypes,
    ...bloomArgTypes,
    ...vignetteArgTypes,
    ...raiseBlackPointArgTypes,
    ...roundedCornersArgTypes,
    ...curvatureArgTypes,
    ...switchOnArgTypes,
    ...colorAdjustmentArgTypes,
  },
} satisfies Meta<typeof CRTFiltersDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageSource: "moonbase",
    noise: true,
    noiseIntensity: defaultNoiseUniforms.intensity,
    noiseScale: defaultNoiseUniforms.scale,
    noiseFPS: defaultNoiseUniforms.fps,
    roundedCorners: true,
    cornerRadius: 0.06, //defaultRoundedCornersUniforms.cornerRadius,
    sharpen: true,
    sharpenAmount: defaultSharpenUniforms.amount,
    sharpenRadius: defaultSharpenUniforms.radius,
    sharpenAsymmetry: defaultSharpenUniforms.asymmetry,
    sharpenSignalBlur: defaultSharpenUniforms.signalBlur,
    scanlines: true,
    pixelHeight: 4, // defaultScanlinesUniforms.pixelHeight,
    gapBrightness: 0.3, //defaultScanlinesUniforms.gapBrightness,
    phosphorMask: true,
    pixelWidth: 4.5, // defaultPhosphorMaskUniforms.pixelWidth,
    maskBrightness: 0.3, // defaultPhosphorMaskUniforms.maskBrightness,
    phosphorMaskNumSamples: 6, // defaultPhosphorMaskOptions.numSamples,
    transitionWidth: 0.3, // defaultPhosphorMaskOptions.transitionWidth,
    bloom: true,
    bloomIntensity: defaultBloomUniforms.intensity,
    radius: 1.2, // defaultBloomUniforms.radius,
    cutoff: defaultBloomUniforms.cutoff,
    edgeBlur: defaultBloomUniforms.edgeBlur,
    curvature: true,
    curvatureX: 0.35, // defaultCurvatureOptions.curvatureX,
    curvatureY: 0.35, // defaultCurvatureOptions.curvatureY,
    multisampling: defaultCurvatureOptions.multisampling,
    vignette: true,
    vignetteIntensity: 0.6, //defaultVignetteUniforms.intensity,
    vignetteRadius: 1.3, // defaultVignetteUniforms.radius,
    raiseBlackPoint: true,
    blackPoint: defaultRaiseBlackPointUniforms.blackPoint,
    domeEdgeLift: defaultRaiseBlackPointUniforms.domeEdgeLift,
    domeRadius: defaultRaiseBlackPointUniforms.domeRadius,
    domeFalloff: defaultRaiseBlackPointUniforms.domeFalloff,
    domeSuperellipse: defaultRaiseBlackPointUniforms.domeSuperellipse,
    domeCentreX: defaultRaiseBlackPointUniforms.domeCentreX,
    domeCentreY: defaultRaiseBlackPointUniforms.domeCentreY,
    liftHue: defaultRaiseBlackPointUniforms.liftHue,
    liftSaturation: defaultRaiseBlackPointUniforms.liftSaturation,
    switchOn: true,
    switchOnPaused: false,
    switchOnElapsed: 0,
    switchOnWarmUpDelay: defaultSwitchOnOptions.warmUpDelay,
    switchOnDuration: defaultSwitchOnOptions.duration,
    switchOnOvershoot: defaultSwitchOnOptions.overshoot,
    switchOnCastHue: defaultSwitchOnOptions.castHue,
    switchOnCastStrength: defaultSwitchOnOptions.castStrength,
    switchOnOverscan: defaultSwitchOnOptions.overscan,
    colorAdjustment: true,
    gamma: 1, //defaultColorAdjustmentUniforms.gamma,
    saturation: 1.2, // defaultColorAdjustmentUniforms.saturation,
    brightness: 1.5, //defaultColorAdjustmentUniforms.brightness,
    brightnessBottom: defaultColorAdjustmentUniforms.brightnessBottom,
  },
};
