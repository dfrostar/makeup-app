// Mock the window object
(global as any).window = {};

// Mock GSAP
const mockGsap = {
    from: jest.fn(),
    utils: {
        toArray: jest.fn(() => [
            { classList: { contains: jest.fn(() => true) } },
            { classList: { contains: jest.fn(() => true) } }
        ])
    },
    registerPlugin: jest.fn()
};

jest.mock('gsap', () => ({
    __esModule: true,
    gsap: mockGsap,
    ScrollTrigger: {}
}));

import { initScrollAnimations } from '../../../frontend/lib/animations';

describe('Animation Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register ScrollTrigger plugin', () => {
        initScrollAnimations();
        expect(mockGsap.registerPlugin).toHaveBeenCalled();
    });

    it('should create scroll triggers for elements', () => {
        initScrollAnimations();
        expect(mockGsap.utils.toArray).toHaveBeenCalledWith('.category-card');
        expect(mockGsap.from).toHaveBeenCalled();
    });

    it('should handle missing elements gracefully', () => {
        mockGsap.utils.toArray.mockReturnValueOnce([]);
        expect(() => initScrollAnimations()).not.toThrow();
    });

    it('should apply correct animation properties', () => {
        initScrollAnimations();
        expect(mockGsap.from).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                scrollTrigger: expect.any(Object),
                opacity: 0,
                y: expect.any(Number),
                duration: expect.any(Number)
            })
        );
    });
});
