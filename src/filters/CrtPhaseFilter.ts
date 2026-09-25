import type {
  FilterSystem,
  RenderTexture,
  Texture,
  UniformData,
} from "pixi.js";

import { defaultFilterVert, Filter, GlProgram } from "pixi.js";

import { replacePlaceholders } from "../utils/replacePlaceholders";

export type CrtPhaseFilterOptions = {
  /** names the gl program, for debugging */
  name: string;
  /** the phase's fragment shader, with {{PLACEHOLDERS}} for its defines */
  fragment: string;
  /** values for the fragment's placeholders - which stages are compiled in, and their constants */
  defines: Record<string, boolean | number>;
  /** the uniforms of every stage that is compiled in */
  uniforms: Record<string, UniformData>;
};

/**
 * One pass of the CRT effect, carrying out several stages in a single fragment shader. Only the
 * stages that are turned on are compiled in, so a stage that is turned off costs nothing.
 */
export class CrtPhaseFilter extends Filter {
  /** every stage's uniforms, by the name its glsl declares - set these to change a stage live */
  public uniforms: Record<string, unknown>;

  #resolution: Float32Array;

  constructor({ name, fragment, defines, uniforms }: CrtPhaseFilterOptions) {
    const glProgram = GlProgram.from({
      vertex: defaultFilterVert,
      fragment: replacePlaceholders(fragment, defines),
      name,
    });

    const resolution = new Float32Array(2);

    super({
      glProgram,
      resources: {
        phaseUniforms: {
          uResolution: { value: resolution, type: "vec2<f32>" },
          ...uniforms,
        },
      },
    });

    this.uniforms = this.resources.phaseUniforms.uniforms;
    this.#resolution = resolution;
  }

  override apply(
    filterSystem: FilterSystem,
    input: Texture,
    output: RenderTexture,
    clearMode: boolean,
  ): void {
    this.#resolution[0] = input.frame.width;
    this.#resolution[1] = input.frame.height;
    super.apply(filterSystem, input, output, clearMode);
  }
}
