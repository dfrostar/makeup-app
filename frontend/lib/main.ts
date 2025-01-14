import {
    initScrollAnimations,
    init3DRotation,
    initHeroParallax,
    initHeaderAnimation,
    initFeatureAnimation
} from './animations';

import {
    initSmoothScroll,
    initSearch,
    initFilters,
    initVirtualTryOn,
    initIngredientGlossary,
    initPersonalizationQuiz
} from './features';

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Animations
    initHeaderAnimation();
    initScrollAnimations();
    init3DRotation();
    initHeroParallax();
    initFeatureAnimation();

    // Features
    initSmoothScroll();
    initSearch();
    initFilters();
    initVirtualTryOn();
    initIngredientGlossary();
    initPersonalizationQuiz();
});

// Export API for use in other files
export { ContentAPI } from './api';
