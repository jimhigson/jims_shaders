#version 300 es
precision mediump float;

// Injected stage toggles
#define COLOR_ADJUSTMENT {{COLOR_ADJUSTMENT}}
#define NOISE {{NOISE}}
#define SHARPEN {{SHARPEN}}

in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform vec2 uResolution;   // Screen resolution

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

#if COLOR_ADJUSTMENT
#include stages/colorAdjustment.glsl;
#endif

#if NOISE
#include stages/noise.glsl;
#endif

// The video signal at coord, as it stands before the set's peaking sharpens it
vec4 signalAt(vec2 coord) {
    vec4 colour = texture(uTexture, coord);

    #if COLOR_ADJUSTMENT
        colour = vec4(clamp(colorAdjust(colour.rgb), 0.0, 1.0), 1.0);
    #endif

    #if NOISE
        colour = vec4(addNoise(colour.rgb, coord), colour.a);
    #endif

    return colour;
}

#if SHARPEN
#include stages/sharpen.glsl;
#endif

void main() {
    #if SHARPEN
        finalColor = sharpen(vTextureCoord);
    #else
        finalColor = signalAt(vTextureCoord);
    #endif
}
