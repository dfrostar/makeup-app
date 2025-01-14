import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';

// Only register plugin in browser environment
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const initScrollAnimations = () => {
    // Animate category cards
    gsap.utils.toArray('.category-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Animate product cards
    gsap.utils.toArray('.product-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });
    });
};

export const init3DRotation = () => {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
};

export const initHeroParallax = () => {
    gsap.to('.hero-image', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        ease: 'none'
    });
};

export const initHeaderAnimation = () => {
    gsap.from('.header', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
};

export const initFeatureAnimation = () => {
    gsap.from('.feature', {
        scrollTrigger: {
            trigger: '.features-section',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.3,
        ease: 'back.out(1.7)'
    });
};
