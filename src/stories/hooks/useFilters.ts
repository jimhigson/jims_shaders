import { useMemo } from "react";

import type { CRTFiltersProps } from "../CRTFilters.stories";

import { crtFilters } from "../../filters/crtFilters";

export const useFilters = ({
  noise,
  noiseIntensity,
  noiseScale,
  noiseFPS,
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
  colorAdjustment,
  gamma,
  saturation,
  brightness,
}: CRTFiltersProps) => {
  return useMemo(() => {
    return crtFilters({
      noise:
        noise ?
          { intensity: noiseIntensity, scale: noiseScale, fps: noiseFPS }
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
      colorAdjustment:
        colorAdjustment ? { gamma, saturation, brightness } : false,
    });
  }, [
    noise,
    noiseIntensity,
    noiseScale,
    noiseFPS,
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
    colorAdjustment,
    gamma,
    saturation,
    brightness,
  ]);
};
