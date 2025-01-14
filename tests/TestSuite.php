<?php

declare(strict_types=1);

namespace BeautyDirectory\Tests;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/TestSetup.php';

// Debug information
echo "Current directory: " . __DIR__ . "\n";
echo "Autoloader path: " . __DIR__ . '/../vendor/autoload.php' . "\n";
echo "Autoloader exists: " . (file_exists(__DIR__ . '/../vendor/autoload.php') ? 'Yes' : 'No') . "\n";
echo "TestSetup.php exists: " . (file_exists(__DIR__ . '/TestSetup.php') ? 'Yes' : 'No') . "\n";

/**
 * Main test suite for Beauty Directory platform
 */
class TestSuite
{
    /**
     * Run all tests
     */
    public function runAll(): void
    {
        $this->runEnvironmentTests();
        $this->runRoutingTests();
        $this->runServiceTests();
    }

    /**
     * Test environment setup
     */
    private function runEnvironmentTests(): void
    {
        echo "\nRunning Environment Tests...\n";
        $setup = new TestSetup('PHP Environment');
        $results = $setup->testFeatures();
        $setup->displayResults($results);
    }

    /**
     * Test routing and URL handling
     */
    private function runRoutingTests(): void
    {
        echo "\nRunning Routing Tests...\n";
        $routes = [
            '/' => 'Home page',
            '/services' => 'Services listing',
            '/providers' => 'Service providers',
            '/bookings' => 'Booking system',
            '/profile' => 'User profile',
        ];

        foreach ($routes as $route => $description) {
            echo "Testing route: $route ($description)\n";
            // TODO: Implement actual route testing once routing is set up
            echo "⚠️ Route testing not implemented yet\n";
        }
    }

    /**
     * Test service management
     */
    private function runServiceTests(): void
    {
        echo "\nRunning Service Tests...\n";
        $services = [
            'Haircut' => ['duration' => 60, 'price' => 50.00],
            'Makeup' => ['duration' => 90, 'price' => 75.00],
            'Manicure' => ['duration' => 45, 'price' => 35.00]
        ];

        foreach ($services as $service => $details) {
            echo "Testing $service service...\n";
            echo "- Duration: {$details['duration']} minutes\n";
            echo "- Price: \${$details['price']}\n";
            // TODO: Implement actual service testing once models are created
            echo "⚠️ Service testing not implemented yet\n";
        }
    }
}

// Run all tests if this file is executed directly
if (basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'])) {
    $suite = new TestSuite();
    $suite->runAll();
}
