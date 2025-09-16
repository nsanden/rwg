<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RandomWordGeneratorController;
use App\Http\Controllers\ColorController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Random Word Generator Homepage
Route::get('/', [RandomWordGeneratorController::class, 'index']);

// Random Word Generator Nouns Page
Route::get('/noun.php', [RandomWordGeneratorController::class, 'noun']);

// Random Word Generator Verbs Page
Route::get('/verb.php', [RandomWordGeneratorController::class, 'verb']);

// Random Word Generator Adjectives Page
Route::get('/adjective.php', [RandomWordGeneratorController::class, 'adjective']);

// Random Letter Generator Page
Route::get('/letter.php', [RandomWordGeneratorController::class, 'letter']);

// Cursive Letters Generator Page
Route::get('/cursive-letter.php', [RandomWordGeneratorController::class, 'cursiveLetter']);

// Random Word Generator Synonyms Page
Route::get('/synonym.php', [RandomWordGeneratorController::class, 'synonym']);

// Random Sentence Generator Page
Route::get('/sentence.php', [RandomWordGeneratorController::class, 'sentence']);

// Random Paragraph Generator Page
Route::get('/paragraph.php', [RandomWordGeneratorController::class, 'paragraph']);

// Random Name Generator Page
Route::get('/name.php', [RandomWordGeneratorController::class, 'name']);

// Random Weird Words Generator Page
Route::get('/weird-word.php', [RandomWordGeneratorController::class, 'weirdWord']);

// Random Fake Words Generator Page
Route::get('/fake-word.php', [RandomWordGeneratorController::class, 'fakeWord']);

// Random Phrase Generator Page
Route::get('/phrase.php', [RandomWordGeneratorController::class, 'phrase']);

// Random Number Generator Page
Route::get('/number.php', [RandomWordGeneratorController::class, 'number']);

// Random Writing Prompts Generator Page
Route::get('/writing-prompt.php', [RandomWordGeneratorController::class, 'writingPrompt']);

// Random Password Generator Page
Route::get('/password.php', [RandomWordGeneratorController::class, 'password']);

// Random List Generator Page
Route::get('/list.php', [RandomWordGeneratorController::class, 'list']);

// Random Gift Ideas Generator Page
Route::get('/gift-ideas.php', [RandomWordGeneratorController::class, 'giftIdeas']);

// Random Dinner Ideas Generator Page
Route::get('/dinner-ideas.php', [RandomWordGeneratorController::class, 'dinnerIdeas']);

// Random Breakfast Ideas Generator Page
Route::get('/breakfast-ideas.php', [RandomWordGeneratorController::class, 'breakfastIdeas']);

// Wedding Hashtags Generator Page
Route::get('/wedding-hashtags.php', [RandomWordGeneratorController::class, 'weddingHashtags']);

// Random Vocabulary Words Generator Page
Route::get('/vocabulary.php', [RandomWordGeneratorController::class, 'vocabulary']);

// Random Motivational Quotes Generator Page
Route::get('/motivational-quote.php', [RandomWordGeneratorController::class, 'motivationalQuote']);

// Random Bible Verse Generator Page
Route::get('/bible-verse.php', [RandomWordGeneratorController::class, 'bibleVerse']);

// Random Facts Generator Page
Route::get('/fact.php', [RandomWordGeneratorController::class, 'fact']);

// Random Interview Questions Generator Page
Route::get('/interview-question.php', [RandomWordGeneratorController::class, 'interviewQuestion']);

// Random Tongue Twisters Generator Page
Route::get('/tongue-twisters.php', [RandomWordGeneratorController::class, 'tongueTwisters']);

// Random Acts of Kindness Generator Page
Route::get('/act-of-kindness.php', [RandomWordGeneratorController::class, 'actOfKindness']);

// Charades Generator Page
Route::get('/charades.php', [RandomWordGeneratorController::class, 'charades']);

// Pictionary Generator Page
Route::get('/pictionary.php', [RandomWordGeneratorController::class, 'pictionary']);

// Hangman Words Generator Page
Route::get('/hangman.php', [RandomWordGeneratorController::class, 'hangman']);

// Truth or Dare Questions Generator Page
Route::get('/truth-or-dare-question.php', [RandomWordGeneratorController::class, 'truthOrDare']);

// Never Have I Ever Questions Generator Page
Route::get('/never-have-i-ever-question.php', [RandomWordGeneratorController::class, 'neverHaveIEver']);

// Would You Rather Questions Generator Page
Route::get('/would-you-rather-question.php', [RandomWordGeneratorController::class, 'wouldYouRather']);

// Random Questions Generator Page
Route::get('/question.php', [RandomWordGeneratorController::class, 'question']);

// Dice Roll Generator Page
Route::get('/dice-roll.php', [RandomWordGeneratorController::class, 'diceRoll']);

// Coin Flip Generator Page
Route::get('/coin-flip.php', [RandomWordGeneratorController::class, 'coinFlip']);

// Decision Maker Generator Page
Route::get('/decision.php', [RandomWordGeneratorController::class, 'decision']);

// Yes or No Oracle Page
Route::get('/yes-no.php', [RandomWordGeneratorController::class, 'yesNo']);

// Random Color Generator Page
Route::get('/color.php', function () {
    return Inertia::render('Colors');
});

// Random Drawing Ideas Generator Page
Route::get('/drawing-idea.php', [RandomWordGeneratorController::class, 'drawingIdea']);

// Random Coloring Pages Generator Page
Route::get('/coloring-pages.php', [RandomWordGeneratorController::class, 'coloringPage']);

// Random Pictures Generator Page
Route::get('/picture.php', [RandomWordGeneratorController::class, 'picture']);

// Letter Sequence Generator Page
Route::get('/letter-sequence.php', [RandomWordGeneratorController::class, 'letterSequence']);

// Computer Code Generator Page
Route::get('/computer-code.php', [RandomWordGeneratorController::class, 'computerCode']);

// Make Money/Passive Income Ideas Generator Page
Route::get('/make-money-ideas.php', [RandomWordGeneratorController::class, 'makeMoneyIdeas']);

// Books Everyone Should Read Generator Page
Route::get('/books-everyone-should-read.php', [RandomWordGeneratorController::class, 'booksEveryoneShouldRead']);

// All Generators Directory Page
Route::get('/more.php', [RandomWordGeneratorController::class, 'allGenerators']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
