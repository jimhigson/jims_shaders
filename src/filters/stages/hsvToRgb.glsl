vec3 hsvToRgb(vec3 hsv) {
    vec3 k = mod(vec3(5.0, 3.0, 1.0) + (hsv.x * 6.0), 6.0);
    return hsv.z - (hsv.z * hsv.y * clamp(min(k, 4.0 - k), 0.0, 1.0));
}
