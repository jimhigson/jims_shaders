#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uIntensity; // Vignette effect (-1.0 to 1.0, negative = brighten center)
uniform float uRadius;    // Vignette radius (0.0 to 2.0)

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

void main() {
    vec3 colour = texture(uTexture, vTextureCoord).rgb;
    
    // Calculate the center of the visible area using Pixi's input clamp
    vec2 visibleCenter = (uInputClamp.xy + uInputClamp.zw) * 0.5;
    
    // Calculate position relative to the actual visible center
    vec2 centered = vTextureCoord - visibleCenter;
    
    // Scale the distance calculation to account for the visible area size
    vec2 visibleSize = uInputClamp.zw - uInputClamp.xy;
    centered = centered / visibleSize;
    
    // Calculate distance from center (0 to ~1.414 at corners)
    float dist = length(centered) * 2.0;
    
    float falloff = dist / uRadius;

    float vignetteFactor = clamp(1.0 - falloff, 0.0, 1.0);
    
    // multiply the rgb colour by 0..1 to darken it
    colour *= mix(1.0 - uIntensity, 1.0, vignetteFactor);
    
    
    finalColor = vec4(colour, 1.0);
}