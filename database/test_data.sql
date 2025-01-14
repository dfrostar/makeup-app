-- Test data for Beauty Directory Platform

-- Insert test professionals
INSERT INTO professionals (wp_user_id, business_name, email, phone, address, verification_status, created_at, updated_at)
VALUES 
(1, 'Glamour Studio', 'glamour@example.com', '555-0101', '123 Beauty Lane, City', 'verified', NOW(), NOW()),
(2, 'Elite Beauty Spa', 'elite@example.com', '555-0102', '456 Spa Street, City', 'pending', NOW(), NOW()),
(3, 'Natural Glow', 'glow@example.com', '555-0103', '789 Wellness Ave, City', 'verified', NOW(), NOW()),
(4, 'Beauty Haven', 'haven@example.com', '555-0104', '321 Style Blvd, City', 'suspended', NOW(), NOW()),
(5, 'Radiant Beauty', 'radiant@example.com', '555-0105', '654 Glow Road, City', 'verified', NOW(), NOW());

-- Insert test services
INSERT INTO services (professional_id, name, description, duration, price, created_at, updated_at)
VALUES 
(1, 'Full Makeup', 'Complete makeup service for any occasion', 60, 75.00, NOW(), NOW()),
(1, 'Hair Styling', 'Professional hair styling service', 45, 55.00, NOW(), NOW()),
(2, 'Facial Treatment', 'Rejuvenating facial with premium products', 90, 120.00, NOW(), NOW()),
(2, 'Manicure', 'Professional nail care service', 30, 35.00, NOW(), NOW()),
(3, 'Natural Massage', 'Relaxing full body massage', 60, 85.00, NOW(), NOW()),
(3, 'Organic Facial', 'Facial using organic products', 60, 95.00, NOW(), NOW()),
(4, 'Hair Coloring', 'Professional hair coloring service', 120, 150.00, NOW(), NOW()),
(5, 'Bridal Makeup', 'Complete bridal makeup package', 120, 200.00, NOW(), NOW()),
(5, 'Pedicure', 'Luxury pedicure treatment', 45, 45.00, NOW(), NOW());

-- Insert test bookings
INSERT INTO bookings (professional_id, service_id, customer_id, booking_date, start_time, end_time, status, total_price, created_at, updated_at)
VALUES 
(1, 1, 10, CURRENT_DATE, '10:00:00', '11:00:00', 'completed', 75.00, NOW(), NOW()),
(1, 2, 11, CURRENT_DATE + INTERVAL '1 day', '14:00:00', '15:00:00', 'confirmed', 55.00, NOW(), NOW()),
(2, 3, 12, CURRENT_DATE + INTERVAL '2 days', '11:00:00', '12:30:00', 'pending', 120.00, NOW(), NOW()),
(3, 5, 13, CURRENT_DATE - INTERVAL '1 day', '15:00:00', '16:00:00', 'completed', 85.00, NOW(), NOW()),
(5, 8, 14, CURRENT_DATE + INTERVAL '5 days', '09:00:00', '11:00:00', 'confirmed', 200.00, NOW(), NOW());

-- Insert test reviews
INSERT INTO reviews (professional_id, customer_id, booking_id, rating, comment, created_at, updated_at)
VALUES 
(1, 10, 1, 5, 'Excellent service! Very professional and skilled.', NOW(), NOW()),
(1, 11, 2, 4, 'Great experience, will come back again.', NOW(), NOW()),
(3, 13, 4, 5, 'Amazing massage, very relaxing!', NOW(), NOW()),
(5, 14, 5, 5, 'Perfect bridal makeup, exactly what I wanted!', NOW(), NOW());

-- Insert test portfolio items
INSERT INTO portfolio_items (professional_id, title, description, image_url, created_at, updated_at)
VALUES 
(1, 'Wedding Makeup', 'Bridal makeup for summer wedding', 'portfolio/wedding-makeup-1.jpg', NOW(), NOW()),
(1, 'Evening Glam', 'Glamorous evening makeup look', 'portfolio/evening-glam-1.jpg', NOW(), NOW()),
(2, 'Spa Treatment', 'Luxury spa facial treatment', 'portfolio/spa-1.jpg', NOW(), NOW()),
(3, 'Natural Look', 'Natural everyday makeup', 'portfolio/natural-1.jpg', NOW(), NOW()),
(5, 'Bridal Collection', 'Collection of bridal looks', 'portfolio/bridal-1.jpg', NOW(), NOW());

-- Insert test availability
INSERT INTO availability (professional_id, day_of_week, start_time, end_time, created_at, updated_at)
VALUES 
(1, 1, '09:00:00', '17:00:00', NOW(), NOW()),
(1, 2, '09:00:00', '17:00:00', NOW(), NOW()),
(1, 3, '09:00:00', '17:00:00', NOW(), NOW()),
(1, 4, '09:00:00', '17:00:00', NOW(), NOW()),
(1, 5, '09:00:00', '17:00:00', NOW(), NOW()),
(2, 1, '10:00:00', '18:00:00', NOW(), NOW()),
(2, 2, '10:00:00', '18:00:00', NOW(), NOW()),
(2, 3, '10:00:00', '18:00:00', NOW(), NOW()),
(2, 4, '10:00:00', '18:00:00', NOW(), NOW()),
(2, 5, '10:00:00', '16:00:00', NOW(), NOW()),
(3, 1, '08:00:00', '16:00:00', NOW(), NOW()),
(3, 2, '08:00:00', '16:00:00', NOW(), NOW()),
(3, 3, '08:00:00', '16:00:00', NOW(), NOW()),
(3, 4, '08:00:00', '16:00:00', NOW(), NOW()),
(3, 5, '08:00:00', '14:00:00', NOW(), NOW()),
(5, 1, '09:00:00', '18:00:00', NOW(), NOW()),
(5, 2, '09:00:00', '18:00:00', NOW(), NOW()),
(5, 3, '09:00:00', '18:00:00', NOW(), NOW()),
(5, 4, '09:00:00', '18:00:00', NOW(), NOW()),
(5, 5, '09:00:00', '18:00:00', NOW(), NOW()),
(5, 6, '10:00:00', '15:00:00', NOW(), NOW());
