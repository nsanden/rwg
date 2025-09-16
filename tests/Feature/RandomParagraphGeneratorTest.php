<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RandomParagraphGeneratorTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test the paragraph page loads successfully
     */
    public function test_paragraph_page_loads_successfully()
    {
        $response = $this->get('/paragraph.php');

        $response->assertStatus(200);
        // For Inertia apps, check that the correct component is rendered
        $response->assertInertia(fn ($page) => $page->component('Paragraph'));
    }

    /**
     * Test basic paragraph generation API
     */
    public function test_paragraph_generation_api_basic()
    {
        $response = $this->get('/api/generate/paragraphs?quantity=2');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'paragraphs' => [],
            'success'
        ]);

        $data = $response->json();
        $this->assertTrue($data['success']);
        $this->assertCount(2, $data['paragraphs']);

        // Check that we actually got paragraph strings
        foreach ($data['paragraphs'] as $paragraph) {
            $this->assertIsString($paragraph);
            $this->assertNotEmpty($paragraph);
            $this->assertGreaterThan(10, strlen($paragraph)); // Paragraphs should be more than 10 characters
        }
    }

    /**
     * Test paragraph generation with different quantities
     */
    public function test_paragraph_generation_quantities()
    {
        $quantities = [1, 5, 10, 50];

        foreach ($quantities as $quantity) {
            $response = $this->get("/api/generate/paragraphs?quantity={$quantity}");

            $response->assertStatus(200);
            $data = $response->json();

            $this->assertTrue($data['success'], "Failed for quantity: {$quantity}");
            $this->assertCount($quantity, $data['paragraphs'], "Wrong count for quantity: {$quantity}");

            // Check that we got valid paragraphs
            foreach ($data['paragraphs'] as $paragraph) {
                $this->assertIsString($paragraph);
                $this->assertNotEmpty($paragraph);
                $this->assertGreaterThan(10, strlen($paragraph));
            }
        }
    }

    /**
     * Test validation errors
     */
    public function test_paragraph_generation_validation()
    {
        // Test quantity too high
        $response = $this->get('/api/generate/paragraphs?quantity=51');
        $response->assertStatus(422);

        // Test negative quantity
        $response = $this->get('/api/generate/paragraphs?quantity=-1');
        $response->assertStatus(422);

        // Test zero quantity
        $response = $this->get('/api/generate/paragraphs?quantity=0');
        $response->assertStatus(422);
    }

    /**
     * Test that paragraphs are randomized
     */
    public function test_paragraph_randomization()
    {
        // Generate paragraphs multiple times to test randomness
        $response1 = $this->get('/api/generate/paragraphs?quantity=10');
        $response2 = $this->get('/api/generate/paragraphs?quantity=10');

        $data1 = $response1->json();
        $data2 = $response2->json();

        $this->assertTrue($data1['success']);
        $this->assertTrue($data2['success']);

        // The two sets of paragraphs should likely be different (not a perfect test, but good enough)
        $this->assertNotEquals($data1['paragraphs'], $data2['paragraphs'], 'Paragraphs should be randomized');
    }

    /**
     * Test that paragraph data file exists and is readable
     */
    public function test_paragraph_data_file_exists()
    {
        $file = 'paragraphs.json';
        $path = storage_path("data/{$file}");

        $this->assertFileExists($path, "Paragraph data file {$file} should exist");
        $this->assertTrue(is_readable($path), "Paragraph data file {$file} should be readable");

        $content = file_get_contents($path);
        $data = json_decode($content, true);

        $this->assertNotNull($data, "Paragraph data file {$file} should contain valid JSON");
        $this->assertArrayHasKey('data', $data, "Paragraph data file {$file} should have 'data' key");
        $this->assertIsArray($data['data'], "Paragraph data file {$file} 'data' should be an array");
        $this->assertGreaterThan(0, count($data['data']), "Paragraph data file {$file} should contain paragraphs");

        // Check the structure of the first paragraph
        $firstParagraph = $data['data'][0];
        $this->assertArrayHasKey('paragraph', $firstParagraph, "Each paragraph entry should have a 'paragraph' key");
        $this->assertIsString($firstParagraph['paragraph'], "Paragraph value should be a string");
        $this->assertNotEmpty($firstParagraph['paragraph'], "Paragraph value should not be empty");
    }

    /**
     * Test default quantity when none specified
     */
    public function test_default_quantity()
    {
        $response = $this->get('/api/generate/paragraphs');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertCount(1, $data['paragraphs']); // Default should be 1
    }

    /**
     * Test edge cases
     */
    public function test_edge_cases()
    {
        // Test minimum quantity
        $response = $this->get('/api/generate/paragraphs?quantity=1');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(1, $data['paragraphs']);

        // Test maximum quantity
        $response = $this->get('/api/generate/paragraphs?quantity=50');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(50, $data['paragraphs']);
    }
}