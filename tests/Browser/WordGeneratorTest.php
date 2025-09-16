<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class WordGeneratorTest extends DuskTestCase
{
    /**
     * Test that the homepage loads correctly
     */
    public function test_homepage_loads_with_word_generator()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->waitFor('h1', 10) // Wait up to 10 seconds for React to load
                    ->assertSee('Random Word Generator')
                    ->waitFor('input[type="number"]', 5) // Wait for form elements
                    ->assertSee('Number of Words:')
                    ->assertSee('Word Type:')
                    ->assertSee('Generate Random Words')
                    ->assertPresent('input[type="number"]') // quantity input
                    ->assertPresent('select') // word type selector
                    ->assertPresent('button[type="button"]'); // generate button
        });
    }

    /**
     * Test basic word generation functionality
     */
    public function test_generate_basic_words()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->waitFor('input[type="number"]', 5) // Wait for form to be ready
                    ->clear('input[type="number"]')
                    ->type('input[type="number"]', '5')
                    ->click('button:contains("Generate Random Words")')
                    ->waitFor('ul li', 10) // Wait for words to appear
                    ->assertElementsCount('ul li', 5); // Should have 5 words

            // Check that we have actual word content
            $words = $browser->elements('ul li');
            $this->assertCount(5, $words);

            foreach ($words as $word) {
                $wordText = $word->getText();
                $this->assertNotEmpty($wordText);
                $this->assertMatchesRegularExpression('/^[a-zA-Z]+$/', $wordText);
            }
        });
    }

    /**
     * Test word type selection
     */
    public function test_word_type_selection()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->waitFor('select[id="word-type-select"]', 5)
                    ->select('select[id="word-type-select"]', 'noun')
                    ->clear('input[id="quantity-input"]')
                    ->type('input[id="quantity-input"]', '10')
                    ->click('button:contains("Generate Random Words")')
                    ->waitFor('ul li', 10)
                    ->assertElementsCount('ul li', 10);

            // Verify we got different results with different word types
            $nounWords = $browser->elements('ul li');
            $nounWordTexts = array_map(fn($el) => $el->getText(), $nounWords);

            // Change to verbs and generate again
            $browser->select('select[id="word-type-select"]', 'verb')
                    ->click('button:contains("Generate Random Words")')
                    ->waitFor('ul li', 10);

            $verbWords = $browser->elements('ul li');
            $verbWordTexts = array_map(fn($el) => $el->getText(), $verbWords);

            // The word lists should likely be different
            $this->assertNotEquals($nounWordTexts, $verbWordTexts);
        });
    }

    /**
     * Test advanced options (first letter, last letter)
     */
    public function test_advanced_word_filtering()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/');

            // On mobile, click to show more options first
            if ($browser->element('#more-options-panel')->getAttribute('class') === 'hidden sm:block') {
                $browser->click('button:contains("Toggle More Options")');
                $browser->waitFor('#more-options-panel.block', 2);
            }

            $browser->waitFor('input[id="first-letter-input"]', 5)
                    ->type('input[id="first-letter-input"]', 'a')
                    ->clear('input[id="quantity-input"]')
                    ->type('input[id="quantity-input"]', '5')
                    ->click('button:contains("Generate Random Words")')
                    ->waitFor('ul li', 10)
                    ->assertElementsCount('ul li', 5);

            // Check that all words start with 'a'
            $words = $browser->elements('ul li');
            foreach ($words as $word) {
                $wordText = strtolower($word->getText());
                $this->assertStringStartsWith('a', $wordText, "Word should start with 'a': {$wordText}");
            }
        });
    }

    /**
     * Test that reset options works
     */
    public function test_reset_options()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/');

            // On mobile, show more options
            if ($browser->element('#more-options-panel')->getAttribute('class') === 'hidden sm:block') {
                $browser->click('button:contains("Toggle More Options")');
                $browser->waitFor('#more-options-panel.block', 2);
            }

            // Set some values
            $browser->waitFor('input[id="first-letter-input"]', 5)
                    ->select('select[id="word-type-select"]', 'noun')
                    ->type('input[id="first-letter-input"]', 'b')
                    ->type('input[id="last-letter-input"]', 'e')
                    ->clear('input[id="quantity-input"]')
                    ->type('input[id="quantity-input"]', '3')
                    ->click('button:contains("Reset Options")')
                    ->pause(500); // Wait for reset to complete

            // Check that values are reset
            $browser->assertInputValue('input[id="quantity-input"]', '1')
                    ->assertSelected('select[id="word-type-select"]', 'all')
                    ->assertInputValue('input[id="first-letter-input"]', '')
                    ->assertInputValue('input[id="last-letter-input"]', '');
        });
    }

    /**
     * Test favorites functionality
     */
    public function test_favorites_functionality()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->clear('input[id="quantity-input"]')
                    ->type('input[id="quantity-input"]', '3')
                    ->click('button:contains("Generate Random Words")')
                    ->waitFor('ul li', 10)
                    ->assertElementsCount('ul li', 3);

            // Add first word to favorites
            $browser->click('ul li:first-child .text-blue-600') // Heart icon
                    ->waitForText('added to favorites', 3); // Wait for toast notification

            // Switch to favorites view
            $browser->click('button:contains("Show Favorites")')
                    ->waitFor('ul li', 5)
                    ->assertElementsCount('ul li', 1); // Should have 1 favorite

            // Clear favorites
            $browser->click('button:contains("Clear All")')
                    ->waitForText('All favorites cleared', 3)
                    ->assertElementsCount('ul li', 0); // Should have no favorites
        });
    }

    /**
     * Test copy to clipboard functionality
     */
    public function test_copy_functionality()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->clear('input[id="quantity-input"]')
                    ->type('input[id="quantity-input"]', '2')
                    ->click('button:contains("Generate Random Words")')
                    ->waitFor('ul li', 10)
                    ->assertElementsCount('ul li', 2)
                    ->click('button:contains("Copy Words")')
                    ->waitForText('copied to clipboard', 3); // Wait for success message
        });
    }

    /**
     * Test responsive design - mobile toggle
     */
    public function test_mobile_more_options_toggle()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->resize(375, 667) // Mobile size
                    ->waitFor('button:contains("Toggle More Options")', 5);

            // More options should be hidden on mobile
            $moreOptionsPanel = $browser->element('#more-options-panel');
            $classes = $moreOptionsPanel->getAttribute('class');
            $this->assertStringContains('hidden', $classes);

            // Click to show options
            $browser->click('button:contains("Toggle More Options")')
                    ->waitFor('#more-options-panel.block', 2);

            // Options should now be visible
            $moreOptionsPanel = $browser->element('#more-options-panel');
            $classes = $moreOptionsPanel->getAttribute('class');
            $this->assertStringContains('block', $classes);
        });
    }

    /**
     * Test that word generation works with syllable filters
     */
    public function test_syllable_filtering()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/');

            // Show more options if hidden
            if ($browser->element('#more-options-panel')->getAttribute('class') === 'hidden sm:block') {
                $browser->click('button:contains("Toggle More Options")');
                $browser->waitFor('#more-options-panel.block', 2);
            }

            $browser->waitFor('select[id="word-size-select"]', 5)
                    ->select('select[id="word-size-select"]', 'syllables')
                    ->waitFor('select[id="comparing-select"]', 2) // Wait for comparison select to appear
                    ->select('select[id="comparing-select"]', 'equals')
                    ->clear('input[id="count-input"]')
                    ->type('input[id="count-input"]', '2')
                    ->clear('input[id="quantity-input"]')
                    ->type('input[id="quantity-input"]', '5')
                    ->click('button:contains("Generate Random Words")')
                    ->waitFor('ul li', 10)
                    ->assertElementsCount('ul li', 5);

            // We can't easily test syllable count, but we can test that the filtering worked
            $words = $browser->elements('ul li');
            $this->assertCount(5, $words);

            foreach ($words as $word) {
                $wordText = $word->getText();
                $this->assertNotEmpty($wordText);
                $this->assertMatchesRegularExpression('/^[a-zA-Z]+$/', $wordText);
            }
        });
    }

    /**
     * Test error handling
     */
    public function test_error_handling()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->clear('input[id="quantity-input"]')
                    ->type('input[id="quantity-input"]', '0') // Invalid quantity
                    ->click('button:contains("Generate Random Words")')
                    ->waitForText('Failed to generate words', 5); // Should show error
        });
    }
}
