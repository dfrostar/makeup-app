<?php

namespace BeautyDirectory\Tests\Unit;

use BeautyDirectory\ContentManager;
use BeautyDirectory\Tests\TestCase;

class ContentManagerTest extends TestCase
{
    private ContentManager $contentManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->contentManager = new ContentManager($this->db);
    }

    public function testGetCategories(): void
    {
        // Test getting all categories
        $categories = $this->contentManager->getCategories();
        $this->assertIsArray($categories);
        $this->assertGreaterThan(0, count($categories));
        $this->assertArrayHasKey('name', $categories[0]);
    }

    public function testGetServicesByCategory(): void
    {
        // Get a category ID from the database
        $stmt = $this->db->query("SELECT id FROM categories LIMIT 1");
        $categoryId = (int) $stmt->fetchColumn();

        // Test getting services for that category
        $services = $this->contentManager->getServicesByCategory($categoryId);
        $this->assertIsArray($services);
        foreach ($services as $service) {
            $this->assertEquals($categoryId, $service['category_id']);
        }
    }

    public function testAddService(): void
    {
        // Get a category ID
        $stmt = $this->db->query("SELECT id FROM categories LIMIT 1");
        $categoryId = (int) $stmt->fetchColumn();

        // Test data
        $serviceData = [
            'category_id' => $categoryId,
            'name' => 'Test Service',
            'slug' => 'test-service',
            'description' => 'Test service description',
            'duration' => 60,
            'price' => 99.99,
            'image' => 'test.jpg'
        ];

        // Add service
        $serviceId = $this->contentManager->addService($serviceData);
        $this->assertIsInt($serviceId);
        $this->assertGreaterThan(0, $serviceId);

        // Verify service was added
        $stmt = $this->db->prepare("SELECT * FROM services WHERE id = ?");
        $stmt->execute([$serviceId]);
        $service = $stmt->fetch();

        $this->assertEquals($serviceData['name'], $service['name']);
        $this->assertEquals($serviceData['price'], $service['price']);
    }

    public function testAddProvider(): void
    {
        $providerData = [
            'name' => 'Test Provider',
            'slug' => 'test-provider',
            'email' => 'test@example.com',
            'phone' => '555-0104',
            'bio' => 'Test provider bio',
            'profile_image' => 'profile.jpg',
            'years_experience' => 5
        ];

        // Add provider
        $providerId = $this->contentManager->addProvider($providerData);
        $this->assertIsInt($providerId);
        $this->assertGreaterThan(0, $providerId);

        // Verify provider was added
        $stmt = $this->db->prepare("SELECT * FROM providers WHERE id = ?");
        $stmt->execute([$providerId]);
        $provider = $stmt->fetch();

        $this->assertEquals($providerData['name'], $provider['name']);
        $this->assertEquals($providerData['email'], $provider['email']);
    }

    public function testSearch(): void
    {
        // Add test data
        $this->db->exec("
            INSERT INTO services (category_id, name, slug, description, duration, price)
            VALUES (1, 'Unique Test Service', 'unique-test-service', 'A unique description', 60, 99.99)
        ");

        // Search for the unique term
        $results = $this->contentManager->search('Unique Test');
        
        $this->assertIsArray($results);
        $this->assertGreaterThan(0, count($results));
        
        $found = false;
        foreach ($results as $result) {
            if ($result['name'] === 'Unique Test Service') {
                $found = true;
                break;
            }
        }
        
        $this->assertTrue($found, 'Search results should include the test service');
    }
}
