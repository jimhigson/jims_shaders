import { useMemo } from "react";

import type { CRTFiltersProps } from "../CRTFilters.stories";

import { crtFilters } from "../../filters/crtFilters";

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
}: CRTFiltersProps) => {
  return useMemo(() => {
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
};
