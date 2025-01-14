// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Animate elements on scroll
function initScrollAnimations() {
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
}

// Initialize 3D product rotation
function init3DRotation() {
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
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax effect for hero section
function initParallax() {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                // TODO: Implement search functionality
                console.log('Searching for:', query);
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    // TODO: Implement search functionality
                    console.log('Searching for:', query);
                }
            }
        });
    }
}

// Filter functionality for products and looks
function initFilters() {
    const productFilters = document.querySelector('.product-filters');
    const lookFilters = document.querySelector('.looks-filters');

    if (productFilters) {
        productFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filter = e.target.dataset.filter;
                const buttons = productFilters.querySelectorAll('.filter-btn');
                const products = document.querySelectorAll('.product-card');

                // Update active button
                buttons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Filter products
                products.forEach(product => {
                    if (filter === 'all' || product.dataset.category.includes(filter)) {
                        gsap.to(product, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.3,
                            ease: 'power2.out',
                            clearProps: 'all'
                        });
                    } else {
                        gsap.to(product, {
                            opacity: 0.3,
                            scale: 0.95,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                });
            }
        });
    }

    if (lookFilters) {
        lookFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                const filter = e.target.dataset.filter;
                const buttons = lookFilters.querySelectorAll('.filter-btn');
                const looks = document.querySelectorAll('.look-card');

                // Update active button
                buttons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Filter looks
                looks.forEach(look => {
                    if (filter === 'all' || look.dataset.category === filter) {
                        gsap.to(look, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.3,
                            ease: 'power2.out',
                            clearProps: 'all'
                        });
                    } else {
                        gsap.to(look, {
                            opacity: 0.3,
                            scale: 0.95,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                });
            }
        });
    }
}

// Upload look functionality
function initUploadLook() {
    const uploadButton = document.getElementById('uploadLook');
    if (uploadButton) {
        uploadButton.addEventListener('click', () => {
            // TODO: Implement file upload functionality
            console.log('Upload look clicked');
        });
    }
}

// Tutorial links functionality
function initTutorialLinks() {
    document.querySelectorAll('.tutorial-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // TODO: Implement tutorial modal or redirect
            console.log('Tutorial clicked:', e.target.closest('.look-card').querySelector('h3').textContent);
        });
    });
}

// Review Section Functionality
function initReviews() {
    const reviewSort = document.querySelector('.review-sort');
    const filterTags = document.querySelectorAll('.filter-tag');
    const helpfulBtns = document.querySelectorAll('.helpful-btn');
    const reviewCards = document.querySelectorAll('.review-card');
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    const pageNumbers = document.querySelectorAll('.page-numbers button');
    const certificationBadges = document.querySelectorAll('.certification-badge');

    // Handle review sorting
    reviewSort?.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        // In a real application, this would make an API call to sort reviews
        console.log(`Sorting reviews by: ${sortValue}`);
    });

    // Handle filter tags
    filterTags?.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            // In a real application, this would filter the reviews
            console.log(`Filtering reviews by: ${tag.textContent}`);
        });
    });

    // Handle helpful buttons
    helpfulBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            const span = btn.querySelector('span');
            const currentCount = parseInt(span.textContent.match(/\d+/)[0]);
            span.textContent = `Helpful (${currentCount + 1})`;
            btn.disabled = true;
            btn.style.opacity = '0.7';
        });
    });

    // Handle pagination
    pageNumbers?.forEach(btn => {
        btn.addEventListener('click', () => {
            pageNumbers.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // In a real application, this would load the corresponding page
            console.log(`Loading page: ${btn.textContent}`);
        });
    });

    paginationBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentPage = document.querySelector('.page-numbers button.active');
            const currentPageNum = parseInt(currentPage.textContent);
            if (btn.classList.contains('prev') && currentPageNum > 1) {
                // Go to previous page
                const prevBtn = document.querySelector(`.page-numbers button:nth-child(${currentPageNum - 1})`);
                if (prevBtn) {
                    pageNumbers.forEach(b => b.classList.remove('active'));
                    prevBtn.classList.add('active');
                }
            } else if (btn.classList.contains('next')) {
                // Go to next page
                const nextBtn = document.querySelector(`.page-numbers button:nth-child(${currentPageNum + 1})`);
                if (nextBtn) {
                    pageNumbers.forEach(b => b.classList.remove('active'));
                    nextBtn.classList.add('active');
                }
            }
        });
    });

    // Handle certification badges hover
    certificationBadges?.forEach(badge => {
        badge.addEventListener('mouseover', () => {
            const title = badge.getAttribute('title');
            // Show tooltip with certification information
            console.log(`Showing tooltip for: ${title}`);
        });
    });
}

