-- Create makeup schema
CREATE SCHEMA IF NOT EXISTS beauty;

-- Set search path
SET search_path TO beauty, public;

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Category items table
CREATE TABLE category_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    badge VARCHAR(50),
    category VARCHAR(50),
    is_trending BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product reviews table
CREATE TABLE product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    author VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, image_url) VALUES
('Face', 'https://images.unsplash.com/photo-1596704017234-0e70f8d4be56'),
('Eyes', 'https://images.unsplash.com/photo-1583241475880-083f84372725'),
('Lips', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa'),
('Tools', 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388');

-- Insert category items
INSERT INTO category_items (category_id, name) VALUES
(1, 'Foundation'),
(1, 'Concealer'),
(1, 'Blush'),
(1, 'Bronzer'),
(2, 'Eyeshadow'),
(2, 'Eyeliner'),
(2, 'Mascara'),
(2, 'Brows'),
(3, 'Lipstick'),
(3, 'Lip Gloss'),
(3, 'Lip Liner'),
(3, 'Lip Care'),
(4, 'Brushes'),
(4, 'Sponges'),
(4, 'Applicators'),
(4, 'Mirrors');

-- Insert sample products
INSERT INTO products (name, brand, price, image_url, badge, category, is_trending) VALUES
('Luminous Foundation', 'Fenty Beauty', 34.99, 'https://images.unsplash.com/photo-1631730359585-38a4935cbec4', 'Clean Beauty', 'clean innovative', true),
('Nude Eyeshadow Palette', 'Huda Beauty', 65.00, 'https://images.unsplash.com/photo-1599305090598-fe179d501227', '50 Shades', 'inclusive', true),
('Matte Lipstick Collection', 'MAC Cosmetics', 19.99, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa', 'Vegan', 'clean', true),
('Serum Foundation', 'The Ordinary', 29.99, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796', 'New Formula', 'innovative', true);

-- Insert sample reviews
INSERT INTO product_reviews (product_id, rating, comment, author) VALUES
(1, 5, 'Amazing coverage and feels lightweight!', 'Sarah'),
(1, 4, 'Great for my sensitive skin', 'Emma'),
(2, 5, 'Perfect everyday palette', 'Jessica'),
(2, 4, 'Beautiful colors, slight fallout', 'Michelle'),
(3, 5, 'Long-lasting and comfortable', 'Ashley'),
(4, 4, 'Great value for money', 'Rachel');
