#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uElapsed;      // Milliseconds since the set was switched on
uniform float uWarmUpDelay;  // Milliseconds the heaters take before there is any emission at all
uniform float uDuration;     // Milliseconds the picture then takes to come up
uniform float uOvershoot;    // How far past its final brightness the picture goes before settling
uniform float uCastHue;      // Hue of the colour cast while the guns are still warming
uniform float uCastStrength; // How strong that cast is when the picture first appears
uniform float uOverscan;     // How far oversized the raster starts, as a fraction of the screen
uniform float uScaleOvershoot; // How far below final size the raster dips before settling

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

vec3 hsvToRgb(vec3 hsv) {
    vec3 k = mod(vec3(5.0, 3.0, 1.0) + (hsv.x * 6.0), 6.0);
    return hsv.z - (hsv.z * hsv.y * clamp(min(k, 4.0 - k), 0.0, 1.0));
}

void main() {
    float progress = clamp((uElapsed - uWarmUpDelay) / uDuration, 0.0, 1.0);

    // The cathodes reach emission temperature gradually, so the picture eases in at
    // both ends rather than ramping linearly
    float emission = smoothstep(0.0, 1.0, progress);

    // The beam limiter and the supplies have not settled by the time there is a picture,
    // so it comes up too bright and then falls back
    float fromPeak = (progress - 0.7) / 0.18;
    float settling = exp(-(fromPeak * fromPeak));
    float gain = emission + (uOvershoot * settling);

    // Until the EHT is up the raster is oversized, shrinking onto the screen as it settles - then,
    // like the brightness, the EHT overshoots before the supplies regulate it, so the raster dips
    // below its final size before settling back
    float scale = 1.0 + (uOverscan * (1.0 - emission)) - (uScaleOvershoot * settling);
    vec2 visibleCentre = (uInputClamp.xy + uInputClamp.zw) * 0.5;
    vec2 coord = visibleCentre + ((vTextureCoord - visibleCentre) / scale);

    vec4 colour = texture(uTexture, clamp(coord, uInputClamp.xy, uInputClamp.zw));

    // The three guns do not warm at the same rate, so the picture arrives off-colour and
    // works its way back to neutral
    float castAmount = uCastStrength * (1.0 - progress) * (1.0 - progress);
    vec3 tint = mix(vec3(1.0), hsvToRgb(vec3(fract(uCastHue / 360.0), 1.0, 1.0)), castAmount);

    vec3 lit = colour.rgb * gain * tint;

    finalColor = vec4(clamp(lit, 0.0, colour.a), colour.a);
}
