<?php
header('Access-Control-Allow-Origin: http://localhost:3001');
header('Content-Type: application/json');

require_once __DIR__ . '/../../../tests/config/test_config.php';

try {
    $dsn = "pgsql:host={$config['database']['host']};port={$config['database']['port']};dbname={$config['database']['name']}";
    $pdo = new PDO(
        $dsn,
        $config['database']['user'],
        $config['database']['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Set the search path
    $pdo->exec("SET search_path TO {$config['database']['schema']}, public");
    
    // Get trending products with their details
    $query = "
        SELECT 
            p.id,
            p.name,
            p.brand,
            p.price,
            p.image_url,
            p.badge,
            p.category,
            COALESCE(AVG(r.rating), 0) as rating,
            COUNT(r.id) as review_count
        FROM products p
        LEFT JOIN product_reviews r ON p.id = r.product_id
        WHERE p.is_trending = true
        GROUP BY p.id, p.name, p.brand, p.price, p.image_url, p.badge, p.category
        ORDER BY p.created_at DESC
        LIMIT 10
    ";
    
    $products = $pdo->query($query)->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($products);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
