#version 300 es
precision mediump float;

// Injected stage toggles
#define SWITCH_ON {{SWITCH_ON}}
#define ROUNDED_CORNERS {{ROUNDED_CORNERS}}
#define SCREEN_GEOMETRY {{SCREEN_GEOMETRY}}
#define COLOR_ADJUSTMENT {{COLOR_ADJUSTMENT}}
#define SCREEN_GEOMETRY_MULTISAMPLE {{SCREEN_GEOMETRY_MULTISAMPLE}}
#define SCREEN_GEOMETRY_LOAD_TAPS {{SCREEN_GEOMETRY_LOAD_TAPS}}

in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform vec2 uResolution;   // Screen resolution

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

#if SWITCH_ON
#include stages/scanlinesPattern.glsl;
#include stages/hsvToRgb.glsl;
#include stages/switchOn.glsl;
#endif

#if ROUNDED_CORNERS
#include stages/roundedCorners.glsl;
#endif

#if COLOR_ADJUSTMENT
#include stages/colorAdjustment.glsl;
#endif

// The picture at coord on the flat face of the tube, before the glass curves it
vec4 pictureAt(vec2 coord) {
    #if SWITCH_ON
        vec4 colour = switchOnAt(coord);
    #else
        vec4 colour = texture(uTexture, coord);
    #endif

    #if ROUNDED_CORNERS
        colour = vec4(colour.rgb * roundedCornersMask(coord), colour.a);
    #endif

    return colour;
}

#if SCREEN_GEOMETRY
#include stages/screenGeometry.glsl;
#endif

void main() {
    #if SCREEN_GEOMETRY
        vec4 colour = vec4(clamp(screenGeometryAt(vTextureCoord), 0.0, 1.0), 1.0);
    #else
        vec4 colour = pictureAt(vTextureCoord);
    #endif

    #if COLOR_ADJUSTMENT
        colour = vec4(colorAdjust(colour.rgb), 1.0);
    #endif

    finalColor = colour;
}
