-- Content Management Tables

-- Categories for beauty services
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Service providers/professionals
CREATE TABLE IF NOT EXISTS providers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    bio TEXT,
    profile_image VARCHAR(255),
    years_experience INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Beauty services
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    duration INT NOT NULL, -- in minutes
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Provider services mapping
CREATE TABLE IF NOT EXISTS provider_services (
    provider_id INT NOT NULL,
    service_id INT NOT NULL,
    price_override DECIMAL(10,2), -- Optional custom price for specific provider
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (provider_id, service_id),
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Portfolio/Gallery items
CREATE TABLE IF NOT EXISTS portfolio_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    provider_id INT NOT NULL,
    service_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- Reviews and ratings
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    provider_id INT NOT NULL,
    service_id INT NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Sample data for categories
INSERT INTO categories (name, slug, description) VALUES
('Hair Services', 'hair-services', 'Professional hair styling, cutting, and coloring services'),
('Makeup', 'makeup', 'Professional makeup services for all occasions'),
('Nail Care', 'nail-care', 'Manicure, pedicure, and nail art services'),
('Skincare', 'skincare', 'Facial treatments and skincare services');

-- Sample data for providers
INSERT INTO providers (name, slug, email, phone, bio, years_experience) VALUES
('Sarah Johnson', 'sarah-johnson', 'sarah@example.com', '555-0101', 'Expert hair stylist with focus on modern cuts and colors', 8),
('Emily Chen', 'emily-chen', 'emily@example.com', '555-0102', 'Professional makeup artist specializing in wedding and event makeup', 5),
('Maria Garcia', 'maria-garcia', 'maria@example.com', '555-0103', 'Certified nail technician with expertise in nail art', 6);

-- Sample data for services
INSERT INTO services (category_id, name, slug, description, duration, price) VALUES
(1, 'Haircut & Style', 'haircut-and-style', 'Professional haircut and styling service', 60, 75.00),
(1, 'Hair Coloring', 'hair-coloring', 'Full hair coloring service', 120, 150.00),
(2, 'Bridal Makeup', 'bridal-makeup', 'Complete bridal makeup service', 90, 200.00),
(2, 'Evening Makeup', 'evening-makeup', 'Glamorous evening makeup look', 60, 100.00),
(3, 'Manicure', 'manicure', 'Classic manicure service', 45, 35.00),
(3, 'Pedicure', 'pedicure', 'Classic pedicure service', 60, 45.00);
