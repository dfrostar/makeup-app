<?php

$environments = [
    'development' => [
        'database' => [
            'host' => 'localhost',
            'port' => '5432',
            'name' => 'beauty_directory_test',
            'user' => 'postgres',
            'password' => 'dynamic69',
            'schema' => 'beauty'
        ],
        'cors' => [
            'allowed_origins' => ['http://localhost:3000'],
            'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            'allowed_headers' => ['Content-Type', 'Authorization']
        ],
        'debug' => true
    ],
    'production' => [
        'database' => [
            'host' => getenv('DB_HOST'),
            'port' => getenv('DB_PORT'),
            'name' => getenv('DB_NAME'),
            'user' => getenv('DB_USER'),
            'password' => getenv('DB_PASSWORD'),
            'schema' => getenv('DB_SCHEMA')
        ],
        'cors' => [
            'allowed_origins' => [getenv('FRONTEND_URL')],
            'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            'allowed_headers' => ['Content-Type', 'Authorization']
        ],
        'debug' => false
    ]
];

$environment = getenv('APP_ENV') ?: 'development';
return $environments[$environment];
