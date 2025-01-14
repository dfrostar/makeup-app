jQuery(function($) {
    'use strict';

    class ProfessionalsDirectory {
        constructor() {
            this.page = 1;
            this.loading = false;
            this.filters = {
                category: '',
                specialty: '',
                search: ''
            };

            this.init();
        }

        init() {
            this.container = $('#professionals-grid');
            this.loadMoreBtn = $('#load-more button');

            // Initialize filters
            this.initFilters();

            // Load initial professionals
            this.loadProfessionals();

            // Initialize infinite scroll
            this.initInfiniteScroll();
        }

        initFilters() {
            const self = this;

            // Search input
            $('#search-professionals').on('input', _.debounce(function() {
                self.filters.search = $(this).val();
                self.resetAndLoad();
            }, 500));

            // Category filter
            $('#category-filter').on('change', function() {
                self.filters.category = $(this).val();
                self.resetAndLoad();
            });

            // Specialty filter
            $('#specialty-filter').on('change', function() {
                self.filters.specialty = $(this).val();
                self.resetAndLoad();
            });
        }

        resetAndLoad() {
            this.page = 1;
            this.container.empty();
            this.loadProfessionals();
        }

        loadProfessionals() {
            if (this.loading) return;
            this.loading = true;

            this.loadMoreBtn.text(beautyDirectory.i18n.loading);

            $.ajax({
                url: beautyDirectory.api.url + '/professionals',
                method: 'GET',
                data: {
                    page: this.page,
                    ...this.filters
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', beautyDirectory.api.nonce);
                }
            })
            .done((response) => {
                if (response.length > 0) {
                    this.renderProfessionals(response);
                    this.page++;
                } else {
                    this.loadMoreBtn.parent().hide();
                }
            })
            .fail((jqXHR) => {
                console.error('Failed to load professionals:', jqXHR.responseJSON);
                this.showError(beautyDirectory.i18n.loadError);
            })
            .always(() => {
                this.loading = false;
                this.loadMoreBtn.text(beautyDirectory.i18n.loadMore);
            });
        }

        renderProfessionals(professionals) {
            professionals.forEach(professional => {
                const template = `
                    <div class="professional-card">
                        <div class="professional-header">
                            <h3>${professional.business_name}</h3>
                            ${this.getRatingStars(professional.average_rating)}
                            <span class="review-count">(${professional.review_count} ${beautyDirectory.i18n.reviews})</span>
                        </div>
                        <div class="professional-content">
                            <p class="experience">${professional.experience_years} ${beautyDirectory.i18n.yearsExperience}</p>
                            <p class="bio">${professional.bio}</p>
                        </div>
                        <div class="professional-actions">
                            <a href="${beautyDirectory.urls.professional}${professional.id}" class="button view-profile">
                                ${beautyDirectory.i18n.viewProfile}
                            </a>
                            <a href="${beautyDirectory.urls.booking}${professional.id}" class="button button-primary book-now">
                                ${beautyDirectory.i18n.bookNow}
                            </a>
                        </div>
                    </div>
                `;
                this.container.append(template);
            });
        }

        getRatingStars(rating) {
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

            return `
                <div class="rating">
                    ${'★'.repeat(fullStars)}
                    ${halfStar ? '½' : ''}
                    ${'☆'.repeat(emptyStars)}
                </div>
            `;
        }

        initInfiniteScroll() {
            const self = this;
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 1.0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !self.loading) {
                        self.loadProfessionals();
                    }
                });
            }, options);

            observer.observe(this.loadMoreBtn[0]);
        }

        showError(message) {
            const error = `
                <div class="beauty-directory-error">
                    <p>${message}</p>
                </div>
            `;
            this.container.append(error);
        }
    }

    // Initialize the directory
    new ProfessionalsDirectory();
});
