<?php

namespace BeautyDirectory\Tests;

/**
 * Class to test PHP development environment setup
 */
class TestSetup
{
    private string $name;
    private array $features;

    /**
     * Constructor for the test setup
     * 
     * @param string $name The name of the test
     */
    public function __construct(string $name)
    {
        $this->name = $name;
        $this->features = [
            'PHP Version' => PHP_VERSION,
            'Extensions' => get_loaded_extensions(),
            'Debug Mode' => ini_get('display_errors'),
        ];
    }

    /**
     * Test PHP syntax features and formatting
     * 
     * @return array<string, mixed>
     */
    public function testFeatures(): array
    {
        // Test array syntax
        $colors = ['red', 'blue', 'green'];
        
        // Test string interpolation
        $message = "Testing setup for {$this->name}";
        
        // Test type declarations
        $numbers = array_map(
            fn(int $n): int => $n * 2,
            [1, 2, 3]
        );

        // Test error handling
        try {
            $result = $this->validateSetup();
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }

        return [
            'message' => $message,
            'colors' => $colors,
            'numbers' => $numbers,
            'features' => $this->features,
            'result' => $result ?? false,
        ];
    }

    /**
     * Validate the development setup
     * 
     * @throws \Exception if requirements are not met
     * @return bool
     */
    private function validateSetup(): bool
    {
        // Check PHP version
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            throw new \Exception('PHP version must be 7.4 or higher');
        }

        // Check required extensions
        $requiredExtensions = ['pdo', 'pdo_mysql', 'mysqli', 'json'];
        $loadedExtensions = get_loaded_extensions();
        $missingExtensions = array_diff($requiredExtensions, array_map('strtolower', $loadedExtensions));
        
        if (!empty($missingExtensions)) {
            throw new \Exception(
                'Missing required extensions: ' . 
                implode(', ', $missingExtensions)
            );
        }

        return true;
    }

    /**
     * Format and display test results
     * 
     * @param array<string, mixed> $results The test results to display
     * @return void
     */
    public function displayResults(array $results): void
    {
        echo "\nPHP Development Environment Test Results:\n";
        echo "----------------------------------------\n";
        foreach ($results as $key => $value) {
            echo ucfirst($key) . ": ";
            if (is_array($value)) {
                echo "\n  " . implode("\n  ", array_map(
                    fn($k, $v) => "$k: " . (is_array($v) ? implode(', ', $v) : $v),
                    array_keys($value),
                    array_values($value)
                ));
            } else {
                echo $value;
            }
            echo "\n";
        }
    }
}

// Run the tests
if (basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'])) {
    $test = new TestSetup('PHP Environment');
    $results = $test->testFeatures();
    $test->displayResults($results);
}
