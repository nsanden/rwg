<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ForeignWord;
use App\Models\ExtendedWord;
use Illuminate\Support\Facades\Log;

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
     * Display the nouns page
     */
    public function noun(): Response
    {
        return Inertia::render('Nouns');
    }

    /**
     * Display the verbs page
     */
    public function verb(): Response
    {
        return Inertia::render('Verbs');
    }

    /**
     * Display the adjectives page
     */
    public function adjective(): Response
    {
        return Inertia::render('Adjectives');
    }

    /**
     * Display the letter generator page
     */
    public function letter(): Response
    {
        return Inertia::render('Letter');
    }

    /**
     * Display the cursive letters generator page
     */
    public function cursiveLetter(): Response
    {
        return Inertia::render('CursiveLetters');
    }

    /**
     * Display the synonyms page
     */
    public function synonym(): Response
    {
        return Inertia::render('Synonyms');
    }

    /**
     * Display the sentence generator page
     */
    public function sentence(): Response
    {
        return Inertia::render('Sentence');
    }

    /**
     * Display the paragraph generator page
     */
    public function paragraph(): Response
    {
        return Inertia::render('Paragraph');
    }

    /**
     * Display the name generator page
     */
    public function name(): Response
    {
        return Inertia::render('Name');
    }

    /**
     * Display the weird words generator page
     */
    public function weirdWord(): Response
    {
        return Inertia::render('WeirdWords');
    }

    /**
     * Display the fake words generator page
     */
    public function fakeWord(): Response
    {
        return Inertia::render('FakeWords');
    }

    /**
     * Display the phrase generator page
     */
    public function phrase(): Response
    {
        return Inertia::render('Phrase');
    }

    /**
     * Generate random words via API
     */
    public function generateWords(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:100',
                'type' => 'string|in:all,basic,noun,verb,adjective,extended,non-english,synonym_all,actions,antonyms,descriptive,feelings,negative,positive,talk_speech,other,weird,fake,letter,cursive-letter',
                'language' => 'string|in:en,es,hi,ar,de,ru,zh,jp,ko,la,it',
                'firstLetter' => 'nullable|string|max:1',
                'lastLetter' => 'nullable|string|max:1',
                'sizeType' => 'nullable|string|in:syllables,letters',
                'comparing' => 'nullable|string|in:equals,less_than,greater_than',
                'count' => 'nullable|integer|min:1|max:100',
                'case' => 'nullable|string|in:uppercase,lowercase,mixed',
            ]);

            $quantity = $request->get('quantity', 5);
            $type = $request->get('type', 'all');
            $language = $request->get('language', 'en');
            $firstLetter = $request->get('firstLetter', '');
            $lastLetter = $request->get('lastLetter', '');
            $sizeType = $request->get('sizeType', '');
            $comparing = $request->get('comparing', 'equals');
            $count = $request->get('count', 5);
            $case = $request->get('case', 'mixed');

            // Log API request
            Log::channel('api')->info('Word generation request', [
                'quantity' => $quantity,
                'type' => $type,
                'language' => $language,
                'filters' => compact('firstLetter', 'lastLetter', 'sizeType', 'comparing', 'count'),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $words = $this->generateWordsFromData($quantity, $type, $language, $firstLetter, $lastLetter, $sizeType, $comparing, $count, $case);

            $duration = round((microtime(true) - $startTime) * 1000, 2);

            // Log performance
            Log::channel('performance')->info('Word generation completed', [
                'duration_ms' => $duration,
                'words_generated' => count($words),
                'type' => $type,
                'quantity_requested' => $quantity,
            ]);

            return response()->json([
                'words' => $words,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::channel('api')->error('Word generation failed', [
                'error' => $e->getMessage(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Failed to generate words',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random sentences via API
     */
    public function generateSentences(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:100',
            ]);

            $quantity = $request->get('quantity', 5);

            // Log API request
            Log::channel('api')->info('Sentence generation request', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $sentences = $this->generateSentencesFromData($quantity);

            $duration = round((microtime(true) - $startTime) * 1000, 2);

            // Log performance
            Log::channel('performance')->info('Sentence generation completed', [
                'duration_ms' => $duration,
                'sentences_generated' => count($sentences),
                'quantity_requested' => $quantity,
            ]);

            return response()->json([
                'sentences' => $sentences,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::channel('api')->error('Sentence generation failed', [
                'error' => $e->getMessage(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Failed to generate sentences',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate words from actual word data files
     */
    private function generateWordsFromData(int $quantity, string $type, string $language = 'en', string $firstLetter = '', string $lastLetter = '', string $sizeType = '', string $comparing = 'equals', int $count = 5, string $case = 'mixed'): array
    {
        // Handle letter generation separately
        if ($type === 'letter' || $type === 'cursive-letter') {
            return $this->generateRandomLetters($quantity, $firstLetter, $lastLetter, $case);
        }

        $wordData = $this->loadWordData($type, $language);

        // Handle database-based words
        if (is_array($wordData) && isset($wordData['type'])) {
            return $this->getWordsFromDatabase($wordData, $quantity, $firstLetter, $lastLetter, $sizeType, $comparing, $count);
        }

        // Handle JSON-based words (legacy)
        if (empty($wordData)) {
            return [];
        }

        $filteredWords = $this->filterWords($wordData, $firstLetter, $lastLetter, $sizeType, $comparing, $count);

        // If we don't have enough words after filtering, supplement with 'all' words
        if (count($filteredWords) < $quantity && !in_array($type, ['all', 'basic'])) {
            $allWordData = $this->loadWordData('all', $language);
            if (is_array($allWordData) && isset($allWordData['type'])) {
                // Try to get more from database
                $additionalWords = $this->getWordsFromDatabase($allWordData, $quantity - count($filteredWords), $firstLetter, $lastLetter, $sizeType, $comparing, $count);
                return array_merge($this->extractWordStrings($filteredWords), $additionalWords);
            } else {
                $additionalWords = $this->filterWords($allWordData, $firstLetter, $lastLetter, $sizeType, $comparing, $count);
                // Merge and remove duplicates
                $allFiltered = array_merge($filteredWords, $additionalWords);
                $filteredWords = array_values(array_unique($allFiltered, SORT_REGULAR));
            }
        }

        // Shuffle the array
        shuffle($filteredWords);

        // Return the requested quantity as word strings
        $slicedWords = array_slice($filteredWords, 0, $quantity);
        return $this->extractWordStrings($slicedWords);
    }

    /**
     * Get words directly from database with filtering
     */
    private function getWordsFromDatabase(array $config, int $quantity, string $firstLetter = '', string $lastLetter = '', string $sizeType = '', string $comparing = 'equals', int $count = 5): array
    {
        // Build the query
        if ($config['type'] === 'foreign') {
            $query = ForeignWord::where('language', $config['language']);
        } else {
            $query = ExtendedWord::query();
        }

        // Apply filters directly to the database query
        if ($firstLetter) {
            $query->where('first_letter', strtolower($firstLetter));
        }

        if ($lastLetter) {
            $query->where('last_letter', strtolower($lastLetter));
        }

        // Handle size filtering
        if ($sizeType && $count > 0) {
            $field = ($sizeType === 'syllables') ? 'syllables' : 'length';

            switch ($comparing) {
                case 'equals':
                    $query->where($field, $count);
                    break;
                case 'less_than':
                    $query->where($field, '<', $count);
                    break;
                case 'greater_than':
                    $query->where($field, '>', $count);
                    break;
            }
        }

        // Get random words - use database random sampling
        $words = $query->inRandomOrder()->limit($quantity)->get(['word', 'syllables']);

        // Return as word strings array
        return $words->pluck('word')->toArray();
    }

    /**
     * Load word data from JSON files or database
     */
    private function loadWordData(string $type, string $language = 'en'): array
    {
        // Handle non-English words from database - return query builder for later filtering
        if ($type === 'non-english' && $language !== 'en') {
            return ['type' => 'foreign', 'language' => $language];
        }

        // Handle extended English words from database - return query builder for later filtering
        if ($type === 'extended') {
            return ['type' => 'extended'];
        }

        // Handle synonym categories from synonyms.json
        if (in_array($type, ['synonym_all', 'actions', 'antonyms', 'descriptive', 'feelings', 'negative', 'positive', 'talk_speech', 'other'])) {
            // Map 'synonym_all' to 'all' for the synonym data loader
            $synonymType = $type === 'synonym_all' ? 'all' : $type;
            return $this->loadSynonymData($synonymType);
        }

        // Handle English words from JSON files
        $filename = match($type) {
            'noun' => 'nouns_ws.json',
            'verb' => 'verbs_ws.json',
            'adjective' => 'adjectives_ws.json',
            'weird' => 'weird-words.json',
            'fake' => 'fake-words.json',
            default => 'words_ws.json'
        };

        $filePath = storage_path("data/{$filename}");

        if (!file_exists($filePath)) {
            return [];
        }

        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);

        if (!isset($data['data']) || !is_array($data['data'])) {
            return [];
        }

        return $data['data'];
    }

    /**
     * Load synonym data from synonyms.json file
     */
    private function loadSynonymData(string $category): array
    {
        $filePath = storage_path('data/synonyms.json');

        if (!file_exists($filePath)) {
            return [];
        }

        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);

        // Handle 'all' category by combining all categories
        if ($category === 'all') {
            $allWords = [];
            $categories = ['actions', 'antonyms', 'descriptive', 'feelings', 'negative', 'positive', 'talk_speech', 'other'];

            foreach ($categories as $cat) {
                if (isset($data[$cat]) && is_array($data[$cat])) {
                    $allWords = array_merge($allWords, $data[$cat]);
                }
            }

            return $allWords;
        }

        if (!isset($data[$category]) || !is_array($data[$category])) {
            return [];
        }

        return $data[$category];
    }

    /**
     * Filter words based on criteria
     */
    private function filterWords(array $wordData, string $firstLetter = '', string $lastLetter = '', string $sizeType = '', string $comparing = 'equals', int $count = 5): array
    {
        return array_filter($wordData, function($item) use ($firstLetter, $lastLetter, $sizeType, $comparing, $count) {
            // Extract word data from different possible keys
            $wordInfo = $this->extractWordInfo($item);
            if (!$wordInfo) {
                return false;
            }

            $word = $wordInfo['value'];
            $syllables = $wordInfo['numSyllables'] ?? 0;

            // Filter by first letter
            if ($firstLetter && strtolower(substr($word, 0, 1)) !== strtolower($firstLetter)) {
                return false;
            }

            // Filter by last letter
            if ($lastLetter && strtolower(substr($word, -1)) !== strtolower($lastLetter)) {
                return false;
            }

            // Filter by size (syllables or letters)
            if ($sizeType) {
                $actualCount = ($sizeType === 'syllables') ? $syllables : strlen($word);

                switch ($comparing) {
                    case 'equals':
                        if ($actualCount !== $count) return false;
                        break;
                    case 'less_than':
                        if ($actualCount >= $count) return false;
                        break;
                    case 'greater_than':
                        if ($actualCount <= $count) return false;
                        break;
                }
            }

            return true;
        });
    }

    /**
     * Extract word info from different JSON structures
     */
    private function extractWordInfo(array $item): ?array
    {
        // Handle weird words format (nested word object with value and definition)
        if (isset($item['word']) && is_array($item['word']) && isset($item['word']['value'])) {
            return $item['word'];
        }

        // Handle fake words format (direct word key)
        if (isset($item['word']) && is_string($item['word'])) {
            return ['value' => $item['word']];
        }

        // Try different possible keys for other word types
        $possibleKeys = ['noun', 'verb', 'adjective'];

        foreach ($possibleKeys as $key) {
            if (isset($item[$key]['value'])) {
                return $item[$key];
            }
        }

        return null;
    }

    /**
     * Extract word strings from filtered data
     */
    private function extractWordStrings(array $filteredWords): array
    {
        return array_map(function($item) {
            $wordInfo = $this->extractWordInfo($item);

            // For synonyms, return word object with synonyms
            if (isset($wordInfo['synonyms'])) {
                return [
                    'word' => $wordInfo['value'] ?? '',
                    'synonyms' => $wordInfo['synonyms'] ?? ''
                ];
            }

            // For weird words, return word object with definition
            if (isset($wordInfo['definition'])) {
                return [
                    'value' => $wordInfo['value'] ?? '',
                    'definition' => $wordInfo['definition'] ?? ''
                ];
            }

            // For regular words, return just the string
            return $wordInfo['value'] ?? '';
        }, $filteredWords);
    }

    /**
     * Generate sentences from sentence data file
     */
    private function generateSentencesFromData(int $quantity): array
    {
        $filePath = storage_path('data/sentences.json');

        if (!file_exists($filePath)) {
            return [];
        }

        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);

        if (!isset($data['data']) || !is_array($data['data'])) {
            return [];
        }

        // Shuffle the sentences
        $sentences = $data['data'];
        shuffle($sentences);

        // Return the requested quantity
        $selectedSentences = array_slice($sentences, 0, $quantity);

        // Extract just the sentence strings
        return array_map(function($item) {
            return $item['sentence'] ?? '';
        }, $selectedSentences);
    }

    /**
     * Generate random names via API
     */
    public function generateNames(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:100',
                'category' => 'string|in:real,fantasy,place,pop-culture',
                'subCategory' => 'string',
                'gender' => 'string|in:male,female,both',
                'firstNameFirstLetter' => 'nullable|string|max:1',
                'firstNameLastLetter' => 'nullable|string|max:1',
                'lastNameFirstLetter' => 'nullable|string|max:1',
                'lastNameLastLetter' => 'nullable|string|max:1',
                'firstNameSizeType' => 'nullable|string|in:syllables,length',
                'lastNameSizeType' => 'nullable|string|in:syllables,length',
                'firstNameComparison' => 'nullable|string|in:equals,less_than,greater_than',
                'lastNameComparison' => 'nullable|string|in:equals,less_than,greater_than',
                'firstNameSize' => 'nullable|integer|min:1',
                'lastNameSize' => 'nullable|integer|min:1',
            ]);

            $quantity = $request->get('quantity', 5);
            $category = $request->get('category', 'real');
            $subCategory = $request->get('subCategory', 'any');
            $gender = $request->get('gender', 'both');

            // Log API request
            Log::channel('api')->info('Name generation request', [
                'quantity' => $quantity,
                'category' => $category,
                'subCategory' => $subCategory,
                'gender' => $gender,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $names = $this->generateNamesFromData($request->all());

            $duration = round((microtime(true) - $startTime) * 1000, 2);

            // Log performance
            Log::channel('performance')->info('Name generation completed', [
                'duration_ms' => $duration,
                'names_generated' => count($names),
                'category' => $category,
                'quantity_requested' => $quantity,
            ]);

            return response()->json([
                'names' => $names,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::channel('api')->error('Name generation failed', [
                'error' => $e->getMessage(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Failed to generate names',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random paragraphs via API
     */
    public function generateParagraphs(Request $request)
    {
        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:50'
            ]);

            $quantity = $request->get('quantity', 1);

            // Log API request
            Log::channel('api')->info('Paragraph generation request', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $paragraphs = $this->generateParagraphsFromData($quantity);

            return response()->json([
                'success' => true,
                'paragraphs' => $paragraphs
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::channel('api')->error('Paragraph generation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate paragraphs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate writing prompts from writing prompts data file
     */
    private function generateWritingPromptsFromData(int $quantity): array
    {
        $filePath = storage_path('data/writing-prompts.json');

        if (!file_exists($filePath)) {
            return [];
        }

        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);

        if (!isset($data['data']) || !is_array($data['data'])) {
            return [];
        }

        // Shuffle the prompts
        $prompts = $data['data'];
        shuffle($prompts);

        // Return the requested quantity
        $selectedPrompts = array_slice($prompts, 0, $quantity);

        // Return prompts with value and description
        return array_map(function($item) {
            return [
                'value' => $item['prompt']['value'] ?? '',
                'description' => $item['prompt']['description'] ?? ''
            ];
        }, $selectedPrompts);
    }

    /**
     * Generate paragraphs from paragraph data file
     */
    private function generateParagraphsFromData(int $quantity): array
    {
        $filePath = storage_path('data/paragraphs.json');

        if (!file_exists($filePath)) {
            return [];
        }

        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);

        if (!isset($data['data']) || !is_array($data['data'])) {
            return [];
        }

        // Shuffle the paragraphs
        $paragraphs = $data['data'];
        shuffle($paragraphs);

        // Return the requested quantity
        $selectedParagraphs = array_slice($paragraphs, 0, $quantity);

        // Extract just the paragraph strings
        return array_map(function($item) {
            return $item['paragraph'] ?? '';
        }, $selectedParagraphs);
    }

    /**
     * Generate names from name data files
     */
    private function generateNamesFromData(array $params): array
    {
        $quantity = $params['quantity'] ?? 5;
        $category = $params['category'] ?? 'real';
        $subCategory = $params['subCategory'] ?? 'any';
        $gender = $params['gender'] ?? 'both';

        // Load the appropriate name data
        $nameData = $this->loadNameData($category, $subCategory);

        if (empty($nameData)) {
            return [];
        }

        $names = [];

        for ($i = 0; $i < $quantity; $i++) {
            if ($category === 'real') {
                $name = $this->generateRealName($nameData, $gender, $params);
            } else {
                $name = $this->generateOtherName($nameData, $params);
            }

            if ($name) {
                $names[] = $name;
            }
        }

        return $names;
    }

    /**
     * Generate a real person name (first + last)
     */
    private function generateRealName(array $nameData, string $gender, array $params): string
    {
        $firstName = '';
        $lastName = '';

        // Generate first name based on gender
        if ($gender === 'male' && isset($nameData['male'])) {
            $firstName = $this->selectFilteredName($nameData['male'], $params, 'firstName');
        } elseif ($gender === 'female' && isset($nameData['female'])) {
            $firstName = $this->selectFilteredName($nameData['female'], $params, 'firstName');
        } elseif ($gender === 'both') {
            $allFirstNames = [];
            if (isset($nameData['male'])) {
                $allFirstNames = array_merge($allFirstNames, $nameData['male']);
            }
            if (isset($nameData['female'])) {
                $allFirstNames = array_merge($allFirstNames, $nameData['female']);
            }
            if (!empty($allFirstNames)) {
                $firstName = $this->selectFilteredName($allFirstNames, $params, 'firstName');
            }
        }

        // Generate last name
        if (isset($nameData['surname'])) {
            $lastName = $this->selectFilteredName($nameData['surname'], $params, 'lastName');
        }

        return trim($firstName . ' ' . $lastName);
    }

    /**
     * Generate other types of names (fantasy, places, pop culture)
     */
    private function generateOtherName(array $nameData, array $params): string
    {
        if (empty($nameData)) {
            return '';
        }

        // For fantasy names, try to combine first and last names
        if (isset($nameData['male']) || isset($nameData['female']) || isset($nameData['surname'])) {
            // Use similar logic to real names but handle fantasy structure
            $firstName = '';
            $lastName = '';

            $gender = $params['gender'] ?? 'both';

            // Generate first name based on gender
            if ($gender === 'male' && isset($nameData['male'])) {
                $firstName = $this->selectFilteredName($nameData['male'], $params, 'firstName');
            } elseif ($gender === 'female' && isset($nameData['female'])) {
                $firstName = $this->selectFilteredName($nameData['female'], $params, 'firstName');
            } elseif ($gender === 'both') {
                $allFirstNames = [];
                if (isset($nameData['male'])) {
                    $allFirstNames = array_merge($allFirstNames, $nameData['male']);
                }
                if (isset($nameData['female'])) {
                    $allFirstNames = array_merge($allFirstNames, $nameData['female']);
                }
                if (!empty($allFirstNames)) {
                    $firstName = $this->selectFilteredName($allFirstNames, $params, 'firstName');
                }
            }

            // Generate last name
            if (isset($nameData['surname'])) {
                $lastName = $this->selectFilteredName($nameData['surname'], $params, 'lastName');
            }

            return trim($firstName . ' ' . $lastName);
        }

        // For other types (places, etc.), just pick a single name
        if (isset($nameData[0])) {
            return $this->selectFilteredName($nameData, $params, 'firstName');
        }

        return '';
    }

    /**
     * Select a name from an array with filtering applied
     */
    private function selectFilteredName(array $names, array $params, string $nameType): string
    {
        $filteredNames = $this->filterNamesByParams($names, $params, $nameType);

        if (empty($filteredNames)) {
            // Fall back to unfiltered if no matches
            if (empty($names)) {
                return '';
            }
            $filteredNames = $names;
        }

        $randomIndex = array_rand($filteredNames);
        $selectedName = $filteredNames[$randomIndex];

        // Extract name from different possible structures
        if (is_array($selectedName)) {
            // Handle nested name structure (e.g., fantasy names with name.value)
            if (isset($selectedName['name']) && is_array($selectedName['name'])) {
                return $selectedName['name']['value'] ?? '';
            }
            // Handle simple name structure (e.g., real names)
            return $selectedName['name'] ?? '';
        }

        return $selectedName;
    }

    /**
     * Filter names based on parameters
     */
    private function filterNamesByParams(array $names, array $params, string $nameType): array
    {
        $firstLetterKey = $nameType . 'FirstLetter';
        $lastLetterKey = $nameType . 'LastLetter';
        $sizeTypeKey = $nameType . 'SizeType';
        $comparisonKey = $nameType . 'Comparison';
        $sizeKey = $nameType . 'Size';

        $firstLetter = $params[$firstLetterKey] ?? '';
        $lastLetter = $params[$lastLetterKey] ?? '';
        $sizeType = $params[$sizeTypeKey] ?? '';
        $comparison = $params[$comparisonKey] ?? 'equals';
        $size = $params[$sizeKey] ?? '';

        return array_filter($names, function($nameItem) use ($firstLetter, $lastLetter, $sizeType, $comparison, $size) {
            // Handle nested name structure (e.g., fantasy names)
            if (is_array($nameItem) && isset($nameItem['name']) && is_array($nameItem['name'])) {
                $name = $nameItem['name']['value'] ?? '';
                $numSyllables = $nameItem['name']['numSyllables'] ?? 0;
            } else {
                $name = is_array($nameItem) ? ($nameItem['name'] ?? '') : $nameItem;
                $numSyllables = 0;
            }

            if (empty($name)) {
                return false;
            }

            // Filter by first letter
            if ($firstLetter && strtolower(substr($name, 0, 1)) !== strtolower($firstLetter)) {
                return false;
            }

            // Filter by last letter
            if ($lastLetter && strtolower(substr($name, -1)) !== strtolower($lastLetter)) {
                return false;
            }

            // Filter by size
            if ($sizeType && $size) {
                $actualSize = 0;
                if ($sizeType === 'syllables') {
                    $actualSize = $numSyllables > 0 ? $numSyllables : $this->countSyllables($name);
                } else {
                    $actualSize = strlen($name);
                }

                switch ($comparison) {
                    case 'equals':
                        if ($actualSize != $size) return false;
                        break;
                    case 'less_than':
                        if ($actualSize >= $size) return false;
                        break;
                    case 'greater_than':
                        if ($actualSize <= $size) return false;
                        break;
                }
            }

            return true;
        });
    }

    /**
     * Load name data from JSON files
     */
    private function loadNameData(string $category, string $subCategory): array
    {
        $basePath = storage_path('data/names');

        $filePath = match($category) {
            'real' => $this->getRealNameFilePath($basePath, $subCategory),
            'fantasy' => "{$basePath}/fantasy-characters/{$subCategory}.json",
            'place' => "{$basePath}/fantasy-places/{$subCategory}.json",
            'pop-culture' => "{$basePath}/pop-culture/{$subCategory}.json",
            default => ''
        };

        if (empty($filePath) || !file_exists($filePath)) {
            return [];
        }

        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);

        return $data ?? [];
    }

    /**
     * Get the file path for real names based on subcategory
     */
    private function getRealNameFilePath(string $basePath, string $subCategory): string
    {
        if ($subCategory === 'any') {
            return "{$basePath}/real-people/names.json";
        }

        // Try with syllable data first, then fall back to regular
        $syllableFilePath = "{$basePath}/real-people/{$subCategory}_ws.json";
        if (file_exists($syllableFilePath)) {
            return $syllableFilePath;
        }

        return "{$basePath}/real-people/{$subCategory}.json";
    }

    /**
     * Simple syllable counting algorithm
     */
    private function countSyllables(string $word): int
    {
        $word = strtolower($word);
        $vowels = 'aeiouy';
        $syllableCount = 0;
        $previousWasVowel = false;

        for ($i = 0; $i < strlen($word); $i++) {
            $isVowel = strpos($vowels, $word[$i]) !== false;
            if ($isVowel && !$previousWasVowel) {
                $syllableCount++;
            }
            $previousWasVowel = $isVowel;
        }

        // Handle silent e
        if (substr($word, -1) === 'e' && $syllableCount > 1) {
            $syllableCount--;
        }

        return max(1, $syllableCount);
    }

    /**
     * Generate random letters
     */
    private function generateRandomLetters(int $quantity, string $firstLetter = '', string $lastLetter = '', string $case = 'mixed'): array
    {
        $letters = [];
        $alphabet = range('A', 'Z');

        for ($i = 0; $i < $quantity; $i++) {
            $letter = '';

            // If a specific first letter is requested and we're generating the first letter
            if ($firstLetter && $i === 0) {
                $letter = strtoupper($firstLetter);
            }
            // If a specific last letter is requested and we're generating the last letter
            elseif ($lastLetter && $i === $quantity - 1) {
                $letter = strtoupper($lastLetter);
            }
            // Generate a random letter
            else {
                $letter = $alphabet[array_rand($alphabet)];
            }

            // Apply case transformation
            switch ($case) {
                case 'lowercase':
                    $letters[] = strtolower($letter);
                    break;
                case 'uppercase':
                    $letters[] = strtoupper($letter);
                    break;
                case 'mixed':
                default:
                    // Randomly choose between upper and lower case
                    $letters[] = rand(0, 1) ? strtoupper($letter) : strtolower($letter);
                    break;
            }
        }

        // Format letters as word objects for the frontend
        return array_map(function($letter) {
            return ['word' => $letter];
        }, $letters);
    }

    /**
     * Generate random phrases via API
     */
    public function generatePhrases(Request $request)
    {
        $startTime = microtime(true);
        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:100',
            ]);
            $quantity = $request->get('quantity', 5);
            // Log API request
            Log::channel('api')->info('Phrase generation request', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            $phrases = $this->generatePhrasesFromData($quantity);
            $duration = round((microtime(true) - $startTime) * 1000, 2);
            // Log performance
            Log::channel('performance')->info('Phrase generation completed', [
                'duration_ms' => $duration,
                'phrases_generated' => count($phrases),
                'quantity_requested' => $quantity,
            ]);
            return response()->json([
                'phrases' => $phrases,
                'success' => true,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::channel('api')->error('Phrase generation failed', [
                'error' => $e->getMessage(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate phrases',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate phrases from data file
     */
    private function generatePhrasesFromData(int $quantity): array
    {
        $filePath = storage_path('data/phrases.json');
        if (!file_exists($filePath)) {
            return [];
        }
        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);
        if (!isset($data['data']) || !is_array($data['data'])) {
            return [];
        }
        // Shuffle the phrases
        $phrases = $data['data'];
        shuffle($phrases);
        // Return the requested quantity
        $selectedPhrases = array_slice($phrases, 0, $quantity);
        // Extract just the phrase strings
        return array_map(function($item) {
            return $item['phrase'] ?? '';
        }, $selectedPhrases);
    }

    /**
     * Display the number generator page
     */
    public function number(): Response
    {
        return Inertia::render('Number');
    }

    /**
     * Show the writing prompts generator page
     */
    public function writingPrompt(): Response
    {
        return Inertia::render('WritingPrompts');
    }

    /**
     * Generate random writing prompts via API
     */
    public function generateWritingPrompts(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:50',
            ]);

            $quantity = $request->get('quantity', 3);

            // Log API request
            Log::channel('api')->info('Writing prompts generation request', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $prompts = $this->generateWritingPromptsFromData($quantity);

            $duration = round((microtime(true) - $startTime) * 1000, 2);

            // Log performance
            Log::channel('performance')->info('Writing prompts generation completed', [
                'duration_ms' => $duration,
                'prompts_generated' => count($prompts),
                'quantity_requested' => $quantity,
            ]);

            return response()->json([
                'prompts' => $prompts,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::channel('api')->error('Writing prompts generation failed', [
                'error' => $e->getMessage(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Failed to generate writing prompts',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random numbers via API
     */
    public function generateNumbers(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:1000',
                'min' => 'integer',
                'max' => 'integer',
                'allowDuplicates' => 'boolean',
                'sortOrder' => 'string|in:random,ascending,descending',
            ]);

            $quantity = $request->get('quantity', 1);
            $min = $request->get('min', 1);
            $max = $request->get('max', 100);
            $allowDuplicates = $request->get('allowDuplicates', true);
            $sortOrder = $request->get('sortOrder', 'random');

            // Validate that min is less than max
            if ($min > $max) {
                return response()->json([
                    'error' => 'Minimum value must be less than or equal to maximum value',
                    'success' => false,
                ], 422);
            }

            // If duplicates are not allowed, ensure range is large enough
            if (!$allowDuplicates) {
                $range = $max - $min + 1;
                if ($quantity > $range) {
                    return response()->json([
                        'error' => 'The range is too small for the requested quantity without duplicates',
                        'success' => false,
                    ], 422);
                }
            }

            // Log API request
            Log::channel('api')->info('Number generation request', [
                'quantity' => $quantity,
                'min' => $min,
                'max' => $max,
                'allowDuplicates' => $allowDuplicates,
                'sortOrder' => $sortOrder,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Generate the numbers
            $numbers = [];

            if ($allowDuplicates) {
                // Generate with duplicates allowed
                for ($i = 0; $i < $quantity; $i++) {
                    $numbers[] = rand($min, $max);
                }
            } else {
                // Generate without duplicates
                $availableNumbers = range($min, $max);
                shuffle($availableNumbers);
                $numbers = array_slice($availableNumbers, 0, $quantity);
            }

            // Apply sorting
            switch ($sortOrder) {
                case 'ascending':
                    sort($numbers);
                    break;
                case 'descending':
                    rsort($numbers);
                    break;
                // 'random' requires no additional sorting
            }

            $duration = round((microtime(true) - $startTime) * 1000, 2);

            Log::channel('api')->info('Number generation completed', [
                'duration_ms' => $duration,
                'numbers_generated' => count($numbers),
                'quantity_requested' => $quantity,
            ]);

            return response()->json([
                'numbers' => $numbers,
                'success' => true,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::channel('api')->error('Number generation failed', [
                'error' => $e->getMessage(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate numbers',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Display the password generator page
     */
    public function password(): Response
    {
        return Inertia::render('Password');
    }

    /**
     * Display the list generator page
     */
    public function list(): Response
    {
        return Inertia::render('List');
    }

    /**
     * Display the gift ideas generator page
     */
    public function giftIdeas(): Response
    {
        return Inertia::render('GiftIdeas');
    }

    /**
     * Display the dinner ideas generator page
     */
    public function dinnerIdeas(): Response
    {
        return Inertia::render('DinnerIdeas');
    }

    public function breakfastIdeas(): Response
    {
        return Inertia::render('BreakfastIdeas');
    }

    public function weddingHashtags(): Response
    {
        return Inertia::render('WeddingHashtags');
    }

    public function drawingIdea(): Response
    {
        return Inertia::render('DrawingIdeas');
    }

    /**
     * Show the coloring pages generator page
     */
    public function coloringPage(): Response
    {
        return Inertia::render('ColoringPages');
    }

    /**
     * Show the random pictures generator page
     */
    public function picture(): Response
    {
        return Inertia::render('RandomPictures');
    }

    /**
     * Show the letter sequence generator page
     */
    public function letterSequence(): Response
    {
        return Inertia::render('LetterSequence');
    }

    /**
     * Show the computer code generator page
     */
    public function computerCode(): Response
    {
        return Inertia::render('ComputerCode');
    }

    /**
     * Generate random passwords via API
     */
    public function generatePasswords(Request $request)
    {
        $startTime = microtime(true);
        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:50',
                'length' => 'integer|min:4|max:128',
                'includeCapital' => 'boolean',
                'includeLowercase' => 'boolean',
                'includeNumbers' => 'boolean',
                'includeSpecialChars' => 'boolean',
                'specialChars' => 'nullable|array',
            ]);

            $quantity = $request->get('quantity', 1);
            $length = $request->get('length', 16);
            $includeCapital = $request->get('includeCapital', true);
            $includeLowercase = $request->get('includeLowercase', true);
            $includeNumbers = $request->get('includeNumbers', true);
            $includeSpecialChars = $request->get('includeSpecialChars', true);
            $selectedSpecialChars = $request->get('specialChars', []);

            // Log API request
            Log::channel('api')->info('Password generation request', [
                'quantity' => $quantity,
                'length' => $length,
                'character_types' => [
                    'capital' => $includeCapital,
                    'lowercase' => $includeLowercase,
                    'numbers' => $includeNumbers,
                    'special' => $includeSpecialChars
                ],
                'special_chars_count' => count($selectedSpecialChars),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            // Validate at least one character type is selected
            $hasCharacterTypes = $includeCapital || $includeLowercase || $includeNumbers ||
                               ($includeSpecialChars && !empty($selectedSpecialChars));

            if (!$hasCharacterTypes) {
                return response()->json([
                    'error' => 'Please select at least one character type.',
                    'success' => false,
                ], 400);
            }

            $passwords = [];

            // Build character pools
            $characterPool = '';

            if ($includeCapital) {
                $characterPool .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            }

            if ($includeLowercase) {
                $characterPool .= 'abcdefghijklmnopqrstuvwxyz';
            }

            if ($includeNumbers) {
                $characterPool .= '0123456789';
            }

            if ($includeSpecialChars && !empty($selectedSpecialChars)) {
                $characterPool .= implode('', $selectedSpecialChars);
            }

            // Generate passwords
            for ($i = 0; $i < $quantity; $i++) {
                $password = '';
                for ($j = 0; $j < $length; $j++) {
                    $randomIndex = random_int(0, strlen($characterPool) - 1);
                    $password .= $characterPool[$randomIndex];
                }
                $passwords[] = $password;
            }

            $endTime = microtime(true);
            Log::channel('api')->info('Password generation completed', [
                'passwords_count' => count($passwords),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'passwords' => $passwords,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Password generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::channel('api')->error('Password generation failed', [
                'error' => $e->getMessage(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate passwords',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Display the vocabulary words generator page
     */
    public function vocabulary(): Response
    {
        return Inertia::render('Vocabulary');
    }

    /**
     * Generate random vocabulary words via API
     */
    public function generateVocabulary(Request $request)
    {
        $startTime = microtime(true);
        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:100',
            ]);

            $quantity = $request->get('quantity', 10);

            // Load vocabulary data
            $filePath = storage_path('data/vocabulary.json');

            if (!file_exists($filePath)) {
                throw new \Exception('Vocabulary data file not found');
            }

            $vocabulary = json_decode(file_get_contents($filePath), true);

            if (empty($vocabulary)) {
                throw new \Exception('No vocabulary data available');
            }

            // Shuffle and select random vocabulary words
            shuffle($vocabulary);
            $selectedWords = array_slice($vocabulary, 0, $quantity);

            $endTime = microtime(true);
            Log::channel('api')->info('Vocabulary generation completed', [
                'words_count' => count($selectedWords),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'words' => $selectedWords,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Vocabulary generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Vocabulary generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate vocabulary words',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Display the motivational quotes page
     */
    public function motivationalQuote(): Response
    {
        return Inertia::render('MotivationalQuotes');
    }

    /**
     * Display the Bible verse generator page
     */
    public function bibleVerse(): Response
    {
        return Inertia::render('BibleVerses');
    }

    /**
     * Show the random facts generator page
     */
    public function fact(): Response
    {
        return Inertia::render('RandomFacts');
    }

    /**
     * Show the interview questions generator page
     */
    public function interviewQuestion(): Response
    {
        return Inertia::render('InterviewQuestions');
    }

    /**
     * Show the tongue twisters generator page
     */
    public function tongueTwisters(): Response
    {
        return Inertia::render('TongueTwisters');
    }

    /**
     * Generate random motivational quotes
     */
    public function generateMotivationalQuotes(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:50'
            ]);

            $quantity = (int) $request->input('quantity');

            Log::channel('api')->info('Motivational quotes generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load motivational quotes data
            $filePath = storage_path('data/motivational-quotes.json');

            if (!file_exists($filePath)) {
                throw new \Exception('Motivational quotes data file not found');
            }

            $quotesData = json_decode(file_get_contents($filePath), true);

            // Handle both direct array and wrapped in "data" key
            $quotes = isset($quotesData['data']) ? $quotesData['data'] : $quotesData;

            if (empty($quotes)) {
                throw new \Exception('No motivational quotes data available');
            }

            // Shuffle and select random quotes
            shuffle($quotes);
            $selectedQuotes = array_slice($quotes, 0, $quantity);

            // Format quotes for display (handle legacy format)
            $formattedQuotes = array_map(function($quote) {
                if (isset($quote['inspirational_quote'])) {
                    // Legacy format - just return the cleaned text as-is
                    $text = $quote['inspirational_quote'];
                    $cleanText = strip_tags($text);
                    return ['quote' => $cleanText];
                } else {
                    // Standard format
                    return $quote;
                }
            }, $selectedQuotes);

            $endTime = microtime(true);
            Log::channel('api')->info('Motivational quotes generation completed', [
                'quotes_count' => count($selectedQuotes),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'quotes' => $formattedQuotes,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Motivational quotes generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Motivational quotes generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate motivational quotes',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random Bible verses
     */
    public function generateBibleVerses(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20'
            ]);

            $quantity = (int) $request->input('quantity');

            Log::channel('api')->info('Bible verses generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load Bible verses data
            $filePath = storage_path('data/bible_verses.json');

            if (!file_exists($filePath)) {
                throw new \Exception('Bible verses data file not found');
            }

            $verses = json_decode(file_get_contents($filePath), true);

            if (empty($verses)) {
                throw new \Exception('No Bible verses data available');
            }

            // Shuffle and select random verses
            shuffle($verses);
            $selectedVerses = array_slice($verses, 0, $quantity);

            // Format verses for display
            $formattedVerses = array_map(function($verse) {
                return [
                    'value' => $verse['text'],
                    'definition' => $verse['verse']
                ];
            }, $selectedVerses);

            $endTime = microtime(true);
            Log::channel('api')->info('Bible verses generation completed', [
                'verses_count' => count($formattedVerses),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'verses' => $formattedVerses,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Bible verses generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Bible verses generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate Bible verses',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random facts
     */
    public function generateFacts(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20'
            ]);

            $quantity = (int) $request->input('quantity');

            Log::channel('api')->info('Facts generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load facts data
            $filePath = storage_path('data/facts.json');

            if (!file_exists($filePath)) {
                throw new \Exception('Facts data file not found');
            }

            $factsData = json_decode(file_get_contents($filePath), true);

            // Handle both formats: direct array or wrapped in "data" key
            $facts = isset($factsData['data']) ? $factsData['data'] : $factsData;

            if (empty($facts)) {
                throw new \Exception('No facts data available');
            }

            // Shuffle and select random facts
            shuffle($facts);
            $selectedFacts = array_slice($facts, 0, $quantity);

            // Format facts for display
            $formattedFacts = array_map(function($fact) {
                return $fact['fact'] . (isset($fact['source_url']) ? "\n\nSource: <a href=\"" . $fact['source_url'] . "\" rel=\"nofollow noreferrer\" target=\"_blank\" class=\"text-blue-600 hover:text-blue-700 underline break-words\">" . $fact['source_url'] . "</a>" : '');
            }, $selectedFacts);

            $endTime = microtime(true);
            Log::channel('api')->info('Facts generation completed', [
                'facts_count' => count($formattedFacts),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'facts' => $formattedFacts,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Facts generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Facts generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate facts',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random gift ideas via API
     */
    public function generateGiftIdeas(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20',
                'category' => 'nullable|integer|min:0|max:127'
            ]);

            $quantity = (int) $request->input('quantity');
            $category = (int) $request->input('category', 0); // 0 = Anyone

            Log::channel('api')->info('Gift ideas generation started', [
                'quantity' => $quantity,
                'category' => $category,
                'ip' => $request->ip(),
            ]);

            // Load gift ideas data
            $filePath = storage_path('data/gift-ideas.json');

            if (!file_exists($filePath)) {
                throw new \Exception('Gift ideas data file not found');
            }

            $giftData = json_decode(file_get_contents($filePath), true);

            // Handle both formats: direct array or wrapped in "data" key
            $gifts = isset($giftData['data']) ? $giftData['data'] : $giftData;

            if (empty($gifts)) {
                throw new \Exception('No gift ideas data available');
            }

            // Filter by category if specified (using bitwise AND like the legacy version)
            if ($category > 0) {
                $gifts = array_filter($gifts, function($gift) use ($category) {
                    return isset($gift['category']) && ($gift['category'] & $category);
                });
            }

            if (empty($gifts)) {
                throw new \Exception('No gift ideas found for the selected category');
            }

            // Shuffle and select random gifts
            shuffle($gifts);
            $selectedGifts = array_slice($gifts, 0, min($quantity, count($gifts)));

            // Format gifts for display (extract just the text)
            $formattedGifts = array_map(function($gift) {
                return $gift['text'];
            }, $selectedGifts);

            $endTime = microtime(true);
            Log::channel('api')->info('Gift ideas generation completed', [
                'gifts_count' => count($formattedGifts),
                'category' => $category,
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'gifts' => $formattedGifts,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Gift ideas generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Gift ideas generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate gift ideas',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random dinner ideas via API
     */
    public function generateDinnerIdeas(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20'
            ]);

            $quantity = (int) $request->input('quantity');

            Log::channel('api')->info('Dinner ideas generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load dinner ideas data
            $filePath = storage_path('data/dinner-ideas.json');

            if (!file_exists($filePath)) {
                throw new \Exception('Dinner ideas data file not found');
            }

            $dinnerData = json_decode(file_get_contents($filePath), true);

            // Handle both formats: direct array or wrapped in "data" key
            $dinners = isset($dinnerData['data']) ? $dinnerData['data'] : $dinnerData;

            if (empty($dinners)) {
                throw new \Exception('No dinner ideas data available');
            }

            // Shuffle and select random dinner ideas
            shuffle($dinners);
            $selectedDinners = array_slice($dinners, 0, min($quantity, count($dinners)));

            // Return full dinner objects (no formatting needed for image display)
            $endTime = microtime(true);
            Log::channel('api')->info('Dinner ideas generation completed', [
                'dinners_count' => count($selectedDinners),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'dinners' => $selectedDinners,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Dinner ideas generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Dinner ideas generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate dinner ideas',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random breakfast ideas
     */
    public function generateBreakfastIdeas(Request $request)
    {
        $startTime = microtime(true);
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20'
            ]);
            $quantity = (int) $request->input('quantity');

            Log::channel('api')->info('Breakfast ideas generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load breakfast ideas data
            $filePath = storage_path('data/breakfast-ideas.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Breakfast ideas data file not found');
            }

            $breakfastData = json_decode(file_get_contents($filePath), true);

            // Handle both formats: direct array or wrapped in "data" key
            $breakfasts = isset($breakfastData['data']) ? $breakfastData['data'] : $breakfastData;

            if (empty($breakfasts)) {
                throw new \Exception('No breakfast ideas data available');
            }

            // Shuffle and select random breakfast ideas
            shuffle($breakfasts);
            $selectedBreakfasts = array_slice($breakfasts, 0, min($quantity, count($breakfasts)));

            // Return full breakfast objects (no formatting needed for image display)
            $endTime = microtime(true);
            Log::channel('api')->info('Breakfast ideas generation completed', [
                'breakfasts_count' => count($selectedBreakfasts),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'breakfasts' => $selectedBreakfasts,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Breakfast ideas generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Breakfast ideas generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate breakfast ideas',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random wedding hashtags
     */
    public function generateWeddingHashtags(Request $request)
    {
        $startTime = microtime(true);
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20',
                'date' => 'required|date',
                'types' => 'required|array|min:1',
                'types.*' => 'in:traditional,fun,offbeat',
                'yourFirstName' => 'required|string|max:50',
                'yourLastName' => 'required|string|max:50',
                'fianceFirstName' => 'required|string|max:50',
                'fianceLastName' => 'required|string|max:50'
            ]);

            $quantity = (int) $request->input('quantity');
            $date = $request->input('date');
            $types = $request->input('types');
            $yourFirstName = trim($request->input('yourFirstName'));
            $yourLastName = trim($request->input('yourLastName'));
            $fianceFirstName = trim($request->input('fianceFirstName'));
            $fianceLastName = trim($request->input('fianceLastName'));

            Log::channel('api')->info('Wedding hashtags generation started', [
                'quantity' => $quantity,
                'types' => $types,
                'ip' => $request->ip(),
            ]);

            // Load wedding hashtag templates
            $filePath = storage_path('data/wedding-hashtags.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Wedding hashtag templates not found');
            }

            $templatesData = json_decode(file_get_contents($filePath), true);
            $templates = $templatesData['templates'] ?? [];

            if (empty($templates)) {
                throw new \Exception('No wedding hashtag templates available');
            }

            // Parse date
            $dateObj = \DateTime::createFromFormat('Y-m-d', $date);
            if (!$dateObj) {
                throw new \Exception('Invalid date format');
            }

            $day = $dateObj->format('d');
            $month = $dateObj->format('M');
            $year = $dateObj->format('Y');

            // Collect templates from selected types
            $availableTemplates = [];
            foreach ($types as $type) {
                if (isset($templates[$type])) {
                    $availableTemplates = array_merge($availableTemplates, $templates[$type]);
                }
            }

            if (empty($availableTemplates)) {
                throw new \Exception('No templates found for selected types');
            }

            // Generate hashtags by replacing variables
            $generatedHashtags = [];
            foreach ($availableTemplates as $template) {
                $hashtag = $template;
                $hashtag = str_replace('%first1%', $yourFirstName, $hashtag);
                $hashtag = str_replace('%first2%', $fianceFirstName, $hashtag);
                $hashtag = str_replace('%last1%', $yourLastName, $hashtag);
                $hashtag = str_replace('%last2%', $fianceLastName, $hashtag);
                $hashtag = str_replace('%day%', $day, $hashtag);
                $hashtag = str_replace('%month%', $month, $hashtag);
                $hashtag = str_replace('%year%', $year, $hashtag);

                $generatedHashtags[] = '#' . $hashtag;
            }

            // Shuffle and select random hashtags
            shuffle($generatedHashtags);
            $selectedHashtags = array_slice($generatedHashtags, 0, min($quantity, count($generatedHashtags)));

            $endTime = microtime(true);
            Log::channel('api')->info('Wedding hashtags generation completed', [
                'hashtags_count' => count($selectedHashtags),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'hashtags' => $selectedHashtags,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Wedding hashtags generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Wedding hashtags generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate wedding hashtags',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random interview questions
     */
    public function generateInterviewQuestions(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20'
            ]);

            $quantity = (int) $request->input('quantity');

            Log::channel('api')->info('Interview questions generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load interview questions data
            $filePath = storage_path('data/interview-questions.json');

            if (!file_exists($filePath)) {
                throw new \Exception('Interview questions data file not found');
            }

            $questionsData = json_decode(file_get_contents($filePath), true);

            // Handle both formats: direct array or wrapped in "data" key
            $questions = isset($questionsData['data']) ? $questionsData['data'] : $questionsData;

            if (empty($questions)) {
                throw new \Exception('No interview questions data available');
            }

            // Shuffle and select random questions
            shuffle($questions);
            $selectedQuestions = array_slice($questions, 0, $quantity);

            // Format questions for display
            $formattedQuestions = array_map(function($question) {
                return $question['question'];
            }, $selectedQuestions);

            $endTime = microtime(true);
            Log::channel('api')->info('Interview questions generation completed', [
                'questions_count' => count($formattedQuestions),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'questions' => $formattedQuestions,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Interview questions generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Interview questions generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate interview questions',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random tongue twisters
     */
    public function generateTongueTwisters(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20'
            ]);

            $quantity = (int) $request->input('quantity');

            Log::channel('api')->info('Tongue twisters generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load tongue twisters data
            $filePath = storage_path('data/tongue-twisters.json');

            if (!file_exists($filePath)) {
                throw new \Exception('Tongue twisters data file not found');
            }

            $twistersData = json_decode(file_get_contents($filePath), true);

            // Handle both formats: direct array or wrapped in "data" key
            $twisters = isset($twistersData['data']) ? $twistersData['data'] : $twistersData;

            if (empty($twisters)) {
                throw new \Exception('No tongue twisters data available');
            }

            // Shuffle and select random tongue twisters
            shuffle($twisters);
            $selectedTwisters = array_slice($twisters, 0, $quantity);

            // Format tongue twisters for display
            $formattedTwisters = array_map(function($twister) {
                return $twister['tongue_twister'];
            }, $selectedTwisters);

            $endTime = microtime(true);
            Log::channel('api')->info('Tongue twisters generation completed', [
                'twisters_count' => count($formattedTwisters),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'tongueTwisters' => $formattedTwisters,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Tongue twisters generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Tongue twisters generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate tongue twisters',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Show the yes/no generator page
     */
    public function yesNo(): Response
    {
        return Inertia::render('YesNo');
    }

    /**
     * Show the pictionary page
     */
    public function pictionary(): Response
    {
        return Inertia::render('Pictionary');
    }

    /**
     * Show the random questions page
     */
    public function question(): Response
    {
        return Inertia::render('Questions');
    }

    /**
     * Show the coin flip page
     */
    public function coinFlip(): Response
    {
        return Inertia::render('CoinFlip');
    }

    /**
     * Show the dice roll page
     */
    public function diceRoll(): Response
    {
        return Inertia::render('DiceRoll');
    }

    /**
     * Show the never have I ever questions page
     */
    public function neverHaveIEver(): Response
    {
        return Inertia::render('NeverHaveIEver');
    }

    /**
     * Show the would you rather questions page
     */
    public function wouldYouRather(): Response
    {
        return Inertia::render('WouldYouRather');
    }

    /**
     * Show the truth or dare questions page
     */
    public function truthOrDare(): Response
    {
        return Inertia::render('TruthOrDare');
    }

    /**
     * Show the decision generator page
     */
    public function decision(): Response
    {
        return Inertia::render('Decision');
    }

    /**
     * Show the charades page
     */
    public function charades(): Response
    {
        return Inertia::render('Charades');
    }

    /**
     * Show the hangman words page
     */
    public function hangman(): Response
    {
        return Inertia::render('Hangman');
    }

    /**
     * Generate random pictionary words
     */
    public function generatePictionary(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20',
                'gameType' => 'sometimes|string|in:pictionary,catchphrase,holidays,charades,subjects,get-to-know-you,wordplay,movies,individuals',
                'difficulty' => 'sometimes|string'
            ]);

            $quantity = (int)$request->input('quantity');
            $gameType = $request->input('gameType', 'pictionary');
            $difficulty = $request->input('difficulty', 'easy');

            Log::channel('api')->info('Pictionary generation started', [
                'quantity' => $quantity,
                'gameType' => $gameType,
                'difficulty' => $difficulty,
                'ip' => $request->ip(),
            ]);

            // Map all game types to their legacy files
            $legacyMappings = [
                'pictionary' => [
                    'easy' => 'pictionary_easy.json',
                    'medium' => 'pictionary_medium.json',
                    'hard' => 'pictionary_hard.json',
                    'really_hard' => 'pictionary_really_hard.json',
                ],
                'catchphrase' => [
                    'easy' => 'catchphrase_easy.json',
                    'medium' => 'catchphrase_medium.json',
                    'hard' => 'catchphrase_hard.json',
                ],
                'charades' => [
                    'easy' => 'charades_easy.json',
                    'medium' => 'charades_medium.json',
                    'hard' => 'charades_hard.json',
                    'really_hard' => 'charades_really_hard.json',
                    'actions' => 'charades_actions.json',
                ],
                'holidays' => [
                    'valentines_day' => 'holidays_valentines_day.json',
                    'fourth_of_july' => 'holidays_fourth_of_july.json',
                    'halloween' => 'holidays_halloween.json',
                    'thanksgiving' => 'holidays_thanksgiving.json',
                    'christmas' => 'holidays_christmas.json',
                    'christmas_songs' => 'holidays_christmas_songs.json',
                    'spring' => 'holidays_spring.json',
                    'new_years' => 'holidays_new_years.json',
                    'winter' => 'holidays_winter.json',
                    'summer' => 'holidays_summer.json',
                    'fall' => 'holidays_fall.json',
                    'summer_olympics' => 'holidays_summer_olympics.json',
                ],
                'subjects' => [
                    'animals' => 'subjects_animals.json',
                    'food_and_cooking' => 'subjects_food_and_cooking.json',
                    'people' => 'subjects_people.json',
                    'places' => 'subjects_places.json',
                    'around_the_house' => 'subjects_around_the_house.json',
                    'around_the_office' => 'subjects_around_the_office.json',
                    'art' => 'subjects_art.json',
                    'colors' => 'subjects_colors.json',
                    'common_animals' => 'subjects_common_animals.json',
                    'dog_breeds' => 'subjects_dog_breeds.json',
                    'english_literature' => 'subjects_english_literature.json',
                    'feelings_and_emotions' => 'subjects_feelings_and_emotions.json',
                    'math' => 'subjects_math.json',
                    'music' => 'subjects_music.json',
                    'nature' => 'subjects_nature.json',
                    'science' => 'subjects_science.json',
                    'sports' => 'subjects_sports.json',
                    'travel' => 'subjects_travel.json',
                    'categories' => 'subjects_categories.json',
                ],
                'get-to-know-you' => [
                    'light_questions' => 'get_to_know_you_light_questions.json',
                    'moderate_questions' => 'get_to_know_you_moderate_questions.json',
                    'in_depth_questions' => 'get_to_know_you_in_depth_questions.json',
                    'qualities_traits_experiences' => 'get_to_know_you_qualities_traits_experiences.json',
                    'questions_for_youngsters' => 'get_to_know_you_questions_for_youngsters.json',
                    'this_or_that' => 'get_to_know_you_this_or_that.json',
                ],
                'wordplay' => [
                    'adjectives' => 'wordplay_adjectives.json',
                    'adverbs' => 'wordplay_adverbs.json',
                    'idioms_and_sayings' => 'wordplay_idioms_and_sayings.json',
                    'nouns' => 'wordplay_nouns.json',
                    'opposites' => 'wordplay_opposites.json',
                    'pairs' => 'wordplay_pairs.json',
                    'rhyming_opposite_sets' => 'wordplay_rhyming_opposite_sets.json',
                    'trios' => 'wordplay_trios.json',
                    'verbs' => 'wordplay_verbs.json',
                ],
                'movies' => [
                    'animal_movies' => 'movies_animal_movies.json',
                    'animated_movies' => 'movies_animated_movies.json',
                    'comedies' => 'movies_comedies.json',
                    'disney_and_pixar_movies' => 'movies_disney_and_pixar_movies.json',
                    'dramas' => 'movies_dramas.json',
                    'family_movies' => 'movies_family_movies.json',
                    'fantasy_movies' => 'movies_fantasy_movies.json',
                    'historical_movies' => 'movies_historical_movies.json',
                    'live_action_movies' => 'movies_live_action_movies.json',
                    'movies_older_than_1970' => 'movies_movies_older_than_1970.json',
                    'music_movies' => 'movies_music_movies.json',
                    'sci_fi_movies' => 'movies_sci_fi_movies.json',
                    'remakes_spinoffs_sequels_and_parodies' => 'movies_remakes_spinoffs_sequels_and_parodies.json',
                    'all_movies' => 'movies_all_movies.json',
                ],
                'individuals' => [
                    'celebrities' => 'individuals_celebrities.json',
                    'characters' => 'individuals_characters.json',
                    'historical_people' => 'individuals_historical_people.json',
                ],
            ];

            // Check if we have a legacy mapping for this game type and difficulty
            if (isset($legacyMappings[$gameType]) && isset($legacyMappings[$gameType][$difficulty])) {
                $legacyFile = $legacyMappings[$gameType][$difficulty];
                $filePath = storage_path('data/pictionary/' . $legacyFile);

                if (!file_exists($filePath)) {
                    throw new \Exception('Legacy data file not found: ' . $legacyFile);
                }

                $gameData = json_decode(file_get_contents($filePath), true);
                $words = array_map(function ($word) {
                    return ['word' => $word];
                }, $gameData['words'] ?? []);
            } else {
                throw new \Exception('Invalid game type or difficulty combination');
            }

            if (empty($words)) {
                throw new \Exception('No words available for the selected game type and difficulty');
            }

            // Shuffle and select random words
            shuffle($words);
            $selectedWords = array_slice($words, 0, $quantity);

            $endTime = microtime(true);
            Log::channel('api')->info('Pictionary generation completed', [
                'words_count' => count($selectedWords),
                'gameType' => $gameType,
                'difficulty' => $difficulty,
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'pictionary' => $selectedWords,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Pictionary generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Pictionary generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Failed to generate pictionary words',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random questions
     */
    public function generateQuestions(Request $request)
    {
        $startTime = microtime(true);
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:50'
            ]);

            $quantity = (int)$request->input('quantity');

            Log::channel('api')->info('Questions generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load questions data
            $filePath = storage_path('data/questions.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Questions data file not found');
            }

            $questionsData = json_decode(file_get_contents($filePath), true);
            $allQuestions = $questionsData['data'] ?? [];

            if (empty($allQuestions)) {
                throw new \Exception('No questions available');
            }

            // Shuffle and select random questions
            shuffle($allQuestions);
            $selectedQuestions = array_slice($allQuestions, 0, $quantity);

            $endTime = microtime(true);
            $executionTime = round(($endTime - $startTime) * 1000, 2);

            Log::channel('api')->info('Questions generation completed', [
                'quantity' => $quantity,
                'execution_time' => $executionTime . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'questions' => array_column($selectedQuestions, 'question'),
                'execution_time' => $executionTime . 'ms',
                'success' => true,
            ]);

        } catch (\Exception $e) {
            $endTime = microtime(true);

            Log::channel('api')->error('Questions generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Failed to generate questions',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random Never Have I Ever questions
     */
    public function generateNeverHaveIEver(Request $request)
    {
        $startTime = microtime(true);
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20',
                'category' => 'sometimes|string|in:all,entertainment,funny,good_questions,for_kids,embarrassing,gross,food,rule_breaking,drinking,dirty'
            ]);

            $quantity = (int)$request->input('quantity');
            $category = $request->input('category', 'all');

            Log::channel('api')->info('Never Have I Ever generation started', [
                'quantity' => $quantity,
                'category' => $category,
                'ip' => $request->ip(),
            ]);

            // Load Never Have I Ever data
            $filePath = storage_path('data/never-have-i-ever.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Never Have I Ever data file not found');
            }

            $neverHaveIEverData = json_decode(file_get_contents($filePath), true);
            $allCategories = $neverHaveIEverData['data'] ?? [];

            if (empty($allCategories)) {
                throw new \Exception('No Never Have I Ever questions available');
            }

            $selectedQuestions = [];

            if ($category === 'all') {
                // Combine all categories
                $allQuestions = [];
                foreach ($allCategories as $categoryName => $questions) {
                    foreach ($questions as $question) {
                        $allQuestions[] = $question;
                    }
                }

                // Shuffle and select random questions
                shuffle($allQuestions);
                $selectedQuestions = array_slice($allQuestions, 0, $quantity);
            } else {
                // Select from specific category
                $categoryQuestions = $allCategories[$category] ?? [];

                if (empty($categoryQuestions)) {
                    throw new \Exception('No questions available for the selected category');
                }

                // Shuffle and select random questions from category
                shuffle($categoryQuestions);
                $selectedQuestions = array_slice($categoryQuestions, 0, $quantity);
            }

            $endTime = microtime(true);

            Log::channel('api')->info('Never Have I Ever generation completed', [
                'questions_count' => count($selectedQuestions),
                'category' => $category,
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'questions' => $selectedQuestions,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Never Have I Ever generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Never Have I Ever generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate Never Have I Ever questions',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random Would You Rather questions
     */
    public function generateWouldYouRather(Request $request)
    {
        $startTime = microtime(true);
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20'
            ]);

            $quantity = (int)$request->input('quantity');

            Log::channel('api')->info('Would You Rather generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load Would You Rather data
            $filePath = storage_path('data/question-would-you-rather.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Would You Rather data file not found');
            }

            $wouldYouRatherData = json_decode(file_get_contents($filePath), true);
            $allQuestions = $wouldYouRatherData['data']['all'] ?? [];

            if (empty($allQuestions)) {
                throw new \Exception('No Would You Rather questions available');
            }

            // Shuffle and select random questions
            shuffle($allQuestions);
            $selectedQuestions = array_slice($allQuestions, 0, $quantity);

            $endTime = microtime(true);

            Log::channel('api')->info('Would You Rather generation completed', [
                'questions_count' => count($selectedQuestions),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'questions' => $selectedQuestions,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Would You Rather generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Invalid request parameters',
                'success' => false,
            ], 422);

        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Would You Rather generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Failed to generate Would You Rather questions',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random truth or dare questions
     */
    public function generateTruthOrDare(Request $request)
    {
        $startTime = microtime(true);
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20',
                'questionType' => 'sometimes|string|in:any,truth,dare,both'
            ]);

            $quantity = (int)$request->input('quantity');
            $questionType = $request->input('questionType', 'any');

            Log::channel('api')->info('Truth or Dare generation started', [
                'quantity' => $quantity,
                'questionType' => $questionType,
                'ip' => $request->ip(),
            ]);

            // Load truth or dare data
            $filePath = storage_path('data/truth-or-dare.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Truth or Dare data file not found');
            }

            $truthOrDareData = json_decode(file_get_contents($filePath), true);
            $truths = $truthOrDareData['data']['truths'] ?? [];
            $dares = $truthOrDareData['data']['dares'] ?? [];

            if (empty($truths) || empty($dares)) {
                throw new \Exception('No truth or dare questions available');
            }

            $selectedQuestions = [];

            switch ($questionType) {
                case 'truth':
                    // Only truth questions
                    shuffle($truths);
                    $selectedQuestions = array_slice($truths, 0, $quantity);
                    // Add type label to each question
                    foreach ($selectedQuestions as &$question) {
                        $question['type'] = 'Truth';
                    }
                    break;

                case 'dare':
                    // Only dare questions
                    shuffle($dares);
                    $selectedQuestions = array_slice($dares, 0, $quantity);
                    // Add type label to each question
                    foreach ($selectedQuestions as &$question) {
                        $question['type'] = 'Dare';
                    }
                    break;

                case 'both':
                    // One truth and one dare (ignore quantity for this mode)
                    shuffle($truths);
                    shuffle($dares);
                    $selectedQuestions = [
                        array_merge($truths[0], ['type' => 'Truth']),
                        array_merge($dares[0], ['type' => 'Dare'])
                    ];
                    break;

                case 'any':
                default:
                    // Random mix of truths and dares
                    $allQuestions = [];

                    // Add type labels to questions
                    foreach ($truths as $truth) {
                        $allQuestions[] = array_merge($truth, ['type' => 'Truth']);
                    }
                    foreach ($dares as $dare) {
                        $allQuestions[] = array_merge($dare, ['type' => 'Dare']);
                    }

                    // Shuffle all questions and select
                    shuffle($allQuestions);
                    $selectedQuestions = array_slice($allQuestions, 0, $quantity);
                    break;
            }

            $endTime = microtime(true);

            Log::channel('api')->info('Truth or Dare generation completed', [
                'questions_count' => count($selectedQuestions),
                'questionType' => $questionType,
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'questions' => $selectedQuestions,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Truth or Dare generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Truth or Dare generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate truth or dare questions',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random charades words
     */
    public function generateCharades(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20',
                'difficulty' => 'sometimes|string|in:easy,medium,hard,really_hard,actions'
            ]);

            $quantity = (int)$request->input('quantity');
            $difficulty = $request->input('difficulty', 'easy');

            Log::channel('api')->info('Charades generation started', [
                'quantity' => $quantity,
                'difficulty' => $difficulty,
                'ip' => $request->ip(),
            ]);

            // Load charades data
            $filePath = storage_path('data/charades.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Charades data file not found');
            }

            $charadesData = json_decode(file_get_contents($filePath), true);

            // Get words for the specified difficulty
            $words = $charadesData['data'][$difficulty] ?? [];

            if (empty($words)) {
                throw new \Exception('No charades words available for the selected difficulty');
            }

            // Shuffle and select random words
            shuffle($words);
            $selectedWords = array_slice($words, 0, $quantity);

            $endTime = microtime(true);
            Log::channel('api')->info('Charades generation completed', [
                'words_count' => count($selectedWords),
                'difficulty' => $difficulty,
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'charades' => $selectedWords,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Charades generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Charades generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Failed to generate charades words',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random hangman words
     */
    public function generateHangman(Request $request)
    {
        $startTime = microtime(true);
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20'
            ]);

            $quantity = (int)$request->input('quantity');

            Log::channel('api')->info('Hangman generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load hangman data
            $filePath = storage_path('data/hangman.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Hangman data file not found');
            }

            $hangmanData = json_decode(file_get_contents($filePath), true);
            $words = $hangmanData['data'] ?? [];

            if (empty($words)) {
                throw new \Exception('No hangman words available');
            }

            // Shuffle and select random words
            shuffle($words);
            $selectedWords = array_slice($words, 0, $quantity);

            $endTime = microtime(true);

            Log::channel('api')->info('Hangman generation completed', [
                'words_count' => count($selectedWords),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'hangman' => $selectedWords,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Hangman generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Hangman generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate hangman words',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random drawing ideas via API
     */
    public function generateDrawingIdeas(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:50',
            ]);

            $quantity = $request->get('quantity', 3);

            // Log API request
            Log::channel('api')->info('Drawing ideas generation request', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $filePath = storage_path('data/drawing_ideas.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Drawing ideas data file not found');
            }

            $drawingData = json_decode(file_get_contents($filePath), true);
            $ideas = $drawingData['data'] ?? [];

            if (empty($ideas)) {
                throw new \Exception('No drawing ideas available');
            }

            // Shuffle and select random ideas
            shuffle($ideas);
            $selectedIdeas = array_slice($ideas, 0, $quantity);

            // Transform the data to match expected format
            $transformedIdeas = array_map(function($item) {
                if (isset($item['drawing'])) {
                    return [
                        'value' => $item['drawing']['value'],
                        'image_url' => $item['drawing']['image_url'] ?? null
                    ];
                }
                return $item;
            }, $selectedIdeas);

            $endTime = microtime(true);

            Log::channel('api')->info('Drawing ideas generation completed', [
                'ideas_count' => count($transformedIdeas),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'drawing_ideas' => $transformedIdeas,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Drawing ideas generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Drawing ideas generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate drawing ideas',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random coloring pages via API
     */
    public function generateColoringPages(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:50',
            ]);

            $quantity = $request->get('quantity', 3);

            // Log API request
            Log::channel('api')->info('Coloring pages generation request', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $filePath = storage_path('data/coloring-pages.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Coloring pages data file not found');
            }

            $coloringData = json_decode(file_get_contents($filePath), true);
            $pages = $coloringData['data'] ?? [];

            if (empty($pages)) {
                throw new \Exception('No coloring pages available');
            }

            // Shuffle and select random pages
            shuffle($pages);
            $selectedPages = array_slice($pages, 0, $quantity);

            // Transform the data to match expected format
            $transformedPages = array_map(function($item) {
                if (isset($item['drawing'])) {
                    return [
                        'value' => $item['drawing']['value'],
                        'image_url' => $item['drawing']['image_url'] ?? null
                    ];
                }
                return $item;
            }, $selectedPages);

            $endTime = microtime(true);

            Log::channel('api')->info('Coloring pages generation completed', [
                'pages_count' => count($transformedPages),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'coloring_pages' => $transformedPages,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Coloring pages generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Coloring pages generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate coloring pages',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random pictures via API
     */
    public function generatePictures(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:50',
            ]);

            $quantity = $request->get('quantity', 3);

            // Log API request
            Log::channel('api')->info('Pictures generation request', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $filePath = storage_path('data/pictures.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Pictures data file not found');
            }

            $picturesData = json_decode(file_get_contents($filePath), true);
            $allPictures = $picturesData['data'] ?? [];

            if (empty($allPictures)) {
                throw new \Exception('No pictures available');
            }

            // Shuffle and select random pictures
            shuffle($allPictures);
            $selectedPictures = array_slice($allPictures, 0, $quantity);

            $endTime = microtime(true);

            Log::channel('api')->info('Pictures generation completed', [
                'pictures_count' => count($selectedPictures),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'pictures' => $selectedPictures,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Pictures generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Pictures generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate pictures',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random letter sequences via API
     */
    public function generateLetterSequences(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:50',
                'sequence_length' => 'integer|min:1|max:26',
                'include_uppercase' => 'boolean',
                'include_lowercase' => 'boolean',
                'language' => 'string|in:English,Armenian,Chinese,French,German,Japanese,Russian,Spanish'
            ]);

            $quantity = $request->get('quantity', 3);
            $sequenceLength = $request->get('sequence_length', 5);
            $includeUppercase = $request->get('include_uppercase', true);
            $includeLowercase = $request->get('include_lowercase', true);
            $language = $request->get('language', 'English');

            // Log API request
            Log::channel('api')->info('Letter sequences generation request', [
                'quantity' => $quantity,
                'sequence_length' => $sequenceLength,
                'include_uppercase' => $includeUppercase,
                'include_lowercase' => $includeLowercase,
                'language' => $language,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $filePath = storage_path('data/letters-multilang.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Letter sequence data file not found');
            }

            $letterData = json_decode(file_get_contents($filePath), true);
            $allLetters = $letterData[$language] ?? [];

            if (empty($allLetters)) {
                throw new \Exception('No letters available');
            }

            // Filter letters based on case preferences
            $availableLetters = [];
            foreach ($allLetters as $letterObj) {
                $letter = $letterObj['letter'];

                // For languages without case distinctions or with special handling
                if ($language === 'Chinese' || $language === 'Japanese' || $language === 'Armenian') {
                    $availableLetters[] = $letter;
                } else {
                    // For languages with case distinctions - use mb_strtoupper to handle UTF-8
                    $isUppercase = ($letter === mb_strtoupper($letter, 'UTF-8')) && ($letter !== mb_strtolower($letter, 'UTF-8'));
                    $isLowercase = ($letter === mb_strtolower($letter, 'UTF-8')) && ($letter !== mb_strtoupper($letter, 'UTF-8'));

                    if ($includeUppercase && $isUppercase) {
                        $availableLetters[] = $letter;
                    } elseif ($includeLowercase && $isLowercase) {
                        $availableLetters[] = $letter;
                    }
                }
            }

            if (empty($availableLetters)) {
                throw new \Exception('No letters available for selected options');
            }

            // Generate sequences
            $sequences = [];
            for ($i = 0; $i < $quantity; $i++) {
                $sequence = '';
                for ($j = 0; $j < $sequenceLength; $j++) {
                    $randomLetter = $availableLetters[array_rand($availableLetters)];
                    $sequence .= $randomLetter . ' ';
                }
                $sequences[] = ['sequence' => trim($sequence)];
            }

            $endTime = microtime(true);

            Log::channel('api')->info('Letter sequences generation completed', [
                'sequences_count' => count($sequences),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'letter_sequences' => $sequences,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Letter sequences generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Letter sequences generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate letter sequences',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random computer code examples via API
     */
    public function generateComputerCode(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'integer|min:1|max:50',
            ]);

            $quantity = $request->get('quantity', 3);

            // Log API request
            Log::channel('api')->info('Computer code generation request', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $filePath = storage_path('data/computer-code.json');
            if (!file_exists($filePath)) {
                throw new \Exception('Computer code data file not found');
            }

            $codeData = json_decode(file_get_contents($filePath), true);
            $allExamples = $codeData['data'] ?? [];

            if (empty($allExamples)) {
                throw new \Exception('No code examples available');
            }

            // Shuffle and select random examples
            shuffle($allExamples);
            $selectedExamples = array_slice($allExamples, 0, $quantity);

            // Transform the data to match expected format
            $transformedExamples = array_map(function($item) {
                if (isset($item['code'])) {
                    return [
                        'language' => $item['code']['language'],
                        'code' => $item['code']['code'],
                        'description' => $item['code']['description']
                    ];
                }
                return $item;
            }, $selectedExamples);

            $endTime = microtime(true);

            Log::channel('api')->info('Computer code generation completed', [
                'examples_count' => count($transformedExamples),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'code_examples' => $transformedExamples,
                'success' => true,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Computer code generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Computer code generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate computer code',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Display the all generators directory page
     */
    public function allGenerators(): Response
    {
        return Inertia::render('AllGenerators');
    }

    /**
     * Display the make money ideas generator page
     */
    public function makeMoneyIdeas(): Response
    {
        return Inertia::render('MakeMoneyIdeas');
    }

    /**
     * Display the books everyone should read generator page
     */
    public function booksEveryoneShouldRead(): Response
    {
        return Inertia::render('BooksEveryoneShouldRead');
    }

    /**
     * Generate random make money/passive income ideas
     */
    public function generateMakeMoneyIdeas(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:50'
            ]);

            $quantity = (int) $request->input('quantity');

            Log::channel('api')->info('Make money ideas generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load make money ideas data
            $filePath = storage_path('data/make-money.json');

            if (!file_exists($filePath)) {
                throw new \Exception('Make money ideas data file not found');
            }

            $ideasData = json_decode(file_get_contents($filePath), true);

            // Handle both formats: direct array or wrapped in "data" key
            $ideas = isset($ideasData['data']) ? $ideasData['data'] : $ideasData;

            if (empty($ideas)) {
                throw new \Exception('No make money ideas data available');
            }

            // Shuffle and select random ideas
            shuffle($ideas);
            $selectedIdeas = array_slice($ideas, 0, min($quantity, count($ideas)));

            $endTime = microtime(true);
            Log::channel('api')->info('Make money ideas generation completed', [
                'ideas_count' => count($selectedIdeas),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'ideas' => $selectedIdeas,
                'success' => true,
            ]);

        } catch (\Exception $e) {
            Log::channel('api')->error('Make money ideas generation failed', [
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Failed to generate make money ideas',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate random books everyone should read
     */
    public function generateBooksEveryoneShouldRead(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:50'
            ]);

            $quantity = (int) $request->input('quantity');

            Log::channel('api')->info('Books generation started', [
                'quantity' => $quantity,
                'ip' => $request->ip(),
            ]);

            // Load books data
            $filePath = storage_path('data/books-everyone-should-read.json');

            if (!file_exists($filePath)) {
                throw new \Exception('Books data file not found');
            }

            $booksData = json_decode(file_get_contents($filePath), true);

            // Handle both formats: direct array or wrapped in "data" key
            $books = isset($booksData['data']) ? $booksData['data'] : $booksData;

            if (empty($books)) {
                throw new \Exception('No books data available');
            }

            // Shuffle and select random books
            shuffle($books);
            $selectedBooks = array_slice($books, 0, min($quantity, count($books)));

            $endTime = microtime(true);
            Log::channel('api')->info('Books generation completed', [
                'books_count' => count($selectedBooks),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'books' => $selectedBooks,
                'success' => true,
            ]);

        } catch (\Exception $e) {
            Log::channel('api')->error('Books generation failed', [
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'error' => 'Failed to generate books',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}