<?php

return [
    'database' => [
        'type' => 'pgsql',
        'host' => 'localhost',
        'port' => '5432',
        'name' => 'beauty_directory_test',
        'user' => 'postgres',
        'password' => 'dynamic69',
        'schema' => 'beauty'
    ],
    'admin' => [
        'username' => 'test_admin',
        'password' => 'test_password'
    ],
    'upload_dir' => __DIR__ . '/../../uploads/test',
    'log_dir' => __DIR__ . '/../../logs/test'
];
