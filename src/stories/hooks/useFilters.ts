import { useMemo } from "react";

import type { CRTFiltersProps } from "../CRTFilters.stories";

import { crtFilters } from "../../filters/crtFilters";

export const useFilters = ({
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
  intensity,
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
      bloom: bloom ? { intensity, radius, cutoff, edgeBlur } : false,
      curvature: curvature ? { curvatureX, curvatureY, multisampling } : false,
      vignette:
        vignette ?
          { intensity: vignetteIntensity, radius: vignetteRadius }
        : false,
      colorAdjustment:
        colorAdjustment ? { gamma, saturation, brightness } : false,
    });
  }, [
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
    intensity,
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
