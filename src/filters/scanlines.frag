#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uPixelHeight;  // Height of virtual pixels in output pixels
uniform vec2 uResolution;    // Screen resolution
uniform float uGapBrightness;  // Brightness of dark bands (0.0 to 1.0)

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

#include scanlinesPattern.glsl;

void main() {
    vec3 colour = texture(uTexture, vTextureCoord).rgb;

    vec3 outputColour = applyScanlines(
        uTexture,
        vTextureCoord,
        colour,
        uResolution,
        uPixelHeight,
        uGapBrightness,
        uInputClamp
    );

    finalColor = vec4(outputColour, 1.0);
}
