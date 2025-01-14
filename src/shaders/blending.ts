export const BlendingShader = {
  uniforms: {
    tDiffuse: { value: null },
    tBlend: { value: null },
    blendMode: { value: 0 },
    opacity: { value: 1.0 },
    blendAlpha: { value: true }
  },

  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D tBlend;
    uniform int blendMode;
    uniform float opacity;
    uniform bool blendAlpha;

    varying vec2 vUv;

    // Color space conversion
    vec3 rgb2hsv(vec3 c) {
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    // Advanced blend modes
    vec3 blendColor(vec3 base, vec3 blend) {
      vec3 baseHSV = rgb2hsv(base);
      vec3 blendHSV = rgb2hsv(blend);
      return hsv2rgb(vec3(blendHSV.x, blendHSV.y, baseHSV.z));
    }

    vec3 blendLuminosity(vec3 base, vec3 blend) {
      vec3 baseHSV = rgb2hsv(base);
      vec3 blendHSV = rgb2hsv(blend);
      return hsv2rgb(vec3(baseHSV.x, baseHSV.y, blendHSV.z));
    }

    vec3 blendSaturation(vec3 base, vec3 blend) {
      vec3 baseHSV = rgb2hsv(base);
      vec3 blendHSV = rgb2hsv(blend);
      return hsv2rgb(vec3(baseHSV.x, blendHSV.y, baseHSV.z));
    }

    vec3 blendHue(vec3 base, vec3 blend) {
      vec3 baseHSV = rgb2hsv(base);
      vec3 blendHSV = rgb2hsv(blend);
      return hsv2rgb(vec3(blendHSV.x, baseHSV.y, baseHSV.z));
    }

    // Makeup-specific blend modes
    vec3 blendFoundation(vec3 base, vec3 blend, float alpha) {
      // Foundation should even out skin tone while preserving natural variation
      vec3 baseHSV = rgb2hsv(base);
      vec3 blendHSV = rgb2hsv(blend);
      
      // Preserve some of the base texture
      float texturePreservation = 0.3;
      float newValue = mix(blendHSV.z, baseHSV.z, texturePreservation);
      
      // Smooth transition for natural look
      vec3 result = hsv2rgb(vec3(
        mix(baseHSV.x, blendHSV.x, 0.8),
        mix(baseHSV.y, blendHSV.y, 0.7),
        newValue
      ));
      
      return mix(base, result, alpha);
    }

    vec3 blendHighlight(vec3 base, vec3 blend, float alpha) {
      // Highlight should add luminosity and slight color
      vec3 screen = 1.0 - (1.0 - base) * (1.0 - blend);
      vec3 softLight = mix(
        2.0 * base * blend + base * base * (1.0 - 2.0 * blend),
        sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend),
        step(0.5, blend)
      );
      
      // Combine screen and soft light for natural highlight
      vec3 result = mix(screen, softLight, 0.5);
      return mix(base, result, alpha);
    }

    vec3 blendBlush(vec3 base, vec3 blend, float alpha) {
      // Blush should add color while preserving skin texture
      vec3 baseHSV = rgb2hsv(base);
      vec3 blendHSV = rgb2hsv(blend);
      
      // Keep base luminosity variation for texture
      vec3 colorized = hsv2rgb(vec3(
        blendHSV.x,
        mix(baseHSV.y, blendHSV.y, 0.8),
        mix(baseHSV.z, blendHSV.z, 0.6)
      ));
      
      // Soft light blend for natural look
      vec3 result = mix(
        2.0 * base * colorized + base * base * (1.0 - 2.0 * colorized),
        sqrt(base) * (2.0 * colorized - 1.0) + 2.0 * base * (1.0 - colorized),
        step(0.5, colorized)
      );
      
      return mix(base, result, alpha);
    }

    void main() {
      vec4 baseColor = texture2D(tDiffuse, vUv);
      vec4 blendColor = texture2D(tBlend, vUv);

      // Calculate alpha for blending
      float alpha = blendAlpha ? blendColor.a * opacity : opacity;

      vec3 result;
      if (blendMode == 0) { // Normal
        result = mix(baseColor.rgb, blendColor.rgb, alpha);
      }
      else if (blendMode == 1) { // Foundation
        result = blendFoundation(baseColor.rgb, blendColor.rgb, alpha);
      }
      else if (blendMode == 2) { // Highlight
        result = blendHighlight(baseColor.rgb, blendColor.rgb, alpha);
      }
      else if (blendMode == 3) { // Blush
        result = blendBlush(baseColor.rgb, blendColor.rgb, alpha);
      }
      else if (blendMode == 4) { // Color
        result = mix(baseColor.rgb, blendColor(baseColor.rgb, blendColor.rgb), alpha);
      }
      else if (blendMode == 5) { // Luminosity
        result = mix(baseColor.rgb, blendLuminosity(baseColor.rgb, blendColor.rgb), alpha);
      }
      else if (blendMode == 6) { // Saturation
        result = mix(baseColor.rgb, blendSaturation(baseColor.rgb, blendColor.rgb), alpha);
      }
      else if (blendMode == 7) { // Hue
        result = mix(baseColor.rgb, blendHue(baseColor.rgb, blendColor.rgb), alpha);
      }

      gl_FragColor = vec4(result, baseColor.a);
    }
  `
};
