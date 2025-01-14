import { renderHook, act } from '@testing-library/react';
import { useVisualSearch } from '../useVisualSearch';

describe('useVisualSearch', () => {
    beforeEach(() => {
        // Mock navigator.mediaDevices
        global.navigator.mediaDevices = {
            getUserMedia: jest.fn().mockResolvedValue({
                getTracks: () => [{
                    stop: jest.fn()
                }]
            })
        };
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useVisualSearch());
        
        expect(result.current.isCapturing).toBe(false);
        expect(result.current.imageData).toBeNull();
        expect(result.current.error).toBeNull();
    });

    it('should handle starting camera capture', async () => {
        const { result } = renderHook(() => useVisualSearch());
        
        await act(async () => {
            await result.current.startCamera();
        });
        
        expect(result.current.isCapturing).toBe(true);
        expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    });

    it('should handle stopping camera capture', async () => {
        const { result } = renderHook(() => useVisualSearch());
        
        await act(async () => {
            await result.current.startCamera();
            result.current.stopCamera();
        });
        
        expect(result.current.isCapturing).toBe(false);
    });

    it('should handle image upload', async () => {
        const { result } = renderHook(() => useVisualSearch());
        const file = new File(['test'], 'test.png', { type: 'image/png' });
        
        await act(async () => {
            await result.current.handleImageUpload(file);
        });
        
        expect(result.current.imageData).not.toBeNull();
    });

    it('should handle errors', async () => {
        global.navigator.mediaDevices.getUserMedia = jest.fn().mockRejectedValue(new Error('Camera access denied'));
        
        const { result } = renderHook(() => useVisualSearch());
        
        await act(async () => {
            await result.current.startCamera();
        });
        
        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toBe('Camera access denied');
    });
});
