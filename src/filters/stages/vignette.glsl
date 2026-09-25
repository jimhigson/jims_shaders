uniform float uVignetteIntensity; // Vignette effect (-1.0 to 1.0, negative = brighten center)
uniform float uVignetteRadius;    // Vignette radius (0.0 to 2.0)

vec3 applyVignette(vec3 colour, vec2 coord) {
    // Calculate the center of the visible area using Pixi's input clamp
    vec2 visibleCenter = (uInputClamp.xy + uInputClamp.zw) * 0.5;

    // Calculate position relative to the actual visible center
    vec2 centered = coord - visibleCenter;

    // Scale the distance calculation to account for the visible area size
    vec2 visibleSize = uInputClamp.zw - uInputClamp.xy;
    centered = centered / visibleSize;

    // Calculate distance from center (0 to ~1.414 at corners)
    float dist = length(centered) * 2.0;

    float falloff = dist / uVignetteRadius;

    float vignetteFactor = clamp(1.0 - falloff, 0.0, 1.0);

    // multiply the rgb colour by 0..1 to darken it
    return colour * mix(1.0 - uVignetteIntensity, 1.0, vignetteFactor);
}
