#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uCornerRadius; // Corner radius as proportion (0.0-0.1 of image size)
uniform float uEdgeFade;     // How far in from every edge the picture fades up from black

// Pixi built-in uniforms (provided automatically)
uniform vec4 uInputClamp;  // xy: min texture coords, zw: max texture coords of visible area

out vec4 finalColor;

void main() {
    // Sample the texture
    vec4 color = texture(uTexture, vTextureCoord);
    
    // Calculate position in normalized visible space
    vec2 visibleSize = uInputClamp.zw - uInputClamp.xy;
    vec2 normalizedPos = (vTextureCoord - uInputClamp.xy) / visibleSize;
    
    // For the current Y, calculate the X bounds of the rounded rectangle
    float minX = 0.0;
    float maxX = 1.0;
    
    // Top corners (when y < radius)
    float topCornerFactor = step(normalizedPos.y, uCornerRadius);
    float dy_top = uCornerRadius - normalizedPos.y;
    float dx_top = sqrt(max(0.0, uCornerRadius * uCornerRadius - dy_top * dy_top));
    minX = mix(minX, uCornerRadius - dx_top, topCornerFactor);
    maxX = mix(maxX, 1.0 - uCornerRadius + dx_top, topCornerFactor);
    
    // Bottom corners (when y > 1 - radius)
    float bottomCornerFactor = step(1.0 - uCornerRadius, normalizedPos.y);
    float dy_bottom = normalizedPos.y - (1.0 - uCornerRadius);
    float dx_bottom = sqrt(max(0.0, uCornerRadius * uCornerRadius - dy_bottom * dy_bottom));
    minX = mix(minX, uCornerRadius - dx_bottom, bottomCornerFactor);
    maxX = mix(maxX, 1.0 - uCornerRadius + dx_bottom, bottomCornerFactor);
    
    // Fade up from black over a band just inside every edge, rather than stopping at one.
    // Curving a hard edge afterwards leaves it aliased along the curve, and a band of even a
    // fraction of the screen is enough to take that away
    float fadeWidth = max(uEdgeFade, 0.0001);

    float leftEdge = smoothstep(minX, minX + fadeWidth, normalizedPos.x);
    float rightEdge = 1.0 - smoothstep(maxX - fadeWidth, maxX, normalizedPos.x);
    float topEdge = smoothstep(0.0, fadeWidth, normalizedPos.y);
    float bottomEdge = 1.0 - smoothstep(1.0 - fadeWidth, 1.0, normalizedPos.y);

    float cornerMask = leftEdge * rightEdge * topEdge * bottomEdge;

    // Apply the mask to the original color
    finalColor = vec4(color.rgb * cornerMask, color.a);
}