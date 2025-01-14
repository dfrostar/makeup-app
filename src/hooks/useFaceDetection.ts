import { useEffect, useState, useRef, RefObject } from 'react';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import { FaceMeshData, FaceDetectionResult } from '../types/ar';

export const useFaceDetection = (
    videoRef: RefObject<HTMLVideoElement>
): FaceDetectionResult => {
    const [face, setFace] = useState<FaceMeshData | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [confidence, setConfidence] = useState(0);
    const modelRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(
        null
    );
    const frameRef = useRef<number>();

    useEffect(() => {
        const initializeDetector = async () => {
            try {
                // Load face landmarks detection model
                const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
                const detector = await faceLandmarksDetection.createDetector(
                    model,
                    {
                        runtime: 'mediapipe',
                        refineLandmarks: true,
                        maxFaces: 1,
                    }
                );
                modelRef.current = detector;
            } catch (err) {
                setError(new Error('Failed to initialize face detection'));
                console.error('Face detection initialization error:', err);
            }
        };

        initializeDetector();

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!modelRef.current || !videoRef.current) return;

        const detectFace = async () => {
            if (!modelRef.current || !videoRef.current) return;

            try {
                const predictions = await modelRef.current.estimateFaces(
                    videoRef.current,
                    {
                        flipHorizontal: false,
                        staticImageMode: false,
                    }
                );

                if (predictions.length > 0) {
                    const prediction = predictions[0];
                    
                    // Convert prediction to FaceMeshData format
                    const faceMeshData: FaceMeshData = {
                        vertices: prediction.mesh.map((point) => [
                            point[0],
                            point[1],
                            point[2],
                        ]).flat(),
                        indices: prediction.meshIndices,
                        uvs: prediction.meshUVs.flat(),
                        landmarks: {
                            jawLine: prediction.annotations.jawLine,
                            leftEyebrow: prediction.annotations.leftEyebrow,
                            rightEyebrow: prediction.annotations.rightEyebrow,
                            noseBridge: prediction.annotations.noseBridge,
                            noseTip: prediction.annotations.noseTip,
                            leftEye: prediction.annotations.leftEye,
                            rightEye: prediction.annotations.rightEye,
                            outerLips: prediction.annotations.outerLips,
                            innerLips: prediction.annotations.innerLips,
                            leftCheek: prediction.annotations.leftCheek,
                            rightCheek: prediction.annotations.rightCheek,
                            chin: prediction.annotations.chin,
                            foreheadCenter: prediction.annotations.foreheadCenter[0],
                            leftTemple: prediction.annotations.leftTemple[0],
                            rightTemple: prediction.annotations.rightTemple[0],
                            leftCheekbone: prediction.annotations.leftCheekbone[0],
                            rightCheekbone: prediction.annotations.rightCheekbone[0],
                            leftNostril: prediction.annotations.leftNostril[0],
                            rightNostril: prediction.annotations.rightNostril[0],
                            cupidsBow: prediction.annotations.cupidsBow[0],
                        },
                    };

                    setFace(faceMeshData);
                    setConfidence(prediction.confidence || 0);
                } else {
                    setFace(null);
                    setConfidence(0);
                }

                // Continue detection loop
                frameRef.current = requestAnimationFrame(detectFace);
            } catch (err) {
                setError(new Error('Face detection failed'));
                console.error('Face detection error:', err);
            }
        };

        // Start detection loop
        if (videoRef.current.readyState === 4) {
            detectFace();
        } else {
            videoRef.current.addEventListener('loadeddata', detectFace);
        }

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
            if (videoRef.current) {
                videoRef.current.removeEventListener('loadeddata', detectFace);
            }
        };
    }, [videoRef]);

    return { face, error, confidence };
};
