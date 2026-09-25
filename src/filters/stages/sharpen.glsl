// Needs signalAt(coord) defined before it is included: the signal as it stands before
// sharpening, since the peaking reads the signal either side of each point

uniform float uSharpenAmount;      // Strength of the high frequency boost
uniform float uSharpenRadius;      // Distance to the peaking taps, in output pixels
uniform float uSharpenAsymmetry;   // Balance of the boost between the leading and trailing tap
uniform float uSharpenSignalBlur;  // How far the signal is band-limited before the boost is applied

// Weights of the analogue luminance signal the peaking circuit acted on
const vec3 sharpenLuma = vec3(0.299, 0.587, 0.114);

vec4 sharpenSampleAt(vec2 coord) {
    return signalAt(clamp(coord, uInputClamp.xy, uInputClamp.zw));
}

vec4 sharpen(vec2 coord) {
    vec4 colour = signalAt(coord);

    float tap = uSharpenRadius / uResolution.x;
    float leadingWeight = 0.5 * (1.0 - uSharpenAsymmetry);
    float trailingWeight = 0.5 * (1.0 + uSharpenAsymmetry);

    vec4 leadingSample = sharpenSampleAt(coord - vec2(tap, 0.0));
    vec4 trailingSample = sharpenSampleAt(coord + vec2(tap, 0.0));

    float centre = dot(colour.rgb, sharpenLuma);
    float leading = dot(leadingSample.rgb, sharpenLuma);
    float trailing = dot(trailingSample.rgb, sharpenLuma);

    // High-pass taken along the scan direction only, since a raster has no continuous
    // vertical signal to boost. Unequal arm weights put more of the ringing on the
    // trailing side of an edge, as the group delay of a peaking circuit does
    float peaking = centre - ((leading * leadingWeight) + (trailing * trailingWeight));

    // The signal reaching the tube has already lost its highest frequencies, which is
    // what the peaking is there to put back - so roll them off first, with a 1-2-1
    // kernel over the taps the peaking has taken anyway
    vec3 bandLimited = (leadingSample.rgb + (colour.rgb * 2.0) + trailingSample.rgb) * 0.25;
    vec3 signal = mix(colour.rgb, bandLimited, uSharpenSignalBlur);

    // Added equally to all three channels so that only the luminance is sharpened,
    // leaving the far lower bandwidth chroma alone. Clamping to alpha both keeps the
    // result valid premultiplied-alpha colour and clips the overshoot at white, as a
    // video amplifier driven past 100% does
    vec3 sharpened = signal + (uSharpenAmount * peaking * colour.a);

    return vec4(clamp(sharpened, 0.0, colour.a), colour.a);
}
