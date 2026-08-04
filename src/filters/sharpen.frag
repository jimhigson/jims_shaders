#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uAmount;      // Strength of the high frequency boost
uniform float uRadius;      // Distance to the peaking taps, in output pixels
uniform float uAsymmetry;   // Balance of the boost between the leading and trailing tap
uniform float uSignalBlur;  // How far the signal is band-limited before the boost is applied
uniform vec2 uResolution;   // Screen resolution

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

// Weights of the analogue luminance signal the peaking circuit acted on
const vec3 rec601Luma = vec3(0.299, 0.587, 0.114);

vec4 sampleAt(vec2 coord) {
    return texture(uTexture, clamp(coord, uInputClamp.xy, uInputClamp.zw));
}

void main() {
    vec4 colour = texture(uTexture, vTextureCoord);

    float tap = uRadius / uResolution.x;
    float leadingWeight = 0.5 * (1.0 - uAsymmetry);
    float trailingWeight = 0.5 * (1.0 + uAsymmetry);

    vec4 leadingSample = sampleAt(vTextureCoord - vec2(tap, 0.0));
    vec4 trailingSample = sampleAt(vTextureCoord + vec2(tap, 0.0));

    float centre = dot(colour.rgb, rec601Luma);
    float leading = dot(leadingSample.rgb, rec601Luma);
    float trailing = dot(trailingSample.rgb, rec601Luma);

    // High-pass taken along the scan direction only, since a raster has no continuous
    // vertical signal to boost. Unequal arm weights put more of the ringing on the
    // trailing side of an edge, as the group delay of a peaking circuit does
    float peaking = centre - ((leading * leadingWeight) + (trailing * trailingWeight));

    // The signal reaching the tube has already lost its highest frequencies, which is
    // what the peaking is there to put back - so roll them off first, with a 1-2-1
    // kernel over the taps the peaking has taken anyway
    vec3 bandLimited = (leadingSample.rgb + (colour.rgb * 2.0) + trailingSample.rgb) * 0.25;
    vec3 signal = mix(colour.rgb, bandLimited, uSignalBlur);

    // Added equally to all three channels so that only the luminance is sharpened,
    // leaving the far lower bandwidth chroma alone. Clamping to alpha both keeps the
    // result valid premultiplied-alpha colour and clips the overshoot at white, as a
    // video amplifier driven past 100% does
    vec3 sharpened = signal + (uAmount * peaking * colour.a);

    finalColor = vec4(clamp(sharpened, 0.0, colour.a), colour.a);
}
