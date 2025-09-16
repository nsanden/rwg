<?php

namespace App\Http\Controllers;

use App\Models\ForeignWord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;


class RandomWordGeneratorController extends Controller
{
    /**
     * Display the homepage with random word generator
     */
    public function index()
    {
        return Inertia::render('Homepage');
    }

    /**
     * Display the nouns page
     */
    public function noun()
    {
        return Inertia::render('Nouns');
    }

    /**
     * Display the verbs page
     */
    public function verb()
    {
        return Inertia::render('Verbs');
    }

    /**
     * Display the adjectives page
     */
    public function adjective()
    {
        return Inertia::render('Adjectives');
    }

    /**
     * Display the letter generator page
     */
    public function letter()
    {
        return Inertia::render('Letter');
    }

    /**
     * Display the cursive letters generator page
     */
    public function cursiveLetter()
    {
        return Inertia::render('CursiveLetters');
    }

    /**
     * Display the synonyms page
     */
    public function synonym()
    {
        return Inertia::render('Synonyms');
    }

    /**
     * Display the sentence generator page
     */
    public function sentence()
    {
        return Inertia::render('Sentence');
    }

    /**
     * Display the paragraph generator page
     */
    public function paragraph()
    {
        return Inertia::render('Paragraph');
    }

    /**
     * Display the name generator page
     */
    public function name()
    {
        return Inertia::render('Name');
    }

    /**
     * Display the weird words generator page
     */
    public function weirdWord()
    {
        return Inertia::render('WeirdWords');
    }

    /**
     * Display the fake words generator page
     */
    public function fakeWord()
    {
        return Inertia::render('FakeWords');
    }

