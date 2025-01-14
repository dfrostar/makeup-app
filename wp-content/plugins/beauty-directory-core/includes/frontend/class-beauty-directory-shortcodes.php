<?php
/**
 * Frontend Shortcodes for Beauty Directory
 */

if (!defined('ABSPATH')) {
    exit;
}

class Beauty_Directory_Shortcodes {
    
    public static function init() {
        $shortcodes = array(
            'beauty_directory_professionals' => array(__CLASS__, 'professionals_directory'),
            'beauty_directory_dashboard' => array(__CLASS__, 'professional_dashboard'),
            'beauty_directory_booking' => array(__CLASS__, 'booking_form'),
            'beauty_directory_profile' => array(__CLASS__, 'professional_profile'),
            'beauty_directory_services' => array(__CLASS__, 'services_list'),
        );

        foreach ($shortcodes as $shortcode => $function) {
            add_shortcode($shortcode, $function);
        }
    }

    /**
     * Professionals Directory shortcode
     */
    public static function professionals_directory($atts) {
        if (!is_user_logged_in()) {
            return do_shortcode('[woocommerce_my_account]');
        }

        wp_enqueue_style('beauty-directory-styles');
        wp_enqueue_script('beauty-directory-professionals');

        $atts = shortcode_atts(array(
            'category' => '',
            'specialty' => '',
            'per_page' => 12
        ), $atts);

        ob_start();
        ?>
        <div id="beauty-directory-professionals" class="beauty-directory-container">
            <div class="beauty-directory-filters">
                <input type="text" id="search-professionals" placeholder="<?php esc_attr_e('Search professionals...', 'beauty-directory'); ?>">
                
                <select id="category-filter">
                    <option value=""><?php esc_html_e('All Categories', 'beauty-directory'); ?></option>
                    <?php
                    $categories = get_terms(array(
                        'taxonomy' => 'service_category',
                        'hide_empty' => true
                    ));
                    foreach ($categories as $category) {
                        echo '<option value="' . esc_attr($category->slug) . '">' . esc_html($category->name) . '</option>';
                    }
                    ?>
                </select>

                <select id="specialty-filter">
                    <option value=""><?php esc_html_e('All Specialties', 'beauty-directory'); ?></option>
                    <?php
                    $specialties = get_terms(array(
                        'taxonomy' => 'specialty',
                        'hide_empty' => true
                    ));
                    foreach ($specialties as $specialty) {
                        echo '<option value="' . esc_attr($specialty->slug) . '">' . esc_html($specialty->name) . '</option>';
                    }
                    ?>
                </select>
            </div>

            <div id="professionals-grid" class="beauty-directory-grid">
                <!-- Professionals will be loaded here via AJAX -->
            </div>

            <div id="load-more" class="beauty-directory-load-more">
                <button class="button"><?php esc_html_e('Load More', 'beauty-directory'); ?></button>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Professional Dashboard shortcode
     */
    public static function professional_dashboard($atts) {
        if (!is_user_logged_in()) {
            return do_shortcode('[woocommerce_my_account]');
        }

        $user_id = get_current_user_id();
        $db = Beauty_Directory()->db;
        $profile = $db->get_professional_profile($user_id);

        if (!$profile && !current_user_can('beauty_professional')) {
            return sprintf(
                __('You need to <a href="%s">upgrade to a professional account</a> to access the dashboard.', 'beauty-directory'),
                esc_url(wc_get_page_permalink('shop'))
            );
        }

        wp_enqueue_style('beauty-directory-styles');
        wp_enqueue_script('beauty-directory-dashboard');

        ob_start();
        ?>
        <div id="beauty-directory-dashboard" class="beauty-directory-container">
            <div class="dashboard-header">
                <h2><?php esc_html_e('Professional Dashboard', 'beauty-directory'); ?></h2>
                <div class="dashboard-actions">
                    <a href="#" class="button" id="edit-profile"><?php esc_html_e('Edit Profile', 'beauty-directory'); ?></a>
                    <a href="#" class="button" id="manage-services"><?php esc_html_e('Manage Services', 'beauty-directory'); ?></a>
                </div>
            </div>

            <div class="dashboard-content">
                <div class="dashboard-section">
                    <h3><?php esc_html_e('Upcoming Bookings', 'beauty-directory'); ?></h3>
                    <div id="upcoming-bookings">
                        <!-- Bookings will be loaded here via AJAX -->
                    </div>
                </div>

                <div class="dashboard-section">
                    <h3><?php esc_html_e('Recent Reviews', 'beauty-directory'); ?></h3>
                    <div id="recent-reviews">
                        <!-- Reviews will be loaded here via AJAX -->
                    </div>
                </div>

                <div class="dashboard-section">
                    <h3><?php esc_html_e('Analytics', 'beauty-directory'); ?></h3>
                    <div id="analytics-charts">
                        <!-- Analytics will be loaded here via AJAX -->
                    </div>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Booking Form shortcode
     */
    public static function booking_form($atts) {
        if (!is_user_logged_in()) {
            return do_shortcode('[woocommerce_my_account]');
        }

        wp_enqueue_style('beauty-directory-styles');
        wp_enqueue_script('beauty-directory-booking');

        $atts = shortcode_atts(array(
            'professional_id' => get_query_var('professional_id'),
            'service_id' => get_query_var('service_id'),
        ), $atts);

        if (!$atts['professional_id']) {
            return '<p>' . esc_html__('Please select a professional to book with.', 'beauty-directory') . '</p>';
        }

        $db = Beauty_Directory()->db;
        $professional = $db->get_professional_profile($atts['professional_id']);
        $services = $db->get_professional_services($atts['professional_id']);

        ob_start();
        ?>
        <div id="beauty-directory-booking" class="beauty-directory-container">
            <h2><?php esc_html_e('Book an Appointment', 'beauty-directory'); ?></h2>
            
            <form id="booking-form" class="beauty-directory-form">
                <input type="hidden" name="professional_id" value="<?php echo esc_attr($atts['professional_id']); ?>">
                
                <div class="form-group">
                    <label for="service"><?php esc_html_e('Select Service', 'beauty-directory'); ?></label>
                    <select name="service_id" id="service" required>
                        <option value=""><?php esc_html_e('Choose a service...', 'beauty-directory'); ?></option>
                        <?php foreach ($services as $service) : ?>
                            <option value="<?php echo esc_attr($service['id']); ?>" 
                                    data-duration="<?php echo esc_attr($service['duration']); ?>"
                                    data-price="<?php echo esc_attr($service['price']); ?>">
                                <?php echo esc_html($service['name']); ?> - 
                                <?php echo wc_price($service['price']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="date"><?php esc_html_e('Select Date', 'beauty-directory'); ?></label>
                    <input type="date" name="date" id="date" required min="<?php echo esc_attr(date('Y-m-d')); ?>">
                </div>

                <div class="form-group">
                    <label for="time"><?php esc_html_e('Select Time', 'beauty-directory'); ?></label>
                    <select name="time" id="time" required disabled>
                        <option value=""><?php esc_html_e('Choose a date first...', 'beauty-directory'); ?></option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="notes"><?php esc_html_e('Notes', 'beauty-directory'); ?></label>
                    <textarea name="notes" id="notes" rows="3"></textarea>
                </div>

                <div class="booking-summary">
                    <h3><?php esc_html_e('Booking Summary', 'beauty-directory'); ?></h3>
                    <div id="booking-details"></div>
                    <div class="total-price">
                        <?php esc_html_e('Total:', 'beauty-directory'); ?> 
                        <span id="total-price">-</span>
                    </div>
                </div>

                <button type="submit" class="button"><?php esc_html_e('Book Now', 'beauty-directory'); ?></button>
            </form>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Professional Profile shortcode
     */
    public static function professional_profile($atts) {
        $atts = shortcode_atts(array(
            'id' => get_query_var('professional_id'),
        ), $atts);

        if (!$atts['id']) {
            return '<p>' . esc_html__('Professional not found.', 'beauty-directory') . '</p>';
        }

        wp_enqueue_style('beauty-directory-styles');
        wp_enqueue_script('beauty-directory-profile');

        $db = Beauty_Directory()->db;
        $professional = $db->get_professional_profile($atts['id']);
        $services = $db->get_professional_services($atts['id']);
        $portfolio = $db->get_professional_portfolio($atts['id']);
        $reviews = $db->get_professional_reviews($atts['id']);

        ob_start();
        ?>
        <div id="beauty-directory-profile" class="beauty-directory-container">
            <div class="profile-header">
                <div class="profile-info">
                    <h1><?php echo esc_html($professional['business_name']); ?></h1>
                    <div class="profile-meta">
                        <span class="experience">
                            <?php printf(
                                _n('%s Year Experience', '%s Years Experience', $professional['experience_years'], 'beauty-directory'),
                                number_format_i18n($professional['experience_years'])
                            ); ?>
                        </span>
                        <?php if ($professional['verification_status'] === 'verified') : ?>
                            <span class="verified"><?php esc_html_e('Verified Professional', 'beauty-directory'); ?></span>
                        <?php endif; ?>
                    </div>
                    <div class="profile-bio">
                        <?php echo wp_kses_post($professional['bio']); ?>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <a href="<?php echo esc_url(add_query_arg('professional_id', $atts['id'], get_permalink(wc_get_page_id('book_service')))); ?>" 
                       class="button button-primary">
                        <?php esc_html_e('Book Now', 'beauty-directory'); ?>
                    </a>
                </div>
            </div>

            <div class="profile-content">
                <div class="services-section">
                    <h2><?php esc_html_e('Services', 'beauty-directory'); ?></h2>
                    <div class="services-grid">
                        <?php foreach ($services as $service) : ?>
                            <div class="service-card">
                                <h3><?php echo esc_html($service['name']); ?></h3>
                                <p><?php echo wp_kses_post($service['description']); ?></p>
                                <div class="service-meta">
                                    <span class="duration">
                                        <?php printf(
                                            _n('%d minute', '%d minutes', $service['duration'], 'beauty-directory'),
                                            $service['duration']
                                        ); ?>
                                    </span>
                                    <span class="price"><?php echo wc_price($service['price']); ?></span>
                                </div>
                                <a href="<?php echo esc_url(add_query_arg(array(
                                    'professional_id' => $atts['id'],
                                    'service_id' => $service['id']
                                ), get_permalink(wc_get_page_id('book_service')))); ?>" 
                                   class="button">
                                    <?php esc_html_e('Book Now', 'beauty-directory'); ?>
                                </a>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <?php if ($portfolio) : ?>
                <div class="portfolio-section">
                    <h2><?php esc_html_e('Portfolio', 'beauty-directory'); ?></h2>
                    <div class="portfolio-grid">
                        <?php foreach ($portfolio as $item) : ?>
                            <div class="portfolio-item">
                                <img src="<?php echo esc_url($item['image_url']); ?>" 
                                     alt="<?php echo esc_attr($item['title']); ?>">
                                <div class="portfolio-overlay">
                                    <h3><?php echo esc_html($item['title']); ?></h3>
                                    <?php if ($item['category_name']) : ?>
                                        <span class="category"><?php echo esc_html($item['category_name']); ?></span>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>

                <?php if ($reviews) : ?>
                <div class="reviews-section">
                    <h2><?php esc_html_e('Reviews', 'beauty-directory'); ?></h2>
                    <div class="reviews-grid">
                        <?php foreach ($reviews as $review) : ?>
                            <div class="review-card">
                                <div class="review-header">
                                    <span class="reviewer"><?php echo esc_html($review['customer_name']); ?></span>
                                    <div class="rating">
                                        <?php for ($i = 1; $i <= 5; $i++) : ?>
                                            <span class="star <?php echo $i <= $review['rating'] ? 'filled' : ''; ?>">★</span>
                                        <?php endfor; ?>
                                    </div>
                                </div>
                                <p class="review-content"><?php echo wp_kses_post($review['comment']); ?></p>
                                <span class="review-date">
                                    <?php echo esc_html(human_time_diff(strtotime($review['created_at']), current_time('timestamp'))); ?>
                                    <?php esc_html_e('ago', 'beauty-directory'); ?>
                                </span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Services List shortcode
     */
    public static function services_list($atts) {
        $atts = shortcode_atts(array(
            'category' => '',
            'columns' => 3,
            'per_page' => 12
        ), $atts);

        wp_enqueue_style('beauty-directory-styles');
        wp_enqueue_script('beauty-directory-services');

        ob_start();
        ?>
        <div id="beauty-directory-services" class="beauty-directory-container">
            <div class="services-filters">
                <input type="text" id="search-services" placeholder="<?php esc_attr_e('Search services...', 'beauty-directory'); ?>">
                
                <select id="category-filter">
                    <option value=""><?php esc_html_e('All Categories', 'beauty-directory'); ?></option>
                    <?php
                    $categories = get_terms(array(
                        'taxonomy' => 'service_category',
                        'hide_empty' => true
                    ));
                    foreach ($categories as $category) {
                        echo '<option value="' . esc_attr($category->slug) . '">' . esc_html($category->name) . '</option>';
                    }
                    ?>
                </select>

                <select id="sort-services">
                    <option value="name"><?php esc_html_e('Sort by Name', 'beauty-directory'); ?></option>
                    <option value="price_low"><?php esc_html_e('Price: Low to High', 'beauty-directory'); ?></option>
                    <option value="price_high"><?php esc_html_e('Price: High to Low', 'beauty-directory'); ?></option>
                    <option value="rating"><?php esc_html_e('Sort by Rating', 'beauty-directory'); ?></option>
                </select>
            </div>

            <div id="services-grid" class="beauty-directory-grid columns-<?php echo esc_attr($atts['columns']); ?>">
                <!-- Services will be loaded here via AJAX -->
            </div>

            <div id="load-more" class="beauty-directory-load-more">
                <button class="button"><?php esc_html_e('Load More', 'beauty-directory'); ?></button>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
