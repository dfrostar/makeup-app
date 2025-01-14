<?php
/**
 * REST API Handler for Beauty Directory
 */

if (!defined('ABSPATH')) {
    exit;
}

class Beauty_Directory_REST_API {
    private $namespace = 'beauty-directory/v1';

    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes() {
        // Professionals endpoints
        register_rest_route($this->namespace, '/professionals', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_professionals'),
                'permission_callback' => '__return_true',
                'args' => array(
                    'page' => array(
                        'default' => 1,
                        'sanitize_callback' => 'absint',
                    ),
                    'per_page' => array(
                        'default' => 12,
                        'sanitize_callback' => 'absint',
                    ),
                    'category' => array(
                        'default' => '',
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'specialty' => array(
                        'default' => '',
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                    'search' => array(
                        'default' => '',
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                ),
            ),
        ));

        // Services endpoints
        register_rest_route($this->namespace, '/services', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_services'),
                'permission_callback' => '__return_true',
                'args' => array(
                    'professional_id' => array(
                        'required' => true,
                        'sanitize_callback' => 'absint',
                    ),
                ),
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_service'),
                'permission_callback' => array($this, 'check_professional_permission'),
            ),
        ));

        // Bookings endpoints
        register_rest_route($this->namespace, '/bookings', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_bookings'),
                'permission_callback' => array($this, 'check_professional_permission'),
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_booking'),
                'permission_callback' => '__return_true',
            ),
        ));

        // Availability endpoints
        register_rest_route($this->namespace, '/availability/(?P<professional_id>\d+)', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_availability'),
                'permission_callback' => '__return_true',
                'args' => array(
                    'date' => array(
                        'required' => true,
                        'sanitize_callback' => 'sanitize_text_field',
                    ),
                ),
            ),
        ));

        // Reviews endpoints
        register_rest_route($this->namespace, '/reviews', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_reviews'),
                'permission_callback' => '__return_true',
                'args' => array(
                    'professional_id' => array(
                        'required' => true,
                        'sanitize_callback' => 'absint',
                    ),
                ),
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'create_review'),
                'permission_callback' => '__return_true',
            ),
        ));

        // Portfolio endpoints
        register_rest_route($this->namespace, '/portfolio', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_portfolio'),
                'permission_callback' => '__return_true',
                'args' => array(
                    'professional_id' => array(
                        'required' => true,
                        'sanitize_callback' => 'absint',
                    ),
                ),
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'add_portfolio_item'),
                'permission_callback' => array($this, 'check_professional_permission'),
            ),
        ));
    }

    /**
     * Get professionals
     */
    public function get_professionals($request) {
        $db = Beauty_Directory()->db;
        $params = $request->get_params();

        try {
            $query = "
                SELECT p.*, 
                       COUNT(DISTINCT r.id) as review_count,
                       AVG(r.rating) as average_rating
                FROM professional_profiles p
                LEFT JOIN reviews r ON p.id = r.professional_id
            ";

            $where = array('p.verification_status = \'verified\'');
            $args = array();

            if (!empty($params['category'])) {
                $where[] = 'EXISTS (
                    SELECT 1 FROM services s 
                    WHERE s.professional_id = p.id 
                    AND s.category_id = :category_id
                )';
                $args['category_id'] = $params['category'];
            }

            if (!empty($params['specialty'])) {
                $where[] = 'p.id IN (
                    SELECT object_id FROM wp_term_relationships 
                    WHERE term_taxonomy_id = :specialty_id
                )';
                $args['specialty_id'] = $params['specialty'];
            }

            if (!empty($params['search'])) {
                $where[] = '(
                    p.business_name LIKE :search 
                    OR p.bio LIKE :search
                )';
                $args['search'] = '%' . $params['search'] . '%';
            }

            if (!empty($where)) {
                $query .= ' WHERE ' . implode(' AND ', $where);
            }

            $query .= ' GROUP BY p.id';
            $query .= ' ORDER BY average_rating DESC, review_count DESC';
            $query .= ' LIMIT :limit OFFSET :offset';

            $args['limit'] = $params['per_page'];
            $args['offset'] = ($params['page'] - 1) * $params['per_page'];

            $professionals = $db->get_results($query, $args);

            return new WP_REST_Response($professionals, 200);
        } catch (Exception $e) {
            return new WP_Error('database_error', $e->getMessage(), array('status' => 500));
        }
    }

    /**
     * Get services
     */
    public function get_services($request) {
        $db = Beauty_Directory()->db;
        $professional_id = $request->get_param('professional_id');

        try {
            $services = $db->get_professional_services($professional_id);
            return new WP_REST_Response($services, 200);
        } catch (Exception $e) {
            return new WP_Error('database_error', $e->getMessage(), array('status' => 500));
        }
    }

    /**
     * Create service
     */
    public function create_service($request) {
        $db = Beauty_Directory()->db;
        $data = $request->get_params();

        try {
            $service_id = $db->create_service($data);
            if ($service_id) {
                return new WP_REST_Response(array('id' => $service_id), 201);
            }
            return new WP_Error('service_creation_failed', 'Failed to create service', array('status' => 500));
        } catch (Exception $e) {
            return new WP_Error('database_error', $e->getMessage(), array('status' => 500));
        }
    }

    /**
     * Get bookings
     */
    public function get_bookings($request) {
        $db = Beauty_Directory()->db;
        $user_id = get_current_user_id();
        $professional = $db->get_professional_profile($user_id);

        if (!$professional) {
            return new WP_Error('not_professional', 'User is not a professional', array('status' => 403));
        }

        try {
            $bookings = $db->get_professional_bookings($professional['id']);
            return new WP_REST_Response($bookings, 200);
        } catch (Exception $e) {
            return new WP_Error('database_error', $e->getMessage(), array('status' => 500));
        }
    }

    /**
     * Create booking
     */
    public function create_booking($request) {
        $db = Beauty_Directory()->db;
        $data = $request->get_params();
        $data['customer_id'] = get_current_user_id();

        try {
            $booking_id = $db->create_booking($data);
            if ($booking_id) {
                return new WP_REST_Response(array('id' => $booking_id), 201);
            }
            return new WP_Error('booking_creation_failed', 'Failed to create booking', array('status' => 500));
        } catch (Exception $e) {
            return new WP_Error('database_error', $e->getMessage(), array('status' => 500));
        }
    }

    /**
     * Get availability
     */
    public function get_availability($request) {
        $db = Beauty_Directory()->db;
        $professional_id = $request['professional_id'];
        $date = $request->get_param('date');

        try {
            $working_hours = $db->get_working_hours($professional_id);
            $bookings = $db->get_professional_bookings($professional_id, $date, $date);

            $availability = array();
            $day_of_week = date('w', strtotime($date));

            foreach ($working_hours as $hours) {
                if ($hours['day_of_week'] == $day_of_week && $hours['is_available']) {
                    $start = strtotime($hours['start_time']);
                    $end = strtotime($hours['end_time']);
                    
                    // Create 30-minute slots
                    for ($time = $start; $time < $end; $time += 1800) {
                        $slot = date('H:i', $time);
                        $available = true;

                        // Check if slot conflicts with any booking
                        foreach ($bookings as $booking) {
                            $booking_start = strtotime($booking['start_time']);
                            $booking_end = strtotime($booking['end_time']);
                            
                            if ($time >= $booking_start && $time < $booking_end) {
                                $available = false;
                                break;
                            }
                        }

                        if ($available) {
                            $availability[] = $slot;
                        }
                    }
                }
            }

            return new WP_REST_Response($availability, 200);
        } catch (Exception $e) {
            return new WP_Error('database_error', $e->getMessage(), array('status' => 500));
        }
    }

    /**
     * Check professional permission
     */
    public function check_professional_permission() {
        return current_user_can('beauty_professional');
    }
}
