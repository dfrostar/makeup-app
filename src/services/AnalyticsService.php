<?php

namespace BeautyDirectory\Services;

class AnalyticsService {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats() {
        return [
            'revenue' => $this->getRevenueStats(),
            'bookings' => $this->getBookingStats(),
            'professionals' => $this->getProfessionalStats(),
            'services' => $this->getServiceStats(),
            'recentActivity' => $this->getRecentActivity()
        ];
    }

    /**
     * Get revenue statistics
     */
    private function getRevenueStats() {
        // Monthly revenue for the past 12 months
        $stmt = $this->db->prepare("
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                SUM(total_amount) as revenue
            FROM service_bookings
            WHERE status = 'completed'
            AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY month
            ORDER BY month ASC
        ");
        $stmt->execute();
        $monthlyRevenue = $stmt->fetchAll();

        // Total revenue
        $stmt = $this->db->prepare("
            SELECT SUM(total_amount) as total
            FROM service_bookings
            WHERE status = 'completed'
        ");
        $stmt->execute();
        $totalRevenue = $stmt->fetch()['total'];

        return [
            'total' => $totalRevenue,
            'labels' => array_column($monthlyRevenue, 'month'),
            'data' => array_column($monthlyRevenue, 'revenue')
        ];
    }

    /**
     * Get booking statistics
     */
    private function getBookingStats() {
        // Weekly bookings
        $stmt = $this->db->prepare("
            SELECT 
                DATE_FORMAT(booking_date, '%W') as day,
                COUNT(*) as count
            FROM service_bookings
            WHERE booking_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            GROUP BY day
            ORDER BY booking_date ASC
        ");
        $stmt->execute();
        $weeklyBookings = $stmt->fetchAll();

        // Today's bookings
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count
            FROM service_bookings
            WHERE DATE(booking_date) = CURDATE()
        ");
        $stmt->execute();
        $todayBookings = $stmt->fetch()['count'];

        // Conversion rate
        $stmt = $this->db->prepare("
            SELECT 
                (SELECT COUNT(*) FROM service_bookings WHERE status = 'completed') * 100.0 /
                NULLIF((SELECT COUNT(*) FROM service_bookings), 0) as rate
        ");
        $stmt->execute();
        $conversionRate = $stmt->fetch()['rate'];

        return [
            'today' => $todayBookings,
            'conversionRate' => round($conversionRate, 2),
            'labels' => array_column($weeklyBookings, 'day'),
            'data' => array_column($weeklyBookings, 'count')
        ];
    }

    /**
     * Get professional statistics
     */
    private function getProfessionalStats() {
        // Active professionals
        $stmt = $this->db->prepare("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END) as verified,
                SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured
            FROM professional_profiles
            WHERE status = 'active'
        ");
        $stmt->execute();
        $stats = $stmt->fetch();

        // Membership distribution
        $stmt = $this->db->prepare("
            SELECT 
                membership_type,
                COUNT(*) as count
            FROM professional_profiles
            GROUP BY membership_type
        ");
        $stmt->execute();
        $memberships = $stmt->fetchAll();

        return [
            'active' => $stats['total'],
            'verified' => $stats['verified'],
            'featured' => $stats['featured'],
            'memberships' => $memberships
        ];
    }

    /**
     * Get service statistics
     */
    private function getServiceStats() {
        // Popular services
        $stmt = $this->db->prepare("
            SELECT 
                bs.name,
                COUNT(sb.id) as booking_count
            FROM beauty_services bs
            LEFT JOIN service_bookings sb ON bs.id = sb.service_id
            GROUP BY bs.id
            ORDER BY booking_count DESC
            LIMIT 5
        ");
        $stmt->execute();
        $popularServices = $stmt->fetchAll();

        return [
            'labels' => array_column($popularServices, 'name'),
            'data' => array_column($popularServices, 'booking_count')
        ];
    }

    /**
     * Get recent activity
     */
    private function getRecentActivity() {
        $stmt = $this->db->prepare("
            (SELECT 
                'booking' as type,
                created_at as time,
                CONCAT('New booking for ', bs.name) as description
            FROM service_bookings sb
            JOIN beauty_services bs ON sb.service_id = bs.id
            ORDER BY created_at DESC
            LIMIT 5)
            
            UNION
            
            (SELECT 
                'professional' as type,
                created_at as time,
                CONCAT('New professional registered: ', business_name) as description
            FROM professional_profiles
            ORDER BY created_at DESC
            LIMIT 5)
            
            UNION
            
            (SELECT 
                'review' as type,
                created_at as time,
                CONCAT('New review: ', SUBSTRING(review, 1, 50), '...') as description
            FROM service_reviews
            ORDER BY created_at DESC
            LIMIT 5)
            
            ORDER BY time DESC
            LIMIT 10
        ");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get professional performance metrics
     */
    public function getProfessionalMetrics($professionalId) {
        return [
            'revenue' => $this->getProfessionalRevenue($professionalId),
            'bookings' => $this->getProfessionalBookings($professionalId),
            'reviews' => $this->getProfessionalReviews($professionalId),
            'services' => $this->getProfessionalServices($professionalId)
        ];
    }

    private function getProfessionalRevenue($professionalId) {
        $stmt = $this->db->prepare("
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as month,
                SUM(total_amount) as revenue,
                SUM(commission_amount) as commission
            FROM service_bookings
            WHERE professional_id = ?
            AND status = 'completed'
            AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY month
            ORDER BY month ASC
        ");
        $stmt->execute([$professionalId]);
        return $stmt->fetchAll();
    }

    private function getProfessionalBookings($professionalId) {
        $stmt = $this->db->prepare("
            SELECT 
                status,
                COUNT(*) as count
            FROM service_bookings
            WHERE professional_id = ?
            GROUP BY status
        ");
        $stmt->execute([$professionalId]);
        return $stmt->fetchAll();
    }

    private function getProfessionalReviews($professionalId) {
        $stmt = $this->db->prepare("
            SELECT 
                AVG(rating) as average_rating,
                COUNT(*) as total_reviews,
                aspects_rating
            FROM service_reviews sr
            JOIN service_bookings sb ON sr.booking_id = sb.id
            WHERE sb.professional_id = ?
            GROUP BY sb.professional_id
        ");
        $stmt->execute([$professionalId]);
        return $stmt->fetch();
    }

    private function getProfessionalServices($professionalId) {
        $stmt = $this->db->prepare("
            SELECT 
                bs.name,
                COUNT(sb.id) as booking_count,
                AVG(sr.rating) as average_rating
            FROM beauty_services bs
            LEFT JOIN service_bookings sb ON bs.id = sb.service_id
            LEFT JOIN service_reviews sr ON sb.id = sr.booking_id
            WHERE bs.professional_id = ?
            GROUP BY bs.id
        ");
        $stmt->execute([$professionalId]);
        return $stmt->fetchAll();
    }
}
