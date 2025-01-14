import { BlendMode } from '@/types/ar';

export const MakeupShader = {
  uniforms: {
    tDiffuse: { value: null },
    tMakeup: { value: null },
    makeupColor: { value: null },
    opacity: { value: 1.0 },
    blendMode: { value: 'normal' as BlendMode },
    skinTone: { value: [1.0, 1.0, 1.0] },
    lightDirection: { value: [0.0, 0.0, 1.0] },
    specularPower: { value: 20.0 },
    roughness: { value: 0.5 }
  },

  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      
      // Transform normal to view space
      vNormal = normalMatrix * normal;
      
      // Calculate view-space position
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D tMakeup;
    uniform vec3 makeupColor;
    uniform float opacity;
    uniform int blendMode;
    uniform vec3 skinTone;
    uniform vec3 lightDirection;
    uniform float specularPower;
    uniform float roughness;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    // Utility functions
    float luminance(vec3 color) {
      return dot(color, vec3(0.299, 0.587, 0.114));
    }

    vec3 adjustSaturation(vec3 color, float saturation) {
      float l = luminance(color);
      return mix(vec3(l), color, saturation);
    }

    // Physically based rendering functions
    float distributionGGX(vec3 N, vec3 H, float roughness) {
      float a = roughness * roughness;
      float a2 = a * a;
      float NdotH = max(dot(N, H), 0.0);
      float NdotH2 = NdotH * NdotH;

      float nom = a2;
      float denom = (NdotH2 * (a2 - 1.0) + 1.0);
      denom = PI * denom * denom;

      return nom / denom;
    }

    float geometrySchlickGGX(float NdotV, float roughness) {
      float r = (roughness + 1.0);
      float k = (r * r) / 8.0;

      float nom = NdotV;
      float denom = NdotV * (1.0 - k) + k;

      return nom / denom;
    }

    float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
      float NdotV = max(dot(N, V), 0.0);
      float NdotL = max(dot(N, L), 0.0);
      float ggx2 = geometrySchlickGGX(NdotV, roughness);
      float ggx1 = geometrySchlickGGX(NdotL, roughness);

      return ggx1 * ggx2;
    }

    vec3 fresnelSchlick(float cosTheta, vec3 F0) {
      return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
    }

    // Blend mode functions
    vec3 blendNormal(vec3 base, vec3 blend) {
      return blend;
    }

    vec3 blendMultiply(vec3 base, vec3 blend) {
      return base * blend;
    }

    vec3 blendScreen(vec3 base, vec3 blend) {
      return 1.0 - (1.0 - base) * (1.0 - blend);
    }

    vec3 blendOverlay(vec3 base, vec3 blend) {
      return mix(
        2.0 * base * blend,
        1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
        step(0.5, base)
      );
    }

    vec3 blendSoftLight(vec3 base, vec3 blend) {
      return mix(
        2.0 * base * blend + base * base * (1.0 - 2.0 * blend),
        sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend),
        step(0.5, blend)
      );
    }

    // Main shader
    void main() {
      // Get base colors
      vec4 diffuseColor = texture2D(tDiffuse, vUv);
      vec4 makeupTexture = texture2D(tMakeup, vUv);
      
      // Normalize vectors
      vec3 N = normalize(vNormal);
      vec3 V = normalize(vViewPosition);
      vec3 L = normalize(lightDirection);
      vec3 H = normalize(V + L);
      
      // Calculate makeup color with texture
      vec3 makeupFinal = makeupColor * makeupTexture.rgb;
      
      // Adjust makeup color based on skin tone
      vec3 skinHSL = rgb2hsl(skinTone);
      makeupFinal = adjustMakeupForSkin(makeupFinal, skinHSL);
      
      // Calculate PBR lighting
      vec3 F0 = vec3(0.04);
      F0 = mix(F0, makeupFinal, metallic);
      
      // Cook-Torrance BRDF
      float NDF = distributionGGX(N, H, roughness);
      float G = geometrySmith(N, V, L, roughness);
      vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);
      
      vec3 numerator = NDF * G * F;
      float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001;
      vec3 specular = numerator / denominator;
      
      // Blend makeup with base color
      vec3 blended;
      if (blendMode == 0) blended = blendNormal(diffuseColor.rgb, makeupFinal);
      else if (blendMode == 1) blended = blendMultiply(diffuseColor.rgb, makeupFinal);
      else if (blendMode == 2) blended = blendScreen(diffuseColor.rgb, makeupFinal);
      else if (blendMode == 3) blended = blendOverlay(diffuseColor.rgb, makeupFinal);
      else blended = blendSoftLight(diffuseColor.rgb, makeupFinal);
      
      // Combine diffuse and specular
      vec3 kS = F;
      vec3 kD = vec3(1.0) - kS;
      kD *= 1.0 - metallic;
      
      float NdotL = max(dot(N, L), 0.0);
      vec3 Lo = (kD * blended / PI + specular) * NdotL;
      
      // Add ambient lighting
      vec3 ambient = 0.03 * blended;
      vec3 finalColor = ambient + Lo;
      
      // HDR tonemapping and gamma correction
      finalColor = finalColor / (finalColor + vec3(1.0));
      finalColor = pow(finalColor, vec3(1.0/2.2));
      
      gl_FragColor = vec4(finalColor, opacity * makeupTexture.a);
    }
  `
};
