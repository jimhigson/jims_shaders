#version 300 es
precision mediump float;

// Injected stage toggles
#define BLOOM {{BLOOM}}
#define VIGNETTE {{VIGNETTE}}
#define RAISE_BLACK_POINT {{RAISE_BLACK_POINT}}

in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform vec2 uResolution;   // Screen resolution

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

#if BLOOM
#include stages/bloom.glsl;
#endif

#if VIGNETTE
#include stages/vignette.glsl;
#endif

#if RAISE_BLACK_POINT
#include stages/hsvToRgb.glsl;
#include stages/raiseBlackPoint.glsl;
#endif

void main() {
    vec4 colour = texture(uTexture, vTextureCoord);

    #if BLOOM
        colour = vec4(clamp(applyBloom(colour.rgb, vTextureCoord), 0.0, 1.0), 1.0);
    #endif

    #if VIGNETTE
        colour = vec4(clamp(applyVignette(colour.rgb, vTextureCoord), 0.0, 1.0), 1.0);
    #endif

    #if RAISE_BLACK_POINT
        colour = applyRaiseBlackPoint(colour, vTextureCoord);
    #endif

    finalColor = colour;
}
