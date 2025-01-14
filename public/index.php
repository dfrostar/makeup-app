<?php
$config = require_once __DIR__ . '/../tests/config/test_config.php';

try {
    $pdo = new PDO(
        "pgsql:host={$config['database']['host']};port={$config['database']['port']};dbname={$config['database']['name']}",
        $config['database']['user'],
        $config['database']['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Set the search path
    $pdo->exec("SET search_path TO {$config['database']['schema']}, public");
    
    // Get professionals with their services
    $professionals = $pdo->query("
        SELECT 
            p.*,
            json_agg(json_build_object(
                'name', s.name,
                'description', s.description,
                'duration', s.duration,
                'price', s.price
            )) as services
        FROM beauty.professional_profiles p
        LEFT JOIN beauty.services s ON s.professional_id = p.id
        GROUP BY p.id
        ORDER BY p.rating DESC
    ")->fetchAll(PDO::FETCH_ASSOC);
    
    // Get recent reviews
    $reviews = $pdo->query("
        SELECT 
            r.*,
            p.business_name
        FROM beauty.reviews r
        JOIN beauty.professional_profiles p ON r.professional_id = p.id
        ORDER BY r.created_at DESC
        LIMIT 6
    ")->fetchAll(PDO::FETCH_ASSOC);
    
} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beauty Directory - Find Your Perfect Beauty Professional</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="#">Beauty Directory</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#professionals">Professionals</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#services">Services</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#reviews">Reviews</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-primary text-white px-3" href="#book">Book Now</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero-section text-center py-5">
        <div class="container">
            <h1 class="display-4 mb-4">Find Your Perfect Beauty Professional</h1>
            <p class="lead mb-4">Connect with top-rated makeup artists, hair stylists, and skincare specialists</p>
            <div class="search-box mx-auto">
                <input type="text" class="form-control form-control-lg" placeholder="Search for services or professionals...">
            </div>
        </div>
    </header>

    <!-- Featured Professionals -->
    <section id="professionals" class="py-5">
        <div class="container">
            <h2 class="text-center mb-5">Featured Beauty Professionals</h2>
            <div class="row">
                <?php foreach ($professionals as $pro): ?>
                <div class="col-md-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title"><?= htmlspecialchars($pro['business_name']) ?></h5>
                            <div class="rating mb-2">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                    <i class="fas fa-star <?= $i <= $pro['rating'] ? 'text-warning' : 'text-muted' ?>"></i>
                                <?php endfor; ?>
                                <span class="ms-2"><?= number_format($pro['rating'], 1) ?></span>
                            </div>
                            <p class="card-text"><?= htmlspecialchars($pro['description']) ?></p>
                            <p class="mb-2"><i class="fas fa-map-marker-alt text-primary me-2"></i><?= htmlspecialchars($pro['location']) ?></p>
                            <p class="mb-2"><i class="fas fa-phone text-primary me-2"></i><?= htmlspecialchars($pro['phone']) ?></p>
                            
                            <h6 class="mt-4">Services:</h6>
                            <?php 
                            $services = json_decode($pro['services'], true);
                            foreach ($services as $service): 
                            ?>
                            <div class="service-item mb-2">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span><?= htmlspecialchars($service['name']) ?></span>
                                    <span class="badge bg-primary">$<?= number_format($service['price'], 2) ?></span>
                                </div>
                                <small class="text-muted"><?= $service['duration'] ?> mins</small>
                            </div>
                            <?php endforeach; ?>
                            
                            <a href="#" class="btn btn-primary mt-3">Book Appointment</a>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Reviews Section -->
    <section id="reviews" class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center mb-5">Recent Reviews</h2>
            <div class="row">
                <?php foreach ($reviews as $review): ?>
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <div class="rating mb-2">
                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                    <i class="fas fa-star <?= $i <= $review['rating'] ? 'text-warning' : 'text-muted' ?>"></i>
                                <?php endfor; ?>
                            </div>
                            <p class="card-text">"<?= htmlspecialchars($review['comment']) ?>"</p>
                            <p class="text-muted mb-0">For <?= htmlspecialchars($review['business_name']) ?></p>
                        </div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>Beauty Directory</h5>
                    <p>Connect with the best beauty professionals in your area.</p>
                </div>
                <div class="col-md-4">
                    <h5>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-light">Find Professionals</a></li>
                        <li><a href="#" class="text-light">Book Appointment</a></li>
                        <li><a href="#" class="text-light">Write a Review</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Contact Us</h5>
                    <p>Email: contact@beautydirectory.com<br>
                    Phone: (555) 123-4567</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
