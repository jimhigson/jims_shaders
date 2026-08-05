import { useEffect, useMemo } from "react";

import type { CRTFiltersProps } from "../CRTFilters.stories";

export type UseFiltersProps = CRTFiltersProps & {
  /** Changing this rebuilds the filters, restarting the switch-on animation */
  switchOnKey: number;
};

import { crtFilters } from "../../filters/crtFilters";
import { SwitchOnFilter } from "../../filters/SwitchOnFilter";

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
  scanlines,
  pixelHeight,
  gapBrightness,
  phosphorMask,
  pixelWidth,
  maskBrightness,
  phosphorMaskNumSamples,
  transitionWidth,
  bloom,
  bloomIntensity,
  radius,
  cutoff,
  edgeBlur,
  curvature,
  curvatureX,
  curvatureY,
  multisampling,
  vignette,
  vignetteIntensity,
  vignetteRadius,
  switchOn,
  switchOnPaused,
  switchOnElapsed,
  switchOnWarmUpDelay,
  switchOnDuration,
  switchOnOvershoot,
  switchOnCastHue,
  switchOnCastStrength,
  switchOnOverscan,
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
      roundedCorners: roundedCorners ? { cornerRadius } : false,
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
      bloom:
        bloom ? { intensity: bloomIntensity, radius, cutoff, edgeBlur } : false,
      curvature: curvature ? { curvatureX, curvatureY, multisampling } : false,
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
            duration: switchOnDuration,
            overshoot: switchOnOvershoot,
            castHue: switchOnCastHue,
            castStrength: switchOnCastStrength,
            overscan: switchOnOverscan,
          }
        : false,
      colorAdjustment:
        colorAdjustment ?
          { gamma, saturation, brightness, brightnessBottom }
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
    scanlines,
    pixelHeight,
    gapBrightness,
    phosphorMask,
    pixelWidth,
    maskBrightness,
    phosphorMaskNumSamples,
    transitionWidth,
    bloom,
    bloomIntensity,
    radius,
    cutoff,
    edgeBlur,
    curvature,
    curvatureX,
    curvatureY,
    multisampling,
    vignette,
    vignetteIntensity,
    vignetteRadius,
    switchOn,
    switchOnWarmUpDelay,
    switchOnDuration,
    switchOnOvershoot,
    switchOnCastHue,
    switchOnCastStrength,
    switchOnOverscan,
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
  ]);

  useEffect(() => {
    for (const filter of filters) {
      if (filter instanceof SwitchOnFilter) {
        if (switchOnPaused) {
          filter.elapsed = switchOnElapsed;
        } else {
          filter.restart();
        }
      }
    }
  }, [filters, switchOnKey, switchOnPaused, switchOnElapsed]);

  return filters;
};
