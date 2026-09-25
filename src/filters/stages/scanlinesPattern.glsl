// Sample neighborhood in cross pattern to get average luminosity
float scanlinesNeighborhoodLuminosity(sampler2D tex, vec2 coord, vec2 resolution) {
    vec2 pixelSize = 1.0 / resolution;

    vec3 centerSample = texture(tex, coord).rgb;
    vec3 leftSample = texture(tex, coord + vec2(-pixelSize.x, 0.0)).rgb;
    vec3 rightSample = texture(tex, coord + vec2(pixelSize.x, 0.0)).rgb;
    vec3 topSample = texture(tex, coord + vec2(0.0, -pixelSize.y)).rgb;
    vec3 bottomSample = texture(tex, coord + vec2(0.0, pixelSize.y)).rgb;

    float centerLum = (centerSample.r + centerSample.g + centerSample.b) / 3.0;
    float leftLum = (leftSample.r + leftSample.g + leftSample.b) / 3.0;
    float rightLum = (rightSample.r + rightSample.g + rightSample.b) / 3.0;
    float topLum = (topSample.r + topSample.g + topSample.b) / 3.0;
    float bottomLum = (bottomSample.r + bottomSample.g + bottomSample.b) / 3.0;

    // Weight center more heavily (0.5) and edges equally (0.125 each)
    return centerLum * 0.5 + (leftLum + rightLum + topLum + bottomLum) * 0.125;
}

// Darkens colour into horizontal scanline bands at coord. Shared between ScanlinesFilter
// (applied at vTextureCoord, screen space) and SwitchOnFilter (applied at its own
// raster-scaled coordinate, so the bands shrink onto the screen with the raster rather
// than staying screen-space-fixed like the phosphor mask)
vec3 applyScanlines(
    sampler2D tex,
    vec2 coord,
    vec3 colour,
    vec2 resolution,
    float pixelHeight,
    float gapBrightness,
    vec4 inputClamp
) {
    float luminosity = scanlinesNeighborhoodLuminosity(tex, coord, resolution);

    // Map texture coord to position within visible area (0-1), then to pixel position
    float normalizedY = (coord.y - inputClamp.y) / (inputClamp.w - inputClamp.y);
    float virtualPixelY = normalizedY * resolution.y / pixelHeight;

    // Calculate position within scanline period (0 to 2 for double height scanlines)
    float yInScanline = mod(virtualPixelY, 2.0);

    // Dark band centers are at 0.5 and 1.5 in our 2-unit period. Branchless
    // selection: if yInScanline < 1.0, use 0.5, else use 1.5
    float darkCenter = mix(1.5, 0.5, step(yInScanline, 1.0));
    float distToDarkCenter = abs(yInScanline - darkCenter);

    // Threshold based on luminosity - how close to the centre of a dark band
    // counts as "in" it. Bright pixels = low threshold = thin dark bands.
    // Range from 0.5 (black) to 0.0 (white) - allows dark bands to disappear
    float distanceThresh = 0.5 * (1.0 - luminosity);

    // Boost factor compensates bright bands for the darkening, so average
    // brightness is preserved: boost = 1 + darkToBrightRatio * (1 - gapBrightness)
    float darkToBrightRatio = distanceThresh / (1.0 - distanceThresh);
    float boostFactor = 1.0 + darkToBrightRatio * (1.0 - gapBrightness);

    // Soft cutoff for anti-aliasing, 1/4 of a virtual pixel wide
    float transitionWidth = 0.25;
    float innerBoundary = distanceThresh - transitionWidth * 0.5;
    float outerBoundary = distanceThresh + transitionWidth * 0.5;
    float inBrightBand = smoothstep(innerBoundary, outerBoundary, distToDarkCenter);

    vec3 brightBandColour = colour * boostFactor;
    vec3 darkBandColour = colour * gapBrightness;

    return mix(darkBandColour, brightBandColour, inBrightBand);
}
