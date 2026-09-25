import { useEffect, useMemo } from "react";

import type { CRTFiltersProps } from "../CRTFilters.stories";

export type UseFiltersProps = CRTFiltersProps & {
  /** Changing this rebuilds the filters, restarting the switch-on animation */
  switchOnKey: number;
};

import { crtFilters } from "../../filters/crtFilters";
import { TubeFilter } from "../../filters/TubeFilter";

export const useFilters = ({
  noise,
  noiseIntensity,
  noiseScale,
  noiseFPS,
  sharpen,
  sharpenAmount,
  sharpenRadius,
  sharpenAsymmetry,
  sharpenSignalBlur,
  roundedCorners,
  cornerRadius,
  edgeFade,
  scanlines,
  pixelHeight,
  gapBrightness,
  phosphorMask,
  pixelWidth,
  maskBrightness,
  phosphorMaskNumSamples,
  transitionWidth,
  flicker,
  flickerHz,
  flickerDepth,
  flickerPersistence,
  bloom,
  bloomIntensity,
  radius,
  cutoff,
  edgeBlur,
  screenGeometry,
  curvatureX,
  curvatureY,
  curvatureExponent,
  screenOverscan,
  pixelAspect,
  rowStretch,
  lineLag,
  sagLines,
  multisampling,
  vignette,
  vignetteIntensity,
  vignetteRadius,
  switchOn,
  switchOnPaused,
  switchOnElapsed,
  switchOnWarmUpDelay,
  switchOnRiseDuration,
  switchOnDecayDuration,
  switchOnOvershoot,
  switchOnCastHue,
  switchOnCastStrength,
  switchOnOverscan,
  switchOnBloomAmount,
  switchOnScanlinesPixelHeight,
  switchOnScanlinesGapBrightness,
  switchOnDegaussAmount,
  switchOnDegaussDecay,
  switchOnRollAmount,
  switchOnRollDecay,
  switchOnKey,
  raiseBlackPoint,
  blackPoint,
  domeEdgeLift,
  domeRadius,
  domeFalloff,
  domeSuperellipse,
  domeCentreX,
  domeCentreY,
  liftHue,
  liftSaturation,
  colorAdjustment,
  gamma,
  saturation,
  brightness,
  brightnessBottom,
  phosphorExpansion,
  phosphorRedExtra,
  warmth,
}: UseFiltersProps) => {
  const filters = useMemo(() => {
    return crtFilters({
      noise:
        noise ?
          { intensity: noiseIntensity, scale: noiseScale, fps: noiseFPS }
        : false,
      sharpen:
        sharpen ?
          {
            amount: sharpenAmount,
            radius: sharpenRadius,
            asymmetry: sharpenAsymmetry,
            signalBlur: sharpenSignalBlur,
          }
        : false,
      roundedCorners: roundedCorners ? { cornerRadius, edgeFade } : false,
      scanlines: scanlines ? { pixelHeight, gapBrightness } : false,
      phosphorMask:
        phosphorMask ?
          {
            pixelWidth,
            maskBrightness,
            numSamples: phosphorMaskNumSamples,
            transitionWidth,
          }
        : false,
      flicker:
        flicker ?
          {
            hz: flickerHz,
            depth: flickerDepth,
            persistence: flickerPersistence,
          }
        : false,
      bloom:
        bloom ? { intensity: bloomIntensity, radius, cutoff, edgeBlur } : false,
      screenGeometry:
        screenGeometry ?
          {
            curvatureX,
            curvatureY,
            curvatureExponent,
            overscan: screenOverscan,
            pixelAspect,
            rowStretch,
            lineLag,
            sagLines,
            multisampling,
          }
        : false,
      vignette:
        vignette ?
          { intensity: vignetteIntensity, radius: vignetteRadius }
        : false,
      raiseBlackPoint:
        raiseBlackPoint ?
          {
            blackPoint,
            domeEdgeLift,
            domeRadius,
            domeFalloff,
            domeSuperellipse,
            domeCentreX,
            domeCentreY,
            liftHue,
            liftSaturation,
          }
        : false,
      switchOn:
        switchOn ?
          {
            warmUpDelay: switchOnWarmUpDelay,
            riseDuration: switchOnRiseDuration,
            decayDuration: switchOnDecayDuration,
            overshoot: switchOnOvershoot,
            castHue: switchOnCastHue,
            castStrength: switchOnCastStrength,
            overscan: switchOnOverscan,
            bloomAmount: switchOnBloomAmount,
            scanlinesPixelHeight: switchOnScanlinesPixelHeight,
            scanlinesGapBrightness: switchOnScanlinesGapBrightness,
            degaussAmount: switchOnDegaussAmount,
            degaussDecay: switchOnDegaussDecay,
            rollAmount: switchOnRollAmount,
            rollDecay: switchOnRollDecay,
          }
        : false,
      colorAdjustment:
        colorAdjustment ?
          {
            gamma,
            saturation,
            brightness,
            brightnessBottom,
            phosphorExpansion,
            phosphorRedExtra,
            warmth,
          }
        : false,
    });
  }, [
    noise,
    noiseIntensity,
    noiseScale,
    noiseFPS,
    sharpen,
    sharpenAmount,
    sharpenRadius,
    sharpenAsymmetry,
    sharpenSignalBlur,
    roundedCorners,
    cornerRadius,
    edgeFade,
    scanlines,
    pixelHeight,
    gapBrightness,
    phosphorMask,
    pixelWidth,
    maskBrightness,
    phosphorMaskNumSamples,
    transitionWidth,
    flicker,
    flickerHz,
    flickerDepth,
    flickerPersistence,
    bloom,
    bloomIntensity,
    radius,
    cutoff,
    edgeBlur,
    screenGeometry,
    curvatureX,
    curvatureY,
    curvatureExponent,
    screenOverscan,
    pixelAspect,
    rowStretch,
    lineLag,
    sagLines,
    multisampling,
    vignette,
    vignetteIntensity,
    vignetteRadius,
    switchOn,
    switchOnWarmUpDelay,
    switchOnRiseDuration,
    switchOnDecayDuration,
    switchOnOvershoot,
    switchOnCastHue,
    switchOnCastStrength,
    switchOnOverscan,
    switchOnBloomAmount,
    switchOnScanlinesPixelHeight,
    switchOnScanlinesGapBrightness,
    switchOnDegaussAmount,
    switchOnDegaussDecay,
    switchOnRollAmount,
    switchOnRollDecay,
    raiseBlackPoint,
    blackPoint,
    domeEdgeLift,
    domeRadius,
    domeFalloff,
    domeSuperellipse,
    domeCentreX,
    domeCentreY,
    liftHue,
    liftSaturation,
    colorAdjustment,
    gamma,
    saturation,
    brightness,
    brightnessBottom,
    phosphorExpansion,
    phosphorRedExtra,
    warmth,
  ]);

  useEffect(() => {
    for (const filter of filters) {
      if (filter instanceof TubeFilter && filter.switchOnClock !== undefined) {
        if (switchOnPaused) {
          filter.switchOnClock.elapsed = switchOnElapsed;
        } else {
          filter.switchOnClock.restart();
        }
      }
    }
  }, [filters, switchOnKey, switchOnPaused, switchOnElapsed]);

  return filters;
};
