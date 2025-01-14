<?php
/**
 * Beauty Directory Admin Interface
 */

if (!defined('ABSPATH')) {
    exit;
}

class Beauty_Directory_Admin {
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_notices', array($this, 'admin_notices'));
    }

    public function add_admin_menu() {
        add_menu_page(
            __('Beauty Directory', 'beauty-directory'),
            __('Beauty Directory', 'beauty-directory'),
            'manage_beauty_directory',
            'beauty-directory',
            array($this, 'render_dashboard_page'),
            'dashicons-businesswoman',
            25
        );

        add_submenu_page(
            'beauty-directory',
            __('Dashboard', 'beauty-directory'),
            __('Dashboard', 'beauty-directory'),
            'manage_beauty_directory',
            'beauty-directory',
            array($this, 'render_dashboard_page')
        );

        add_submenu_page(
            'beauty-directory',
            __('Professionals', 'beauty-directory'),
            __('Professionals', 'beauty-directory'),
            'manage_beauty_directory',
            'beauty-directory-professionals',
            array($this, 'render_professionals_page')
        );

        add_submenu_page(
            'beauty-directory',
            __('Services', 'beauty-directory'),
            __('Services', 'beauty-directory'),
            'manage_beauty_directory',
            'beauty-directory-services',
            array($this, 'render_services_page')
        );

        add_submenu_page(
            'beauty-directory',
            __('Bookings', 'beauty-directory'),
            __('Bookings', 'beauty-directory'),
            'manage_beauty_directory',
            'beauty-directory-bookings',
            array($this, 'render_bookings_page')
        );

        add_submenu_page(
            'beauty-directory',
            __('Reviews', 'beauty-directory'),
            __('Reviews', 'beauty-directory'),
            'manage_beauty_directory',
            'beauty-directory-reviews',
            array($this, 'render_reviews_page')
        );

        add_submenu_page(
            'beauty-directory',
            __('Settings', 'beauty-directory'),
            __('Settings', 'beauty-directory'),
            'manage_beauty_directory',
            'beauty-directory-settings',
            array($this, 'render_settings_page')
        );
    }

    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'beauty-directory') === false) {
            return;
        }

        wp_enqueue_style(
            'beauty-directory-admin',
            BEAUTY_DIRECTORY_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            BEAUTY_DIRECTORY_VERSION
        );

        wp_enqueue_script(
            'beauty-directory-admin',
            BEAUTY_DIRECTORY_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery', 'wp-api'),
            BEAUTY_DIRECTORY_VERSION,
            true
        );

        wp_localize_script('beauty-directory-admin', 'beautyDirectoryAdmin', array(
            'api' => array(
                'url' => rest_url('beauty-directory/v1'),
                'nonce' => wp_create_nonce('wp_rest')
            ),
            'i18n' => array(
                'confirmDelete' => __('Are you sure you want to delete this item?', 'beauty-directory'),
                'confirmVerify' => __('Are you sure you want to verify this professional?', 'beauty-directory'),
                'confirmSuspend' => __('Are you sure you want to suspend this professional?', 'beauty-directory'),
                'deleteSuccess' => __('Item deleted successfully.', 'beauty-directory'),
                'deleteFail' => __('Failed to delete item.', 'beauty-directory'),
                'saveSuccess' => __('Changes saved successfully.', 'beauty-directory'),
                'saveFail' => __('Failed to save changes.', 'beauty-directory'),
            )
        ));
    }

    public function register_settings() {
        register_setting('beauty_directory_options', 'beauty_directory_commission_rate');
        register_setting('beauty_directory_options', 'beauty_directory_booking_buffer');
        register_setting('beauty_directory_options', 'beauty_directory_currency');
        register_setting('beauty_directory_options', 'beauty_directory_notification_email');
        register_setting('beauty_directory_options', 'beauty_directory_google_maps_api_key');
        register_setting('beauty_directory_options', 'beauty_directory_stripe_publishable_key');
        register_setting('beauty_directory_options', 'beauty_directory_stripe_secret_key');
    }

    public function render_dashboard_page() {
        $db = Beauty_Directory()->db;
        $stats = $this->get_dashboard_stats();
        ?>
        <div class="wrap beauty-directory-admin">
            <h1><?php _e('Beauty Directory Dashboard', 'beauty-directory'); ?></h1>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3><?php _e('Total Professionals', 'beauty-directory'); ?></h3>
                    <div class="stat-value"><?php echo esc_html($stats['professionals']); ?></div>
                    <div class="stat-meta">
                        <?php echo sprintf(
                            __('%d pending verification', 'beauty-directory'),
                            $stats['pending_professionals']
                        ); ?>
                    </div>
                </div>

                <div class="stat-card">
                    <h3><?php _e('Total Bookings', 'beauty-directory'); ?></h3>
                    <div class="stat-value"><?php echo esc_html($stats['bookings']); ?></div>
                    <div class="stat-meta">
                        <?php echo sprintf(
                            __('%d this month', 'beauty-directory'),
                            $stats['monthly_bookings']
                        ); ?>
                    </div>
                </div>

                <div class="stat-card">
                    <h3><?php _e('Total Revenue', 'beauty-directory'); ?></h3>
                    <div class="stat-value">
                        <?php echo wc_price($stats['revenue']); ?>
                    </div>
                    <div class="stat-meta">
                        <?php echo sprintf(
                            __('%s this month', 'beauty-directory'),
                            wc_price($stats['monthly_revenue'])
                        ); ?>
                    </div>
                </div>

                <div class="stat-card">
                    <h3><?php _e('Average Rating', 'beauty-directory'); ?></h3>
                    <div class="stat-value">
                        <?php echo number_format($stats['average_rating'], 1); ?>
                    </div>
                    <div class="stat-meta">
                        <?php echo sprintf(
                            __('from %d reviews', 'beauty-directory'),
                            $stats['total_reviews']
                        ); ?>
                    </div>
                </div>
            </div>

            <div class="dashboard-charts">
                <div class="chart-container">
                    <h2><?php _e('Revenue Trend', 'beauty-directory'); ?></h2>
                    <canvas id="revenue-chart"></canvas>
                </div>

                <div class="chart-container">
                    <h2><?php _e('Bookings Trend', 'beauty-directory'); ?></h2>
                    <canvas id="bookings-chart"></canvas>
                </div>
            </div>

            <div class="dashboard-tables">
                <div class="table-container">
                    <h2><?php _e('Recent Bookings', 'beauty-directory'); ?></h2>
                    <?php $this->render_recent_bookings_table(); ?>
                </div>

                <div class="table-container">
                    <h2><?php _e('Pending Verifications', 'beauty-directory'); ?></h2>
                    <?php $this->render_pending_verifications_table(); ?>
                </div>
            </div>
        </div>
        <?php
    }

    public function render_professionals_page() {
        $db = Beauty_Directory()->db;
        $page = isset($_GET['paged']) ? absint($_GET['paged']) : 1;
        $search = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
        $status = isset($_GET['status']) ? sanitize_text_field($_GET['status']) : '';

        $professionals = $db->get_professionals_list($page, $search, $status);
        ?>
        <div class="wrap beauty-directory-admin">
            <h1 class="wp-heading-inline"><?php _e('Professionals', 'beauty-directory'); ?></h1>

            <div class="tablenav top">
                <div class="alignleft actions">
                    <select name="status" id="filter-by-status">
                        <option value=""><?php _e('All Statuses', 'beauty-directory'); ?></option>
                        <option value="pending" <?php selected($status, 'pending'); ?>>
                            <?php _e('Pending', 'beauty-directory'); ?>
                        </option>
                        <option value="verified" <?php selected($status, 'verified'); ?>>
                            <?php _e('Verified', 'beauty-directory'); ?>
                        </option>
                        <option value="suspended" <?php selected($status, 'suspended'); ?>>
                            <?php _e('Suspended', 'beauty-directory'); ?>
                        </option>
                    </select>
                    <input type="submit" class="button" value="<?php esc_attr_e('Filter', 'beauty-directory'); ?>">
                </div>

                <form class="search-box">
                    <input type="search" name="s" value="<?php echo esc_attr($search); ?>"
                           placeholder="<?php esc_attr_e('Search professionals...', 'beauty-directory'); ?>">
                    <input type="submit" class="button" value="<?php esc_attr_e('Search', 'beauty-directory'); ?>">
                </form>
            </div>

            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th><?php _e('Business Name', 'beauty-directory'); ?></th>
                        <th><?php _e('Owner', 'beauty-directory'); ?></th>
                        <th><?php _e('Services', 'beauty-directory'); ?></th>
                        <th><?php _e('Rating', 'beauty-directory'); ?></th>
                        <th><?php _e('Status', 'beauty-directory'); ?></th>
                        <th><?php _e('Actions', 'beauty-directory'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($professionals as $professional) : ?>
                        <tr>
                            <td>
                                <strong>
                                    <a href="<?php echo esc_url(add_query_arg(
                                        array('page' => 'beauty-directory-professionals', 'action' => 'edit', 'id' => $professional->id),
                                        admin_url('admin.php')
                                    )); ?>">
                                        <?php echo esc_html($professional->business_name); ?>
                                    </a>
                                </strong>
                            </td>
                            <td>
                                <?php
                                $user = get_user_by('id', $professional->wp_user_id);
                                echo esc_html($user ? $user->display_name : '-');
                                ?>
                            </td>
                            <td><?php echo esc_html($professional->service_count); ?></td>
                            <td>
                                <div class="rating">
                                    <?php echo str_repeat('★', round($professional->average_rating)); ?>
                                    <?php echo str_repeat('☆', 5 - round($professional->average_rating)); ?>
                                    <span class="rating-count">
                                        (<?php echo esc_html($professional->review_count); ?>)
                                    </span>
                                </div>
                            </td>
                            <td>
                                <span class="status-badge status-<?php echo esc_attr($professional->verification_status); ?>">
                                    <?php echo esc_html(ucfirst($professional->verification_status)); ?>
                                </span>
                            </td>
                            <td class="actions">
                                <?php if ($professional->verification_status === 'pending') : ?>
                                    <button class="button verify-professional" data-id="<?php echo esc_attr($professional->id); ?>">
                                        <?php _e('Verify', 'beauty-directory'); ?>
                                    </button>
                                <?php endif; ?>
                                
                                <?php if ($professional->verification_status === 'verified') : ?>
                                    <button class="button suspend-professional" data-id="<?php echo esc_attr($professional->id); ?>">
                                        <?php _e('Suspend', 'beauty-directory'); ?>
                                    </button>
                                <?php endif; ?>
                                
                                <button class="button view-details" data-id="<?php echo esc_attr($professional->id); ?>">
                                    <?php _e('View Details', 'beauty-directory'); ?>
                                </button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <?php $this->render_pagination($page, $professionals->max_num_pages); ?>
        </div>
        <?php
    }

    private function get_dashboard_stats() {
        $db = Beauty_Directory()->db;
        
        return array(
            'professionals' => $db->count_professionals(),
            'pending_professionals' => $db->count_professionals('pending'),
            'bookings' => $db->count_bookings(),
            'monthly_bookings' => $db->count_bookings(array(
                'start_date' => date('Y-m-01'),
                'end_date' => date('Y-m-t')
            )),
            'revenue' => $db->get_total_revenue(),
            'monthly_revenue' => $db->get_total_revenue(array(
                'start_date' => date('Y-m-01'),
                'end_date' => date('Y-m-t')
            )),
            'average_rating' => $db->get_average_rating(),
            'total_reviews' => $db->count_reviews()
        );
    }

    private function render_recent_bookings_table() {
        $db = Beauty_Directory()->db;
        $bookings = $db->get_recent_bookings(10);
        ?>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th><?php _e('Service', 'beauty-directory'); ?></th>
                    <th><?php _e('Professional', 'beauty-directory'); ?></th>
                    <th><?php _e('Customer', 'beauty-directory'); ?></th>
                    <th><?php _e('Date', 'beauty-directory'); ?></th>
                    <th><?php _e('Status', 'beauty-directory'); ?></th>
                    <th><?php _e('Amount', 'beauty-directory'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($bookings as $booking) : ?>
                    <tr>
                        <td><?php echo esc_html($booking->service_name); ?></td>
                        <td><?php echo esc_html($booking->professional_name); ?></td>
                        <td><?php echo esc_html($booking->customer_name); ?></td>
                        <td>
                            <?php echo esc_html(date_i18n(
                                get_option('date_format') . ' ' . get_option('time_format'),
                                strtotime($booking->booking_date . ' ' . $booking->start_time)
                            )); ?>
                        </td>
                        <td>
                            <span class="status-badge status-<?php echo esc_attr($booking->status); ?>">
                                <?php echo esc_html(ucfirst($booking->status)); ?>
                            </span>
                        </td>
                        <td><?php echo wc_price($booking->total_price); ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php
    }

    private function render_pending_verifications_table() {
        $db = Beauty_Directory()->db;
        $professionals = $db->get_pending_verifications(10);
        ?>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th><?php _e('Business Name', 'beauty-directory'); ?></th>
                    <th><?php _e('Owner', 'beauty-directory'); ?></th>
                    <th><?php _e('Submitted', 'beauty-directory'); ?></th>
                    <th><?php _e('Actions', 'beauty-directory'); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($professionals as $professional) : ?>
                    <tr>
                        <td><?php echo esc_html($professional->business_name); ?></td>
                        <td>
                            <?php
                            $user = get_user_by('id', $professional->wp_user_id);
                            echo esc_html($user ? $user->display_name : '-');
                            ?>
                        </td>
                        <td>
                            <?php echo human_time_diff(
                                strtotime($professional->created_at),
                                current_time('timestamp')
                            ) . ' ' . __('ago', 'beauty-directory'); ?>
                        </td>
                        <td>
                            <button class="button verify-professional" data-id="<?php echo esc_attr($professional->id); ?>">
                                <?php _e('Verify', 'beauty-directory'); ?>
                            </button>
                            <button class="button view-details" data-id="<?php echo esc_attr($professional->id); ?>">
                                <?php _e('View Details', 'beauty-directory'); ?>
                            </button>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php
    }

    private function render_pagination($current_page, $total_pages) {
        if ($total_pages <= 1) return;

        echo '<div class="tablenav-pages">';
        echo paginate_links(array(
            'base' => add_query_arg('paged', '%#%'),
            'format' => '',
            'prev_text' => __('&laquo;'),
            'next_text' => __('&raquo;'),
            'total' => $total_pages,
            'current' => $current_page
        ));
        echo '</div>';
    }
}

// Initialize the admin interface
new Beauty_Directory_Admin();
