-- Revenue Streams Database Schema for Beauty Directory

-- Professional Profiles and Memberships
CREATE TABLE professional_memberships (
    id SERIAL PRIMARY KEY,
    plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('basic', 'premium', 'elite')),
    monthly_price DECIMAL(10,2) NOT NULL,
    features JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE professional_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    membership_id INT REFERENCES professional_memberships(id),
    business_name VARCHAR(255),
    specialties TEXT[],
    portfolio_images TEXT[],
    booking_enabled BOOLEAN DEFAULT false,
    featured_until TIMESTAMP,
    verification_status VARCHAR(50),
    rating DECIMAL(3,2),
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beauty Services and Bookings
CREATE TABLE beauty_services (
    id SERIAL PRIMARY KEY,
    professional_id INT REFERENCES professional_profiles(id),
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL, -- in minutes
    price DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 15.00,
    category VARCHAR(100),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_bookings (
    id SERIAL PRIMARY KEY,
    service_id INT REFERENCES beauty_services(id),
    customer_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Premium Content and Tutorials
CREATE TABLE premium_content (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES professional_profiles(id),
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    description TEXT,
    access_level VARCHAR(50) DEFAULT 'free',
    media_url TEXT,
    price DECIMAL(10,2),
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Advertising and Promotions
CREATE TABLE ad_spaces (
    id SERIAL PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    price_per_month DECIMAL(10,2) NOT NULL,
    dimensions VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ad_campaigns (
    id SERIAL PRIMARY KEY,
    advertiser_id INT NOT NULL,
    ad_space_id INT REFERENCES ad_spaces(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    media_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    total_cost DECIMAL(10,2) NOT NULL,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate Program
CREATE TABLE affiliate_programs (
    id SERIAL PRIMARY KEY,
    professional_id INT REFERENCES professional_profiles(id),
    commission_rate DECIMAL(5,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE affiliate_transactions (
    id SERIAL PRIMARY KEY,
    affiliate_id INT REFERENCES affiliate_programs(id),
    order_id INT NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events and Workshops
CREATE TABLE beauty_events (
    id SERIAL PRIMARY KEY,
    organizer_id INT REFERENCES professional_profiles(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration INT NOT NULL, -- in minutes
    location TEXT,
    max_participants INT,
    price DECIMAL(10,2),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics and Metrics
CREATE TABLE revenue_metrics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    revenue_stream VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_count INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_professional_profiles_user_id ON professional_profiles(user_id);
CREATE INDEX idx_service_bookings_date ON service_bookings(booking_date);
CREATE INDEX idx_premium_content_access ON premium_content(access_level);
CREATE INDEX idx_ad_campaigns_dates ON ad_campaigns(start_date, end_date);
CREATE INDEX idx_affiliate_transactions_status ON affiliate_transactions(status);
CREATE INDEX idx_beauty_events_date ON beauty_events(event_date);

-- Sample Data for Professional Memberships
INSERT INTO professional_memberships (plan_type, monthly_price, features) VALUES
('basic', 29.99, '{"profile": true, "portfolio_limit": 5, "contact_form": true, "analytics": "basic"}'),
('premium', 79.99, '{"profile": true, "portfolio_limit": -1, "booking_system": true, "featured_listing": true, "analytics": "advanced"}'),
('elite', 199.99, '{"profile": true, "portfolio_limit": -1, "booking_system": true, "featured_listing": true, "analytics": "premium", "api_access": true, "marketing_tools": true}');

-- Sample Data for Ad Spaces
INSERT INTO ad_spaces (location, price_per_month, dimensions, description) VALUES
('homepage_banner', 299.99, '728x90', 'Premium banner space on homepage'),
('sidebar', 199.99, '300x250', 'Sidebar advertisement space'),
('search_results', 249.99, '468x60', 'Featured placement in search results');
