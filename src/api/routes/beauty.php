<?php

use BeautyDirectory\Services\BookingService;
use BeautyDirectory\Services\PaymentService;
use Slim\App;
use Slim\Http\Response;
use Slim\Http\ServerRequest;

return function (App $app) {
    // Membership Routes
    $app->post('/api/memberships/subscribe', function (ServerRequest $request, Response $response) {
        try {
            $data = $request->getParsedBody();
            $userId = $request->getAttribute('userId');
            $paymentService = new PaymentService($this->get('db'));
            
            $result = $paymentService->createMembershipSubscription(
                $userId,
                $data['planType']
            );
            
            return $response->withJson($result);
        } catch (\Exception $e) {
            return $response
                ->withStatus(400)
                ->withJson(['error' => $e->getMessage()]);
        }
    });

    // Booking Routes
    $app->get('/api/professionals/{id}/services', function (ServerRequest $request, Response $response, array $args) {
        try {
            $stmt = $this->get('db')->prepare("
                SELECT * FROM beauty_services 
                WHERE professional_id = ? 
                AND status = 'active'
            ");
            $stmt->execute([$args['id']]);
            $services = $stmt->fetchAll();
            
            return $response->withJson($services);
        } catch (\Exception $e) {
            return $response
                ->withStatus(400)
                ->withJson(['error' => $e->getMessage()]);
        }
    });

    $app->post('/api/availability', function (ServerRequest $request, Response $response) {
        try {
            $data = $request->getParsedBody();
            $bookingService = new BookingService(
                $this->get('db'),
                $this->get('paymentService')
            );
            
            $slots = $bookingService->getAvailableSlots(
                $data['professionalId'],
                $data['serviceId'],
                $data['date']
            );
            
            return $response->withJson(['slots' => $slots]);
        } catch (\Exception $e) {
            return $response
                ->withStatus(400)
                ->withJson(['error' => $e->getMessage()]);
        }
    });

    $app->post('/api/bookings', function (ServerRequest $request, Response $response) {
        try {
            $data = $request->getParsedBody();
            $userId = $request->getAttribute('userId');
            $bookingService = new BookingService(
                $this->get('db'),
                $this->get('paymentService')
            );
            
            $result = $bookingService->createBooking(
                $userId,
                $data['professionalId'],
                $data['serviceId'],
                $data['date'],
                $data['timeSlot']
            );
            
            return $response->withJson($result);
        } catch (\Exception $e) {
            return $response
                ->withStatus(400)
                ->withJson(['error' => $e->getMessage()]);
        }
    });

    $app->delete('/api/bookings/{id}', function (ServerRequest $request, Response $response, array $args) {
        try {
            $userId = $request->getAttribute('userId');
            $bookingService = new BookingService(
                $this->get('db'),
                $this->get('paymentService')
            );
            
            $result = $bookingService->cancelBooking($args['id'], $userId);
            
            return $response->withJson(['success' => $result]);
        } catch (\Exception $e) {
            return $response
                ->withStatus(400)
                ->withJson(['error' => $e->getMessage()]);
        }
    });

    // Featured Listing Routes
    $app->post('/api/featured-listings', function (ServerRequest $request, Response $response) {
        try {
            $data = $request->getParsedBody();
            $userId = $request->getAttribute('userId');
            $paymentService = new PaymentService($this->get('db'));
            
            $result = $paymentService->processFeaturedListing(
                $userId,
                $data['duration']
            );
            
            return $response->withJson($result);
        } catch (\Exception $e) {
            return $response
                ->withStatus(400)
                ->withJson(['error' => $e->getMessage()]);
        }
    });

    // Payment Webhook
    $app->post('/api/webhooks/stripe', function (ServerRequest $request, Response $response) {
        try {
            $payload = $request->getBody();
            $sig_header = $request->getHeaderLine('Stripe-Signature');
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sig_header,
                STRIPE_WEBHOOK_SECRET
            );
            
            $paymentService = new PaymentService($this->get('db'));
            
            switch ($event->type) {
                case 'payment_intent.succeeded':
                    $paymentService->handlePaymentSucceeded($event);
                    break;
                case 'customer.subscription.created':
                    $paymentService->handleSubscriptionCreated($event);
                    break;
                case 'customer.subscription.deleted':
                    $paymentService->handleSubscriptionCancelled($event);
                    break;
            }
            
            return $response->withJson(['received' => true]);
        } catch (\Exception $e) {
            return $response
                ->withStatus(400)
                ->withJson(['error' => $e->getMessage()]);
        }
    });
};
