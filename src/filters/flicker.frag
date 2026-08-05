#version 300 es
precision mediump float;

in vec2 vTextureCoord;
uniform sampler2D uTexture;

uniform float uBrightness;  // How lit the phosphors are this frame, worked out on the way in

out vec4 finalColor;

void main() {
    vec4 colour = texture(uTexture, vTextureCoord);

    // Clamping to alpha keeps the result valid premultiplied-alpha colour
    finalColor = vec4(clamp(colour.rgb * uBrightness, 0.0, colour.a), colour.a);
}
