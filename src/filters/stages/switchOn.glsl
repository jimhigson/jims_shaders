// Needs scanlinesPattern.glsl and hsvToRgb.glsl included before it

uniform float uSwitchOnElapsed;       // Milliseconds since the set was switched on
uniform float uSwitchOnWarmUpDelay;   // Milliseconds the heaters take before there is any emission at all
uniform float uSwitchOnRiseDuration;  // Milliseconds the picture then takes to reach its brightest, most bloomed point
uniform float uSwitchOnDecayDuration; // Milliseconds the picture then takes to settle from that peak
uniform float uSwitchOnOvershoot;     // How far past its final brightness the picture peaks before settling
uniform float uSwitchOnCastHue;       // Hue of the colour cast while the guns are still warming
uniform float uSwitchOnCastStrength;  // How strong that cast is when the picture first appears
uniform float uSwitchOnOverscan;      // How far oversized the raster starts, as a fraction of the screen
uniform float uSwitchOnBloomAmount;   // How much further the raster grows at the brightness peak (blooming)
uniform float uSwitchOnScanlinesPixelHeight;   // Height of scanline virtual pixels
uniform float uSwitchOnScanlinesGapBrightness; // Brightness of scanline gaps
uniform float uSwitchOnDegaussAmount; // How far the degauss coil's decaying field displaces the picture
uniform float uSwitchOnDegaussDecay;  // Milliseconds the degauss ripple takes to decay away
uniform float uSwitchOnRollAmount;    // How far the cold vertical oscillator's hunting displaces the picture
uniform float uSwitchOnRollDecay;     // Milliseconds the vertical roll takes to settle as the oscillator locks

// The picture as the tube is drawing it at coord, part way through coming up to temperature
vec4 switchOnAt(vec2 screenCoord) {
    // milliseconds since the picture started appearing - negative during warm-up
    float t = uSwitchOnElapsed - uSwitchOnWarmUpDelay;

    // The cathodes reach emission temperature gradually, so the picture eases up to its
    // steady-state level rather than ramping linearly, then stays there
    float rise = smoothstep(0.0, 1.0, clamp(t / uSwitchOnRiseDuration, 0.0, 1.0));
    // The beam limiter and the supplies have not settled by the time there is a picture,
    // so brightness (and, by the same rising beam current, the raster size - see below)
    // overshoot before falling back. This envelope is 0 before the peak, 1 exactly at it
    // (t = uSwitchOnRiseDuration), and 0 again once settled - shared by both, rather than each
    // being animated as an independent curve
    float decay = smoothstep(0.0, 1.0, clamp((t - uSwitchOnRiseDuration) / uSwitchOnDecayDuration, 0.0, 1.0));
    float overshootEnvelope = rise * (1.0 - decay);

    float gain = rise + (uSwitchOnOvershoot * overshootEnvelope);

    // A fast, self-damping ripple from the degaussing coil's decaying field just after
    // switch-on, and separately the cold vertical oscillator hunting for lock as its
    // timing drifts with temperature - both decaying oscillations, not smooth eases, and
    // on their own independent (and much shorter) clocks from the rise/decay above
    float degaussEnvelope = exp(-max(t, 0.0) / uSwitchOnDegaussDecay);
    float degaussWobble = sin(t * 0.09) * uSwitchOnDegaussAmount * degaussEnvelope;
    float rollEnvelope = exp(-max(t, 0.0) / uSwitchOnRollDecay);
    float rollWobble = sin(t * 0.021) * uSwitchOnRollAmount * rollEnvelope;

    // Until the EHT is up the raster is oversized, shrinking onto the screen as it settles.
    // Blooming then grows it again at the brightness peak - the same beam-current rise that
    // overshoots the brightness also loads the high voltage and expands the raster - before
    // both shrink back to their resting size together as the tube finishes settling
    float scale = 1.0 + (uSwitchOnOverscan * (1.0 - rise)) + (uSwitchOnBloomAmount * overshootEnvelope);
    vec2 visibleCentre = (uInputClamp.xy + uInputClamp.zw) * 0.5;
    vec2 coord = visibleCentre + ((screenCoord - visibleCentre) / scale);
    coord.x += degaussWobble;
    coord.y += rollWobble;
    coord = clamp(coord, uInputClamp.xy, uInputClamp.zw);

    vec4 picture = texture(uTexture, coord);

    // scanlines render here, in the same raster-scaled coordinate space the picture itself
    // is sampled in, so they shrink and wobble onto the screen with the raster rather than
    // staying screen-space-fixed the way the phosphor mask does
    vec3 colour = applyScanlines(
        uTexture,
        coord,
        picture.rgb,
        uResolution,
        uSwitchOnScanlinesPixelHeight,
        uSwitchOnScanlinesGapBrightness,
        uInputClamp
    );

    // The three guns do not warm at the same rate, so the picture arrives off-colour and
    // works its way back to neutral
    float castAmount = uSwitchOnCastStrength * (1.0 - rise) * (1.0 - rise);
    vec3 tint = mix(vec3(1.0), hsvToRgb(vec3(fract(uSwitchOnCastHue / 360.0), 1.0, 1.0)), castAmount);

    vec3 lit = colour * gain * tint;

    return vec4(clamp(lit, 0.0, picture.a), picture.a);
}
