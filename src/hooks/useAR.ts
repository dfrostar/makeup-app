import { useState, useCallback, useEffect } from 'react';
import { ARError, ARRenderOptions, ARSettings, ARStats } from '../types/ar';
import { initializeAR, setupTracking, renderMakeup } from '../services/ar';

const DEFAULT_SETTINGS: ARSettings = {
    performance: 'high',
    enableHighAccuracy: true,
    smoothingFactor: 0.8,
    minConfidence: 0.9,
    maxFaces: 1,
};

export const useAR = (settings: Partial<ARSettings> = {}) => {
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState<ARError | null>(null);
    const [stats, setStats] = useState<ARStats>({
        fps: 0,
        latency: 0,
        confidence: 0,
        lastUpdate: Date.now(),
    });

    // Initialize AR system
    useEffect(() => {
        const init = async () => {
            try {
                await initializeAR({
                    ...DEFAULT_SETTINGS,
                    ...settings,
                });
                setInitialized(true);
            } catch (err) {
                setError({
                    code: 'INITIALIZATION_ERROR',
                    message: 'Failed to initialize AR system',
                    details: err,
                });
            }
        };

        init();
    }, [settings]);

    // Setup tracking
    useEffect(() => {
        if (!initialized) return;

        let frameId: number;
        let lastFrameTime = performance.now();

        const track = async () => {
            try {
                const tracking = await setupTracking();
                const trackFrame = async () => {
                    const now = performance.now();
                    const delta = now - lastFrameTime;
                    lastFrameTime = now;

                    const { face, confidence } = await tracking.update();

                    setStats((prev) => ({
                        fps: Math.round(1000 / delta),
                        latency: delta,
                        confidence,
                        lastUpdate: Date.now(),
                    }));

                    frameId = requestAnimationFrame(trackFrame);
                };

                frameId = requestAnimationFrame(trackFrame);
            } catch (err) {
                setError({
                    code: 'TRACKING_ERROR',
                    message: 'Failed to setup face tracking',
                    details: err,
                });
            }
        };

        track();

        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [initialized]);

    // Apply makeup effect
    const applyMakeup = useCallback(
        async (options: ARRenderOptions) => {
            if (!initialized) {
                setError({
                    code: 'NOT_INITIALIZED',
                    message: 'AR system not initialized',
                });
                return;
            }

            try {
                await renderMakeup(options);
            } catch (err) {
                setError({
                    code: 'RENDER_ERROR',
                    message: 'Failed to apply makeup effect',
                    details: err,
                });
            }
        },
        [initialized]
    );

    // Reset error state
    const resetError = useCallback(() => {
        setError(null);
    }, []);

    return {
        initialized,
        error,
        stats,
        applyMakeup,
        resetError,
    };
};
