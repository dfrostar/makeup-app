import { useEffect, useRef } from 'react';
import { ProductData, FaceMeshData } from '@/types/ar';
import { useWebGL } from '@/hooks/useWebGL';

interface MakeupFilterProps {
  product: ProductData;
  face: FaceMeshData;
  color: string;
  intensity?: number;
}

export const MakeupFilter: React.FC<MakeupFilterProps> = ({
  product,
  face,
  color,
  intensity = 1.0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { context, initializeContext } = useWebGL();

  // Shader for makeup effects
  const vertexShader = `
    attribute vec4 position;
    attribute vec2 texCoord;
    varying vec2 vTexCoord;
    void main() {
      gl_Position = position;
      vTexCoord = texCoord;
    }
  `;

  const fragmentShader = `
    precision mediump float;
    varying vec2 vTexCoord;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uBlur;
    uniform float uShininess;
    
    void main() {
      vec4 color = texture2D(uTexture, vTexCoord);
      
      // Apply makeup color
      vec3 makeupColor = mix(color.rgb, uColor, uIntensity);
      
      // Add shimmer effect
      float shimmer = pow(dot(normalize(vec3(1.0)), normalize(makeupColor)), uShininess);
      makeupColor += shimmer * 0.2;
      
      // Soft blur effect
      vec2 pixelSize = vec2(1.0) / vec2(textureSize(uTexture, 0));
      vec4 blur = vec4(0.0);
      for(float x = -2.0; x <= 2.0; x++) {
        for(float y = -2.0; y <= 2.0; y++) {
          vec2 offset = vec2(x, y) * pixelSize * uBlur;
          blur += texture2D(uTexture, vTexCoord + offset);
        }
      }
      blur /= 25.0;
      
      // Blend original and makeup
      vec3 finalColor = mix(color.rgb, makeupColor, uIntensity);
      finalColor = mix(finalColor, blur.rgb, 0.3);
      
      gl_FragColor = vec4(finalColor, color.a);
    }
  `;

  useEffect(() => {
    if (!canvasRef.current || !face) return;

    const init = async () => {
      const success = await initializeContext(canvasRef.current!);
      if (!success || !context) return;

      // Set up WebGL program
      const program = createProgram(context, vertexShader, fragmentShader);
      if (!program) return;

      // Set up attributes and uniforms
      const positionLocation = context.getAttribLocation(program, 'position');
      const texCoordLocation = context.getAttribLocation(program, 'texCoord');
      
      // Create buffers
      const positionBuffer = context.createBuffer();
      const texCoordBuffer = context.createBuffer();

      // Set up texture
      const texture = context.createTexture();
      context.bindTexture(context.TEXTURE_2D, texture);

      // Apply makeup effect
      applyMakeupEffect(context, program, {
        position: positionBuffer,
        texCoord: texCoordBuffer,
        positionLoc: positionLocation,
        texCoordLoc: texCoordLocation,
        color: hexToRgb(color),
        intensity,
        blur: 0.5,
        shininess: product.type === 'highlighter' ? 20.0 : 5.0
      });
    };

    init();
  }, [face, color, intensity, product]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ mixBlendMode: product.blendMode || 'normal' }}
    />
  );
};

// Helper functions
function createProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return null;
  }

  return program;
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
}

interface EffectParams {
  position: WebGLBuffer | null;
  texCoord: WebGLBuffer | null;
  positionLoc: number;
  texCoordLoc: number;
  color: [number, number, number];
  intensity: number;
  blur: number;
  shininess: number;
}

function applyMakeupEffect(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  params: EffectParams
) {
  gl.useProgram(program);

  // Set uniforms
  const colorLoc = gl.getUniformLocation(program, 'uColor');
  const intensityLoc = gl.getUniformLocation(program, 'uIntensity');
  const blurLoc = gl.getUniformLocation(program, 'uBlur');
  const shininessLoc = gl.getUniformLocation(program, 'uShininess');

  gl.uniform3fv(colorLoc, params.color);
  gl.uniform1f(intensityLoc, params.intensity);
  gl.uniform1f(blurLoc, params.blur);
  gl.uniform1f(shininessLoc, params.shininess);

  // Draw
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
