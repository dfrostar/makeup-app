<?php

namespace BeautyDirectory\Services;

class BookingService {
    private $db;
    private $paymentService;

    public function __construct($db, PaymentService $paymentService) {
        $this->db = $db;
        $this->paymentService = $paymentService;
    }

    /**
     * Get available time slots for a service
     */
    public function getAvailableSlots($professionalId, $serviceId, $date) {
        try {
            // Get service duration
            $stmt = $this->db->prepare("
                SELECT duration FROM beauty_services 
                WHERE id = ? AND professional_id = ?
            ");
            $stmt->execute([$serviceId, $professionalId]);
            $service = $stmt->fetch();

            // Get professional's working hours
            $workingHours = $this->getProfessionalWorkingHours($professionalId, $date);

            // Get existing bookings
            $stmt = $this->db->prepare("
                SELECT start_time 
                FROM service_bookings 
                WHERE service_id = ? 
                AND booking_date = ? 
                AND status != 'cancelled'
            ");
            $stmt->execute([$serviceId, $date]);
            $existingBookings = $stmt->fetchAll();

            // Calculate available slots
            $slots = [];
            $currentTime = strtotime($workingHours['start_time']);
            $endTime = strtotime($workingHours['end_time']);
            $duration = $service['duration'] * 60; // Convert to seconds

            while ($currentTime + $duration <= $endTime) {
                $slotStart = date('H:i', $currentTime);
                $isAvailable = true;

                // Check if slot conflicts with existing bookings
                foreach ($existingBookings as $booking) {
                    $bookingStart = strtotime($booking['start_time']);
                    if ($currentTime < $bookingStart + $duration && 
                        $currentTime + $duration > $bookingStart) {
                        $isAvailable = false;
                        break;
                    }
                }

                if ($isAvailable) {
                    $slots[] = $slotStart;
                }

                $currentTime += 1800; // 30-minute intervals
            }

            return $slots;
        } catch (\Exception $e) {
            throw new \Exception('Error getting available slots: ' . $e->getMessage());
        }
    }

    /**
     * Create a new booking
     */
    public function createBooking($userId, $professionalId, $serviceId, $date, $timeSlot) {
        try {
            // Start transaction
            $this->db->beginTransaction();

            // Verify slot availability
            $availableSlots = $this->getAvailableSlots($professionalId, $serviceId, $date);
            if (!in_array($timeSlot, $availableSlots)) {
                throw new \Exception('Selected time slot is not available');
            }

            // Get service details
            $stmt = $this->db->prepare("
                SELECT price, commission_rate 
                FROM beauty_services 
                WHERE id = ?
            ");
            $stmt->execute([$serviceId]);
            $service = $stmt->fetch();

            // Calculate amounts
            $totalAmount = $service['price'];
            $commissionAmount = $totalAmount * ($service['commission_rate'] / 100);

            // Create booking record
            $stmt = $this->db->prepare("
                INSERT INTO service_bookings (
                    service_id, customer_id, booking_date, 
                    start_time, total_amount, commission_amount
                ) VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $serviceId,
                $userId,
                $date,
                $timeSlot,
                $totalAmount,
                $commissionAmount
            ]);
            $bookingId = $this->db->lastInsertId();

            // Process payment
            $paymentResult = $this->paymentService->processBookingPayment($bookingId);

            // Commit transaction
            $this->db->commit();

            return [
                'bookingId' => $bookingId,
                'paymentIntent' => $paymentResult['clientSecret']
            ];
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw new \Exception('Error creating booking: ' . $e->getMessage());
        }
    }

    /**
     * Cancel a booking
     */
    public function cancelBooking($bookingId, $userId) {
        try {
            // Verify booking ownership and status
            $stmt = $this->db->prepare("
                SELECT * FROM service_bookings 
                WHERE id = ? AND customer_id = ? 
                AND status != 'cancelled'
            ");
            $stmt->execute([$bookingId, $userId]);
            $booking = $stmt->fetch();

            if (!$booking) {
                throw new \Exception('Booking not found or already cancelled');
            }

            // Check cancellation policy
            $bookingTime = strtotime($booking['booking_date'] . ' ' . $booking['start_time']);
            $cancellationDeadline = $bookingTime - (24 * 3600); // 24 hours before

            if (time() > $cancellationDeadline) {
                throw new \Exception('Cancellation period has expired');
            }

            // Update booking status
            $stmt = $this->db->prepare("
                UPDATE service_bookings 
                SET status = 'cancelled', 
                    cancelled_at = NOW() 
                WHERE id = ?
            ");
            $stmt->execute([$bookingId]);

            // Process refund if applicable
            if ($booking['payment_status'] === 'completed') {
                $this->paymentService->processRefund($bookingId);
            }

            return true;
        } catch (\Exception $e) {
            throw new \Exception('Error cancelling booking: ' . $e->getMessage());
        }
    }

    /**
     * Get professional's working hours
     */
    private function getProfessionalWorkingHours($professionalId, $date) {
        // Implementation for getting working hours
        // This would typically check the professional's schedule and availability
        return [
            'start_time' => '09:00',
            'end_time' => '17:00'
        ];
    }
}
