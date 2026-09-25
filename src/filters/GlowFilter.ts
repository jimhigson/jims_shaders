import type { UniformData } from "pixi.js";

import { CrtPhaseFilter } from "./CrtPhaseFilter";
import fragment from "./glow.frag";
import {
  type BloomFilterOptions,
  bloomUniforms,
} from "./stages/BloomFilterOptions";
import {
  type RaiseBlackPointFilterOptions,
  raiseBlackPointUniforms,
} from "./stages/RaiseBlackPointFilterOptions";
import {
  type VignetteFilterOptions,
  vignetteUniforms,
} from "./stages/VignetteFilterOptions";

/** Each stage's options, or false (or left out) to leave that stage out */
export type GlowFilterOptions = {
  bloom?: BloomFilterOptions | false;
  vignette?: false | VignetteFilterOptions;
  raiseBlackPoint?: false | RaiseBlackPointFilterOptions;
};

/**
 * The light of the lit phosphors: bright areas glowing into their surroundings, the fall-off
 * towards the edges of the screen, and the glow that keeps the tube from ever being fully black.
 */
export class GlowFilter extends CrtPhaseFilter {
  constructor({ bloom, vignette, raiseBlackPoint }: GlowFilterOptions = {}) {
    const uniforms: Record<string, UniformData> = {
      ...(bloom ? bloomUniforms(bloom) : {}),
      ...(vignette ? vignetteUniforms(vignette) : {}),
      ...(raiseBlackPoint ? raiseBlackPointUniforms(raiseBlackPoint) : {}),
    };

    super({
      name: "glow-filter",
      fragment,
      defines: {
        BLOOM: Boolean(bloom),
        VIGNETTE: Boolean(vignette),
        RAISE_BLACK_POINT: Boolean(raiseBlackPoint),
      },
      uniforms,
    });
  }
}
