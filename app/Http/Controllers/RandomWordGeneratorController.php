<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RandomWordGeneratorController extends Controller
{
    /**
     * Display the homepage with random word generator
     */
    public function index(): Response
    {
        return Inertia::render('Homepage');
    }

    /**
     * Generate random words via API
     */
    public function generateWords(Request $request)
    {
        $request->validate([
            'quantity' => 'integer|min:1|max:100',
            'type' => 'string|in:all,noun,verb,adjective,extended,non-english',
            'language' => 'string|in:en,es,hi,ar,de,ru,zh,jp,ko,la,it',
            'firstLetter' => 'string|max:1',
            'lastLetter' => 'string|max:1',
            'sizeType' => 'string|in:syllables,letters',
            'comparing' => 'string|in:equals,less_than,greater_than',
            'count' => 'integer|min:1|max:20',
        ]);

        $quantity = $request->get('quantity', 5);
        $type = $request->get('type', 'all');
        $language = $request->get('language', 'en');
        $firstLetter = $request->get('firstLetter', '');
        $lastLetter = $request->get('lastLetter', '');
        $sizeType = $request->get('sizeType', '');
        $comparing = $request->get('comparing', 'equals');
        $count = $request->get('count', 5);

        // For now, return mock data - we'll implement the actual word generation later
        $words = $this->generateMockWords($quantity, $type, $firstLetter, $lastLetter);

        return response()->json([
            'words' => $words,
            'success' => true,
        ]);
    }

    /**
     * Generate mock words for testing purposes
     */
    private function generateMockWords(int $quantity, string $type, string $firstLetter = '', string $lastLetter = ''): array
    {
        $wordSets = [
            'all' => [
                'adventure', 'brilliant', 'cascade', 'delightful', 'enigma', 'fantastic', 'gorgeous', 'harmony',
                'illuminate', 'joyful', 'kindness', 'luminous', 'magnificent', 'nurture', 'optimistic', 'peaceful',
                'quintessential', 'radiant', 'serenity', 'tranquil', 'unique', 'vibrant', 'wonderful', 'xenial',
                'yearning', 'zestful', 'amazing', 'beautiful', 'creative', 'dynamic', 'elegant', 'flourish'
            ],
            'noun' => [
                'butterfly', 'mountain', 'ocean', 'sunrise', 'library', 'garden', 'symphony', 'treasure',
                'journey', 'kingdom', 'lighthouse', 'meadow', 'notebook', 'orchestra', 'phoenix', 'rainbow',
                'sanctuary', 'telescope', 'universe', 'waterfall', 'xenolith', 'yearbook', 'zenith'
            ],
            'verb' => [
                'accelerate', 'bounce', 'celebrate', 'discover', 'explore', 'flourish', 'generate', 'harmonize',
                'illuminate', 'journey', 'kindle', 'leap', 'motivate', 'navigate', 'optimize', 'persevere',
                'question', 'radiate', 'sparkle', 'transform', 'unite', 'venture', 'whisper', 'xerox', 'yearn', 'zoom'
            ],
            'adjective' => [
                'amazing', 'brilliant', 'curious', 'dazzling', 'elegant', 'fantastic', 'graceful', 'harmonious',
                'incredible', 'joyous', 'kindhearted', 'luminous', 'magnificent', 'nostalgic', 'optimistic',
                'peaceful', 'quirky', 'radiant', 'spectacular', 'tremendous', 'unique', 'vivid', 'wonderful'
            ]
        ];

        $selectedWords = $wordSets[$type] ?? $wordSets['all'];

        // Filter by first/last letter if specified
        if ($firstLetter) {
            $selectedWords = array_filter($selectedWords, fn($word) =>
                strtolower(substr($word, 0, 1)) === strtolower($firstLetter)
            );
        }

        if ($lastLetter) {
            $selectedWords = array_filter($selectedWords, fn($word) =>
                strtolower(substr($word, -1)) === strtolower($lastLetter)
            );
        }

        // If we don't have enough words after filtering, mix in some from 'all'
        if (count($selectedWords) < $quantity) {
            $selectedWords = array_merge($selectedWords, $wordSets['all']);
            $selectedWords = array_unique($selectedWords);
        }

        // Shuffle and return the requested quantity
        shuffle($selectedWords);
        return array_slice($selectedWords, 0, $quantity);
    }
}