// Virtual Try-On Feature
function initVirtualTryOn() {
    const startCameraBtn = document.getElementById('startCamera');
    const takePhotoBtn = document.getElementById('takePhoto');
    const uploadPhotoBtn = document.getElementById('uploadPhoto');
    const photoUpload = document.getElementById('photoUpload');
    const webcam = document.getElementById('webcam');
    const overlay = document.getElementById('overlay');
    const productItems = document.querySelectorAll('.product-item');
    const categoryBtns = document.querySelectorAll('.product-categories .category-btn');

    let stream = null;
    let selectedProduct = null;

    // Handle camera start
    startCameraBtn?.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcam.srcObject = stream;
            takePhotoBtn.disabled = false;
            startCameraBtn.textContent = 'Stop Camera';
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Unable to access camera. Please make sure you have granted camera permissions.');
        }
    });

    // Handle photo upload
    uploadPhotoBtn?.addEventListener('click', () => {
        photoUpload.click();
    });

    photoUpload?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    overlay.getContext('2d').drawImage(img, 0, 0, overlay.width, overlay.height);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle product selection
    productItems?.forEach(item => {
        item.addEventListener('click', () => {
            productItems.forEach(p => p.classList.remove('selected'));
            item.classList.add('selected');
            selectedProduct = {
                type: item.dataset.type,
                color: item.dataset.color
            };
            applyMakeup();
        });
    });

    // Handle category selection
    categoryBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            productItems.forEach(item => {
                item.style.display = item.dataset.type === category ? 'block' : 'none';
            });
        });
    });

    function applyMakeup() {
        if (!selectedProduct) return;
        
        const ctx = overlay.getContext('2d');
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        
        // In a real application, this would use face detection and AR
        // to apply the makeup. For now, we'll just show a placeholder effect
        ctx.fillStyle = selectedProduct.color;
        ctx.globalAlpha = 0.3;
        
        switch (selectedProduct.type) {
            case 'lipstick':
                // Simplified lipstick effect
                ctx.fillRect(overlay.width * 0.4, overlay.height * 0.7, 
                           overlay.width * 0.2, overlay.height * 0.05);
                break;
            case 'foundation':
                // Simplified foundation effect
                ctx.fillRect(0, 0, overlay.width, overlay.height);
                break;
            // Add more product types as needed
        }
        
        ctx.globalAlpha = 1;
    }
}

// Ingredient Glossary
function initIngredientGlossary() {
    const toggleBtns = document.querySelectorAll('.view-toggle .toggle-btn');
    const ingredientSearch = document.querySelector('.ingredient-search');
    const ingredientsGrid = document.querySelector('.ingredients-grid');

    toggleBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.dataset.view;
            ingredientsGrid.dataset.view = view;
            // In a real application, this would reorganize the ingredients
            console.log(`Switching to ${view} view`);
        });
    });

    ingredientSearch?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const ingredients = document.querySelectorAll('.ingredient-card');
        
        ingredients.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || description.includes(searchTerm);
            card.style.display = isVisible ? 'block' : 'none';
        });
    });
}

// Personalization Quiz
function initPersonalizationQuiz() {
    const quizContainer = document.querySelector('.quiz-container');
    const progressBar = document.querySelector('.quiz-progress .progress');
    const progressText = document.querySelector('.progress-text');
    const prevBtn = document.querySelector('.quiz-navigation .prev');
    const nextBtn = document.querySelector('.quiz-navigation .next');
    const optionBtns = document.querySelectorAll('.option-btn');

    let currentQuestion = 1;
    const totalQuestions = 5;
    const answers = {};

    function updateProgress() {
        const progress = (currentQuestion - 1) / totalQuestions * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
        
        prevBtn.disabled = currentQuestion === 1;
        nextBtn.textContent = currentQuestion === totalQuestions ? 'Finish' : 'Next';
    }

    prevBtn?.addEventListener('click', () => {
        if (currentQuestion > 1) {
            currentQuestion--;
            updateProgress();
        }
    });

    nextBtn?.addEventListener('click', () => {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            updateProgress();
        } else {
            // Quiz completed
            console.log('Quiz answers:', answers);
            // In a real application, this would submit the answers and show recommendations
        }
    });

    optionBtns?.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.closest('.quiz-question').dataset.question;
            const value = btn.dataset.value;
            
            // Remove selection from other options in the same question
            const questionBtns = btn.closest('.options-grid').querySelectorAll('.option-btn');
            questionBtns.forEach(b => b.classList.remove('selected'));
            
            // Select this option
            btn.classList.add('selected');
            answers[question] = value;
            
            // Enable next button if an option is selected
            nextBtn.disabled = false;
        });
    });

    // Initialize quiz
    updateProgress();
}

