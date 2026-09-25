uniform float uFlickerBrightness;  // How lit the phosphors are this frame, worked out on the way in

vec4 applyFlicker(vec4 colour) {
    // Clamping to alpha keeps the result valid premultiplied-alpha colour
    return vec4(clamp(colour.rgb * uFlickerBrightness, 0.0, colour.a), colour.a);
}
