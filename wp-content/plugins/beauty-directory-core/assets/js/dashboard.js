jQuery(function($) {
    'use strict';

    class ProfessionalDashboard {
        constructor() {
            this.init();
        }

        init() {
            this.initTabs();
            this.loadUpcomingBookings();
            this.loadReviews();
            this.initAnalytics();
            this.initServiceManagement();
            this.initPortfolioManagement();
        }

        initTabs() {
            $('.dashboard-tab').on('click', function(e) {
                e.preventDefault();
                const target = $(this).data('target');
                
                $('.dashboard-tab').removeClass('active');
                $(this).addClass('active');
                
                $('.dashboard-section').hide();
                $(`#${target}`).show();
            });
        }

        loadUpcomingBookings() {
            $.ajax({
                url: beautyDirectory.api.url + '/bookings',
                method: 'GET',
                data: { status: 'upcoming' },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', beautyDirectory.api.nonce);
                }
            })
            .done((bookings) => {
                this.renderBookings(bookings);
            })
            .fail((jqXHR) => {
                console.error('Failed to load bookings:', jqXHR.responseJSON);
                this.showError('#upcoming-bookings', beautyDirectory.i18n.loadBookingsError);
            });
        }

        renderBookings(bookings) {
            const container = $('#upcoming-bookings');
            container.empty();

            if (bookings.length === 0) {
                container.html(`<p class="no-data">${beautyDirectory.i18n.noBookings}</p>`);
                return;
            }

            const bookingsList = $('<div class="bookings-list"></div>');
            
            bookings.forEach(booking => {
                const template = `
                    <div class="booking-card" data-id="${booking.id}">
                        <div class="booking-header">
                            <h4>${booking.service_name}</h4>
                            <span class="booking-status ${booking.status}">${booking.status}</span>
                        </div>
                        <div class="booking-details">
                            <p class="customer">
                                <i class="fas fa-user"></i> ${booking.customer_name}
                            </p>
                            <p class="datetime">
                                <i class="fas fa-calendar"></i> ${this.formatDate(booking.booking_date)}
                                <i class="fas fa-clock"></i> ${booking.start_time} - ${booking.end_time}
                            </p>
                            <p class="price">
                                <i class="fas fa-tag"></i> ${this.formatPrice(booking.total_price)}
                            </p>
                        </div>
                        <div class="booking-actions">
                            ${this.getBookingActions(booking)}
                        </div>
                    </div>
                `;
                bookingsList.append(template);
            });

            container.append(bookingsList);
            this.initBookingActions();
        }

        getBookingActions(booking) {
            const actions = [];

            switch (booking.status) {
                case 'pending':
                    actions.push(`
                        <button class="button accept-booking" data-id="${booking.id}">
                            ${beautyDirectory.i18n.accept}
                        </button>
                        <button class="button decline-booking" data-id="${booking.id}">
                            ${beautyDirectory.i18n.decline}
                        </button>
                    `);
                    break;
                case 'confirmed':
                    actions.push(`
                        <button class="button complete-booking" data-id="${booking.id}">
                            ${beautyDirectory.i18n.complete}
                        </button>
                        <button class="button cancel-booking" data-id="${booking.id}">
                            ${beautyDirectory.i18n.cancel}
                        </button>
                    `);
                    break;
            }

            return actions.join('');
        }

        initBookingActions() {
            $('.accept-booking').on('click', (e) => {
                this.updateBookingStatus($(e.target).data('id'), 'confirmed');
            });

            $('.decline-booking').on('click', (e) => {
                this.updateBookingStatus($(e.target).data('id'), 'declined');
            });

            $('.complete-booking').on('click', (e) => {
                this.updateBookingStatus($(e.target).data('id'), 'completed');
            });

            $('.cancel-booking').on('click', (e) => {
                this.updateBookingStatus($(e.target).data('id'), 'cancelled');
            });
        }

        updateBookingStatus(bookingId, status) {
            $.ajax({
                url: beautyDirectory.api.url + `/bookings/${bookingId}`,
                method: 'PATCH',
                data: { status },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', beautyDirectory.api.nonce);
                }
            })
            .done(() => {
                this.loadUpcomingBookings();
            })
            .fail((jqXHR) => {
                console.error('Failed to update booking:', jqXHR.responseJSON);
                this.showError('#upcoming-bookings', beautyDirectory.i18n.updateBookingError);
            });
        }

        loadReviews() {
            $.ajax({
                url: beautyDirectory.api.url + '/reviews',
                method: 'GET',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', beautyDirectory.api.nonce);
                }
            })
            .done((reviews) => {
                this.renderReviews(reviews);
            })
            .fail((jqXHR) => {
                console.error('Failed to load reviews:', jqXHR.responseJSON);
                this.showError('#recent-reviews', beautyDirectory.i18n.loadReviewsError);
            });
        }

        renderReviews(reviews) {
            const container = $('#recent-reviews');
            container.empty();

            if (reviews.length === 0) {
                container.html(`<p class="no-data">${beautyDirectory.i18n.noReviews}</p>`);
                return;
            }

            const reviewsList = $('<div class="reviews-list"></div>');
            
            reviews.forEach(review => {
                const template = `
                    <div class="review-card">
                        <div class="review-header">
                            <div class="reviewer-info">
                                <h4>${review.customer_name}</h4>
                                <div class="rating">
                                    ${this.getRatingStars(review.rating)}
                                </div>
                            </div>
                            <span class="review-date">${this.formatDate(review.created_at)}</span>
                        </div>
                        <div class="review-content">
                            <p>${review.comment}</p>
                        </div>
                        ${review.response ? `
                            <div class="review-response">
                                <h5>${beautyDirectory.i18n.yourResponse}:</h5>
                                <p>${review.response}</p>
                            </div>
                        ` : `
                            <div class="review-actions">
                                <button class="button respond-to-review" data-id="${review.id}">
                                    ${beautyDirectory.i18n.respond}
                                </button>
                            </div>
                        `}
                    </div>
                `;
                reviewsList.append(template);
            });

            container.append(reviewsList);
            this.initReviewActions();
        }

        initReviewActions() {
            $('.respond-to-review').on('click', (e) => {
                const reviewId = $(e.target).data('id');
                this.showResponseForm(reviewId);
            });
        }

        showResponseForm(reviewId) {
            const form = $(`
                <div class="response-form">
                    <textarea placeholder="${beautyDirectory.i18n.typeResponse}"></textarea>
                    <div class="form-actions">
                        <button class="button submit-response">${beautyDirectory.i18n.submit}</button>
                        <button class="button cancel-response">${beautyDirectory.i18n.cancel}</button>
                    </div>
                </div>
            `);

            const reviewCard = $(`.review-card:has(button[data-id="${reviewId}"])`);
            reviewCard.find('.review-actions').replaceWith(form);

            form.find('.submit-response').on('click', () => {
                const response = form.find('textarea').val();
                this.submitResponse(reviewId, response);
            });

            form.find('.cancel-response').on('click', () => {
                this.loadReviews();
            });
        }

        submitResponse(reviewId, response) {
            $.ajax({
                url: beautyDirectory.api.url + `/reviews/${reviewId}/response`,
                method: 'POST',
                data: { response },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', beautyDirectory.api.nonce);
                }
            })
            .done(() => {
                this.loadReviews();
            })
            .fail((jqXHR) => {
                console.error('Failed to submit response:', jqXHR.responseJSON);
                this.showError('#recent-reviews', beautyDirectory.i18n.submitResponseError);
            });
        }

        initAnalytics() {
            this.loadAnalyticsData();
            this.initDateRangePicker();
        }

        loadAnalyticsData() {
            const startDate = $('#analytics-start-date').val();
            const endDate = $('#analytics-end-date').val();

            $.ajax({
                url: beautyDirectory.api.url + '/analytics',
                method: 'GET',
                data: { start_date: startDate, end_date: endDate },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', beautyDirectory.api.nonce);
                }
            })
            .done((data) => {
                this.renderAnalytics(data);
            })
            .fail((jqXHR) => {
                console.error('Failed to load analytics:', jqXHR.responseJSON);
                this.showError('#analytics-charts', beautyDirectory.i18n.loadAnalyticsError);
            });
        }

        renderAnalytics(data) {
            this.renderRevenueChart(data.revenue);
            this.renderBookingsChart(data.bookings);
            this.renderServiceStats(data.services);
            this.renderCustomerStats(data.customers);
        }

        renderRevenueChart(data) {
            const ctx = document.getElementById('revenue-chart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: beautyDirectory.i18n.revenue,
                        data: data.values,
                        borderColor: '#2ecc71',
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => this.formatPrice(value)
                            }
                        }
                    }
                }
            });
        }

        initServiceManagement() {
            $('#add-service').on('click', () => {
                this.showServiceForm();
            });

            this.loadServices();
        }

        loadServices() {
            $.ajax({
                url: beautyDirectory.api.url + '/services',
                method: 'GET',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', beautyDirectory.api.nonce);
                }
            })
            .done((services) => {
                this.renderServices(services);
            })
            .fail((jqXHR) => {
                console.error('Failed to load services:', jqXHR.responseJSON);
                this.showError('#services-list', beautyDirectory.i18n.loadServicesError);
            });
        }

        initPortfolioManagement() {
            $('#add-portfolio-item').on('click', () => {
                this.showPortfolioForm();
            });

            this.loadPortfolio();
        }

        formatDate(dateStr) {
            return new Date(dateStr).toLocaleDateString(
                beautyDirectory.locale,
                { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            );
        }

        formatPrice(price) {
            return new Intl.NumberFormat(beautyDirectory.locale, {
                style: 'currency',
                currency: beautyDirectory.currency
            }).format(price);
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

        showError(selector, message) {
            const error = `
                <div class="beauty-directory-error">
                    <p>${message}</p>
                </div>
            `;
            $(selector).prepend(error);
            setTimeout(() => {
                $('.beauty-directory-error').fadeOut(function() {
                    $(this).remove();
                });
            }, 5000);
        }
    }

    // Initialize the dashboard
    new ProfessionalDashboard();
});
