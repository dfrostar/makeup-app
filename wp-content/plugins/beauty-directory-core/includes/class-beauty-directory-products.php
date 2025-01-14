<?php
/**
 * WooCommerce Integration for Beauty Directory
 */

if (!defined('ABSPATH')) {
    exit;
}

class Beauty_Directory_Products {
    
    public function __construct() {
        add_action('init', array($this, 'register_product_types'));
        add_filter('product_type_selector', array($this, 'add_product_types'));
        add_filter('woocommerce_product_data_tabs', array($this, 'add_product_data_tabs'));
        add_action('woocommerce_product_data_panels', array($this, 'add_product_data_panels'));
        add_action('woocommerce_process_product_meta', array($this, 'save_product_meta'));
    }

    /**
     * Register custom product types
     */
    public function register_product_types() {
        class WC_Product_Professional_Membership extends WC_Product_Subscription {
            public function __construct($product) {
                $this->product_type = 'professional_membership';
                parent::__construct($product);
            }
        }

        class WC_Product_Beauty_Service extends WC_Product {
            public function __construct($product) {
                $this->product_type = 'beauty_service';
                parent::__construct($product);
            }
        }

        class WC_Product_Featured_Listing extends WC_Product_Subscription {
            public function __construct($product) {
                $this->product_type = 'featured_listing';
                parent::__construct($product);
            }
        }
    }

    /**
     * Add custom product types to product type dropdown
     */
    public function add_product_types($types) {
        $types['professional_membership'] = __('Professional Membership', 'beauty-directory');
        $types['beauty_service'] = __('Beauty Service', 'beauty-directory');
        $types['featured_listing'] = __('Featured Listing', 'beauty-directory');
        return $types;
    }

    /**
     * Add custom data tabs
     */
    public function add_product_data_tabs($tabs) {
        $tabs['membership'] = array(
            'label' => __('Membership Details', 'beauty-directory'),
            'target' => 'membership_product_data',
            'class' => array('show_if_professional_membership'),
        );

        $tabs['service'] = array(
            'label' => __('Service Details', 'beauty-directory'),
            'target' => 'service_product_data',
            'class' => array('show_if_beauty_service'),
        );

        $tabs['featured'] = array(
            'label' => __('Featured Details', 'beauty-directory'),
            'target' => 'featured_product_data',
            'class' => array('show_if_featured_listing'),
        );

        return $tabs;
    }

    /**
     * Add custom data panels
     */
    public function add_product_data_panels() {
        // Membership Panel
        echo '<div id="membership_product_data" class="panel woocommerce_options_panel">';
        woocommerce_wp_select(array(
            'id' => '_membership_level',
            'label' => __('Membership Level', 'beauty-directory'),
            'options' => array(
                'basic' => __('Basic', 'beauty-directory'),
                'premium' => __('Premium', 'beauty-directory'),
                'platinum' => __('Platinum', 'beauty-directory'),
            ),
        ));
        woocommerce_wp_textarea_input(array(
            'id' => '_membership_features',
            'label' => __('Features', 'beauty-directory'),
            'desc_tip' => true,
            'description' => __('List the features included in this membership level.', 'beauty-directory'),
        ));
        echo '</div>';

        // Service Panel
        echo '<div id="service_product_data" class="panel woocommerce_options_panel">';
        woocommerce_wp_text_input(array(
            'id' => '_service_duration',
            'label' => __('Duration (minutes)', 'beauty-directory'),
            'type' => 'number',
        ));
        woocommerce_wp_textarea_input(array(
            'id' => '_service_requirements',
            'label' => __('Requirements', 'beauty-directory'),
            'desc_tip' => true,
            'description' => __('List any requirements or preparations needed for this service.', 'beauty-directory'),
        ));
        echo '</div>';

        // Featured Listing Panel
        echo '<div id="featured_product_data" class="panel woocommerce_options_panel">';
        woocommerce_wp_select(array(
            'id' => '_featured_type',
            'label' => __('Featured Type', 'beauty-directory'),
            'options' => array(
                'homepage' => __('Homepage Feature', 'beauty-directory'),
                'category' => __('Category Feature', 'beauty-directory'),
                'search' => __('Search Priority', 'beauty-directory'),
            ),
        ));
        woocommerce_wp_text_input(array(
            'id' => '_featured_duration',
            'label' => __('Duration (days)', 'beauty-directory'),
            'type' => 'number',
        ));
        echo '</div>';
    }

    /**
     * Save custom product meta
     */
    public function save_product_meta($post_id) {
        // Membership meta
        if (isset($_POST['_membership_level'])) {
            update_post_meta($post_id, '_membership_level', sanitize_text_field($_POST['_membership_level']));
        }
        if (isset($_POST['_membership_features'])) {
            update_post_meta($post_id, '_membership_features', wp_kses_post($_POST['_membership_features']));
        }

        // Service meta
        if (isset($_POST['_service_duration'])) {
            update_post_meta($post_id, '_service_duration', absint($_POST['_service_duration']));
        }
        if (isset($_POST['_service_requirements'])) {
            update_post_meta($post_id, '_service_requirements', wp_kses_post($_POST['_service_requirements']));
        }

        // Featured listing meta
        if (isset($_POST['_featured_type'])) {
            update_post_meta($post_id, '_featured_type', sanitize_text_field($_POST['_featured_type']));
        }
        if (isset($_POST['_featured_duration'])) {
            update_post_meta($post_id, '_featured_duration', absint($_POST['_featured_duration']));
        }
    }
}

// Initialize the class
new Beauty_Directory_Products();
