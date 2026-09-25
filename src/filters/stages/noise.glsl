uniform float uNoiseIntensity;
uniform float uNoisePixelHeight;
uniform float uNoiseWidthRatio;
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

    // position within the visible area, in output pixels - the same space the scanlines use
    vec2 pixel = (coord - uInputClamp.xy) / (uInputClamp.zw - uInputClamp.xy) * uResolution;
    // one scanline tall, streaked along the beam's direction of travel
    vec2 grainSize = vec2(uNoisePixelHeight * uNoiseWidthRatio, uNoisePixelHeight);
    // rows stay on the scanline grid; only where streaks start along a row moves each frame
    float streakOffset = fract(uFrameNumber * 0.618) * grainSize.x;
    vec2 grain = floor((pixel + vec2(streakOffset, 0.0)) / grainSize);

    vec3 rgbNoise = hash32(grain + mod(uFrameNumber, 1000.0) * vec2(1.618, 2.718));

    // Keep original value if >= 0.7, otherwise set to 0 (not all pixels have noise in all channels)
    rgbNoise = rgbNoise * step(vec3(0.7), rgbNoise);

    // Add noise and clamp to valid range [0.0, 1.0]
    return clamp(colour + rgbNoise * uNoiseIntensity, 0.0, 1.0);
}
