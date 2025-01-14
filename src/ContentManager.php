<?php

namespace BeautyDirectory;

use PDO;
use PDOException;

class ContentManager {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Get all categories
     */
    public function getCategories(): array {
        $stmt = $this->db->query("SELECT * FROM categories ORDER BY name");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get all services in a category
     */
    public function getServicesByCategory(int $categoryId): array {
        $stmt = $this->db->prepare("SELECT * FROM services WHERE category_id = ? ORDER BY name");
        $stmt->execute([$categoryId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get all providers
     */
    public function getProviders(): array {
        $stmt = $this->db->query("SELECT * FROM providers ORDER BY name");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get provider details with their services
     */
    public function getProviderDetails(int $providerId): array {
        // Get provider info
        $stmt = $this->db->prepare("SELECT * FROM providers WHERE id = ?");
        $stmt->execute([$providerId]);
        $provider = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$provider) {
            return [];
        }

        // Get provider's services
        $stmt = $this->db->prepare("
            SELECT s.*, ps.price_override 
            FROM services s
            JOIN provider_services ps ON s.id = ps.service_id
            WHERE ps.provider_id = ?
        ");
        $stmt->execute([$providerId]);
        $provider['services'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get provider's portfolio
        $stmt = $this->db->prepare("SELECT * FROM portfolio_items WHERE provider_id = ?");
        $stmt->execute([$providerId]);
        $provider['portfolio'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get provider's reviews
        $stmt = $this->db->prepare("SELECT * FROM reviews WHERE provider_id = ? ORDER BY created_at DESC");
        $stmt->execute([$providerId]);
        $provider['reviews'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $provider;
    }

    /**
     * Add a new service
     */
    public function addService(array $serviceData): int {
        $stmt = $this->db->prepare("
            INSERT INTO services (category_id, name, slug, description, duration, price, image)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $serviceData['category_id'],
            $serviceData['name'],
            $serviceData['slug'],
            $serviceData['description'],
            $serviceData['duration'],
            $serviceData['price'],
            $serviceData['image'] ?? null
        ]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Add a new provider
     */
    public function addProvider(array $providerData): int {
        $stmt = $this->db->prepare("
            INSERT INTO providers (name, slug, email, phone, bio, profile_image, years_experience)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $providerData['name'],
            $providerData['slug'],
            $providerData['email'],
            $providerData['phone'],
            $providerData['bio'],
            $providerData['profile_image'] ?? null,
            $providerData['years_experience']
        ]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Add a review
     */
    public function addReview(array $reviewData): int {
        $stmt = $this->db->prepare("
            INSERT INTO reviews (provider_id, service_id, client_name, rating, review_text)
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $reviewData['provider_id'],
            $reviewData['service_id'],
            $reviewData['client_name'],
            $reviewData['rating'],
            $reviewData['review_text']
        ]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Search services and providers
     */
    public function search(string $query): array {
        $searchTerm = "%$query%";
        
        // Search services
        $stmt = $this->db->prepare("
            SELECT 'service' as type, id, name, description 
            FROM services 
            WHERE name LIKE ? OR description LIKE ?
        ");
        $stmt->execute([$searchTerm, $searchTerm]);
        $services = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Search providers
        $stmt = $this->db->prepare("
            SELECT 'provider' as type, id, name, bio as description 
            FROM providers 
            WHERE name LIKE ? OR bio LIKE ?
        ");
        $stmt->execute([$searchTerm, $searchTerm]);
        $providers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_merge($services, $providers);
    }
}
