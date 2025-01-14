<?php

namespace BeautyDirectory\Services;

use PHPMailer\PHPMailer\PHPMailer;
use Twilio\Rest\Client as TwilioClient;

class NotificationService {
    private $db;
    private $mailer;
    private $twilioClient;

    public function __construct($db) {
        $this->db = $db;
        $this->initializeMailer();
        $this->initializeTwilio();
    }

    private function initializeMailer() {
        $this->mailer = new PHPMailer(true);
        $this->mailer->isSMTP();
        $this->mailer->Host = SMTP_HOST;
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = SMTP_USERNAME;
        $this->mailer->Password = SMTP_PASSWORD;
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port = SMTP_PORT;
    }

    private function initializeTwilio() {
        $this->twilioClient = new TwilioClient(
            TWILIO_ACCOUNT_SID,
            TWILIO_AUTH_TOKEN
        );
    }

    /**
     * Send booking confirmation
     */
    public function sendBookingConfirmation($bookingId) {
        try {
            $booking = $this->getBookingDetails($bookingId);
            
            // Send email to customer
            $this->sendEmail(
                $booking['customer_email'],
                'Booking Confirmation - Beauty Directory',
                $this->renderTemplate('booking_confirmation', [
                    'booking' => $booking,
                    'professional' => $booking['professional']
                ])
            );

            // Send SMS if phone number available
            if ($booking['customer_phone']) {
                $this->sendSMS(
                    $booking['customer_phone'],
                    "Your beauty appointment is confirmed for {$booking['date']} at {$booking['time']} with {$booking['professional']['name']}."
                );
            }

            // Notify professional
            $this->sendEmail(
                $booking['professional']['email'],
                'New Booking Received - Beauty Directory',
                $this->renderTemplate('professional_booking_notification', [
                    'booking' => $booking,
                    'customer' => $booking['customer']
                ])
            );

            // Store notification record
            $this->logNotification($bookingId, 'booking_confirmation');

        } catch (\Exception $e) {
            throw new \Exception('Error sending booking confirmation: ' . $e->getMessage());
        }
    }

    /**
     * Send booking reminder
     */
    public function sendBookingReminder($bookingId) {
        try {
            $booking = $this->getBookingDetails($bookingId);
            
            // Send email reminder
            $this->sendEmail(
                $booking['customer_email'],
                'Appointment Reminder - Beauty Directory',
                $this->renderTemplate('booking_reminder', [
                    'booking' => $booking,
                    'professional' => $booking['professional']
                ])
            );

            // Send SMS reminder
            if ($booking['customer_phone']) {
                $this->sendSMS(
                    $booking['customer_phone'],
                    "Reminder: Your beauty appointment is tomorrow at {$booking['time']} with {$booking['professional']['name']}."
                );
            }

            $this->logNotification($bookingId, 'booking_reminder');

        } catch (\Exception $e) {
            throw new \Exception('Error sending booking reminder: ' . $e->getMessage());
        }
    }

    /**
     * Send cancellation notification
     */
    public function sendCancellationNotification($bookingId, $reason) {
        try {
            $booking = $this->getBookingDetails($bookingId);
            
            // Notify customer
            $this->sendEmail(
                $booking['customer_email'],
                'Booking Cancellation - Beauty Directory',
                $this->renderTemplate('booking_cancellation', [
                    'booking' => $booking,
                    'reason' => $reason
                ])
            );

            // Notify professional
            $this->sendEmail(
                $booking['professional']['email'],
                'Booking Cancellation - Beauty Directory',
                $this->renderTemplate('professional_cancellation_notification', [
                    'booking' => $booking,
                    'reason' => $reason
                ])
            );

            $this->logNotification($bookingId, 'booking_cancellation');

        } catch (\Exception $e) {
            throw new \Exception('Error sending cancellation notification: ' . $e->getMessage());
        }
    }

    /**
     * Send review request
     */
    public function sendReviewRequest($bookingId) {
        try {
            $booking = $this->getBookingDetails($bookingId);
            
            $this->sendEmail(
                $booking['customer_email'],
                'Share Your Experience - Beauty Directory',
                $this->renderTemplate('review_request', [
                    'booking' => $booking,
                    'professional' => $booking['professional']
                ])
            );

            $this->logNotification($bookingId, 'review_request');

        } catch (\Exception $e) {
            throw new \Exception('Error sending review request: ' . $e->getMessage());
        }
    }

    /**
     * Send professional verification
     */
    public function sendProfessionalVerification($professionalId) {
        try {
            $professional = $this->getProfessionalDetails($professionalId);
            
            $this->sendEmail(
                $professional['email'],
                'Account Verification - Beauty Directory',
                $this->renderTemplate('professional_verification', [
                    'professional' => $professional,
                    'verificationLink' => $this->generateVerificationLink($professionalId)
                ])
            );

            $this->logNotification($professionalId, 'professional_verification');

        } catch (\Exception $e) {
            throw new \Exception('Error sending verification: ' . $e->getMessage());
        }
    }

    private function sendEmail($to, $subject, $body) {
        try {
            $this->mailer->setFrom(EMAIL_FROM, 'Beauty Directory');
            $this->mailer->addAddress($to);
            $this->mailer->Subject = $subject;
            $this->mailer->Body = $body;
            $this->mailer->AltBody = strip_tags($body);
            
            return $this->mailer->send();
        } catch (\Exception $e) {
            throw new \Exception('Error sending email: ' . $e->getMessage());
        }
    }

    private function sendSMS($to, $message) {
        try {
            return $this->twilioClient->messages->create(
                $to,
                [
                    'from' => TWILIO_PHONE_NUMBER,
                    'body' => $message
                ]
            );
        } catch (\Exception $e) {
            throw new \Exception('Error sending SMS: ' . $e->getMessage());
        }
    }

    private function renderTemplate($template, $data) {
        $templatePath = TEMPLATE_PATH . "/{$template}.php";
        if (!file_exists($templatePath)) {
            throw new \Exception("Template not found: {$template}");
        }
        
        ob_start();
        extract($data);
        include $templatePath;
        return ob_get_clean();
    }

    private function getBookingDetails($bookingId) {
        $stmt = $this->db->prepare("
            SELECT 
                sb.*,
                u.email as customer_email,
                u.phone as customer_phone,
                u.name as customer_name,
                p.name as professional_name,
                p.email as professional_email,
                bs.name as service_name
            FROM service_bookings sb
            JOIN users u ON sb.customer_id = u.id
            JOIN professional_profiles p ON sb.professional_id = p.id
            JOIN beauty_services bs ON sb.service_id = bs.id
            WHERE sb.id = ?
        ");
        $stmt->execute([$bookingId]);
        return $stmt->fetch();
    }

    private function getProfessionalDetails($professionalId) {
        $stmt = $this->db->prepare("
            SELECT p.*, u.email, u.name
            FROM professional_profiles p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        ");
        $stmt->execute([$professionalId]);
        return $stmt->fetch();
    }

    private function logNotification($referenceId, $type) {
        $stmt = $this->db->prepare("
            INSERT INTO notification_logs (
                reference_id, notification_type, sent_at
            ) VALUES (?, ?, NOW())
        ");
        return $stmt->execute([$referenceId, $type]);
    }

    private function generateVerificationLink($professionalId) {
        $token = bin2hex(random_bytes(32));
        
        $stmt = $this->db->prepare("
            INSERT INTO verification_tokens (
                professional_id, token, expires_at
            ) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))
        ");
        $stmt->execute([$professionalId, $token]);
        
        return SITE_URL . "/verify-professional?token=" . $token;
    }
}
