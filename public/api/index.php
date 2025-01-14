<?php

require_once __DIR__ . '/../../config/env.php';

// CORS Headers
function setCorsHeaders() {
    $config = require __DIR__ . '/../../config/env.php';
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $config['cors']['allowed_origins'])) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Methods: ' . implode(', ', $config['cors']['allowed_methods']));
        header('Access-Control-Allow-Headers: ' . implode(', ', $config['cors']['allowed_headers']));
    }
}

// Error Handler
function handleError($errno, $errstr, $errfile, $errline) {
    $config = require __DIR__ . '/../../config/env.php';
    
    if ($config['debug']) {
        $error = [
            'message' => $errstr,
            'file' => $errfile,
            'line' => $errline
        ];
    } else {
        $error = ['message' => 'Internal Server Error'];
    }
    
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => $error]);
    exit;
}

set_error_handler('handleError');
setCorsHeaders();

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// API Documentation
$routes = [
    'GET /api/professionals' => 'List all professionals',
    'GET /api/professionals/{id}' => 'Get professional details',
    'GET /api/services' => 'List all services',
    'GET /api/reviews' => 'List all reviews',
    'POST /api/bookings' => 'Create a new booking'
];

// Return API documentation for root endpoint
if ($_SERVER['REQUEST_URI'] === '/api') {
    header('Content-Type: application/json');
    echo json_encode([
        'name' => 'Beauty Directory API',
        'version' => '1.0',
        'endpoints' => $routes
    ]);
    exit;
}
