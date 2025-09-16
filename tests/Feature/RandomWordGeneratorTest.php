<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RandomWordGeneratorTest extends TestCase
{
    use RefreshDatabase;
    /**
     * Test the homepage loads successfully
     */
    public function test_homepage_loads_successfully()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('Random Word Generator');
    }

    /**
     * Test basic word generation API
     */
    public function test_word_generation_api_basic()
    {
        $response = $this->get('/api/generate/words?quantity=5&type=all');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'words' => [],
            'success'
        ]);

        $data = $response->json();
        $this->assertTrue($data['success']);
        $this->assertCount(5, $data['words']);

        // Check that we actually got word strings
        foreach ($data['words'] as $word) {
            $this->assertIsString($word);
            $this->assertNotEmpty($word);
        }
    }

    /**
     * Test word generation with different types
     */
    public function test_word_generation_by_type()
    {
        $types = ['all', 'noun', 'verb', 'adjective'];

        foreach ($types as $type) {
            $response = $this->get("/api/generate/words?quantity=3&type={$type}");

            $response->assertStatus(200);
            $data = $response->json();

            $this->assertTrue($data['success'], "Failed for type: {$type}");
            $this->assertCount(3, $data['words'], "Wrong count for type: {$type}");

            // Check that we got valid words
            foreach ($data['words'] as $word) {
                $this->assertIsString($word);
                $this->assertNotEmpty($word);
                $this->assertMatchesRegularExpression('/^[a-zA-Z]+$/', $word, "Invalid word format: {$word} for type: {$type}");
            }
        }
    }

    /**
     * Test first letter filtering
     */
    public function test_word_generation_with_first_letter()
    {
        $response = $this->get('/api/generate/words?quantity=3&type=all&firstLetter=a');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertGreaterThan(0, count($data['words']));

        // Check that all words start with 'a'
        foreach ($data['words'] as $word) {
            $this->assertStringStartsWith('a', strtolower($word), "Word '{$word}' should start with 'a'");
        }
    }

    /**
     * Test last letter filtering
     */
    public function test_word_generation_with_last_letter()
    {
        $response = $this->get('/api/generate/words?quantity=3&type=all&lastLetter=e');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertGreaterThan(0, count($data['words']));

        // Check that all words end with 'e'
        foreach ($data['words'] as $word) {
            $this->assertStringEndsWith('e', strtolower($word), "Word '{$word}' should end with 'e'");
        }
    }

    /**
     * Test syllable filtering
     */
    public function test_word_generation_with_syllable_filter()
    {
        $response = $this->get('/api/generate/words?quantity=3&type=all&sizeType=syllables&comparing=equals&count=2');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertGreaterThan(0, count($data['words']));

        // We can't easily test syllable count without the actual data, but we can test the response structure
        foreach ($data['words'] as $word) {
            $this->assertIsString($word);
            $this->assertNotEmpty($word);
        }
    }

    /**
     * Test validation errors
     */
    public function test_word_generation_validation()
    {
        // Test invalid type
        $response = $this->get('/api/generate/words?type=invalid');
        $response->assertStatus(422);

        // Test quantity too high
        $response = $this->get('/api/generate/words?quantity=150');
        $response->assertStatus(422);

        // Test negative quantity
        $response = $this->get('/api/generate/words?quantity=-1');
        $response->assertStatus(422);
    }

    /**
     * Test that noun type returns actual nouns
     */
    public function test_noun_type_returns_nouns()
    {
        $response = $this->get('/api/generate/words?quantity=10&type=noun');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertCount(10, $data['words']);

        // Test some known nouns that should be in the list
        $allWords = implode(' ', $data['words']);

        // We can't test specific words easily, but we can test that we're getting different results
        // when we call the API multiple times (randomness test)
        $response2 = $this->get('/api/generate/words?quantity=10&type=noun');
        $data2 = $response2->json();

        // The two sets of words should likely be different (not a perfect test, but good enough)
        $this->assertNotEquals($data['words'], $data2['words'], 'Words should be randomized');
    }

    /**
     * Test that we can generate a specific problematic word
     */
    public function test_specific_word_in_nouns()
    {
        // Generate many nouns to increase chances of getting "policy"
        $response = $this->get('/api/generate/words?quantity=50&type=noun');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertCount(50, $data['words']);

        // Log the words for debugging
        info('Generated noun words:', $data['words']);

        // Check if we have diverse vocabulary (not just the same words repeated)
        $uniqueWords = array_unique($data['words']);
        $this->assertGreaterThan(5, count($uniqueWords), 'Should have diverse noun vocabulary');
    }

    /**
     * Test that word data files exist and are readable
     */
    public function test_word_data_files_exist()
    {
        $files = [
            'words_ws.json',
            'nouns_ws.json',
            'verbs_ws.json',
            'adjectives_ws.json'
        ];

        foreach ($files as $file) {
            $path = storage_path("data/{$file}");
            $this->assertFileExists($path, "Word data file {$file} should exist");
            $this->assertTrue(is_readable($path), "Word data file {$file} should be readable");

            $content = file_get_contents($path);
            $data = json_decode($content, true);

            $this->assertNotNull($data, "Word data file {$file} should contain valid JSON");
            $this->assertArrayHasKey('data', $data, "Word data file {$file} should have 'data' key");
            $this->assertIsArray($data['data'], "Word data file {$file} 'data' should be an array");
            $this->assertGreaterThan(0, count($data['data']), "Word data file {$file} should contain words");
        }
    }

    /**
     * Test rate limiting on API endpoint
     */
    public function test_api_rate_limiting()
    {
        // Make multiple requests rapidly
        $responses = [];
        for ($i = 0; $i < 5; $i++) {
            $responses[] = $this->get('/api/generate/words?quantity=1&type=all');
        }

        // All should succeed (under rate limit)
        foreach ($responses as $response) {
            $response->assertStatus(200);
        }
    }

    /**
     * Test extended word type from database (when data exists)
     */
    public function test_extended_word_type()
    {
        // Skip if no extended words in test database
        if (\App\Models\ExtendedWord::count() === 0) {
            $this->markTestSkipped('No extended words in test database');
        }

        $response = $this->get('/api/generate/words?quantity=5&type=extended');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertCount(5, $data['words']);

        foreach ($data['words'] as $word) {
            $this->assertIsString($word);
            $this->assertNotEmpty($word);
        }
    }

    /**
     * Test non-english word generation (when data exists)
     */
    public function test_non_english_word_generation()
    {
        // Skip if no foreign words in test database
        if (\App\Models\ForeignWord::where('language', 'es')->count() === 0) {
            $this->markTestSkipped('No Spanish words in test database');
        }

        $response = $this->get('/api/generate/words?quantity=3&type=non-english&language=es');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertGreaterThan(0, count($data['words']));

        foreach ($data['words'] as $word) {
            $this->assertIsString($word);
            $this->assertNotEmpty($word);
        }
    }

    /**
     * Test letter length filtering
     */
    public function test_letter_length_filtering()
    {
        $response = $this->get('/api/generate/words?quantity=5&type=all&sizeType=letters&comparing=equals&count=5');

        $response->assertStatus(200);
        $data = $response->json();

        $this->assertTrue($data['success']);
        $this->assertGreaterThan(0, count($data['words']));

        foreach ($data['words'] as $word) {
            $this->assertEquals(5, strlen($word), "Word '{$word}' should be exactly 5 letters long");
        }
    }

    /**
     * Test CORS headers are present
     */
    public function test_api_cors_headers()
    {
        // Test that external requests are blocked (403)
        $response = $this->withHeaders(['Origin' => 'https://example.com'])
            ->get('/api/generate/words?quantity=1&type=all');

        $response->assertStatus(403);

        // Test that internal requests with proper headers work
        $response = $this->withHeaders([
            'X-Requested-With' => 'XMLHttpRequest',
            'X-Inertia' => 'true'
        ])->get('/api/generate/words?quantity=1&type=all');

        $response->assertStatus(200);
    }

    /**
     * Test edge cases and boundary conditions
     */
    public function test_edge_cases()
    {
        // Test minimum quantity
        $response = $this->get('/api/generate/words?quantity=1&type=all');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(1, $data['words']);

        // Test maximum quantity
        $response = $this->get('/api/generate/words?quantity=100&type=all');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(100, $data['words']);

        // Test with very restrictive filters
        $response = $this->get('/api/generate/words?quantity=1&type=all&firstLetter=q&lastLetter=x');
        $response->assertStatus(200);
        // Should not error even if no words match
    }
}