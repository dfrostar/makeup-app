<?php
/**
 * Beauty Directory WooCommerce Integration
 */

if (!defined('ABSPATH')) {
    exit;
}

class Beauty_Directory_WooCommerce {
    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', [$this, 'init']);
        add_action('woocommerce_loaded', [$this, 'woocommerce_loaded']);
        add_filter('woocommerce_product_types', [$this, 'add_product_types']);
    }

    /**
     * Initialize the plugin
     */
    public function init() {
        // Register custom post types
        $this->register_post_types();
        
        // Register taxonomies
        $this->register_taxonomies();
        
        // Add custom fields
        $this->add_custom_fields();
    }

    /**
     * Register directory-specific product types
     */
    public function add_product_types($types) {
        $types['professional_listing'] = __('Professional Listing', 'beauty-directory');
        $types['featured_listing'] = __('Featured Listing', 'beauty-directory');
        $types['beauty_service'] = __('Beauty Service', 'beauty-directory');
        $types['tutorial_access'] = __('Tutorial Access', 'beauty-directory');
        return $types;
    }

    /**
     * Setup commission system
     */
    public function setup_commission_system() {
        add_action('woocommerce_order_status_completed', [$this, 'process_commission']);
        add_action('woocommerce_scheduled_subscription_payment', [$this, 'process_subscription_commission']);
    }

    /**
     * Process commission for an order
     */
    public function process_commission($order_id) {
        $order = wc_get_order($order_id);
        foreach ($order->get_items() as $item) {
            $product = $item->get_product();
            if ($this->is_commission_product($product)) {
                $this->calculate_and_store_commission($item, $order);
            }
        }
    }

    /**
     * Setup membership features
     */
    public function setup_membership_features() {
        // Basic membership
        $this->register_membership_level('basic', [
            'price' => 29.99,
            'features' => [
                'profile' => true,
                'portfolio_limit' => 5,
                'contact_form' => true,
                'analytics' => 'basic'
            ]
        ]);

        // Premium membership
        $this->register_membership_level('premium', [
            'price' => 79.99,
            'features' => [
                'profile' => true,
                'portfolio_limit' => -1,
                'booking_system' => true,
                'featured_listing' => true,
                'analytics' => 'advanced'
            ]
        ]);

        // Elite membership
        $this->register_membership_level('elite', [
            'price' => 199.99,
            'features' => [
                'profile' => true,
                'portfolio_limit' => -1,
                'booking_system' => true,
                'featured_listing' => true,
                'analytics' => 'premium',
                'api_access' => true,
                'marketing_tools' => true
            ]
        ]);
    }

    /**
     * Setup booking system
     */
    public function setup_booking_system() {
        // Add booking capabilities
        add_filter('woocommerce_bookings_get_booking_products_args', [$this, 'add_beauty_booking_type']);
        add_filter('woocommerce_bookings_get_timezone_string', [$this, 'set_booking_timezone']);
        add_action('woocommerce_bookings_after_booking_base_cost', [$this, 'add_beauty_booking_options']);
    }

    /**
     * Setup affiliate system
     */
    public function setup_affiliate_system() {
        // Register commission rates
        $this->register_commission_rates([
            'standard' => 5,
            'premium' => 8,
            'exclusive' => 12
        ]);

        // Setup tracking
        add_action('wp', [$this, 'track_affiliate_visit']);
        add_action('woocommerce_order_status_completed', [$this, 'process_affiliate_commission']);
    }

    /**
     * Setup analytics
     */
    public function setup_analytics() {
        // Revenue tracking
        add_action('woocommerce_order_status_completed', [$this, 'track_revenue']);
        add_action('woocommerce_subscription_payment_complete', [$this, 'track_subscription_revenue']);

        // Performance metrics
        add_action('init', [$this, 'register_analytics_endpoints']);
        add_filter('woocommerce_admin_reports', [$this, 'add_directory_reports']);
    }

    /**
     * Register custom post types
     */
    private function register_post_types() {
        // Professional profile
        register_post_type('beauty_professional', [
            'labels' => [
                'name' => __('Professionals', 'beauty-directory'),
                'singular_name' => __('Professional', 'beauty-directory')
            ],
            'public' => true,
            'has_archive' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
            'show_in_rest' => true
        ]);

        // Beauty tutorial
        register_post_type('beauty_tutorial', [
            'labels' => [
                'name' => __('Tutorials', 'beauty-directory'),
                'singular_name' => __('Tutorial', 'beauty-directory')
            ],
            'public' => true,
            'has_archive' => true,
            'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
            'show_in_rest' => true
        ]);
    }

    /**
     * Register taxonomies
     */
    private function register_taxonomies() {
        // Professional specialties
        register_taxonomy('professional_specialty', ['beauty_professional'], [
            'labels' => [
                'name' => __('Specialties', 'beauty-directory'),
                'singular_name' => __('Specialty', 'beauty-directory')
            ],
            'hierarchical' => true,
            'show_in_rest' => true
        ]);

        // Tutorial categories
        register_taxonomy('tutorial_category', ['beauty_tutorial'], [
            'labels' => [
                'name' => __('Tutorial Categories', 'beauty-directory'),
                'singular_name' => __('Tutorial Category', 'beauty-directory')
            ],
            'hierarchical' => true,
            'show_in_rest' => true
        ]);
    }
}

// Initialize the class
new Beauty_Directory_WooCommerce();
