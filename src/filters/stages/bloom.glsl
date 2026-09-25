uniform float uBloomRadius;      // Blur radius in pixels
uniform float uBloomCutoff;      // Brightness cutoff (0.0 to 1.0)
uniform float uBloomIntensity;   // Bloom intensity (0.0 to 1.0)
uniform float uBloomEdgeBlur;    // Edge blur multiplier (1.0 = uniform, 2.0 = edges 2x blurrier)

// Configuration for the poisson disk sampling pattern
const float BLOOM_INNER_RING_RADIUS = 0.7;
const float BLOOM_OUTER_RING_RADIUS = 1.0;
const float BLOOM_INNER_WEIGHT = 3.5;
const float BLOOM_OUTER_WEIGHT = 0.1;

// Rotation angle for outer ring: 22.5° = π/8 radians
const float BLOOM_OUTER_ROTATION = 0.39269908169872414;
const float BLOOM_COS_OUTER_ROT = cos(BLOOM_OUTER_ROTATION);
const float BLOOM_SIN_OUTER_ROT = sin(BLOOM_OUTER_ROTATION);

// 12-tap pattern: 4-point inner ring + 8-point outer ring
// Inner ring on cardinal axes, outer ring rotated 22.5° between cardinal/diagonal
const int BLOOM_SAMPLES = 12;
const vec2 bloomOffsets[BLOOM_SAMPLES] = vec2[](

    // Inner ring (on cardinal axes)
    vec2(0.0, -BLOOM_INNER_RING_RADIUS),
    vec2(BLOOM_INNER_RING_RADIUS, 0.0),
    vec2(0.0, BLOOM_INNER_RING_RADIUS),
    vec2(-BLOOM_INNER_RING_RADIUS, 0.0),

    // Outer ring rotated 22.5° from top, going clockwise
    vec2(BLOOM_SIN_OUTER_ROT * BLOOM_OUTER_RING_RADIUS, -BLOOM_COS_OUTER_ROT * BLOOM_OUTER_RING_RADIUS),
    vec2(BLOOM_COS_OUTER_ROT * BLOOM_OUTER_RING_RADIUS, -BLOOM_SIN_OUTER_ROT * BLOOM_OUTER_RING_RADIUS),
    vec2(BLOOM_COS_OUTER_ROT * BLOOM_OUTER_RING_RADIUS, BLOOM_SIN_OUTER_ROT * BLOOM_OUTER_RING_RADIUS),
    vec2(BLOOM_SIN_OUTER_ROT * BLOOM_OUTER_RING_RADIUS, BLOOM_COS_OUTER_ROT * BLOOM_OUTER_RING_RADIUS),
    vec2(-BLOOM_SIN_OUTER_ROT * BLOOM_OUTER_RING_RADIUS, BLOOM_COS_OUTER_ROT * BLOOM_OUTER_RING_RADIUS),
    vec2(-BLOOM_COS_OUTER_ROT * BLOOM_OUTER_RING_RADIUS, BLOOM_SIN_OUTER_ROT * BLOOM_OUTER_RING_RADIUS),
    vec2(-BLOOM_COS_OUTER_ROT * BLOOM_OUTER_RING_RADIUS, -BLOOM_SIN_OUTER_ROT * BLOOM_OUTER_RING_RADIUS),
    vec2(-BLOOM_SIN_OUTER_ROT * BLOOM_OUTER_RING_RADIUS, -BLOOM_COS_OUTER_ROT * BLOOM_OUTER_RING_RADIUS)
);

// Weights for each sample - falloff from center to outer ring
const float bloomWeights[BLOOM_SAMPLES] = float[](
    // Inner ring
    BLOOM_INNER_WEIGHT, BLOOM_INNER_WEIGHT, BLOOM_INNER_WEIGHT, BLOOM_INNER_WEIGHT,

    // Outer ring
    BLOOM_OUTER_WEIGHT, BLOOM_OUTER_WEIGHT, BLOOM_OUTER_WEIGHT, BLOOM_OUTER_WEIGHT,
    BLOOM_OUTER_WEIGHT, BLOOM_OUTER_WEIGHT, BLOOM_OUTER_WEIGHT, BLOOM_OUTER_WEIGHT
);

// The glow of the input texture's bright areas added onto colour, the input at coord
vec3 applyBloom(vec3 colour, vec2 coord) {
    // Calculate pixel size
    vec2 pixelSize = 1.0 / uResolution;

    // Calculate distance from center using the same logic as vignette/curvature
    vec2 visibleSize = uInputClamp.zw - uInputClamp.xy;
    vec2 visibleCenter = (uInputClamp.xy + uInputClamp.zw) * 0.5;
    vec2 centered = (coord - visibleCenter) / visibleSize;

    // Accumulate bloom from neighboring pixels
    vec3 bloom = vec3(0.0);
    float totalWeight = 0.0;

    // Distance from center (0 at center, ~0.707 at corners for square aspect)
    float distFromCenter = length(centered);

    // transform edgeBlue from 0..1 to 1..2, raising initially slowly but
    // ramping up more sharply at the corners due to the square factor
    float blurCoefForEdge = (distFromCenter * distFromCenter + 1.0) * (uBloomEdgeBlur + 1.0);

    // Sample using two-ring pattern for smoother bloom
    for (int i = 0; i < BLOOM_SAMPLES; i++) {
        vec2 offset = bloomOffsets[i] * pixelSize * uBloomRadius * blurCoefForEdge;
        vec2 sampleCoord = coord + offset;

        // Sample the neighbor
        vec3 sampleColor = texture(uTexture, sampleCoord).rgb;

        // Calculate brightness of the sample
        float sampleBrightness = max(max(sampleColor.r, sampleColor.g), sampleColor.b);

        // Apply smooth cutoff to determine contribution
        // Only bright pixels contribute to bloom
        float contribution = smoothstep(uBloomCutoff * 0.5, uBloomCutoff + 0.1, sampleBrightness);

        // Get weight for this sample
        float weight = bloomWeights[i] * contribution;

        bloom += sampleColor * weight;
        totalWeight += weight;
    }

    // Normalize the bloom (avoid divide by zero)
    bloom /= max(totalWeight, 0.001);

    // Add bloom to original color
    return colour + (bloom * uBloomIntensity * blurCoefForEdge);
}
