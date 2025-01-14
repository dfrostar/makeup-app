<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');

require_once __DIR__ . '/../../tests/config/test_config.php';

try {
    $pdo = new PDO(
        "pgsql:host={$config['database']['host']};port={$config['database']['port']};dbname={$config['database']['name']}",
        $config['database']['user'],
        $config['database']['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Set the search path
    $pdo->exec("SET search_path TO {$config['database']['schema']}, public");
    
    // Get professionals with their services and reviews
    $query = "
        SELECT 
            p.*,
            json_agg(DISTINCT jsonb_build_object(
                'name', s.name,
                'description', s.description,
                'price', s.price
            )) as services,
            json_agg(DISTINCT jsonb_build_object(
                'rating', r.rating,
                'comment', r.comment,
                'author', 'Anonymous'
            )) as reviews
        FROM professionals p
        LEFT JOIN professional_services ps ON p.id = ps.professional_id
        LEFT JOIN services s ON ps.service_id = s.id
        LEFT JOIN reviews r ON p.id = r.professional_id
        GROUP BY p.id
    ";
    
    $professionals = $pdo->query($query)->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data
    foreach ($professionals as &$professional) {
        $professional['services'] = json_decode($professional['services']);
        $professional['reviews'] = json_decode($professional['reviews']);
    }
    
    echo json_encode($professionals);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
