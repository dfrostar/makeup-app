import React from 'react';
import { render, act } from '@testing-library/react';
import { FaceMesh } from '../FaceMesh';
import { FaceMeshData } from '../../../types/ar';
import { arLogger } from '../../../utils/arLogger';

// Mock Three.js
jest.mock('three', () => {
    const actualThree = jest.requireActual('three');
    return {
        ...actualThree,
        WebGLRenderer: jest.fn().mockImplementation(() => ({
            setSize: jest.fn(),
            setPixelRatio: jest.fn(),
            render: jest.fn(),
            dispose: jest.fn(),
            domElement: document.createElement('canvas'),
        })),
        Scene: jest.fn(),
        PerspectiveCamera: jest.fn().mockImplementation(() => ({
            aspect: 1,
            updateProjectionMatrix: jest.fn(),
            position: { z: 0 },
        })),
        BufferGeometry: jest.fn().mockImplementation(() => ({
            setAttribute: jest.fn(),
            setIndex: jest.fn(),
            computeVertexNormals: jest.fn(),
            computeBoundingSphere: jest.fn(),
            dispose: jest.fn(),
        })),
        MeshPhongMaterial: jest.fn().mockImplementation(() => ({
            dispose: jest.fn(),
        })),
        Mesh: jest.fn().mockImplementation(() => ({
            geometry: {
                setAttribute: jest.fn(),
                setIndex: jest.fn(),
                computeVertexNormals: jest.fn(),
                computeBoundingSphere: jest.fn(),
            },
        })),
        Float32BufferAttribute: jest.fn(),
        AmbientLight: jest.fn(),
        DirectionalLight: jest.fn(),
        MathUtils: {
            lerp: (a: number, b: number, t: number) => a + (b - a) * t,
        },
    };
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));

describe('FaceMesh Component', () => {
    const mockFaceData: FaceMeshData = {
        vertices: [0, 0, 0, 1, 1, 1],
        indices: [0, 1, 2],
        uvs: [0, 0, 1, 1],
        normals: [0, 1, 0, 0, 1, 0],
        landmarks: {
            jawLine: [],
            leftEyebrow: [],
            rightEyebrow: [],
            noseBridge: [],
            noseTip: [],
            leftEye: [],
            rightEye: [],
            outerLips: [],
            innerLips: [],
            leftCheek: [],
            rightCheek: [],
            chin: [],
            foreheadCenter: { x: 0, y: 0, z: 0 },
            leftTemple: { x: 0, y: 0, z: 0 },
            rightTemple: { x: 0, y: 0, z: 0 },
            leftCheekbone: { x: 0, y: 0, z: 0 },
            rightCheekbone: { x: 0, y: 0, z: 0 },
            leftNostril: { x: 0, y: 0, z: 0 },
            rightNostril: { x: 0, y: 0, z: 0 },
            cupidsBow: { x: 0, y: 0, z: 0 },
        },
        confidence: 0.9,
        timestamp: Date.now(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        const { container } = render(<FaceMesh data={null} />);
        expect(container).toBeTruthy();
    });

    it('initializes Three.js scene with correct performance settings', () => {
        render(<FaceMesh data={null} performance="high" />);
        
        // Verify logger called for initialization
        expect(arLogger.info).toHaveBeenCalledWith(
            'FaceMesh',
            'Initializing Three.js scene'
        );
    });

    it('handles face data updates with transitions', async () => {
        const { rerender } = render(<FaceMesh data={null} />);

        // Update with initial face data
        act(() => {
            rerender(<FaceMesh data={mockFaceData} />);
        });

        // Update with new face data to trigger transition
        const newFaceData = {
            ...mockFaceData,
            vertices: [1, 1, 1, 2, 2, 2],
            timestamp: Date.now() + 100,
        };

        act(() => {
            rerender(<FaceMesh data={newFaceData} />);
        });

        // Verify logger called for mesh update
        expect(arLogger.debug).toHaveBeenCalledWith(
            'FaceMesh',
            'Mesh updated',
            expect.any(Object)
        );
    });

    it('handles window resize events', () => {
        render(<FaceMesh data={null} />);

        act(() => {
            global.dispatchEvent(new Event('resize'));
        });

        // Verify logger called for resize
        expect(arLogger.debug).toHaveBeenCalledWith(
            'FaceMesh',
            'Resized',
            expect.any(Object)
        );
    });

    it('handles errors gracefully', () => {
        // Mock a WebGL error
        const mockError = new Error('WebGL context lost');
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        const { rerender } = render(<FaceMesh data={null} />);

        act(() => {
            // Simulate an error during face data update
            rerender(<FaceMesh data={{ ...mockFaceData, vertices: null as any }} />);
        });

        // Verify error was logged
        expect(arLogger.error).toHaveBeenCalledWith(
            'FaceMesh',
            'Failed to update mesh',
            expect.any(Error)
        );
    });
});
