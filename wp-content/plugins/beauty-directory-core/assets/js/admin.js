jQuery(document).ready(function($) {
    // Initialize charts if we're on the dashboard page
    if ($('#revenue-chart').length) {
        initializeCharts();
    }

    // Handle professional verification
    $('.verify-professional').on('click', function(e) {
        e.preventDefault();
        const professionalId = $(this).data('id');
        
        if (confirm(beautyDirectoryAdmin.i18n.confirmVerify)) {
            verifyProfessional(professionalId);
        }
    });

    // Handle professional suspension
    $('.suspend-professional').on('click', function(e) {
        e.preventDefault();
        const professionalId = $(this).data('id');
        
        if (confirm(beautyDirectoryAdmin.i18n.confirmSuspend)) {
            suspendProfessional(professionalId);
        }
    });

    // Handle view details modal
    $('.view-details').on('click', function(e) {
        e.preventDefault();
        const professionalId = $(this).data('id');
        loadProfessionalDetails(professionalId);
    });

    // Handle status filter changes
    $('#filter-by-status').on('change', function() {
        $(this).closest('form').submit();
    });

    // Initialize datepickers
    if ($.fn.datepicker) {
        $('.datepicker').datepicker({
            dateFormat: 'yy-mm-dd'
        });
    }

    // Functions for professional management
    function verifyProfessional(professionalId) {
        $.ajax({
            url: beautyDirectoryAdmin.api.url + '/professionals/' + professionalId + '/verify',
            method: 'POST',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', beautyDirectoryAdmin.api.nonce);
            },
            success: function(response) {
                showNotice(beautyDirectoryAdmin.i18n.saveSuccess, 'success');
                location.reload();
            },
            error: function() {
                showNotice(beautyDirectoryAdmin.i18n.saveFail, 'error');
            }
        });
    }

    function suspendProfessional(professionalId) {
        $.ajax({
            url: beautyDirectoryAdmin.api.url + '/professionals/' + professionalId + '/suspend',
            method: 'POST',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', beautyDirectoryAdmin.api.nonce);
            },
            success: function(response) {
                showNotice(beautyDirectoryAdmin.i18n.saveSuccess, 'success');
                location.reload();
            },
            error: function() {
                showNotice(beautyDirectoryAdmin.i18n.saveFail, 'error');
            }
        });
    }

    function loadProfessionalDetails(professionalId) {
        $.ajax({
            url: beautyDirectoryAdmin.api.url + '/professionals/' + professionalId,
            method: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', beautyDirectoryAdmin.api.nonce);
            },
            success: function(professional) {
                showProfessionalModal(professional);
            },
            error: function() {
                showNotice(beautyDirectoryAdmin.i18n.loadFail, 'error');
            }
        });
    }

    function showProfessionalModal(professional) {
        const modal = $('<div>', {
            class: 'beauty-directory-modal',
            html: `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>${professional.business_name}</h2>
                    <div class="professional-details">
                        <div class="detail-row">
                            <label>Owner:</label>
                            <span>${professional.owner_name}</span>
                        </div>
                        <div class="detail-row">
                            <label>Email:</label>
                            <span>${professional.email}</span>
                        </div>
                        <div class="detail-row">
                            <label>Phone:</label>
                            <span>${professional.phone}</span>
                        </div>
                        <div class="detail-row">
                            <label>Address:</label>
                            <span>${professional.address}</span>
                        </div>
                        <div class="detail-row">
                            <label>Services:</label>
                            <ul>
                                ${professional.services.map(service => `
                                    <li>${service.name} - ${service.price}</li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="detail-row">
                            <label>Rating:</label>
                            <span>${'★'.repeat(Math.round(professional.average_rating))}${'☆'.repeat(5 - Math.round(professional.average_rating))} (${professional.review_count} reviews)</span>
                        </div>
                    </div>
                </div>
            `
        });

        $('body').append(modal);
        modal.find('.close').on('click', function() {
            modal.remove();
        });
    }

    // Initialize dashboard charts
    function initializeCharts() {
        const ctx1 = document.getElementById('revenue-chart').getContext('2d');
        const ctx2 = document.getElementById('bookings-chart').getContext('2d');

        // Fetch data for charts
        $.ajax({
            url: beautyDirectoryAdmin.api.url + '/stats/charts',
            method: 'GET',
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-WP-Nonce', beautyDirectoryAdmin.api.nonce);
            },
            success: function(data) {
                // Revenue Chart
                new Chart(ctx1, {
                    type: 'line',
                    data: {
                        labels: data.revenue.labels,
                        datasets: [{
                            label: 'Revenue',
                            data: data.revenue.data,
                            borderColor: '#2271b1',
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Monthly Revenue'
                            }
                        }
                    }
                });

                // Bookings Chart
                new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: data.bookings.labels,
                        datasets: [{
                            label: 'Bookings',
                            data: data.bookings.data,
                            backgroundColor: '#2271b1'
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Monthly Bookings'
                            }
                        }
                    }
                });
            }
        });
    }

    // Helper function to show admin notices
    function showNotice(message, type) {
        const notice = $('<div>', {
            class: `notice notice-${type} is-dismissible`,
            html: `<p>${message}</p>`
        });

        $('.wrap h1').after(notice);
        
        // Make the notice dismissible
        notice.append('<button type="button" class="notice-dismiss"></button>');
        notice.find('.notice-dismiss').on('click', function() {
            notice.remove();
        });
    }
});
