#version 300 es
precision mediump float;

// Injected defines
#define MULTISAMPLE {{MULTISAMPLE}}
#define LOAD_TAPS {{LOAD_TAPS}}

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uCurvatureX;  // Screen curvature - horizontal
uniform float uCurvatureY;  // Screen curvature - vertical
uniform float uOverscan;    // Uniform oversizing of the raster, as a fraction of the screen
uniform float uRowStretch;  // How much wider a fully lit line is drawn than a black one
uniform float uLineLag;     // How far bright material pushes the rest of its own line along
uniform float uSagLines;    // How many lines back the supply is still recovering over
uniform vec2 uResolution;   // Screen resolution for AA sampling

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

// Weights of the analogue luminance signal, which is what the beam current follows
const vec3 rec601Luma = vec3(0.299, 0.587, 0.114);

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

    for (int i = 0; i < LOAD_TAPS; i++) {
        float along = (float(i) + 0.5) / float(LOAD_TAPS);
        // golden ratio sequence, so the rows sampled do not line up with the columns
        float linesBack = fract(float(i) * 0.618034) * uSagLines;
        float tapRow = row - (linesBack * lineHeight);

        vec3 tap = texture(uTexture, fromVisible(vec2(along, tapRow))).rgb;
        float luma = dot(tap, rec601Luma);
        whole += luma;
        before += luma * step(along, upTo);
    }

    return vec2(whole, before) / float(LOAD_TAPS);
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
    float stretch = 1.0 + (uRowStretch * load.x) + uOverscan;
    visible.x = 0.5 + ((visible.x - 0.5) / stretch);
    visible.y = 0.5 + ((visible.y - 0.5) / (1.0 + uOverscan));

    // The sag builds up as the line is drawn, so everything after bright material sits
    // further along the line than it should
    visible.x -= uLineLag * load.y;

    // Barrel distortion for the curve of the glass
    vec2 curvature = vec2(uCurvatureX, uCurvatureY);
    vec2 centred = visible - vec2(0.5);
    float rsq = dot(centred, centred);
    centred += centred * (curvature * rsq);
    centred *= 1.0 - (0.23 * curvature);

    return fromVisible(centred + vec2(0.5));
}

vec3 sampleAt(vec2 coord) {
    float inBounds =
        step(uInputClamp.x, coord.x) * step(coord.x, uInputClamp.z) *
        step(uInputClamp.y, coord.y) * step(coord.y, uInputClamp.w);
    return texture(uTexture, coord).rgb * inBounds;
}

void main() {
    // Taken once for the whole fragment: the load varies over a line, not over half a pixel
    vec2 here = toVisible(vTextureCoord);
    vec2 load = lineLoad(here.y, here.x);

    #if MULTISAMPLE
        // Quincunx pattern: centre plus the four diagonal corners at half a pixel
        vec2 offset = (1.0 / uResolution) * 0.5;

        vec3 centre = sampleAt(beamCoord(vTextureCoord, load));
        vec3 topLeft = sampleAt(beamCoord(vTextureCoord + vec2(-offset.x, -offset.y), load));
        vec3 topRight = sampleAt(beamCoord(vTextureCoord + vec2(offset.x, -offset.y), load));
        vec3 bottomLeft = sampleAt(beamCoord(vTextureCoord + vec2(-offset.x, offset.y), load));
        vec3 bottomRight = sampleAt(beamCoord(vTextureCoord + vec2(offset.x, offset.y), load));

        vec3 colour =
            (centre * 0.5) +
            ((topLeft + topRight + bottomLeft + bottomRight) * 0.125);
    #else
        vec3 colour = sampleAt(beamCoord(vTextureCoord, load));
    #endif

    finalColor = vec4(colour, 1.0);
}
