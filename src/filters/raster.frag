#version 300 es
precision mediump float;

// Injected stage toggles
#define SCANLINES {{SCANLINES}}
#define PHOSPHOR_MASK {{PHOSPHOR_MASK}}
#define FLICKER {{FLICKER}}
#define PHOSPHOR_MASK_SAMPLES {{PHOSPHOR_MASK_SAMPLES}}

in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform vec2 uResolution;   // Screen resolution

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

#if SCANLINES
uniform float uScanlinesPixelHeight;   // Height of virtual pixels in output pixels
uniform float uScanlinesGapBrightness; // Brightness of dark bands (0.0 to 1.0)
#include stages/scanlinesPattern.glsl;
#endif

#if PHOSPHOR_MASK
#include stages/phosphorMask.glsl;
#endif

#if FLICKER
#include stages/flicker.glsl;
#endif

void main() {
    vec4 colour = texture(uTexture, vTextureCoord);

    #if SCANLINES
        colour = vec4(
            clamp(
                applyScanlines(
                    uTexture,
                    vTextureCoord,
                    colour.rgb,
                    uResolution,
                    uScanlinesPixelHeight,
                    uScanlinesGapBrightness,
                    uInputClamp
                ),
                0.0,
                1.0
            ),
            1.0
        );
    #endif

    #if PHOSPHOR_MASK
        colour = vec4(clamp(applyPhosphorMask(colour.rgb, vTextureCoord), 0.0, 1.0), 1.0);
    #endif

    #if FLICKER
        colour = applyFlicker(colour);
    #endif

    finalColor = colour;
}
