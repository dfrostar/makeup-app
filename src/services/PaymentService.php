<?php

namespace BeautyDirectory\Services;

use Stripe\Stripe;
use Stripe\Customer;
use Stripe\PaymentIntent;
use Stripe\Subscription;

class PaymentService {
    private $stripe;
    private $db;

    public function __construct($db) {
        Stripe::setApiKey(STRIPE_SECRET_KEY);
        $this->db = $db;
    }

    /**
     * Create a subscription for a professional membership
     */
    public function createMembershipSubscription($userId, $planType) {
        try {
            // Get plan details from database
            $stmt = $this->db->prepare("SELECT * FROM professional_memberships WHERE plan_type = ?");
            $stmt->execute([$planType]);
            $plan = $stmt->fetch();

            // Create or get Stripe customer
            $customer = $this->getOrCreateCustomer($userId);

            // Create subscription
            $subscription = Subscription::create([
                'customer' => $customer->id,
                'items' => [['price' => $this->getPlanPriceId($planType)]],
                'payment_behavior' => 'default_incomplete',
                'expand' => ['latest_invoice.payment_intent'],
            ]);

            // Store subscription details
            $this->storeSubscription($userId, $subscription->id, $planType);

            return [
                'subscriptionId' => $subscription->id,
                'clientSecret' => $subscription->latest_invoice->payment_intent->client_secret,
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error creating subscription: ' . $e->getMessage());
        }
    }

    /**
     * Process a service booking payment
     */
    public function processBookingPayment($bookingId) {
        try {
            // Get booking details
            $stmt = $this->db->prepare("
                SELECT sb.*, bs.price, bs.commission_rate
                FROM service_bookings sb
                JOIN beauty_services bs ON sb.service_id = bs.id
                WHERE sb.id = ?
            ");
            $stmt->execute([$bookingId]);
            $booking = $stmt->fetch();

            // Calculate amounts
            $totalAmount = $booking['price'];
            $commissionAmount = $totalAmount * ($booking['commission_rate'] / 100);

            // Create payment intent
            $paymentIntent = PaymentIntent::create([
                'amount' => $totalAmount * 100, // Convert to cents
                'currency' => 'usd',
                'application_fee_amount' => $commissionAmount * 100,
                'transfer_data' => [
                    'destination' => $this->getProfessionalStripeAccount($booking['professional_id']),
                ],
                'metadata' => [
                    'booking_id' => $bookingId,
                    'service_id' => $booking['service_id'],
                ],
            ]);

            // Update booking with payment intent
            $stmt = $this->db->prepare("
                UPDATE service_bookings 
                SET payment_intent_id = ?, commission_amount = ?
                WHERE id = ?
            ");
            $stmt->execute([$paymentIntent->id, $commissionAmount, $bookingId]);

            return [
                'clientSecret' => $paymentIntent->client_secret,
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error processing payment: ' . $e->getMessage());
        }
    }

    /**
     * Process featured listing payment
     */
    public function processFeaturedListing($professionalId, $duration) {
        try {
            // Get featured listing price
            $stmt = $this->db->prepare("SELECT price FROM ad_spaces WHERE location = 'featured_listing'");
            $stmt->execute();
            $price = $stmt->fetch()['price'];

            $paymentIntent = PaymentIntent::create([
                'amount' => $price * 100,
                'currency' => 'usd',
                'metadata' => [
                    'professional_id' => $professionalId,
                    'type' => 'featured_listing',
                    'duration' => $duration,
                ],
            ]);

            return [
                'clientSecret' => $paymentIntent->client_secret,
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error processing featured listing: ' . $e->getMessage());
        }
    }

    /**
     * Handle successful payment webhook
     */
    public function handlePaymentSucceeded($event) {
        $paymentIntent = $event->data->object;
        
        if (isset($paymentIntent->metadata['booking_id'])) {
            // Update booking status
            $stmt = $this->db->prepare("
                UPDATE service_bookings 
                SET payment_status = 'completed'
                WHERE id = ?
            ");
            $stmt->execute([$paymentIntent->metadata['booking_id']]);
        } elseif (isset($paymentIntent->metadata['type']) && $paymentIntent->metadata['type'] === 'featured_listing') {
            // Update professional featured status
            $stmt = $this->db->prepare("
                UPDATE professional_profiles 
                SET featured_until = DATE_ADD(NOW(), INTERVAL ? DAY)
                WHERE id = ?
            ");
            $stmt->execute([
                $paymentIntent->metadata['duration'],
                $paymentIntent->metadata['professional_id']
            ]);
        }
    }

    private function getOrCreateCustomer($userId) {
        // Implementation for customer creation/retrieval
    }

    private function getPlanPriceId($planType) {
        // Implementation for getting Stripe price ID
    }

    private function storeSubscription($userId, $subscriptionId, $planType) {
        // Implementation for storing subscription details
    }

    private function getProfessionalStripeAccount($professionalId) {
        // Implementation for getting professional's Stripe account
    }
}
