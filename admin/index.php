<?php
require_once __DIR__ . '/../vendor/autoload.php';

use BeautyDirectory\ContentManager;

session_start();

// TODO: Add proper authentication
if (!isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit;
}

try {
    $db = new PDO(
        "mysql:host=localhost;dbname=beauty_directory;charset=utf8mb4",
        "root",
        "",
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $contentManager = new ContentManager($db);
    
    // Get data for display
    $categories = $contentManager->getCategories();
    $providers = $contentManager->getProviders();
    
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beauty Directory Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800">Beauty Directory Admin</h1>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Categories Section -->
            <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4">Categories</h2>
                <div class="space-y-4">
                    <?php foreach ($categories as $category): ?>
                    <div class="flex justify-between items-center border-b pb-2">
                        <span><?= htmlspecialchars($category['name']) ?></span>
                        <a href="edit_category.php?id=<?= $category['id'] ?>" 
                           class="text-blue-500 hover:text-blue-700">Edit</a>
                    </div>
                    <?php endforeach; ?>
                </div>
                <a href="add_category.php" 
                   class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add Category
                </a>
            </div>

            <!-- Providers Section -->
            <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-semibold mb-4">Service Providers</h2>
                <div class="space-y-4">
                    <?php foreach ($providers as $provider): ?>
                    <div class="flex justify-between items-center border-b pb-2">
                        <span><?= htmlspecialchars($provider['name']) ?></span>
                        <a href="edit_provider.php?id=<?= $provider['id'] ?>" 
                           class="text-blue-500 hover:text-blue-700">Edit</a>
                    </div>
                    <?php endforeach; ?>
                </div>
                <a href="add_provider.php" 
                   class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Add Provider
                </a>
            </div>
        </div>

        <!-- Services Section -->
        <div class="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-semibold mb-4">Services</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Duration
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <?php foreach ($categories as $category):
                            $services = $contentManager->getServicesByCategory($category['id']);
                            foreach ($services as $service):
                        ?>
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <?= htmlspecialchars($service['name']) ?>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <?= htmlspecialchars($category['name']) ?>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <?= $service['duration'] ?> min
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                $<?= number_format($service['price'], 2) ?>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <a href="edit_service.php?id=<?= $service['id'] ?>" 
                                   class="text-blue-500 hover:text-blue-700">Edit</a>
                            </td>
                        </tr>
                        <?php 
                            endforeach;
                        endforeach; 
                        ?>
                    </tbody>
                </table>
            </div>
            <a href="add_service.php" 
               class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Add Service
            </a>
        </div>
    </div>

    <script>
        // Add any JavaScript functionality here
    </script>
</body>
</html>
