import React, { useEffect, useRef, useState } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-backend-webgl';
import { useWebGL } from '@/hooks/useWebGL';
import { useColorCalibration } from '@/hooks/useColorCalibration';
import { WebGLSecurityManager } from '@/utils/webgl-security';
import type { FaceMeshData, FaceMeshConfig, ARError } from '@/types/ar';

interface FaceMeshProps {
  onFaceDetected?: (faces: FaceMeshData[]) => void;
  onError?: (error: ARError) => void;
  config?: Partial<FaceMeshConfig>;
}

const defaultConfig: FaceMeshConfig = {
  maxFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.8,
  minTrackingConfidence: 0.8
};

export const FaceMesh: React.FC<FaceMeshProps> = ({
  onFaceDetected,
  onError,
  config = {}
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const meshConfig = { ...defaultConfig, ...config };

  // Initialize WebGL context with security
  const { context, initializeContext } = useWebGL();
  const securityManager = useRef<WebGLSecurityManager | null>(null);

  // Initialize color calibration
  const { calibrate, calibrationResult } = useColorCalibration();

  useEffect(() => {
    let detector: faceLandmarksDetection.FaceLandmarksDetector | null = null;
    let animationFrame: number;
    let stream: MediaStream | null = null;

    const initialize = async () => {
      try {
        // Initialize face detector
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        detector = await faceLandmarksDetection.createDetector(model, {
          runtime: 'tfjs',
          refineLandmarks: meshConfig.refineLandmarks,
          maxFaces: meshConfig.maxFaces
        });

        // Initialize video stream
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // Initialize WebGL
        if (canvasRef.current) {
          const success = await initializeContext(canvasRef.current);
          if (success && context) {
            securityManager.current = new WebGLSecurityManager(context, {
              contextIsolation: true,
              textureProtection: true,
              secureContext: true
            });
          }
        }

        setIsInitialized(true);
        startDetection();
      } catch (error) {
        console.error('Initialization error:', error);
        onError?.({
          code: 'INITIALIZATION_ERROR',
          message: 'Failed to initialize face detection',
          details: error
        });
      }
    };

    const startDetection = async () => {
      if (!detector || !videoRef.current || !canvasRef.current) return;

      try {
        const faces = await detector.estimateFaces(videoRef.current, {
          flipHorizontal: false
        });

        if (faces.length > 0) {
          // Convert to our FaceMeshData format
          const meshData = faces.map(face => ({
            vertices: face.keypoints.map(kp => [kp.x, kp.y, kp.z || 0]).flat(),
            indices: generateIndices(face.keypoints.length),
            uvs: generateUVs(face.keypoints),
            normals: generateNormals(face.keypoints),
            landmarks: extractLandmarks(face.keypoints),
            confidence: face.score || 0,
            timestamp: Date.now()
          }));

          // Apply color calibration if available
          if (calibrationResult) {
            applyColorCorrection(meshData);
          }

          onFaceDetected?.(meshData);
          renderMesh(meshData);
        }

        animationFrame = requestAnimationFrame(startDetection);
      } catch (error) {
        console.error('Detection error:', error);
        onError?.({
          code: 'DETECTION_ERROR',
          message: 'Face detection failed',
          details: error
        });
      }
    };

    initialize();

    return () => {
      if (detector) {
        detector.dispose();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (securityManager.current) {
        securityManager.current.dispose();
      }
    };
  }, [meshConfig, onFaceDetected, onError]);

  // Helper functions
  const generateIndices = (numPoints: number): number[] => {
    const indices: number[] = [];
    for (let i = 0; i < numPoints - 2; i++) {
      indices.push(i, i + 1, i + 2);
    }
    return indices;
  };

  const generateUVs = (keypoints: faceLandmarksDetection.Keypoint[]): number[] => {
    return keypoints.map(kp => [
      kp.x / (videoRef.current?.width || 1),
      kp.y / (videoRef.current?.height || 1)
    ]).flat();
  };

  const generateNormals = (keypoints: faceLandmarksDetection.Keypoint[]): number[] => {
    return keypoints.map(() => [0, 0, 1]).flat();
  };

  const extractLandmarks = (keypoints: faceLandmarksDetection.Keypoint[]) => {
    // Extract specific facial landmarks
    return {
      jawLine: keypoints.slice(0, 17),
      leftEyebrow: keypoints.slice(17, 22),
      rightEyebrow: keypoints.slice(22, 27),
      noseBridge: keypoints.slice(27, 31),
      noseTip: keypoints.slice(31, 36),
      leftEye: keypoints.slice(36, 42),
      rightEye: keypoints.slice(42, 48),
      outerLips: keypoints.slice(48, 60),
      innerLips: keypoints.slice(60, 68)
    };
  };

  const applyColorCorrection = (meshData: FaceMeshData[]) => {
    if (!calibrationResult) return;

    meshData.forEach(mesh => {
      // Apply white balance
      for (let i = 0; i < mesh.vertices.length; i += 3) {
        const [r, g, b] = mesh.vertices.slice(i, i + 3);
        mesh.vertices[i] = r * calibrationResult.whiteBalance[0];
        mesh.vertices[i + 1] = g * calibrationResult.whiteBalance[1];
        mesh.vertices[i + 2] = b * calibrationResult.whiteBalance[2];
      }

      // Apply lighting compensation
      for (let i = 0; i < mesh.vertices.length; i += 3) {
        const [r, g, b] = mesh.vertices.slice(i, i + 3);
        mesh.vertices[i] = r * calibrationResult.lightingCompensation[0];
        mesh.vertices[i + 1] = g * calibrationResult.lightingCompensation[1];
        mesh.vertices[i + 2] = b * calibrationResult.lightingCompensation[2];
      }
    });
  };

  const renderMesh = (meshData: FaceMeshData[]) => {
    if (!context || !canvasRef.current) return;

    // Clear canvas
    context.clearColor(0, 0, 0, 0);
    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

    // Set up rendering
    context.enable(context.DEPTH_TEST);
    context.enable(context.BLEND);
    context.blendFunc(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA);

    // Render each face mesh
    meshData.forEach(mesh => {
      // Create buffers
      const vertexBuffer = context.createBuffer();
      const indexBuffer = context.createBuffer();
      const uvBuffer = context.createBuffer();
      const normalBuffer = context.createBuffer();

      // Bind and fill buffers
      context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer);
      context.bufferData(context.ARRAY_BUFFER, new Float32Array(mesh.vertices), context.STATIC_DRAW);

      context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer);
      context.bufferData(context.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), context.STATIC_DRAW);

      context.bindBuffer(context.ARRAY_BUFFER, uvBuffer);
      context.bufferData(context.ARRAY_BUFFER, new Float32Array(mesh.uvs), context.STATIC_DRAW);

      context.bindBuffer(context.ARRAY_BUFFER, normalBuffer);
      context.bufferData(context.ARRAY_BUFFER, new Float32Array(mesh.normals), context.STATIC_DRAW);

      // Draw mesh
      context.drawElements(context.TRIANGLES, mesh.indices.length, context.UNSIGNED_SHORT, 0);

      // Clean up
      context.deleteBuffer(vertexBuffer);
      context.deleteBuffer(indexBuffer);
      context.deleteBuffer(uvBuffer);
      context.deleteBuffer(normalBuffer);
    });
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
        width={640}
        height={480}
      />
      {!isInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
          Initializing face detection...
        </div>
      )}
    </div>
  );
};
