import { EventEmitter } from 'events';

interface VisualSearchOptions {
    maxImageSize?: number;
    supportedFormats?: string[];
    maxResults?: number;
    similarityThreshold?: number;
}

export class VisualSearchService extends EventEmitter {
    private options: VisualSearchOptions;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;

    constructor(options: VisualSearchOptions = {}) {
        super();
        this.options = {
            maxImageSize: 1024,
            supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
            maxResults: 10,
            similarityThreshold: 0.7,
            ...options,
        };

        // Create canvas for image processing
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    private async preprocessImage(file: File): Promise<ImageData | null> {
        if (!this.ctx) return null;

        try {
            // Check file type
            if (!this.options.supportedFormats?.includes(file.type)) {
                throw new Error(`Unsupported file type: ${file.type}`);
            }

            // Load image
            const image = await this.loadImage(file);
            
            // Resize image if necessary
            const { width, height } = this.calculateDimensions(image);
            this.canvas.width = width;
            this.canvas.height = height;

            // Draw and get image data
            this.ctx.drawImage(image, 0, 0, width, height);
            return this.ctx.getImageData(0, 0, width, height);
        } catch (error) {
            this.emit('error', error);
            return null;
        }
    }

    private loadImage(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    private calculateDimensions(image: HTMLImageElement): { width: number; height: number } {
        const maxSize = this.options.maxImageSize || 1024;
        let { width, height } = image;

        if (width > maxSize || height > maxSize) {
            if (width > height) {
                height = Math.round((height * maxSize) / width);
                width = maxSize;
            } else {
                width = Math.round((width * maxSize) / height);
                height = maxSize;
            }
        }

        return { width, height };
    }

    private async extractFeatures(imageData: ImageData): Promise<Float32Array> {
        // In a real implementation, this would use a pre-trained ML model
        // For now, we'll use a simple color histogram as a feature vector
        const data = imageData.data;
        const features = new Float32Array(768); // 256 bins for each RGB channel

        for (let i = 0; i < data.length; i += 4) {
            features[data[i]]++; // R
            features[256 + data[i + 1]]++; // G
            features[512 + data[i + 2]]++; // B
        }

        // Normalize
        const total = imageData.width * imageData.height;
        for (let i = 0; i < features.length; i++) {
            features[i] /= total;
        }

        return features;
    }

    private async searchSimilarProducts(features: Float32Array): Promise<any[]> {
        try {
            // In a real implementation, this would call your backend API
            // to search for similar products using the extracted features
            const response = await fetch('/api/visual-search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    features: Array.from(features),
                    maxResults: this.options.maxResults,
                    similarityThreshold: this.options.similarityThreshold,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch similar products');
            }

            return await response.json();
        } catch (error) {
            this.emit('error', error);
            return [];
        }
    }

    public async searchByImage(file: File): Promise<void> {
        try {
            this.emit('searchStart');

            // Preprocess image
            const imageData = await this.preprocessImage(file);
            if (!imageData) {
                throw new Error('Failed to process image');
            }

            // Extract features
            const features = await this.extractFeatures(imageData);

            // Search for similar products
            const results = await this.searchSimilarProducts(features);

            this.emit('searchComplete', results);
        } catch (error) {
            this.emit('error', error);
        }
    }

    public async searchByCamera(): Promise<void> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            await video.play();

            // Capture frame
            if (this.ctx) {
                this.canvas.width = video.videoWidth;
                this.canvas.height = video.videoHeight;
                this.ctx.drawImage(video, 0, 0);
            }

            // Stop camera
            stream.getTracks().forEach(track => track.stop());

            // Convert to blob and search
            const blob = await new Promise<Blob>((resolve) => {
                this.canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                }, 'image/jpeg');
            });

            await this.searchByImage(new File([blob], 'camera.jpg', { type: 'image/jpeg' }));
        } catch (error) {
            this.emit('error', error);
        }
    }

    public isSupported(): boolean {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
}
