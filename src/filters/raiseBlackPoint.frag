#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uBlackPoint;    // Lift applied everywhere, including the centre of the dome
uniform vec2 uDomeCentre;     // Centre of the dome, in 0..1 of the visible area
uniform float uDomeRadius;    // Distance from the centre at which the full extra lift is reached
uniform float uDomeEdgeLift;  // Extra lift added on top of uBlackPoint at the dome radius
uniform float uDomeFalloff;   // Falloff exponent - 2.0 is quadratic, higher flattens the middle
uniform float uDomeSuperellipse; // Shape of the dome's contours - 2.0 is an ellipse, higher is a rounded rectangle
uniform float uLiftHue;       // Hue of the lift, in degrees around the colour wheel
uniform float uLiftSaturation;// Saturation of the lift, 0 for a neutral grey lift

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

vec3 hsvToRgb(vec3 hsv) {
    vec3 k = mod(vec3(5.0, 3.0, 1.0) + (hsv.x * 6.0), 6.0);
    return hsv.z - (hsv.z * hsv.y * clamp(min(k, 4.0 - k), 0.0, 1.0));
}

void main() {
    vec4 colour = texture(uTexture, vTextureCoord);

    vec2 visibleMin = uInputClamp.xy;
    vec2 visibleSize = uInputClamp.zw - uInputClamp.xy;

    // Position within the visible area, normalised so that the centre is at the
    // origin and the edge midpoints are at a distance of 1. Deliberately not
    // corrected for aspect ratio, so the dome follows the shape of the screen
    // rather than being inscribed in it.
    vec2 centred = abs(((vTextureCoord - visibleMin) / visibleSize) - uDomeCentre) * 2.0;

    // Superellipse distance, ie the p-norm of the position: at p = 2 this is the
    // euclidean length and the contours are ellipses, and as p rises the corners
    // push outwards until the contours are rectangles with rounded corners
    float dist = pow(
        pow(centred.x, uDomeSuperellipse) + pow(centred.y, uDomeSuperellipse),
        1.0 / uDomeSuperellipse
    );

    float dome = pow(clamp(dist / uDomeRadius, 0.0, 1.0), uDomeFalloff);
    float lift = uBlackPoint + (uDomeEdgeLift * dome);

    // Value of 1 so that the hue's brightest channel lifts by the full amount, and
    // saturating pulls the other channels down from there
    vec3 tint = hsvToRgb(vec3(fract(uLiftHue / 360.0), uLiftSaturation, 1.0));

    // Scaling the lift by alpha keeps the result valid premultiplied-alpha colour
    // (rgb never exceeds a) so that alpha itself can be passed through untouched
    finalColor = vec4(colour.rgb * (1.0 - lift) + (lift * tint * colour.a), colour.a);
}
