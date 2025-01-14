<?php
/**
 * Register Custom Post Types and Taxonomies for Beauty Directory
 */

if (!defined('ABSPATH')) {
    exit;
}

class Beauty_Directory_Post_Types {
    
    public function __construct() {
        add_action('init', array($this, 'register_post_types'));
        add_action('init', array($this, 'register_taxonomies'));
        add_action('acf/init', array($this, 'register_acf_fields'));
    }

    /**
     * Register custom post types
     */
    public function register_post_types() {
        // Beauty Professional
        register_post_type('beauty_professional', array(
            'labels' => array(
                'name' => __('Professionals', 'beauty-directory'),
                'singular_name' => __('Professional', 'beauty-directory'),
                'menu_name' => __('Professionals', 'beauty-directory'),
                'add_new' => __('Add Professional', 'beauty-directory'),
                'add_new_item' => __('Add New Professional', 'beauty-directory'),
                'edit_item' => __('Edit Professional', 'beauty-directory'),
                'view_item' => __('View Professional', 'beauty-directory'),
                'search_items' => __('Search Professionals', 'beauty-directory'),
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-businesswoman',
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
            'rewrite' => array('slug' => 'professionals'),
            'capability_type' => 'post',
            'map_meta_cap' => true,
        ));

        // Beauty Service
        register_post_type('beauty_service', array(
            'labels' => array(
                'name' => __('Services', 'beauty-directory'),
                'singular_name' => __('Service', 'beauty-directory'),
                'menu_name' => __('Services', 'beauty-directory'),
                'add_new' => __('Add Service', 'beauty-directory'),
                'add_new_item' => __('Add New Service', 'beauty-directory'),
                'edit_item' => __('Edit Service', 'beauty-directory'),
                'view_item' => __('View Service', 'beauty-directory'),
                'search_items' => __('Search Services', 'beauty-directory'),
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-clipboard',
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'rewrite' => array('slug' => 'services'),
        ));

        // Beauty Tutorial
        register_post_type('beauty_tutorial', array(
            'labels' => array(
                'name' => __('Tutorials', 'beauty-directory'),
                'singular_name' => __('Tutorial', 'beauty-directory'),
                'menu_name' => __('Tutorials', 'beauty-directory'),
                'add_new' => __('Add Tutorial', 'beauty-directory'),
                'add_new_item' => __('Add New Tutorial', 'beauty-directory'),
                'edit_item' => __('Edit Tutorial', 'beauty-directory'),
                'view_item' => __('View Tutorial', 'beauty-directory'),
                'search_items' => __('Search Tutorials', 'beauty-directory'),
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-video-alt3',
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'comments'),
            'rewrite' => array('slug' => 'tutorials'),
        ));

        // Product Review
        register_post_type('product_review', array(
            'labels' => array(
                'name' => __('Product Reviews', 'beauty-directory'),
                'singular_name' => __('Product Review', 'beauty-directory'),
                'menu_name' => __('Product Reviews', 'beauty-directory'),
                'add_new' => __('Add Review', 'beauty-directory'),
                'add_new_item' => __('Add New Review', 'beauty-directory'),
                'edit_item' => __('Edit Review', 'beauty-directory'),
                'view_item' => __('View Review', 'beauty-directory'),
                'search_items' => __('Search Reviews', 'beauty-directory'),
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-star-filled',
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'comments'),
            'rewrite' => array('slug' => 'reviews'),
        ));
    }

    /**
     * Register custom taxonomies
     */
    public function register_taxonomies() {
        // Service Categories
        register_taxonomy('service_category', array('beauty_service'), array(
            'labels' => array(
                'name' => __('Service Categories', 'beauty-directory'),
                'singular_name' => __('Category', 'beauty-directory'),
                'search_items' => __('Search Categories', 'beauty-directory'),
                'all_items' => __('All Categories', 'beauty-directory'),
                'edit_item' => __('Edit Category', 'beauty-directory'),
                'update_item' => __('Update Category', 'beauty-directory'),
                'add_new_item' => __('Add New Category', 'beauty-directory'),
                'new_item_name' => __('New Category Name', 'beauty-directory'),
                'menu_name' => __('Categories', 'beauty-directory'),
            ),
            'hierarchical' => true,
            'show_ui' => true,
            'show_in_rest' => true,
            'rewrite' => array('slug' => 'service-category'),
        ));

        // Professional Specialties
        register_taxonomy('specialty', array('beauty_professional'), array(
            'labels' => array(
                'name' => __('Specialties', 'beauty-directory'),
                'singular_name' => __('Specialty', 'beauty-directory'),
                'search_items' => __('Search Specialties', 'beauty-directory'),
                'all_items' => __('All Specialties', 'beauty-directory'),
                'edit_item' => __('Edit Specialty', 'beauty-directory'),
                'update_item' => __('Update Specialty', 'beauty-directory'),
                'add_new_item' => __('Add New Specialty', 'beauty-directory'),
                'new_item_name' => __('New Specialty Name', 'beauty-directory'),
                'menu_name' => __('Specialties', 'beauty-directory'),
            ),
            'hierarchical' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'rewrite' => array('slug' => 'specialty'),
        ));

        // Tutorial Categories
        register_taxonomy('tutorial_category', array('beauty_tutorial'), array(
            'labels' => array(
                'name' => __('Tutorial Categories', 'beauty-directory'),
                'singular_name' => __('Category', 'beauty-directory'),
                'search_items' => __('Search Categories', 'beauty-directory'),
                'all_items' => __('All Categories', 'beauty-directory'),
                'edit_item' => __('Edit Category', 'beauty-directory'),
                'update_item' => __('Update Category', 'beauty-directory'),
                'add_new_item' => __('Add New Category', 'beauty-directory'),
                'new_item_name' => __('New Category Name', 'beauty-directory'),
                'menu_name' => __('Categories', 'beauty-directory'),
            ),
            'hierarchical' => true,
            'show_ui' => true,
            'show_in_rest' => true,
            'rewrite' => array('slug' => 'tutorial-category'),
        ));
    }

    /**
     * Register Advanced Custom Fields
     */
    public function register_acf_fields() {
        if (function_exists('acf_add_local_field_group')) {
            // Professional Profile Fields
            acf_add_local_field_group(array(
                'key' => 'group_professional_details',
                'title' => 'Professional Details',
                'fields' => array(
                    array(
                        'key' => 'field_business_name',
                        'label' => 'Business Name',
                        'name' => 'business_name',
                        'type' => 'text',
                        'required' => true,
                    ),
                    array(
                        'key' => 'field_experience_years',
                        'label' => 'Years of Experience',
                        'name' => 'experience_years',
                        'type' => 'number',
                        'required' => true,
                    ),
                    array(
                        'key' => 'field_certifications',
                        'label' => 'Certifications',
                        'name' => 'certifications',
                        'type' => 'repeater',
                        'sub_fields' => array(
                            array(
                                'key' => 'field_certification_name',
                                'label' => 'Certification Name',
                                'name' => 'name',
                                'type' => 'text',
                            ),
                            array(
                                'key' => 'field_certification_year',
                                'label' => 'Year Obtained',
                                'name' => 'year',
                                'type' => 'number',
                            ),
                        ),
                    ),
                    array(
                        'key' => 'field_portfolio',
                        'label' => 'Portfolio',
                        'name' => 'portfolio',
                        'type' => 'gallery',
                    ),
                ),
                'location' => array(
                    array(
                        array(
                            'param' => 'post_type',
                            'operator' => '==',
                            'value' => 'beauty_professional',
                        ),
                    ),
                ),
            ));

            // Service Fields
            acf_add_local_field_group(array(
                'key' => 'group_service_details',
                'title' => 'Service Details',
                'fields' => array(
                    array(
                        'key' => 'field_duration',
                        'label' => 'Duration (minutes)',
                        'name' => 'duration',
                        'type' => 'number',
                        'required' => true,
                    ),
                    array(
                        'key' => 'field_price',
                        'label' => 'Price',
                        'name' => 'price',
                        'type' => 'number',
                        'required' => true,
                    ),
                    array(
                        'key' => 'field_requirements',
                        'label' => 'Requirements',
                        'name' => 'requirements',
                        'type' => 'textarea',
                    ),
                ),
                'location' => array(
                    array(
                        array(
                            'param' => 'post_type',
                            'operator' => '==',
                            'value' => 'beauty_service',
                        ),
                    ),
                ),
            ));
        }
    }
}

// Initialize the class
new Beauty_Directory_Post_Types();
