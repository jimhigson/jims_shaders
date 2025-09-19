#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uIntensity; // Vignette effect (-1.0 to 1.0, negative = brighten center)
uniform float uRadius;    // Vignette radius (0.0 to 2.0)
uniform float uSoftness;  // Vignette edge softness (0.0 = hard edge, 1.0 = very soft)

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
    
    // Use a higher power for smoother, more gradual falloff
    // pow(dist, 6) starts very slowly and accelerates rapidly
    // This creates a more natural, less obvious transition
    float falloff = pow(dist / uRadius, 6.0);
    
    // Apply softness to control the transition smoothness
    // Higher softness = more gradual transition
    float vignetteFactor = 1.0 - smoothstep(0.0, uSoftness, falloff);
    
    // Apply the vignette effect
    // When intensity > 0: darkens edges (traditional vignette)
    // When intensity < 0: brightens center (negative vignette/spotlight)
    // vignetteFactor is 1 at center, 0 at edges
    
    if (uIntensity > 0.0) {
        // Traditional darkening vignette
        colour *= mix(1.0 - uIntensity, 1.0, vignetteFactor);
    } else {
        // Negative vignette - brighten the center
        // Use multiplication to amplify existing bright areas
        float brightnessFactor = 1.0 + (-uIntensity * vignetteFactor);
        colour *= brightnessFactor;
    }
    
    finalColor = vec4(colour, 1.0);
}