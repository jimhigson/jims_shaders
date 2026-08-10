#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uElapsed;       // Milliseconds since the set was switched on
uniform float uWarmUpDelay;   // Milliseconds the heaters take before there is any emission at all
uniform float uRiseDuration;  // Milliseconds the picture then takes to reach its brightest, most bloomed point
uniform float uDecayDuration; // Milliseconds the picture then takes to settle from that peak
uniform float uOvershoot;     // How far past its final brightness the picture peaks before settling
uniform float uCastHue;       // Hue of the colour cast while the guns are still warming
uniform float uCastStrength;  // How strong that cast is when the picture first appears
uniform float uOverscan;      // How far oversized the raster starts, as a fraction of the screen
uniform float uBloomAmount;   // How much further the raster grows at the brightness peak (blooming)
uniform float uScanlinesPixelHeight;   // Height of scanline virtual pixels, matching ScanlinesFilter
uniform float uScanlinesGapBrightness; // Brightness of scanline gaps, matching ScanlinesFilter
uniform vec2 uResolution;     // Screen resolution, for the scanlines
uniform float uDegaussAmount; // How far the degauss coil's decaying field displaces the picture
uniform float uDegaussDecay;  // Milliseconds the degauss ripple takes to decay away
uniform float uRollAmount;    // How far the cold vertical oscillator's hunting displaces the picture
uniform float uRollDecay;     // Milliseconds the vertical roll takes to settle as the oscillator locks

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

#include scanlinesPattern.glsl;

vec3 hsvToRgb(vec3 hsv) {
    vec3 k = mod(vec3(5.0, 3.0, 1.0) + (hsv.x * 6.0), 6.0);
    return hsv.z - (hsv.z * hsv.y * clamp(min(k, 4.0 - k), 0.0, 1.0));
}

void main() {
    // milliseconds since the picture started appearing - negative during warm-up
    float t = uElapsed - uWarmUpDelay;

    // The cathodes reach emission temperature gradually, so the picture eases up to its
    // steady-state level rather than ramping linearly, then stays there
    float rise = smoothstep(0.0, 1.0, clamp(t / uRiseDuration, 0.0, 1.0));
    // The beam limiter and the supplies have not settled by the time there is a picture,
    // so brightness (and, by the same rising beam current, the raster size - see below)
    // overshoot before falling back. This envelope is 0 before the peak, 1 exactly at it
    // (t = uRiseDuration), and 0 again once settled - shared by both, rather than each
    // being animated as an independent curve
    float decay = smoothstep(0.0, 1.0, clamp((t - uRiseDuration) / uDecayDuration, 0.0, 1.0));
    float overshootEnvelope = rise * (1.0 - decay);

    float gain = rise + (uOvershoot * overshootEnvelope);

    // A fast, self-damping ripple from the degaussing coil's decaying field just after
    // switch-on, and separately the cold vertical oscillator hunting for lock as its
    // timing drifts with temperature - both decaying oscillations, not smooth eases, and
    // on their own independent (and much shorter) clocks from the rise/decay above
    float degaussEnvelope = exp(-max(t, 0.0) / uDegaussDecay);
    float degaussWobble = sin(t * 0.09) * uDegaussAmount * degaussEnvelope;
    float rollEnvelope = exp(-max(t, 0.0) / uRollDecay);
    float rollWobble = sin(t * 0.021) * uRollAmount * rollEnvelope;

    // Until the EHT is up the raster is oversized, shrinking onto the screen as it settles.
    // Blooming then grows it again at the brightness peak - the same beam-current rise that
    // overshoots the brightness also loads the high voltage and expands the raster - before
    // both shrink back to their resting size together as the tube finishes settling
    float scale = 1.0 + (uOverscan * (1.0 - rise)) + (uBloomAmount * overshootEnvelope);
    vec2 visibleCentre = (uInputClamp.xy + uInputClamp.zw) * 0.5;
    vec2 coord = visibleCentre + ((vTextureCoord - visibleCentre) / scale);
    coord.x += degaussWobble;
    coord.y += rollWobble;
    coord = clamp(coord, uInputClamp.xy, uInputClamp.zw);

    vec4 picture = texture(uTexture, coord);

    // scanlines render here, in the same raster-scaled coordinate space the picture itself
    // is sampled in, so they shrink and wobble onto the screen with the raster rather than
    // staying screen-space-fixed the way the (separately-applied) phosphor mask does - the
    // standalone ScanlinesFilter is left out of the chain while this filter is active
    vec3 colour = applyScanlines(
        uTexture,
        coord,
        picture.rgb,
        uResolution,
        uScanlinesPixelHeight,
        uScanlinesGapBrightness,
        uInputClamp
    );

    // The three guns do not warm at the same rate, so the picture arrives off-colour and
    // works its way back to neutral
    float castAmount = uCastStrength * (1.0 - rise) * (1.0 - rise);
    vec3 tint = mix(vec3(1.0), hsvToRgb(vec3(fract(uCastHue / 360.0), 1.0, 1.0)), castAmount);

    vec3 lit = colour * gain * tint;

    finalColor = vec4(clamp(lit, 0.0, picture.a), picture.a);
}