// Content Management System
const ContentAPI = {
    // API endpoints
    endpoints: {
        products: 'https://makeup-api.herokuapp.com/api/v1/products.json',
        ingredients: 'https://api.cosmeticsinfo.org/ingredients',
        trends: 'https://api.trendsapi.com/beauty',  // Example endpoint
    },

    // API keys - should be moved to environment variables
    keys: {
        sephora: process.env.SEPHORA_API_KEY,
        ulta: process.env.ULTA_API_KEY,
    },

    // Cache management
    cache: new Map(),
    cacheExpiry: {
        products: 24 * 60 * 60 * 1000,  // 24 hours
        trends: 7 * 24 * 60 * 60 * 1000,  // 7 days
        ingredients: 30 * 24 * 60 * 60 * 1000,  // 30 days
    },

    async fetchWithCache(key, fetcher, expiry) {
        const cached = this.cache.get(key);
        if (cached && (Date.now() - cached.timestamp < expiry)) {
            return cached.data;
        }
        
        const data = await fetcher();
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
        return data;
    },

    // Product data fetching
    async getProducts(category = null) {
        const fetcher = async () => {
            try {
                // Try primary source
                const response = await fetch(this.endpoints.products);
                if (!response.ok) throw new Error('Primary API failed');
                return await response.json();
            } catch (error) {
                console.warn('Falling back to secondary source:', error);
                // Fallback to secondary source
                return this.getProductsFallback(category);
            }
        };

        return this.fetchWithCache(`products-${category}`, fetcher, this.cacheExpiry.products);
    },

    // Ingredient information
    async getIngredients(query = '') {
        const fetcher = async () => {
            try {
                const response = await fetch(`${this.endpoints.ingredients}?search=${query}`);
                return await response.json();
            } catch (error) {
                console.error('Error fetching ingredients:', error);
                return this.getIngredientsFallback(query);
            }
        };

        return this.fetchWithCache(`ingredients-${query}`, fetcher, this.cacheExpiry.ingredients);
    },

    // Trending content
    async getTrendingLooks() {
        const fetcher = async () => {
            try {
                const response = await fetch(this.endpoints.trends);
                return await response.json();
            } catch (error) {
                return this.getTrendingLooksFallback();
            }
        };

        return this.fetchWithCache('trending-looks', fetcher, this.cacheExpiry.trends);
    },

    // Fallback data methods
    async getProductsFallback(category) {
        // Implement local fallback data
        return fallbackProducts.filter(p => !category || p.category === category);
    },

    async getIngredientsFallback(query) {
        return fallbackIngredients.filter(i => 
            !query || i.name.toLowerCase().includes(query.toLowerCase())
        );
    },

    async getTrendingLooksFallback() {
        return fallbackTrendingLooks;
    }
};

// Fallback data
const fallbackProducts = [
    {
        id: 1,
        name: "Fresh Face Glow Kit",
        category: "face",
        products: [
            "Tinted Moisturizer",
            "Cream Blush",
            "Clear Brow Gel",
            "Lip Oil"
        ],
        image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?ixlib=rb-4.0.3"
    },
    // Add more fallback products...
];

const fallbackIngredients = [
    {
        name: "Hyaluronic Acid",
        description: "A powerful humectant that can hold up to 1000x its weight in water",
        benefits: ["Hydrating", "Anti-aging", "Plumping"],
        safetyRating: 1
    },
    // Add more fallback ingredients...
];

const fallbackTrendingLooks = [
    {
        name: "Sultry Night Out",
        category: "glam",
        products: [
            "Full Coverage Foundation",
            "Smokey Eye Palette",
            "False Lashes",
            "Metallic Highlighter"
        ],
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-4.0.3"
    },
    // Add more fallback looks...
];

// Initialize all features when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    init3DRotation();
    initSmoothScroll();
    initParallax();
    initSearch();
    initFilters();
    initUploadLook();
    initTutorialLinks();
    initReviews();
    initVirtualTryOn();
    initIngredientGlossary();
    initPersonalizationQuiz();
});
