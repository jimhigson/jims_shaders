uniform float uNoiseIntensity;
uniform float uNoiseScale;
uniform float uNoiseFPS;
uniform float uNoiseTime;

///  3 out, 2 in...
vec3 hash32(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

// Adds this frame's noise to colour at coord, which fixes where the noise grain falls
vec3 addNoise(vec3 colour, vec2 coord) {
    float period = (1000.0/uNoiseFPS);
    float uFrameNumber = floor(uNoiseTime / period) * period;

    vec2 uv = coord * (uInputClamp.zw - uInputClamp.xy); // Scale to texture size
    // adjust the scale uniform given to be half the size for every unit increase
    float scale10 = pow(0.5, (uNoiseScale + 7.0));
    // change the square pixels to be wider than they are tall (scanlines)
    vec2 scale10BiasedHoriz = vec2(scale10 * 16.0, scale10);
    // round the uv coords to the nearest "pixel" center. Adding fract(uTime) randomises
    // where the pixels start so it isn't on a strict grid:
    vec2 uvRounded = floor(uv / scale10BiasedHoriz + fract(uFrameNumber)) * scale10BiasedHoriz;

    vec3 rgbNoise = hash32( uvRounded * (uFrameNumber + 1000.0));

    // Keep original value if >= 0.7, otherwise set to 0 (not all pixels have noise in all channels)
    rgbNoise = rgbNoise * step(vec3(0.7), rgbNoise);

    // Add noise and clamp to valid range [0.0, 1.0]
    return clamp(colour + rgbNoise * uNoiseIntensity, 0.0, 1.0);
}
