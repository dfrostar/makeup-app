<?php

namespace BeautyDirectory\Tests;

use PDO;
use PHPUnit\Framework\TestCase as BaseTestCase;

class TestCase extends BaseTestCase
{
    protected PDO $db;
    protected array $config;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Load test configuration
        $this->config = require __DIR__ . '/config/test_config.php';
        
        // Create test database connection
        $this->db = new PDO(
            "mysql:host={$this->config['database']['host']};charset={$this->config['database']['charset']}",
            $this->config['database']['user'],
            $this->config['database']['password'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        
        // Create test database if it doesn't exist
        $this->db->exec("CREATE DATABASE IF NOT EXISTS {$this->config['database']['name']}");
        $this->db->exec("USE {$this->config['database']['name']}");
        
        // Import test schema
        $this->importTestSchema();
        
        // Create test directories
        $this->createTestDirectories();
    }

    protected function tearDown(): void
    {
        // Clean up test database
        $this->db->exec("DROP DATABASE IF EXISTS {$this->config['database']['name']}");
        
        // Clean up test directories
        $this->cleanupTestDirectories();
        
        parent::tearDown();
    }

    protected function importTestSchema(): void
    {
        // Read and execute schema file
        $schema = file_get_contents(__DIR__ . '/../database/content_schema.sql');
        $this->db->exec($schema);
    }

    protected function createTestDirectories(): void
    {
        $dirs = [
            $this->config['upload_dir'],
            $this->config['log_dir']
        ];

        foreach ($dirs as $dir) {
            if (!file_exists($dir)) {
                mkdir($dir, 0777, true);
            }
        }
    }

    protected function cleanupTestDirectories(): void
    {
        $dirs = [
            $this->config['upload_dir'],
            $this->config['log_dir']
        ];

        foreach ($dirs as $dir) {
            if (file_exists($dir)) {
                $this->recursiveRemoveDirectory($dir);
            }
        }
    }

    protected function recursiveRemoveDirectory(string $dir): void
    {
        if (is_dir($dir)) {
            $objects = scandir($dir);
            foreach ($objects as $object) {
                if ($object != "." && $object != "..") {
                    if (is_dir($dir . "/" . $object)) {
                        $this->recursiveRemoveDirectory($dir . "/" . $object);
                    } else {
                        unlink($dir . "/" . $object);
                    }
                }
            }
            rmdir($dir);
        }
    }
}
