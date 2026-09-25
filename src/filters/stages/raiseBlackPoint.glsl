// Needs hsvToRgb.glsl included before it

uniform float uRaiseBlackPointBlackPoint;    // Lift applied everywhere, including the centre of the dome
uniform vec2 uRaiseBlackPointDomeCentre;     // Centre of the dome, in 0..1 of the visible area
uniform float uRaiseBlackPointDomeRadius;    // Distance from the centre at which the full extra lift is reached
uniform float uRaiseBlackPointDomeEdgeLift;  // Extra lift added on top of the black point at the dome radius
uniform float uRaiseBlackPointDomeFalloff;   // Falloff exponent - 2.0 is quadratic, higher flattens the middle
uniform float uRaiseBlackPointDomeSuperellipse; // Shape of the dome's contours - 2.0 is an ellipse, higher is a rounded rectangle
uniform float uRaiseBlackPointLiftHue;       // Hue of the lift, in degrees around the colour wheel
uniform float uRaiseBlackPointLiftSaturation;// Saturation of the lift, 0 for a neutral grey lift

/**
 * Half a step of 8-bit colour either way, fixed to each screen pixel, so the slow gradient of
 * the lift is broken up rather than stepping into bands - and, being fixed, it never shimmers.
 * Interleaved gradient noise, worked at high precision since screen coordinates run large.
 */
float ditherOffset() {
    highp vec2 pixel = gl_FragCoord.xy;
    highp float noise = fract(52.9829189 * fract(dot(pixel, vec2(0.06711056, 0.00583715))));
    return (noise - 0.5) / 255.0;
}

vec4 applyRaiseBlackPoint(vec4 colour, vec2 coord) {
    vec2 visibleMin = uInputClamp.xy;
    vec2 visibleSize = uInputClamp.zw - uInputClamp.xy;

    // Position within the visible area, normalised so that the centre is at the
    // origin and the edge midpoints are at a distance of 1. Deliberately not
    // corrected for aspect ratio, so the dome follows the shape of the screen
    // rather than being inscribed in it.
    vec2 centred = abs(((coord - visibleMin) / visibleSize) - uRaiseBlackPointDomeCentre) * 2.0;

    // Superellipse distance, ie the p-norm of the position: at p = 2 this is the
    // euclidean length and the contours are ellipses, and as p rises the corners
    // push outwards until the contours are rectangles with rounded corners
    float dist = pow(
        pow(centred.x, uRaiseBlackPointDomeSuperellipse) + pow(centred.y, uRaiseBlackPointDomeSuperellipse),
        1.0 / uRaiseBlackPointDomeSuperellipse
    );

    float dome = pow(clamp(dist / uRaiseBlackPointDomeRadius, 0.0, 1.0), uRaiseBlackPointDomeFalloff);
    float lift = uRaiseBlackPointBlackPoint + (uRaiseBlackPointDomeEdgeLift * dome);

    // Value of 1 so that the hue's brightest channel lifts by the full amount, and
    // saturating pulls the other channels down from there
    vec3 tint = hsvToRgb(vec3(fract(uRaiseBlackPointLiftHue / 360.0), uRaiseBlackPointLiftSaturation, 1.0));

    // Scaling the lift by alpha keeps the result valid premultiplied-alpha colour
    // (rgb never exceeds a) so that alpha itself can be passed through untouched
    vec3 lifted = colour.rgb * (1.0 - lift) + (lift * tint * colour.a);
    // dithered by alpha too, staying valid premultiplied colour
    vec3 dithered = clamp(lifted + (ditherOffset() * colour.a), 0.0, colour.a);
    return vec4(dithered, colour.a);
}
