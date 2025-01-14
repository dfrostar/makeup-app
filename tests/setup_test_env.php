<?php

// Load configuration
$config = require __DIR__ . '/config/test_config.php';

// First connect to PostgreSQL main database
try {
    // Connect to default postgres database first
    $pdo = new PDO(
        "pgsql:host={$config['database']['host']};port={$config['database']['port']};dbname=postgres",
        $config['database']['user'],
        $config['database']['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    echo "✓ Connected to PostgreSQL\n";

    // Create test database if it doesn't exist
    $dbname = $config['database']['name'];
    $pdo->exec("DROP DATABASE IF EXISTS $dbname");
    $pdo->exec("CREATE DATABASE $dbname");
    echo "✓ Created database: $dbname\n";

    // Connect to the new database
    $pdo = new PDO(
        "pgsql:host={$config['database']['host']};port={$config['database']['port']};dbname={$dbname}",
        $config['database']['user'],
        $config['database']['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Create schema
    $schema = $config['database']['schema'];
    $pdo->exec("CREATE SCHEMA IF NOT EXISTS $schema");
    $pdo->exec("SET search_path TO $schema");
    echo "✓ Created schema: $schema\n";

    // Import schema
    $schema_sql = file_get_contents(__DIR__ . '/../database/init.sql');
    $pdo->exec($schema_sql);
    echo "✓ Imported database schema\n";

} catch (PDOException $e) {
    die("Database setup failed: " . $e->getMessage() . "\n");
}

// Create test directories
$directories = [
    $config['upload_dir'],
    $config['log_dir']
];

foreach ($directories as $dir) {
    if (!file_exists($dir)) {
        if (mkdir($dir, 0777, true)) {
            echo "✓ Created directory: $dir\n";
        } else {
            echo "✗ Failed to create directory: $dir\n";
        }
    } else {
        echo "✓ Directory exists: $dir\n";
    }
}