    /**
     * Display the phrase generator page
     */
    public function phrase()
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
                'quantity' => 'required|integer|min:1|max:100',
                'word_type' => 'sometimes|string|in:all,nouns,verbs,adjectives,adverbs',
                'type' => 'sometimes|string|in:all,nouns,verbs,adjectives,adverbs',
                'language' => 'sometimes|string|in:en,es,fr,de,it,pt',
                'starts_with' => 'sometimes|string|size:1|alpha',
                'ends_with' => 'sometimes|string|size:1|alpha',
                'pattern' => 'sometimes|string|max:20',
                'syllables' => 'sometimes|integer|min:1|max:10',
                'parts_of_speech' => 'sometimes|array',
                'parts_of_speech.*' => 'string|in:noun,verb,adjective,adverb'
            ]);

            $quantity = (int)$request->input('quantity');
            $wordType = $request->input('word_type', $request->input('type', 'all'));
            $language = $request->input('language', 'en');

            // Debug logging
            Log::channel('api')->info('Word generation debug', [
                'wordType' => $wordType,
                'language' => $language,
                'condition_check' => ($language !== 'en' && $wordType !== 'common'),
                'will_use_database' => ($language !== 'en' && $wordType !== 'common')
            ]);
            $startsWith = $request->input('starts_with');
            $endsWith = $request->input('ends_with');
            $pattern = $request->input('pattern');
            $syllables = $request->input('syllables');
            $partsOfSpeech = $request->input('parts_of_speech', []);

            Log::channel('api')->info('Word generation started', [
                'quantity' => $quantity,
                'word_type' => $wordType,
                'language' => $language,
                'starts_with' => $startsWith,
                'ends_with' => $endsWith,
                'pattern' => $pattern,
                'syllables' => $syllables,
                'parts_of_speech' => $partsOfSpeech,
                'ip' => $request->ip(),
            ]);

            // Handle multilingual word generation
            // Force English JSON for 'common' type, otherwise use database for non-English languages
            if ($wordType !== 'common' && $language !== 'en') {
                // Use database for non-English languages
                $availableLanguages = ForeignWord::distinct('language')->pluck('language')->toArray();

                if (!in_array($language, $availableLanguages)) {
                    return response()->json([
                        'success' => false,
                        'error' => "Language '{$language}' is not currently supported. Available languages: " . implode(', ', array_merge(['en'], $availableLanguages))
                    ], 400);
                }

                // Get words from database for foreign language
                $query = ForeignWord::where('language', $language);

                // Apply filters
                if ($startsWith) {
                    $query->where('first_letter', strtolower($startsWith));
                }
                if ($endsWith) {
                    $query->where('last_letter', strtolower($endsWith));
                }
                if ($syllables) {
                    $query->where('syllables', $syllables);
                }
                if ($pattern) {
                    $query->where('word', 'LIKE', str_replace('*', '%', $pattern));
                }

                $totalWords = $query->count();
                if ($totalWords === 0) {
                    throw new \Exception('No words found matching the specified criteria');
                }

                $words = $query->inRandomOrder()->limit($quantity)->pluck('word')->toArray();

                $endTime = microtime(true);
                $responseTime = round(($endTime - $startTime) * 1000, 2);

                Log::channel('api')->info('Foreign word generation completed', [
                    'language' => $language,
                    'count' => count($words),
                    'total_available' => $totalWords,
                    'response_time_ms' => $responseTime,
                    'ip' => $request->ip(),
                ]);

                return response()->json([
                    'success' => true,
                    'data' => $words
                ]);
            }

            // Load English word database from JSON file
            $wordFile = storage_path('data/words_ws.json');
            if (!file_exists($wordFile)) {
                throw new \Exception('Word database not found');
            }

            $wordsData = json_decode(file_get_contents($wordFile), true);
            if (!$wordsData) {
                throw new \Exception('Failed to load word database');
            }

            // Extract words from the nested JSON structure with filtering
            $words = [];
            if (isset($wordsData['data']) && is_array($wordsData['data'])) {
                foreach ($wordsData['data'] as $wordItem) {
                    if (isset($wordItem['word']['value'])) {
                        $word = $wordItem['word']['value'];
                        $numSyllables = $wordItem['word']['numSyllables'] ?? null;

                        // Apply syllables filter if specified
                        if ($syllables && $numSyllables && $numSyllables != $syllables) {
                            continue;
                        }

                        $words[] = $word;
                    }
                }
            }

            // Apply filters
            if ($startsWith) {
                $words = array_filter($words, function ($word) use ($startsWith) {
                    return stripos($word, $startsWith) === 0;
                });
            }

            if ($endsWith) {
                $words = array_filter($words, function ($word) use ($endsWith) {
                    return substr(strtolower($word), -1) === strtolower($endsWith);
                });
            }

            if ($pattern) {
                $words = array_filter($words, function ($word) use ($pattern) {
                    return stripos($word, $pattern) !== false;
                });
            }

            // Shuffle and select
            $words = array_values($words);
            shuffle($words);
            $selectedWords = array_slice($words, 0, $quantity);

            $endTime = microtime(true);
            Log::channel('api')->info('Word generation completed', [
                'words_count' => count($selectedWords),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'data' => $selectedWords
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::channel('api')->warning('Word generation validation failed', [
                'errors' => $e->errors(),
                'input' => $request->all(),
                'ip' => $request->ip(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            Log::channel('api')->error('Word generation failed', [
                'error' => $e->getMessage(),
                'execution_time' => round(($endTime - $startTime) * 1000, 2) . 'ms',
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'error' => 'Failed to generate words',
                'success' => false,
            ], 500);
        }
    }

    /**
     * Generate random adjectives
     */
    public function generateAdjectives(Request $request)
    {
        return $this->generateWords(
            $request->merge(['word_type' => 'adjectives'])
        );
    }

    /**
     * Generate random nouns
     */
    public function generateNouns(Request $request)
    {
        return $this->generateWords(
            $request->merge(['word_type' => 'nouns'])
        );
    }

    /**
     * Generate random verbs
     */
    public function generateVerbs(Request $request)
    {
        return $this->generateWords(
            $request->merge(['word_type' => 'verbs'])
        );
    }

    /**
     * Generate random adverbs
     */
    public function generateAdverbs(Request $request)
    {
        return $this->generateWords(
            $request->merge(['word_type' => 'adverbs'])
        );
    }

    /**
     * Generate random facts
     */
    public function generateFacts(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:10'
            ]);

            $quantity = (int)$request->input('quantity');

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

            // Format facts to match expected output
            $formattedFacts = array_map(function ($fact) {
                return is_array($fact) && isset($fact['fact']) ? $fact['fact'] : $fact;
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
     * Generate random interview questions
     */
    public function generateInterviewQuestions(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:20'
            ]);

            $quantity = (int)$request->input('quantity');

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

            // Format questions to match expected output
            $formattedQuestions = array_map(function ($question) {
                return is_array($question) && isset($question['question']) ? $question['question'] : $question;
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
     * Show the pictionary page
     */
    public function pictionary()
    {
        return Inertia::render('Pictionary');
    }

    /**
     * Show the hangman words page
     */
    public function hangman()
    {
        return Inertia::render('Hangman');
    }

    /**
     * Show the truth or dare questions page
     */
    public function truthOrDare()
    {
        return Inertia::render('TruthOrDare');
    }

    /**
     * Show the never have I ever questions page
     */
    public function neverHaveIEver()
    {
        return Inertia::render('NeverHaveIEver');
    }

    /**
     * Show the charades page
     */
    public function charades()
    {
        return Inertia::render('Charades');
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
     * Show the would you rather questions page
     */
    public function wouldYouRather()
    {
        return Inertia::render('WouldYouRather');
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
     * Show the random questions page
     */
    public function question()
    {
        return Inertia::render('Questions');
    }

    /**
     * Show the dice roll page
     */
    public function diceRoll()
    {
        return Inertia::render('DiceRoll');
    }

    /**
     * Show the coin flip page
     */
    public function coinFlip()
    {
        return Inertia::render('CoinFlip');
    }

    public function number()
    {
        return Inertia::render('Number');
    }

    public function writingPrompt()
    {
        return Inertia::render('WritingPrompts');
    }

    public function vocabulary()
    {
        return Inertia::render('Vocabulary');
    }

    public function motivationalQuote()
    {
        return Inertia::render('MotivationalQuotes');
    }

    public function bibleVerse()
    {
        return Inertia::render('BibleVerses');
    }

    public function fact()
    {
        return Inertia::render('Facts');
    }

    public function interviewQuestion()
    {
        return Inertia::render('InterviewQuestions');
    }

    public function tongueTwisters()
    {
        return Inertia::render('TongueTwisters');
    }

    public function actOfKindness()
    {
        return Inertia::render('ActsOfKindness');
    }


    public function decision()
    {
        return Inertia::render('Decision');
    }

    public function yesNo()
    {
        return Inertia::render('YesNo');
    }

    public function password()
    {
        return Inertia::render('Password');
    }

    /**
     * Generate random passwords
     */
    public function generatePasswords(Request $request)
    {
        $startTime = microtime(true);

        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:100',
                'length' => 'required|integer|min:1|max:100',
                'include_capital' => 'sometimes|boolean',
                'include_lowercase' => 'sometimes|boolean',
                'include_numbers' => 'sometimes|boolean',
                'include_special_chars' => 'sometimes|boolean',
                'selected_special_chars' => 'sometimes|array',
                'selected_special_chars.*' => 'string|max:1'
            ]);

            $quantity = (int)$request->input('quantity');
            $length = (int)$request->input('length');
            $includeCapital = $request->input('include_capital', true);
            $includeLowercase = $request->input('include_lowercase', true);
            $includeNumbers = $request->input('include_numbers', true);
            $includeSpecialChars = $request->input('include_special_chars', true);
            $selectedSpecialChars = $request->input('selected_special_chars', []);

            Log::channel('api')->info('Password generation started', [
                'quantity' => $quantity,
                'length' => $length,
                'include_capital' => $includeCapital,
                'include_lowercase' => $includeLowercase,
                'include_numbers' => $includeNumbers,
                'include_special_chars' => $includeSpecialChars,
                'ip' => $request->ip(),
            ]);

            // Build character pool
            $characters = '';

            if ($includeCapital) {
                $characters .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            }

            if ($includeLowercase) {
                $characters .= 'abcdefghijklmnopqrstuvwxyz';
            }

            if ($includeNumbers) {
                $characters .= '0123456789';
            }

            if ($includeSpecialChars && !empty($selectedSpecialChars)) {
                $characters .= implode('', $selectedSpecialChars);
            }

            // Validate at least one character type is selected
            if (empty($characters)) {
                return response()->json([
                    'success' => false,
                    'error' => 'At least one character type must be selected'
                ], 400);
            }

            $passwords = [];
            for ($i = 0; $i < $quantity; $i++) {
                $password = '';
                for ($j = 0; $j < $length; $j++) {
                    $password .= $characters[random_int(0, strlen($characters) - 1)];
                }
                $passwords[] = $password;
            }

            $endTime = microtime(true);
            $responseTime = round(($endTime - $startTime) * 1000, 2);

            Log::channel('api')->info('Password generation completed', [
                'count' => count($passwords),
                'response_time_ms' => $responseTime,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'data' => $passwords,
                'metadata' => [
                    'total_count' => count($passwords),
                    'generation_time_ms' => $responseTime,
                    'parameters' => [
                        'quantity' => $quantity,
                        'length' => $length,
                        'include_capital' => $includeCapital,
                        'include_lowercase' => $includeLowercase,
                        'include_numbers' => $includeNumbers,
                        'include_special_chars' => $includeSpecialChars,
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            $endTime = microtime(true);
            $responseTime = round(($endTime - $startTime) * 1000, 2);

            Log::channel('api')->error('Password generation failed', [
                'error' => $e->getMessage(),
                'response_time_ms' => $responseTime,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to generate passwords: ' . $e->getMessage()
            ], 500);
        }
    }
}

