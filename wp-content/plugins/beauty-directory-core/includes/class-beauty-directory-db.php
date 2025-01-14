<?php
/**
 * Database Connection Layer for Beauty Directory
 */

if (!defined('ABSPATH')) {
    exit;
}

class Beauty_Directory_DB {
    private $db;
    private $prefix;

    public function __construct() {
        global $wpdb;
        $this->prefix = $wpdb->prefix . 'beauty_';
        
        // Initialize PostgreSQL connection
        $this->init_connection();
    }

    private function init_connection() {
        $host = defined('BEAUTY_DB_HOST') ? BEAUTY_DB_HOST : DB_HOST;
        $port = defined('BEAUTY_DB_PORT') ? BEAUTY_DB_PORT : '5432';
        $name = defined('BEAUTY_DB_NAME') ? BEAUTY_DB_NAME : DB_NAME;
        $user = defined('BEAUTY_DB_USER') ? BEAUTY_DB_USER : DB_USER;
        $pass = defined('BEAUTY_DB_PASSWORD') ? BEAUTY_DB_PASSWORD : DB_PASSWORD;

        try {
            $this->db = new PDO(
                "pgsql:host=$host;port=$port;dbname=$name",
                $user,
                $pass,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                )
            );
        } catch (PDOException $e) {
            error_log('Beauty Directory Database Connection Error: ' . $e->getMessage());
        }
    }

    public function create_tables() {
        try {
            $sql = file_get_contents(BEAUTY_DIRECTORY_PLUGIN_DIR . 'database/init.sql');
            $this->db->exec($sql);
            return true;
        } catch (PDOException $e) {
            error_log('Beauty Directory Table Creation Error: ' . $e->getMessage());
            return false;
        }
    }

    // Professional Profile Methods
    public function create_professional_profile($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO professional_profiles 
                (wp_user_id, business_name, experience_years, bio, verification_status, membership_level)
                VALUES (:wp_user_id, :business_name, :experience_years, :bio, :verification_status, :membership_level)
                RETURNING id
            ");
            
            $stmt->execute($data);
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log('Create Professional Profile Error: ' . $e->getMessage());
            return false;
        }
    }

    public function get_professional_profile($id) {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM professional_profiles 
                WHERE id = :id OR wp_user_id = :wp_user_id
            ");
            
            $stmt->execute(array(
                'id' => $id,
                'wp_user_id' => $id
            ));
            
            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log('Get Professional Profile Error: ' . $e->getMessage());
            return false;
        }
    }

    // Service Methods
    public function create_service($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO services 
                (professional_id, name, description, duration, price, category_id)
                VALUES (:professional_id, :name, :description, :duration, :price, :category_id)
                RETURNING id
            ");
            
            $stmt->execute($data);
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log('Create Service Error: ' . $e->getMessage());
            return false;
        }
    }

    public function get_professional_services($professional_id) {
        try {
            $stmt = $this->db->prepare("
                SELECT s.*, c.name as category_name 
                FROM services s
                LEFT JOIN service_categories c ON s.category_id = c.id
                WHERE s.professional_id = :professional_id AND s.is_active = true
                ORDER BY s.name
            ");
            
            $stmt->execute(array('professional_id' => $professional_id));
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log('Get Professional Services Error: ' . $e->getMessage());
            return false;
        }
    }

    // Booking Methods
    public function create_booking($data) {
        try {
            $this->db->beginTransaction();

            $stmt = $this->db->prepare("
                INSERT INTO bookings 
                (professional_id, customer_id, service_id, booking_date, start_time, end_time, total_price, notes)
                VALUES (:professional_id, :customer_id, :service_id, :booking_date, :start_time, :end_time, :total_price, :notes)
                RETURNING id
            ");
            
            $stmt->execute($data);
            $booking_id = $this->db->lastInsertId();

            $this->db->commit();
            return $booking_id;
        } catch (PDOException $e) {
            $this->db->rollBack();
            error_log('Create Booking Error: ' . $e->getMessage());
            return false;
        }
    }

    public function get_professional_bookings($professional_id, $start_date = null, $end_date = null) {
        try {
            $sql = "
                SELECT b.*, s.name as service_name, 
                       u.display_name as customer_name
                FROM bookings b
                JOIN services s ON b.service_id = s.id
                JOIN wp_users u ON b.customer_id = u.ID
                WHERE b.professional_id = :professional_id
            ";

            if ($start_date && $end_date) {
                $sql .= " AND b.booking_date BETWEEN :start_date AND :end_date";
            }

            $sql .= " ORDER BY b.booking_date, b.start_time";

            $stmt = $this->db->prepare($sql);
            
            $params = array('professional_id' => $professional_id);
            if ($start_date && $end_date) {
                $params['start_date'] = $start_date;
                $params['end_date'] = $end_date;
            }

            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log('Get Professional Bookings Error: ' . $e->getMessage());
            return false;
        }
    }

    // Review Methods
    public function create_review($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO reviews 
                (booking_id, customer_id, professional_id, rating, comment)
                VALUES (:booking_id, :customer_id, :professional_id, :rating, :comment)
                RETURNING id
            ");
            
            $stmt->execute($data);
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log('Create Review Error: ' . $e->getMessage());
            return false;
        }
    }

    public function get_professional_reviews($professional_id) {
        try {
            $stmt = $this->db->prepare("
                SELECT r.*, u.display_name as customer_name
                FROM reviews r
                JOIN wp_users u ON r.customer_id = u.ID
                WHERE r.professional_id = :professional_id
                ORDER BY r.created_at DESC
            ");
            
            $stmt->execute(array('professional_id' => $professional_id));
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log('Get Professional Reviews Error: ' . $e->getMessage());
            return false;
        }
    }

    // Portfolio Methods
    public function add_portfolio_item($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO portfolio_items 
                (professional_id, title, description, image_url, service_category_id)
                VALUES (:professional_id, :title, :description, :image_url, :service_category_id)
                RETURNING id
            ");
            
            $stmt->execute($data);
            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log('Add Portfolio Item Error: ' . $e->getMessage());
            return false;
        }
    }

    public function get_professional_portfolio($professional_id) {
        try {
            $stmt = $this->db->prepare("
                SELECT p.*, c.name as category_name
                FROM portfolio_items p
                LEFT JOIN service_categories c ON p.service_category_id = c.id
                WHERE p.professional_id = :professional_id
                ORDER BY p.created_at DESC
            ");
            
            $stmt->execute(array('professional_id' => $professional_id));
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log('Get Professional Portfolio Error: ' . $e->getMessage());
            return false;
        }
    }

    // Working Hours Methods
    public function set_working_hours($data) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO working_hours 
                (professional_id, day_of_week, start_time, end_time, is_available)
                VALUES (:professional_id, :day_of_week, :start_time, :end_time, :is_available)
                ON CONFLICT (professional_id, day_of_week) 
                DO UPDATE SET 
                    start_time = EXCLUDED.start_time,
                    end_time = EXCLUDED.end_time,
                    is_available = EXCLUDED.is_available
                RETURNING id
            ");
            
            $stmt->execute($data);
            return true;
        } catch (PDOException $e) {
            error_log('Set Working Hours Error: ' . $e->getMessage());
            return false;
        }
    }

    public function get_working_hours($professional_id) {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM working_hours
                WHERE professional_id = :professional_id
                ORDER BY day_of_week
            ");
            
            $stmt->execute(array('professional_id' => $professional_id));
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log('Get Working Hours Error: ' . $e->getMessage());
            return false;
        }
    }
}
