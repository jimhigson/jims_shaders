uniform float uColorAdjustmentGamma;        // Gamma correction
uniform float uColorAdjustmentSaturation;   // Color saturation
uniform float uColorAdjustmentBrightness;   // Brightness (0.0 to 2.0)
uniform float uColorAdjustmentPhosphorExpansion;  // How far colours are pushed out from the neutral axis
uniform float uColorAdjustmentPhosphorRedExtra;   // How much further than that the red channel is pushed
uniform float uColorAdjustmentWarmth;             // Tilt of the white point towards red and away from blue

vec3 colorAdjust(vec3 colour) {
    // Apply brightness adjustment
    colour *= uColorAdjustmentBrightness;

    // Tilt the white point. A set's own is cool, but the cool floor and the out-of-gamut
    // red primary both pull a picture cool, so this pulls the balance back - at the cost of
    // warming the greys, which is what any temperature control does
    colour *= vec3(1.0 + uColorAdjustmentWarmth, 1.0, 1.0 - uColorAdjustmentWarmth);

    // Push colours away from the neutral axis, red furthest, standing in for phosphor
    // primaries that sit well outside sRGB - the red one especially. Anchored on the
    // neutral axis, so white and grey do not move at all and only colour that is already
    // saturated goes anywhere
    float neutral = dot(colour, vec3(0.299, 0.587, 0.114));
    vec3 expansion = vec3(
        uColorAdjustmentPhosphorExpansion + uColorAdjustmentPhosphorRedExtra,
        uColorAdjustmentPhosphorExpansion,
        uColorAdjustmentPhosphorExpansion
    );
    colour += expansion * (colour - neutral);

    // Apply saturation adjustment
    float luminance = dot(colour, vec3(0.299, 0.587, 0.114));
    vec3 grayscale = vec3(luminance);
    colour = mix(grayscale, colour, uColorAdjustmentSaturation);

    // Apply gamma correction
    return pow(colour, vec3(1.0 / uColorAdjustmentGamma));
}
