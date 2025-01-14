<?php

declare(strict_types=1);

namespace BeautyDirectory\Tests;

/**
 * Test setup and environment validation
 */
class TestSetup
{
    private string $name;
    private array $results = [];

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    /**
     * Test PHP features and extensions
     */
    public function testFeatures(): array
    {
        $this->results = [];

        // Test PHP version
        $requiredVersion = '7.4.0';
        if (version_compare(PHP_VERSION, $requiredVersion, '>=')) {
            $this->results[] = [
                'test' => 'PHP Version',
                'status' => true,
                'message' => 'PHP ' . PHP_VERSION . ' installed'
            ];
        } else {
            $this->results[] = [
                'test' => 'PHP Version',
                'status' => false,
                'message' => "PHP version $requiredVersion or higher required (current: " . PHP_VERSION . ")"
            ];
        }

        // Test required extensions
        $requiredExtensions = [
            'pdo',
            'pdo_mysql',
            'json',
            'mbstring',
            'xml',
            'curl'
        ];

        foreach ($requiredExtensions as $ext) {
            if (extension_loaded($ext)) {
                $this->results[] = [
                    'test' => "Extension: $ext",
                    'status' => true,
                    'message' => "Extension $ext is loaded"
                ];
            } else {
                $this->results[] = [
                    'test' => "Extension: $ext",
                    'status' => false,
                    'message' => "Extension $ext is required but not loaded"
                ];
            }
        }

        // Test write permissions in key directories
        $directories = [
            'logs',
            'cache',
            'uploads'
        ];

        foreach ($directories as $dir) {
            $path = dirname(__DIR__) . DIRECTORY_SEPARATOR . $dir;
            if (!file_exists($path)) {
                mkdir($path, 0755, true);
            }
            
            if (is_writable($path)) {
                $this->results[] = [
                    'test' => "Directory: $dir",
                    'status' => true,
                    'message' => "Directory $dir is writable"
                ];
            } else {
                $this->results[] = [
                    'test' => "Directory: $dir",
                    'status' => false,
                    'message' => "Directory $dir is not writable"
                ];
            }
        }

        return $this->results;
    }

    /**
     * Display test results
     */
    public function displayResults(array $results): void
    {
        echo "\n{$this->name} Test Results:\n";
        echo str_repeat('-', 80) . "\n";

        $passed = 0;
        $failed = 0;

        foreach ($results as $result) {
            $symbol = $result['status'] ? '✓' : '✗';
            $color = $result['status'] ? '32' : '31'; // 32 = green, 31 = red
            echo "\033[{$color}m$symbol\033[0m {$result['test']}: {$result['message']}\n";

            if ($result['status']) {
                $passed++;
            } else {
                $failed++;
            }
        }

        echo str_repeat('-', 80) . "\n";
        echo "Total: " . count($results) . " | ";
        echo "\033[32mPassed: $passed\033[0m | ";
        echo "\033[31mFailed: $failed\033[0m\n";
    }
}
