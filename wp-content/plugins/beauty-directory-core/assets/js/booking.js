jQuery(function($) {
    'use strict';

    class BookingSystem {
        constructor() {
            this.form = $('#booking-form');
            this.serviceSelect = $('#service');
            this.dateInput = $('#date');
            this.timeSelect = $('#time');
            this.notesInput = $('#notes');
            this.totalPrice = $('#total-price');
            this.bookingDetails = $('#booking-details');

            this.init();
        }

        init() {
            this.initServiceSelect();
            this.initDatePicker();
            this.initTimeSelect();
            this.initFormSubmission();
        }

        initServiceSelect() {
            this.serviceSelect.on('change', () => {
                const selected = this.serviceSelect.find(':selected');
                const price = selected.data('price');
                const duration = selected.data('duration');

                if (price) {
                    this.totalPrice.text(this.formatPrice(price));
                }

                this.updateBookingDetails();
                this.resetTimeSelect();

                if (this.dateInput.val()) {
                    this.loadAvailableSlots();
                }
            });
        }

        initDatePicker() {
            const today = new Date();
            this.dateInput.attr('min', today.toISOString().split('T')[0]);

            this.dateInput.on('change', () => {
                this.resetTimeSelect();
                this.loadAvailableSlots();
                this.updateBookingDetails();
            });
        }

        initTimeSelect() {
            this.timeSelect.on('change', () => {
                this.updateBookingDetails();
            });
        }

        loadAvailableSlots() {
            const professionalId = this.form.find('input[name="professional_id"]').val();
            const date = this.dateInput.val();
            const service = this.serviceSelect.find(':selected');
            const duration = service.data('duration');

            if (!professionalId || !date || !duration) return;

            this.timeSelect.prop('disabled', true).html(
                `<option value="">${beautyDirectory.i18n.loadingSlots}</option>`
            );

            $.ajax({
                url: beautyDirectory.api.url + `/availability/${professionalId}`,
                method: 'GET',
                data: { date },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('X-WP-Nonce', beautyDirectory.api.nonce);
                }
            })
            .done((slots) => {
                this.populateTimeSlots(slots, duration);
            })
            .fail((jqXHR) => {
                console.error('Failed to load time slots:', jqXHR.responseJSON);
                this.timeSelect.html(
                    `<option value="">${beautyDirectory.i18n.errorLoadingSlots}</option>`
                );
            })
            .always(() => {
                this.timeSelect.prop('disabled', false);
            });
        }

        populateTimeSlots(slots, duration) {
            this.timeSelect.empty().append(
                `<option value="">${beautyDirectory.i18n.selectTime}</option>`
            );

            slots.forEach(slot => {
                const startTime = this.parseTime(slot);
                const endTime = new Date(startTime.getTime() + duration * 60000);

                // Only show slots that can accommodate the service duration
                const slotEnd = this.parseTime(slots[slots.indexOf(slot) + 1]);
                if (!slotEnd || endTime <= slotEnd) {
                    this.timeSelect.append(
                        `<option value="${slot}">${slot} - ${this.formatTime(endTime)}</option>`
                    );
                }
            });
        }

        parseTime(timeStr) {
            if (!timeStr) return null;
            const [hours, minutes] = timeStr.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            return date;
        }

        formatTime(date) {
            return date.toTimeString().substring(0, 5);
        }

        updateBookingDetails() {
            const service = this.serviceSelect.find(':selected');
            const date = this.dateInput.val();
            const time = this.timeSelect.val();

            if (!service.val() || !date || !time) {
                this.bookingDetails.empty();
                return;
            }

            const startTime = this.parseTime(time);
            const endTime = new Date(startTime.getTime() + service.data('duration') * 60000);

            const details = `
                <div class="booking-detail">
                    <span class="label">${beautyDirectory.i18n.service}:</span>
                    <span class="value">${service.text()}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">${beautyDirectory.i18n.date}:</span>
                    <span class="value">${this.formatDate(date)}</span>
                </div>
                <div class="booking-detail">
                    <span class="label">${beautyDirectory.i18n.time}:</span>
                    <span class="value">${time} - ${this.formatTime(endTime)}</span>
                </div>
            `;

            this.bookingDetails.html(details);
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

        resetTimeSelect() {
            this.timeSelect.prop('disabled', true).html(
                `<option value="">${beautyDirectory.i18n.selectDateFirst}</option>`
            );
        }

        initFormSubmission() {
            this.form.on('submit', (e) => {
                e.preventDefault();

                const data = {
                    professional_id: this.form.find('input[name="professional_id"]').val(),
                    service_id: this.serviceSelect.val(),
                    booking_date: this.dateInput.val(),
                    start_time: this.timeSelect.val(),
                    notes: this.notesInput.val()
                };

                $.ajax({
                    url: beautyDirectory.api.url + '/bookings',
                    method: 'POST',
                    data: data,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('X-WP-Nonce', beautyDirectory.api.nonce);
                    }
                })
                .done((response) => {
                    window.location.href = beautyDirectory.urls.bookingConfirmation + response.id;
                })
                .fail((jqXHR) => {
                    console.error('Booking failed:', jqXHR.responseJSON);
                    this.showError(beautyDirectory.i18n.bookingError);
                });
            });
        }

        showError(message) {
            const error = `
                <div class="beauty-directory-error">
                    <p>${message}</p>
                </div>
            `;
            this.form.prepend(error);
            setTimeout(() => {
                $('.beauty-directory-error').fadeOut(function() {
                    $(this).remove();
                });
            }, 5000);
        }
    }

    // Initialize the booking system
    new BookingSystem();
});
