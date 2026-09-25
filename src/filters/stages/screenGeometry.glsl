// Needs, defined before it is included: pictureAt(coord), the picture as it stands before its
// geometry is applied; SCREEN_GEOMETRY_MULTISAMPLE; and SCREEN_GEOMETRY_LOAD_TAPS

uniform float uScreenGeometryCurvatureX;  // Screen curvature - horizontal
uniform float uScreenGeometryCurvatureY;  // Screen curvature - vertical
uniform float uScreenGeometryCurvatureExponent; // Superellipse exponent of the curve - 2 bows edges evenly
uniform float uScreenGeometryOverscan;    // Uniform oversizing of the raster, as a fraction of the screen
uniform float uScreenGeometryPixelAspect; // Width over height of one source pixel as the tube draws it
uniform float uScreenGeometryRowStretch;  // How much wider a fully lit line is drawn than a black one
uniform float uScreenGeometryLineLag;     // How far bright material pushes the rest of its own line along
uniform float uScreenGeometrySagLines;    // How many lines back the supply is still recovering over

// Weights of the analogue luminance signal, which is what the beam current follows
const vec3 screenGeometryLuma = vec3(0.299, 0.587, 0.114);

vec2 visibleSize() {
    return uInputClamp.zw - uInputClamp.xy;
}

vec2 toVisible(vec2 coord) {
    return (coord - uInputClamp.xy) / visibleSize();
}

vec2 fromVisible(vec2 visible) {
    return (visible * visibleSize()) + uInputClamp.xy;
}

/**
 * How much smaller than the screen the picture is drawn on each axis to give its pixels their
 * aspect. Only ever shrinks, so the whole picture stays on the glass.
 */
vec2 aspectShrink() {
    return uScreenGeometryPixelAspect >= 1.0 ?
        vec2(1.0, 1.0 / uScreenGeometryPixelAspect) :
        vec2(uScreenGeometryPixelAspect, 1.0);
}

/**
 * How hard the guns have lately been driven: the mean over whole lines, and the mean of just the
 * part drawn before this point along them. The supply sags as a line is drawn, so what has already
 * gone past matters and what is still to come does not - and it is still recovering from the lines
 * above, so the taps are spread back over those too rather than all landing on this one. Without
 * that the estimate would follow fine detail from line to line, which no real supply is quick
 * enough to do.
 */
vec2 lineLoad(float row, float upTo) {
    float whole = 0.0;
    float before = 0.0;

    float lineHeight = 1.0 / (uInputClamp.w - uInputClamp.y);

    for (int i = 0; i < SCREEN_GEOMETRY_LOAD_TAPS; i++) {
        float along = (float(i) + 0.5) / float(SCREEN_GEOMETRY_LOAD_TAPS);
        // golden ratio sequence, so the rows sampled do not line up with the columns
        float linesBack = fract(float(i) * 0.618034) * uScreenGeometrySagLines;
        float tapRow = row - (linesBack * lineHeight);

        vec3 tap = pictureAt(fromVisible(vec2(along, tapRow))).rgb;
        float luma = dot(tap, screenGeometryLuma);
        whole += luma;
        before += luma * step(along, upTo);
    }

    return vec2(whole, before) / float(SCREEN_GEOMETRY_LOAD_TAPS);
}

/**
 * Where on the screen the beam is when it should be drawing the given part of the picture,
 * as one coordinate carrying the oversizing, the sag of the high voltage under beam current,
 * and the curve of the glass - so that all three cost a single resample between them.
 */
vec2 beamCoord(vec2 coord, vec2 load) {
    vec2 visible = toVisible(coord);

    // Less high voltage means a less stiff beam, which the same deflection current throws
    // further, so a heavily loaded line is drawn wider than a dark one
    float stretch = 1.0 + (uScreenGeometryRowStretch * load.x) + uScreenGeometryOverscan;
    vec2 shrink = aspectShrink();
    visible.x = 0.5 + ((visible.x - 0.5) / (stretch * shrink.x));
    visible.y = 0.5 + ((visible.y - 0.5) / ((1.0 + uScreenGeometryOverscan) * shrink.y));

    // The sag builds up as the line is drawn, so everything after bright material sits
    // further along the line than it should
    visible.x -= uScreenGeometryLineLag * load.y;

    // Barrel distortion for the curve of the glass
    vec2 curvature = vec2(uScreenGeometryCurvatureX, uScreenGeometryCurvatureY);
    vec2 centred = visible - vec2(0.5);
    // superellipse radius, 1 at the middle of each edge - at exponent 2 this is a circle
    vec2 fromCentre = abs(centred) * 2.0;
    float radius = pow(
        pow(fromCentre.x, uScreenGeometryCurvatureExponent) +
            pow(fromCentre.y, uScreenGeometryCurvatureExponent),
        1.0 / uScreenGeometryCurvatureExponent
    );
    float rsq = radius * radius * 0.25;
    centred += centred * (curvature * rsq);
    centred *= 1.0 - (0.23 * curvature);

    return fromVisible(centred + vec2(0.5));
}

vec3 screenGeometrySampleAt(vec2 coord) {
    float inBounds =
        step(uInputClamp.x, coord.x) * step(coord.x, uInputClamp.z) *
        step(uInputClamp.y, coord.y) * step(coord.y, uInputClamp.w);
    return pictureAt(coord).rgb * inBounds;
}

// The picture where the beam draws it for the point on the screen at coord
vec3 screenGeometryAt(vec2 coord) {
    // Taken once for the whole fragment: the load varies over a line, not over half a pixel
    vec2 here = toVisible(coord);
    // where this point falls in the picture, once it is shrunk to its pixel aspect
    vec2 inPicture = vec2(0.5) + ((here - vec2(0.5)) / aspectShrink());
    vec2 load = lineLoad(inPicture.y, inPicture.x);

    #if SCREEN_GEOMETRY_MULTISAMPLE
        // Quincunx pattern: centre plus the four diagonal corners at half a pixel
        vec2 offset = (1.0 / uResolution) * 0.5;

        vec3 centre = screenGeometrySampleAt(beamCoord(coord, load));
        vec3 topLeft = screenGeometrySampleAt(beamCoord(coord + vec2(-offset.x, -offset.y), load));
        vec3 topRight = screenGeometrySampleAt(beamCoord(coord + vec2(offset.x, -offset.y), load));
        vec3 bottomLeft = screenGeometrySampleAt(beamCoord(coord + vec2(-offset.x, offset.y), load));
        vec3 bottomRight = screenGeometrySampleAt(beamCoord(coord + vec2(offset.x, offset.y), load));

        return
            (centre * 0.5) +
            ((topLeft + topRight + bottomLeft + bottomRight) * 0.125);
    #else
        return screenGeometrySampleAt(beamCoord(coord, load));
    #endif
}
