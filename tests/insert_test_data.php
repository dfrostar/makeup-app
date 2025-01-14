<?php

$config = require __DIR__ . '/config/test_config.php';

try {
    $dsn = "pgsql:host={$config['database']['host']};port={$config['database']['port']};dbname={$config['database']['name']}";
    $pdo = new PDO(
        $dsn,
        $config['database']['user'],
        $config['database']['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    echo "Connected to database successfully!\n\n";

    // Set the search path
    $pdo->exec("SET search_path TO {$config['database']['schema']}, public");
    
    // Insert Professional Profiles
    $professionals = [
        [1001, "Bella's Beauty Studio", "Expert makeup artist with 10+ years experience", "bella@beautymail.com", "555-0101", "123 Beauty Lane, Dallas, TX", 4.8],
        [1002, "Hair by Sarah", "Specialized in wedding and event styling", "sarah@beautymail.com", "555-0102", "456 Style Ave, Dallas, TX", 4.9],
        [1003, "Natural Glow Spa", "Holistic skincare and wellness treatments", "glow@beautymail.com", "555-0103", "789 Wellness Rd, Dallas, TX", 4.7]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO beauty.professional_profiles (wp_user_id, business_name, description, contact_email, phone, location, rating) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($professionals as $prof) {
        $stmt->execute($prof);
        echo "✓ Added professional: {$prof[1]}\n";
    }

    // Insert Service Categories
    $categories = [
        ["Makeup", "makeup", "Professional makeup services for all occasions"],
        ["Hair Styling", "hair-styling", "Expert hair styling and treatment services"],
        ["Skincare", "skincare", "Professional skincare treatments and consultations"]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO beauty.service_categories (name, slug, description) VALUES (?, ?, ?)");
    foreach ($categories as $cat) {
        $stmt->execute($cat);
        echo "✓ Added category: {$cat[0]}\n";
    }

    // Insert Services
    $services = [
        [1, "Bridal Makeup", "Complete bridal makeup with trial session", 120, 250.00],
        [1, "Special Event Makeup", "Makeup for special occasions", 60, 120.00],
        [2, "Wedding Hair Styling", "Complete bridal hair styling with trial", 90, 200.00],
        [2, "Hair Color and Style", "Full color treatment with styling", 120, 180.00],
        [3, "Facial Treatment", "Deep cleansing facial with massage", 60, 95.00],
        [3, "Skin Consultation", "Detailed skin analysis and treatment plan", 45, 75.00]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO beauty.services (professional_id, name, description, duration, price) VALUES (?, ?, ?, ?, ?)");
    foreach ($services as $service) {
        $stmt->execute($service);
        echo "✓ Added service: {$service[1]}\n";
    }

    // Insert Working Hours (Monday-Saturday, 9 AM - 6 PM)
    $workingHours = [];
    for ($profId = 1; $profId <= 3; $profId++) {
        for ($day = 0; $day < 6; $day++) { // Monday (0) to Saturday (5)
            $workingHours[] = [$profId, $day, '09:00', '18:00'];
        }
    }
    
    $stmt = $pdo->prepare("INSERT INTO beauty.working_hours (professional_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)");
    foreach ($workingHours as $hours) {
        $stmt->execute($hours);
    }
    echo "✓ Added working hours for all professionals\n";

    // Insert Bookings (some recent bookings)
    $bookings = [
        [1, 2001, 1, '2024-12-20', '10:00', '12:00', 'confirmed', 'Bride + 2 bridesmaids'],
        [2, 2002, 3, '2024-12-21', '14:00', '15:30', 'confirmed', 'Wedding guest hair'],
        [3, 2003, 5, '2024-12-19', '11:00', '12:00', 'completed', 'First time client']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO beauty.bookings (professional_id, customer_id, service_id, booking_date, start_time, end_time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($bookings as $booking) {
        $stmt->execute($booking);
        echo "✓ Added booking for customer ID: {$booking[1]}\n";
    }

    // Insert Reviews
    $reviews = [
        [1, 2001, 1, 5, "Amazing bridal makeup, exactly what I wanted!"],
        [2, 2002, 2, 5, "Sarah is incredibly talented, my hair looked perfect"],
        [3, 2003, 3, 4, "Great facial treatment, very relaxing"]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO beauty.reviews (booking_id, customer_id, professional_id, rating, comment) VALUES (?, ?, ?, ?, ?)");
    foreach ($reviews as $review) {
        $stmt->execute($review);
        echo "✓ Added review for professional ID: {$review[2]}\n";
    }

    // Insert Portfolio Items
    $portfolioItems = [
        [1, "Bridal Glamour", "Natural bridal makeup with a touch of glamour", "portfolio/bridal1.jpg"],
        [2, "Wedding Updo", "Elegant updo with floral accessories", "portfolio/hair1.jpg"],
        [3, "Glowing Skin", "Results after a series of facial treatments", "portfolio/skin1.jpg"]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO beauty.portfolio_items (professional_id, title, description, image_url) VALUES (?, ?, ?, ?)");
    foreach ($portfolioItems as $item) {
        $stmt->execute($item);
        echo "✓ Added portfolio item: {$item[1]}\n";
    }

    // Insert Certifications
    $certifications = [
        [1, "Professional Makeup Artistry", "Beauty Academy International", "2020-01-15", "2025-01-15", "certs/makeup_cert.pdf"],
        [2, "Advanced Hair Styling", "Hair Design Institute", "2019-06-20", "2024-06-20", "certs/hair_cert.pdf"],
        [3, "Licensed Esthetician", "State Board of Cosmetology", "2018-03-10", "2023-03-10", "certs/esth_cert.pdf"]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO beauty.certifications (professional_id, name, issuing_organization, issue_date, expiry_date, certificate_url) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($certifications as $cert) {
        $stmt->execute($cert);
        echo "✓ Added certification: {$cert[1]}\n";
    }

    // Insert Notifications
    $notifications = [
        [1001, "booking_confirmed", "Your appointment for Bridal Makeup has been confirmed"],
        [1002, "review_received", "You received a new 5-star review"],
        [2001, "booking_reminder", "Reminder: Your appointment is tomorrow at 10:00 AM"]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO beauty.notifications (user_id, type, message) VALUES (?, ?, ?)");
    foreach ($notifications as $notif) {
        $stmt->execute($notif);
        echo "✓ Added notification for user: {$notif[0]}\n";
    }

    echo "\nAll test data inserted successfully!\n";

    // Now let's run some test queries
    echo "\nRunning test queries:\n";

    // 1. Top rated professionals
    echo "\n1. Top Rated Professionals:\n";
    $result = $pdo->query("SELECT business_name, rating, location FROM beauty.professional_profiles ORDER BY rating DESC");
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo "{$row['business_name']} - {$row['rating']} stars - {$row['location']}\n";
    }

    // 2. Upcoming bookings with service details
    echo "\n2. Upcoming Bookings:\n";
    $result = $pdo->query("
        SELECT 
            p.business_name,
            s.name as service_name,
            b.booking_date,
            b.start_time,
            b.status
        FROM beauty.bookings b
        JOIN beauty.professional_profiles p ON b.professional_id = p.id
        JOIN beauty.services s ON b.service_id = s.id
        WHERE b.booking_date >= CURRENT_DATE
        ORDER BY b.booking_date, b.start_time
    ");
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo "{$row['booking_date']} {$row['start_time']} - {$row['business_name']} - {$row['service_name']} ({$row['status']})\n";
    }

    // 3. Services by price range
    echo "\n3. Services by Price Range:\n";
    $result = $pdo->query("
        SELECT 
            s.name,
            s.price,
            p.business_name
        FROM beauty.services s
        JOIN beauty.professional_profiles p ON s.professional_id = p.id
        ORDER BY s.price DESC
    ");
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo "\${$row['price']} - {$row['name']} by {$row['business_name']}\n";
    }

    // 4. Professional availability for next week
    echo "\n4. Professional Working Hours:\n";
    $result = $pdo->query("
        SELECT 
            p.business_name,
            w.day_of_week,
            w.start_time,
            w.end_time
        FROM beauty.working_hours w
        JOIN beauty.professional_profiles p ON w.professional_id = p.id
        ORDER BY p.business_name, w.day_of_week
    ");
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        echo "{$row['business_name']} - {$days[$row['day_of_week']]}: {$row['start_time']} - {$row['end_time']}\n";
    }

    // 5. Recent reviews with ratings
    echo "\n5. Recent Reviews:\n";
    $result = $pdo->query("
        SELECT 
            p.business_name,
            r.rating,
            r.comment
        FROM beauty.reviews r
        JOIN beauty.professional_profiles p ON r.professional_id = p.id
        ORDER BY r.created_at DESC
    ");
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo "{$row['business_name']} - {$row['rating']} stars - \"{$row['comment']}\"\n";
    }

} catch (PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}
