#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uGamma;        // Gamma correction
uniform float uSaturation;   // Color saturation
uniform float uBrightness;   // Brightness (0.0 to 2.0)
uniform float uPhosphorExpansion;  // How far colours are pushed out from the neutral axis
uniform float uPhosphorRedExtra;   // How much further than that the red channel is pushed
uniform float uWarmth;             // Tilt of the white point towards red and away from blue

out vec4 finalColor;

void main() {
    vec3 colour = texture(uTexture, vTextureCoord).rgb;
    
    // Apply brightness adjustment
    colour *= uBrightness;
    
    // Tilt the white point. A set's own is cool, but the cool floor and the out-of-gamut
    // red primary both pull a picture cool, so this pulls the balance back - at the cost of
    // warming the greys, which is what any temperature control does
    colour *= vec3(1.0 + uWarmth, 1.0, 1.0 - uWarmth);

    // Push colours away from the neutral axis, red furthest, standing in for phosphor
    // primaries that sit well outside sRGB - the red one especially. Anchored on the
    // neutral axis, so white and grey do not move at all and only colour that is already
    // saturated goes anywhere
    float neutral = dot(colour, vec3(0.299, 0.587, 0.114));
    vec3 expansion = vec3(
        uPhosphorExpansion + uPhosphorRedExtra,
        uPhosphorExpansion,
        uPhosphorExpansion
    );
    colour += expansion * (colour - neutral);

    // Apply saturation adjustment
    float luminance = dot(colour, vec3(0.299, 0.587, 0.114));
    vec3 grayscale = vec3(luminance);
    colour = mix(grayscale, colour, uSaturation);
    
    // Apply gamma correction
    colour = pow(colour, vec3(1.0 / uGamma));
    
    finalColor = vec4(colour, 1.0);
}