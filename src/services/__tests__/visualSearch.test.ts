import { VisualSearchService } from '../visualSearch';

describe('VisualSearchService', () => {
    let visualService: VisualSearchService;

    beforeEach(() => {
        // Mock mediaDevices
        (global as any).navigator = {
            mediaDevices: {
                getUserMedia: jest.fn().mockResolvedValue({
                    getTracks: () => [{
                        stop: jest.fn()
                    }]
                })
            }
        };

        // Mock URL
        (global as any).URL = {
            createObjectURL: jest.fn(),
            revokeObjectURL: jest.fn()
        };

        visualService = new VisualSearchService();
    });

    afterEach(() => {
        jest.clearAllMocks();
        delete (global as any).navigator;
        delete (global as any).URL;
    });

    it('should initialize with default options', () => {
        expect(visualService.isSupported()).toBe(true);
    });

    it('should handle image search', (done) => {
        const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

        visualService.on('searchStart', () => {
            expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
        });

        visualService.on('searchComplete', (result) => {
            expect(result).toBeTruthy();
            done();
        });

        visualService.searchByImage(mockFile);
    });

    it('should handle unsupported file types', (done) => {
        const mockFile = new File([''], 'test.txt', { type: 'text/plain' });

        visualService.on('error', (error) => {
            expect(error.message).toContain('Unsupported file type');
            done();
        });

        visualService.searchByImage(mockFile);
    });

    it('should handle camera search', (done) => {
        visualService.on('searchStart', () => {
            expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
        });

        visualService.on('searchComplete', (result) => {
            expect(result).toBeTruthy();
            done();
        });

        visualService.searchByCamera();
    });

    it('should handle camera errors', (done) => {
        (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValueOnce(new Error('Camera access denied'));

        visualService.on('error', (error) => {
            expect(error.message).toBe('Camera access denied');
            done();
        });

        visualService.searchByCamera();
    });

    it('should handle errors gracefully', (done) => {
        const mockError = new Error('Test error');
        
        visualService.on('error', (error) => {
            expect(error).toBe(mockError);
            done();
        });

        visualService.emit('error', mockError);
    });

    it('should cleanup resources', () => {
        const mockStream = {
            getTracks: () => [{
                stop: jest.fn()
            }]
        };

        visualService.cleanup();
        expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
});
