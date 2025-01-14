<?php
/**
 * Plugin Name: Beauty Directory Core
 * Plugin URI: https://beautydirectory.com
 * Description: Core functionality for the Beauty Directory platform
 * Version: 1.0.0
 * Author: Beauty Directory Team
 * Text Domain: beauty-directory
 */

if (!defined('ABSPATH')) {
    exit;
}

class Beauty_Directory_Core {
    private static $instance = null;
    public $db;

    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function __construct() {
        $this->define_constants();
        $this->includes();
        $this->init_hooks();
    }

    private function define_constants() {
        define('BEAUTY_DIRECTORY_VERSION', '1.0.0');
        define('BEAUTY_DIRECTORY_PLUGIN_DIR', plugin_dir_path(__FILE__));
        define('BEAUTY_DIRECTORY_PLUGIN_URL', plugin_dir_url(__FILE__));
    }

    private function includes() {
        // Core classes
        require_once BEAUTY_DIRECTORY_PLUGIN_DIR . 'includes/class-beauty-directory-db.php';
        require_once BEAUTY_DIRECTORY_PLUGIN_DIR . 'includes/class-beauty-directory-post-types.php';
        require_once BEAUTY_DIRECTORY_PLUGIN_DIR . 'includes/class-beauty-directory-products.php';

        // Frontend
        require_once BEAUTY_DIRECTORY_PLUGIN_DIR . 'includes/frontend/class-beauty-directory-shortcodes.php';
        require_once BEAUTY_DIRECTORY_PLUGIN_DIR . 'includes/frontend/class-beauty-directory-templates.php';

        // Admin
        if (is_admin()) {
            require_once BEAUTY_DIRECTORY_PLUGIN_DIR . 'includes/admin/class-beauty-directory-admin.php';
        }
    }

    private function init_hooks() {
        // Initialize database connection
        $this->db = new Beauty_Directory_DB();

        // Activation and deactivation hooks
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));

        // Initialize components
        add_action('plugins_loaded', array($this, 'init'), 0);
    }

    public function init() {
        // Load text domain
        load_plugin_textdomain('beauty-directory', false, dirname(plugin_basename(__FILE__)) . '/languages');

        // Check dependencies
        if (!class_exists('WooCommerce')) {
            add_action('admin_notices', array($this, 'woocommerce_missing_notice'));
            return;
        }

        // Initialize components
        new Beauty_Directory_Post_Types();
        new Beauty_Directory_Products();

        if (is_admin()) {
            new Beauty_Directory_Admin();
        }

        // Initialize shortcodes
        Beauty_Directory_Shortcodes::init();
    }

    public function activate() {
        // Create database tables
        $this->db->create_tables();

        // Create default roles and capabilities
        $this->create_roles();

        // Create required pages
        $this->create_pages();

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    public function deactivate() {
        // Remove custom roles
        $this->remove_roles();

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    private function create_roles() {
        add_role('beauty_professional', __('Beauty Professional', 'beauty-directory'), array(
            'read' => true,
            'edit_posts' => true,
            'delete_posts' => true,
            'upload_files' => true,
            'manage_services' => true,
            'manage_bookings' => true,
        ));

        // Add capabilities to administrator
        $admin = get_role('administrator');
        $admin->add_cap('manage_beauty_directory');
        $admin->add_cap('manage_services');
        $admin->add_cap('manage_bookings');
        $admin->add_cap('verify_professionals');
    }

    private function remove_roles() {
        remove_role('beauty_professional');

        // Remove capabilities from administrator
        $admin = get_role('administrator');
        $admin->remove_cap('manage_beauty_directory');
        $admin->remove_cap('manage_services');
        $admin->remove_cap('manage_bookings');
        $admin->remove_cap('verify_professionals');
    }

    private function create_pages() {
        $pages = array(
            'professional-directory' => array(
                'title' => __('Professional Directory', 'beauty-directory'),
                'content' => '[beauty_directory_professionals]'
            ),
            'professional-dashboard' => array(
                'title' => __('Professional Dashboard', 'beauty-directory'),
                'content' => '[beauty_directory_dashboard]'
            ),
            'book-service' => array(
                'title' => __('Book a Service', 'beauty-directory'),
                'content' => '[beauty_directory_booking]'
            )
        );

        foreach ($pages as $slug => $page) {
            if (!get_page_by_path($slug)) {
                wp_insert_post(array(
                    'post_title' => $page['title'],
                    'post_content' => $page['content'],
                    'post_status' => 'publish',
                    'post_type' => 'page',
                    'post_name' => $slug
                ));
            }
        }
    }

    public function woocommerce_missing_notice() {
        ?>
        <div class="error">
            <p><?php _e('Beauty Directory Core requires WooCommerce to be installed and active.', 'beauty-directory'); ?></p>
        </div>
        <?php
    }
}

function Beauty_Directory() {
    return Beauty_Directory_Core::instance();
}

// Initialize the plugin
Beauty_Directory();
