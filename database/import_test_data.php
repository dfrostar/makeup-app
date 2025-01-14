<?php
require_once(dirname(__FILE__) . '/../wp-load.php');

// Get database connection
global $wpdb;

// Read and execute the SQL file
$sql_file = dirname(__FILE__) . '/test_data.sql';
$sql_content = file_get_contents($sql_file);

// Split SQL into individual queries
$queries = explode(';', $sql_content);

// Execute each query
$success = true;
$wpdb->show_errors();

try {
    // Start transaction
    $wpdb->query('START TRANSACTION');

    foreach ($queries as $query) {
        $query = trim($query);
        if (empty($query)) continue;

        $result = $wpdb->query($query);
        if ($result === false) {
            throw new Exception($wpdb->last_error);
        }
    }

    // Commit transaction
    $wpdb->query('COMMIT');
    echo "Test data imported successfully!\n";

} catch (Exception $e) {
    // Rollback transaction
    $wpdb->query('ROLLBACK');
    echo "Error importing test data: " . $e->getMessage() . "\n";
    $success = false;
}

// Create test WordPress users if they don't exist
$test_users = array(
    array(
        'user_login' => 'glamour_studio',
        'user_email' => 'glamour@example.com',
        'user_pass' => wp_generate_password(),
        'role' => 'beauty_professional'
    ),
    array(
        'user_login' => 'elite_spa',
        'user_email' => 'elite@example.com',
        'user_pass' => wp_generate_password(),
        'role' => 'beauty_professional'
    ),
    array(
        'user_login' => 'natural_glow',
        'user_email' => 'glow@example.com',
        'user_pass' => wp_generate_password(),
        'role' => 'beauty_professional'
    ),
    array(
        'user_login' => 'beauty_haven',
        'user_email' => 'haven@example.com',
        'user_pass' => wp_generate_password(),
        'role' => 'beauty_professional'
    ),
    array(
        'user_login' => 'radiant_beauty',
        'user_email' => 'radiant@example.com',
        'user_pass' => wp_generate_password(),
        'role' => 'beauty_professional'
    )
);

foreach ($test_users as $user_data) {
    if (!username_exists($user_data['user_login']) && !email_exists($user_data['user_email'])) {
        $user_id = wp_insert_user($user_data);
        if (is_wp_error($user_id)) {
            echo "Error creating user {$user_data['user_login']}: " . $user_id->get_error_message() . "\n";
        } else {
            echo "Created user {$user_data['user_login']} with ID: $user_id\n";
        }
    }
}

// Create test customer users
$test_customers = array(
    array(
        'user_login' => 'customer1',
        'user_email' => 'customer1@example.com',
        'user_pass' => wp_generate_password(),
        'role' => 'customer'
    ),
    array(
        'user_login' => 'customer2',
        'user_email' => 'customer2@example.com',
        'user_pass' => wp_generate_password(),
        'role' => 'customer'
    ),
    array(
        'user_login' => 'customer3',
        'user_email' => 'customer3@example.com',
        'user_pass' => wp_generate_password(),
        'role' => 'customer'
    ),
    array(
        'user_login' => 'customer4',
        'user_email' => 'customer4@example.com',
        'user_pass' => wp_generate_password(),
        'role' => 'customer'
    ),
    array(
        'user_login' => 'customer5',
        'user_email' => 'customer5@example.com',
        'user_pass' => wp_generate_password(),
        'role' => 'customer'
    )
);

foreach ($test_customers as $user_data) {
    if (!username_exists($user_data['user_login']) && !email_exists($user_data['user_email'])) {
        $user_id = wp_insert_user($user_data);
        if (is_wp_error($user_id)) {
            echo "Error creating customer {$user_data['user_login']}: " . $user_id->get_error_message() . "\n";
        } else {
            echo "Created customer {$user_data['user_login']} with ID: $user_id\n";
        }
    }
}

if ($success) {
    echo "\nTest data import completed successfully!\n";
    echo "You can now log in with any of the following test accounts:\n";
    echo "Professionals:\n";
    foreach ($test_users as $user) {
        echo "- {$user['user_login']} ({$user['user_email']})\n";
    }
    echo "\nCustomers:\n";
    foreach ($test_customers as $user) {
        echo "- {$user['user_login']} ({$user['user_email']})\n";
    }
    echo "\nNote: Passwords have been randomly generated. Use the WordPress password reset function to set new passwords.\n";
} else {
    echo "\nTest data import failed. Please check the error messages above.\n";
}
