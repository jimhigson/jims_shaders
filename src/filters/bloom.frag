#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uRadius;      // Blur radius in pixels
uniform float uCutoff;      // Brightness cutoff (0.0 to 1.0)
uniform float uIntensity;   // Bloom intensity (0.0 to 1.0)
uniform vec2 uResolution;   // Screen resolution
uniform float uEdgeBlur;    // Edge blur multiplier (1.0 = uniform, 2.0 = edges 2x blurrier)

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

// 13-tap pattern: center + 4-point diamond inner ring + 8-point outer ring
// This gives smoother, more circular bloom
const vec2 poissonOffsets[13] = vec2[](
    // Center
    vec2(0.0, 0.0),
    
    // Inner ring (diamond pattern at radius ~0.4)
    vec2(0.283, -0.283),   // Top-right diagonal
    vec2(0.283, 0.283),    // Bottom-right diagonal
    vec2(-0.283, 0.283),   // Bottom-left diagonal
    vec2(-0.283, -0.283),  // Top-left diagonal
    
    // Outer ring (8 points at radius ~1.0)
    vec2(0.0, -1.0),       // Top
    vec2(0.707, -0.707),   // Top-right
    vec2(1.0, 0.0),        // Right
    vec2(0.707, 0.707),    // Bottom-right
    vec2(0.0, 1.0),        // Bottom
    vec2(-0.707, 0.707),   // Bottom-left
    vec2(-1.0, 0.0),       // Left
    vec2(-0.707, -0.707)   // Top-left
);

// Weights for each sample - falloff from center to outer ring
const float poissonWeights[13] = float[](
    4.0,  // Center - highest weight
    
    // Inner ring - medium weight
    2.5, 2.5, 2.5, 2.5,
    
    // Outer ring - lower weight (33% of original)
    0.4, 0.33, 0.4, 0.33,
    0.4, 0.33, 0.4, 0.33
);

void main() {
    vec3 originalColor = texture(uTexture, vTextureCoord).rgb;
    
    // Calculate pixel size
    vec2 pixelSize = 1.0 / uResolution;
    
    // Calculate distance from center using the same logic as vignette/curvature
    vec2 visibleSize = uInputClamp.zw - uInputClamp.xy;
    vec2 visibleCenter = (uInputClamp.xy + uInputClamp.zw) * 0.5;
    vec2 centered = (vTextureCoord - visibleCenter) / visibleSize;
    
    // Distance from center (0 at center, ~0.707 at corners for square aspect)
    float distFromCenter = length(centered);
    
    // Calculate variable intensity based on distance from center
    // At center: intensity = uIntensity
    // At corners: intensity = uIntensity * uEdgeBlur
    // Linear interpolation based on distance
    float localIntensity = uIntensity * mix(1.0, uEdgeBlur, distFromCenter);
    
    // Accumulate bloom from neighboring pixels
    vec3 bloom = vec3(0.0);
    float totalWeight = 0.0;
    
    // Sample using two-ring pattern for smoother bloom
    for (int i = 0; i < 13; i++) {
        vec2 offset = poissonOffsets[i] * pixelSize * uRadius;
        vec2 sampleCoord = vTextureCoord + offset;
        
        // Sample the neighbor
        vec3 sampleColor = texture(uTexture, sampleCoord).rgb;
        
        // Calculate brightness of the sample
        float sampleBrightness = max(max(sampleColor.r, sampleColor.g), sampleColor.b);
        
        // Apply smooth cutoff to determine contribution
        // Only bright pixels contribute to bloom
        float contribution = smoothstep(uCutoff * 0.5, uCutoff + 0.1, sampleBrightness);
        
        // Get weight for this sample
        float weight = poissonWeights[i] * contribution;
        
        bloom += sampleColor * weight;
        totalWeight += weight;
    }
    
    // Normalize the bloom (avoid divide by zero)
    bloom /= max(totalWeight, 0.001);
    
    // Calculate brightness of current pixel
    float currentBrightness = max(max(originalColor.r, originalColor.g), originalColor.b);
    
    // Bloom should only affect pixels that are darker than the bloom source
    // Calculate the difference and clamp to positive values only
    vec3 bloomDiff = max(bloom - originalColor, vec3(0.0));
    vec3 bloomContribution = bloomDiff * localIntensity;
    
    // Add bloom to original color
    vec3 result = originalColor + bloomContribution;
    
    finalColor = vec4(result, 1.0);
}