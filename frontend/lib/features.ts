export const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href')!);
            target?.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
};

export const initSearch = () => {
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    const searchResults = document.querySelector('.search-results');

    if (!searchInput || !searchResults) return;

    let debounceTimer: NodeJS.Timeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = (e.target as HTMLInputElement).value;
            if (query.length >= 2) {
                fetch(`/api/search?q=${encodeURIComponent(query)}`)
                    .then(res => res.json())
                    .then(data => {
                        // Update search results
                        searchResults.innerHTML = data.map((item: any) => `
                            <div class="search-result-item">
                                <img src="${item.image}" alt="${item.name}" />
                                <div class="search-result-info">
                                    <h3>${item.name}</h3>
                                    <p>${item.description}</p>
                                </div>
                            </div>
                        `).join('');
                    })
                    .catch(console.error);
            } else {
                searchResults.innerHTML = '';
            }
        }, 300);
    });
};

export const initFilters = () => {
    const filterForm = document.querySelector('.filter-form') as HTMLFormElement;
    if (!filterForm) return;

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(filterForm);
        const params = new URLSearchParams();

        formData.forEach((value, key) => {
            if (value) params.append(key, value.toString());
        });

        // Update URL with filters
        window.history.pushState({}, '', `?${params.toString()}`);

        // Fetch and update results
        fetch(`/api/products?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                const productsGrid = document.querySelector('.products-grid');
                if (productsGrid) {
                    productsGrid.innerHTML = data.map((product: any) => `
                        <div class="product-card">
                            <img src="${product.image}" alt="${product.name}" />
                            <h3>${product.name}</h3>
                            <p>${product.price}</p>
                        </div>
                    `).join('');
                }
            })
            .catch(console.error);
    });
};

export const initVirtualTryOn = () => {
    const video = document.querySelector('.virtual-try-on-video') as HTMLVideoElement;
    const canvas = document.querySelector('.virtual-try-on-canvas') as HTMLCanvasElement;
    
    if (!video || !canvas) return;

    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error('Error accessing camera:', err);
            // Show fallback UI
        });

    // Initialize face detection and AR overlay
    // This is a placeholder - actual implementation would use TensorFlow.js or similar
    const detectFace = () => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Add face detection and AR overlay logic here
        requestAnimationFrame(detectFace);
    };

    video.addEventListener('play', detectFace);
};

export const initIngredientGlossary = () => {
    const glossaryItems = document.querySelectorAll('.ingredient-item');
    
    glossaryItems.forEach(item => {
        item.addEventListener('click', () => {
            const details = item.querySelector('.ingredient-details');
            details?.classList.toggle('active');
        });
    });
};

export const initPersonalizationQuiz = () => {
    const quizForm = document.querySelector('.quiz-form') as HTMLFormElement;
    if (!quizForm) return;

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(quizForm);
        const answers: Record<string, string> = {};

        formData.forEach((value, key) => {
            answers[key] = value.toString();
        });

        // Send quiz answers to backend
        fetch('/api/personalization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answers)
        })
            .then(res => res.json())
            .then(recommendations => {
                // Update UI with personalized recommendations
                const recommendationsContainer = document.querySelector('.recommendations');
                if (recommendationsContainer) {
                    recommendationsContainer.innerHTML = recommendations.map((rec: any) => `
                        <div class="recommendation-card">
                            <img src="${rec.image}" alt="${rec.name}" />
                            <h3>${rec.name}</h3>
                            <p>${rec.description}</p>
                        </div>
                    `).join('');
                }
            })
            .catch(console.error);
    });
};
