#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uCornerExponent; // Superellipse exponent - 2 is an ellipse, higher squarer
uniform float uEdgeFade;       // How far in from the edge the picture fades up from black

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

void main() {
    vec4 colour = texture(uTexture, vTextureCoord);

    vec2 visibleSize = uInputClamp.zw - uInputClamp.xy;
    vec2 normalised = (vTextureCoord - uInputClamp.xy) / visibleSize;

    // -1 to 1 across the screen, so that the screen's shape is the unit superellipse and
    // the whole edge - corners and sides alike - is the single contour where this reaches 1
    vec2 fromCentre = abs((normalised - 0.5) * 2.0);

    float exponent = uCornerExponent;
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
    float fade = max(uEdgeFade * 2.0, 0.0001);

    float mask = 1.0 - smoothstep(-fade, 0.0, fromEdge);

    finalColor = vec4(colour.rgb * mask, colour.a);
}
