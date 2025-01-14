// Image Service for CDN management
const ImageService = {
    // Cloudinary configuration
    cloudConfig: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    },

    // Image transformation options
    transformations: {
        thumbnail: { width: 200, height: 200, crop: 'fill' },
        product: { width: 600, height: 600, crop: 'fill' },
        look: { width: 800, height: 600, crop: 'fill' },
        profile: { width: 150, height: 150, crop: 'fill', gravity: 'face' }
    },

    // Generate CDN URL with transformations
    getImageUrl(publicId, transformation = 'thumbnail') {
        const trans = this.transformations[transformation];
        const baseUrl = `https://res.cloudinary.com/${this.cloudConfig.cloudName}/image/upload`;
        const transformString = Object.entries(trans)
            .map(([key, value]) => `${key}_${value}`)
            .join(',');
        
        return `${baseUrl}/${transformString}/${publicId}`;
    },

    // Lazy loading implementation
    setupLazyLoading() {
        const images = document.querySelectorAll('[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    },

    // Fallback image handling
    handleImageError(img) {
        const fallbacks = {
            product: '/assets/fallbacks/product-placeholder.jpg',
            look: '/assets/fallbacks/look-placeholder.jpg',
            profile: '/assets/fallbacks/profile-placeholder.jpg'
        };
        
        const type = img.dataset.type || 'product';
        img.src = fallbacks[type];
        img.classList.add('fallback-image');
    }
};

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ImageService.setupLazyLoading();
});

// Export the service
export default ImageService;
