<?php

use App\Http\Controllers\RandomWordGeneratorController;
use App\Http\Controllers\ColorController;
use Illuminate\Support\Facades\Route;

// All generator routes with API protection and rate limiting
Route::middleware(['api.restrict', 'api.rate_limit'])->group(function () {
    Route::get('/generate/words', [RandomWordGeneratorController::class, 'generateWords']);
    Route::get('/generate/sentences', [RandomWordGeneratorController::class, 'generateSentences']);
    Route::get('/generate/paragraphs', [RandomWordGeneratorController::class, 'generateParagraphs']);
    Route::get('/generate/names', [RandomWordGeneratorController::class, 'generateNames']);
    Route::get('/generate/phrases', [RandomWordGeneratorController::class, 'generatePhrases']);
    Route::get('/generate/numbers', [RandomWordGeneratorController::class, 'generateNumbers']);
    Route::get('/generate/writing-prompts', [RandomWordGeneratorController::class, 'generateWritingPrompts']);
    Route::get('/generate/passwords', [RandomWordGeneratorController::class, 'generatePasswords']);
    Route::get('/generate/vocabulary', [RandomWordGeneratorController::class, 'generateVocabulary']);
    Route::get('/generate/motivational-quotes', [RandomWordGeneratorController::class, 'generateMotivationalQuotes']);
    Route::get('/generate/bible-verses', [RandomWordGeneratorController::class, 'generateBibleVerses']);
    Route::get('/generate/facts', [RandomWordGeneratorController::class, 'generateFacts']);
    Route::get('/generate/interview-questions', [RandomWordGeneratorController::class, 'generateInterviewQuestions']);
    Route::get('/generate/tongue-twisters', [RandomWordGeneratorController::class, 'generateTongueTwisters']);
    Route::get('/generate/acts-of-kindness', [RandomWordGeneratorController::class, 'generateActsOfKindness']);
    Route::get('/generate/charades', [RandomWordGeneratorController::class, 'generateCharades']);
    Route::get('/generate/pictionary', [RandomWordGeneratorController::class, 'generatePictionary']);
    Route::get('/generate/hangman', [RandomWordGeneratorController::class, 'generateHangman']);
    Route::get('/generate/truth-or-dare', [RandomWordGeneratorController::class, 'generateTruthOrDare']);
    Route::get('/generate/never-have-i-ever', [RandomWordGeneratorController::class, 'generateNeverHaveIEver']);
    Route::get('/generate/would-you-rather', [RandomWordGeneratorController::class, 'generateWouldYouRather']);
    Route::get('/generate/questions', [RandomWordGeneratorController::class, 'generateQuestions']);
    Route::get('/generate/gift-ideas', [RandomWordGeneratorController::class, 'generateGiftIdeas']);
    Route::get('/generate/dinner-ideas', [RandomWordGeneratorController::class, 'generateDinnerIdeas']);
    Route::get('/generate/breakfast-ideas', [RandomWordGeneratorController::class, 'generateBreakfastIdeas']);
    Route::post('/generate/wedding-hashtags', [RandomWordGeneratorController::class, 'generateWeddingHashtags']);
    Route::get('/generate/colors', [ColorController::class, 'generateColors']);
    Route::get('/generate/drawing-ideas', [RandomWordGeneratorController::class, 'generateDrawingIdeas']);
    Route::get('/generate/coloring-pages', [RandomWordGeneratorController::class, 'generateColoringPages']);
    Route::get('/generate/pictures', [RandomWordGeneratorController::class, 'generatePictures']);
    Route::get('/generate/letter-sequences', [RandomWordGeneratorController::class, 'generateLetterSequences']);
    Route::get('/generate/computer-code', [RandomWordGeneratorController::class, 'generateComputerCode']);
    Route::get('/generate/make-money-ideas', [RandomWordGeneratorController::class, 'generateMakeMoneyIdeas']);
    Route::get('/generate/books-everyone-should-read', [RandomWordGeneratorController::class, 'generateBooksEveryoneShouldRead']);
});