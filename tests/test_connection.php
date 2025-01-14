<?php

echo "Testing PostgreSQL Connection...\n";

try {
    $pdo = new PDO(
        "pgsql:host=localhost;port=5432;dbname=postgres",
        "postgres",
        "dynamic69"
    );
    echo "Success: Connected to PostgreSQL!\n";
    
    // Get PostgreSQL version
    $result = $pdo->query("SELECT version()");
    echo "PostgreSQL Version: " . $result->fetch()[0] . "\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
