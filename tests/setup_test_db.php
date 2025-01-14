<?php

$config = require_once __DIR__ . '/config/test_config.php';

try {
    // Connect to PostgreSQL server
    $pdo = new PDO(
        "pgsql:host={$config['database']['host']};port={$config['database']['port']};dbname=postgres",
        $config['database']['user'],
        $config['database']['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Create test database if it doesn't exist
    $dbname = $config['database']['name'];
    $pdo->exec("DROP DATABASE IF EXISTS $dbname");
    $pdo->exec("CREATE DATABASE $dbname");
    
    echo "Test database created successfully.\n";

    // Connect to the new test database
    $pdo = new PDO(
        "pgsql:host={$config['database']['host']};port={$config['database']['port']};dbname={$dbname}",
        $config['database']['user'],
        $config['database']['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Read and execute the schema SQL
    $schema_sql = file_get_contents(__DIR__ . '/../database/makeup_schema.sql');
    $pdo->exec($schema_sql);
    
    echo "Schema and sample data imported successfully.\n";
    echo "Test database setup complete!\n";

} catch (PDOException $e) {
    die("Database Error: " . $e->getMessage() . "\n");
}
