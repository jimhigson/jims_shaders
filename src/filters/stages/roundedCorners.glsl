uniform float uRoundedCornersCornerExponent; // Superellipse exponent - 2 is an ellipse, higher squarer
uniform float uRoundedCornersEdgeFade;       // How far in from the edge the picture fades up from black

// How much of the picture shows at coord: 0 outside the screen's shape, fading up to 1 inside it
float roundedCornersMask(vec2 coord) {
    vec2 visibleSize = uInputClamp.zw - uInputClamp.xy;
    vec2 normalised = (coord - uInputClamp.xy) / visibleSize;

    // -1 to 1 across the screen, so that the screen's shape is the unit superellipse and
    // the whole edge - corners and sides alike - is the single contour where this reaches 1
    vec2 fromCentre = abs((normalised - 0.5) * 2.0);

    float exponent = uRoundedCornersCornerExponent;
    float sum = max(
        pow(fromCentre.x, exponent) + pow(fromCentre.y, exponent),
        0.000001
    );
    float edge = pow(sum, 1.0 / exponent);

    // Close enough to a signed distance from that contour: dividing by the gradient converts
    // the field's own units into ones that are evenly wide all the way round, so the fade
    // does not pinch where the edge runs steeply
    float gradient = clamp(
        pow(sum, (1.0 / exponent) - 1.0) *
            length(pow(fromCentre, vec2(exponent - 1.0))),
        0.25,
        8.0
    );
    float fromEdge = (edge - 1.0) / gradient;

    // the fade is given over the whole screen, and this space is half of it either side
    float fade = max(uRoundedCornersEdgeFade * 2.0, 0.0001);

    return 1.0 - smoothstep(-fade, 0.0, fromEdge);
}
