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
    
    // Get categories with their items
    $query = "
        SELECT 
            c.id,
            c.name,
            c.image_url,
            json_agg(i.name) as items
        FROM categories c
        LEFT JOIN category_items i ON c.id = i.category_id
        GROUP BY c.id, c.name, c.image_url
    ";
    
    $categories = $pdo->query($query)->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data
    foreach ($categories as &$category) {
        $category['items'] = json_decode($category['items']);
    }
    
    echo json_encode($categories);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
