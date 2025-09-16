import React, { useState } from 'react';
import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function Pictionary() {
    const [gameType, setGameType] = useState('pictionary');
    const [difficulty, setDifficulty] = useState('easy');

    const {
        words: pictionary,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generatePictionary,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'pictionaryFavorites',
        apiEndpoint: '/api/generate/pictionary',
        itemName: 'pictionary words',
        transformResponse: (data: any) => {
            return data.pictionary || [];
        }
    });

    const formState = useGeneratorForm({
        wordType: 'pictionary',
        onGenerate: (params) => generatePictionary({ ...params, gameType, difficulty }),
        setShowFavorites,
        setQuantity
    });

    // Get available difficulties based on game type
    const getAvailableDifficulties = () => {
        switch (gameType) {
            case 'pictionary':
                return [
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' },
                    { value: 'really_hard', label: 'Really Hard' }
                ];
            case 'catchphrase':
                return [
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' }
                ];
            case 'holidays':
                return [
                    { value: 'valentines_day', label: "Valentine's Day" },
                    { value: 'fourth_of_july', label: 'Fourth of July' },
                    { value: 'halloween', label: 'Halloween' },
                    { value: 'thanksgiving', label: 'Thanksgiving' },
                    { value: 'christmas', label: 'Christmas' },
                    { value: 'christmas_songs', label: 'Christmas Songs' },
                    { value: 'spring', label: 'Spring' },
                    { value: 'new_years', label: "New Year's" },
                    { value: 'winter', label: 'Winter' },
                    { value: 'summer', label: 'Summer' },
                    { value: 'fall', label: 'Fall' },
                    { value: 'summer_olympics', label: 'Summer Olympics' }
                ];
            case 'charades':
                return [
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' },
                    { value: 'really_hard', label: 'Really Hard' },
                    { value: 'actions', label: 'Actions' }
                ];
            case 'subjects':
                return [
                    { value: 'animals', label: 'Animals' },
                    { value: 'food_and_cooking', label: 'Food and Cooking' },
                    { value: 'people', label: 'People' },
                    { value: 'places', label: 'Places' },
                    { value: 'around_the_house', label: 'Around the House' },
                    { value: 'around_the_office', label: 'Around the Office' },
                    { value: 'art', label: 'Art' },
                    { value: 'colors', label: 'Colors' },
                    { value: 'common_animals', label: 'Common Animals' },
                    { value: 'dog_breeds', label: 'Dog Breeds' },
                    { value: 'english_literature', label: 'English Literature' },
                    { value: 'feelings_and_emotions', label: 'Feelings and Emotions' },
                    { value: 'math', label: 'Math' },
                    { value: 'music', label: 'Music' },
                    { value: 'nature', label: 'Nature' },
                    { value: 'science', label: 'Science' },
                    { value: 'sports', label: 'Sports' },
                    { value: 'travel', label: 'Travel' },
                    { value: 'categories', label: 'Categories' }
                ];
            case 'get-to-know-you':
                return [
                    { value: 'light_questions', label: 'Light Questions' },
                    { value: 'moderate_questions', label: 'Moderate Questions' },
                    { value: 'in_depth_questions', label: 'In-depth Questions' },
                    { value: 'qualities_traits_experiences', label: 'Qualities, Traits & Experiences' },
                    { value: 'questions_for_youngsters', label: 'Questions for Youngsters' },
                    { value: 'this_or_that', label: 'This or That' }
                ];
            case 'wordplay':
                return [
                    { value: 'adjectives', label: 'Adjectives' },
                    { value: 'adverbs', label: 'Adverbs' },
                    { value: 'idioms_and_sayings', label: 'Idioms and Sayings' },
                    { value: 'nouns', label: 'Nouns' },
                    { value: 'opposites', label: 'Opposites' },
                    { value: 'pairs', label: 'Pairs' },
                    { value: 'rhyming_opposite_sets', label: 'Rhyming Opposite Sets' },
                    { value: 'trios', label: 'Trios' },
                    { value: 'verbs', label: 'Verbs' }
                ];
            case 'movies':
                return [
                    { value: 'animal_movies', label: 'Animal Movies' },
                    { value: 'animated_movies', label: 'Animated Movies' },
                    { value: 'comedies', label: 'Comedies' },
                    { value: 'disney_and_pixar_movies', label: 'Disney and Pixar Movies' },
                    { value: 'dramas', label: 'Dramas' },
                    { value: 'family_movies', label: 'Family Movies' },
                    { value: 'fantasy_movies', label: 'Fantasy Movies' },
                    { value: 'historical_movies', label: 'Historical Movies' },
                    { value: 'live_action_movies', label: 'Live Action Movies' },
                    { value: 'movies_older_than_1970', label: 'Movies Older than 1970' },
                    { value: 'music_movies', label: 'Music Movies' },
                    { value: 'sci_fi_movies', label: 'Sci-Fi Movies' },
                    { value: 'remakes_spinoffs_sequels_and_parodies', label: 'Remakes, Spinoffs, Sequels and Parodies' },
                    { value: 'all_movies', label: 'All Movies' }
                ];
            case 'individuals':
                return [
                    { value: 'celebrities', label: 'Celebrities' },
                    { value: 'historical_people', label: 'Historical People' },
                    { value: 'characters', label: 'Characters' }
                ];
            default:
                return [{ value: 'easy', label: 'Easy' }];
        }
    };

    // Update difficulty when game type changes
    const handleGameTypeChange = (newGameType: string) => {
        setGameType(newGameType);

        // Get difficulties for the new game type
        let availableDifficulties;
        switch (newGameType) {
            case 'pictionary':
                availableDifficulties = [
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' },
                    { value: 'really_hard', label: 'Really Hard' }
                ];
                break;
            case 'catchphrase':
                availableDifficulties = [
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' }
                ];
                break;
            case 'holidays':
                availableDifficulties = [
                    { value: 'valentines_day', label: "Valentine's Day" },
                    { value: 'fourth_of_july', label: 'Fourth of July' },
                    { value: 'halloween', label: 'Halloween' },
                    { value: 'thanksgiving', label: 'Thanksgiving' },
                    { value: 'christmas', label: 'Christmas' },
                    { value: 'christmas_songs', label: 'Christmas Songs' },
                    { value: 'spring', label: 'Spring' },
                    { value: 'new_years', label: "New Year's" },
                    { value: 'winter', label: 'Winter' },
                    { value: 'summer', label: 'Summer' },
                    { value: 'fall', label: 'Fall' },
                    { value: 'summer_olympics', label: 'Summer Olympics' }
                ];
                break;
            case 'charades':
                availableDifficulties = [
                    { value: 'easy', label: 'Easy' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'hard', label: 'Hard' },
                    { value: 'really_hard', label: 'Really Hard' },
                    { value: 'actions', label: 'Actions' }
                ];
                break;
            case 'subjects':
                availableDifficulties = [
                    { value: 'animals', label: 'Animals' },
                    { value: 'food_and_cooking', label: 'Food and Cooking' },
                    { value: 'people', label: 'People' },
                    { value: 'places', label: 'Places' },
                    { value: 'around_the_house', label: 'Around the House' },
                    { value: 'around_the_office', label: 'Around the Office' },
                    { value: 'art', label: 'Art' },
                    { value: 'colors', label: 'Colors' },
                    { value: 'common_animals', label: 'Common Animals' },
                    { value: 'dog_breeds', label: 'Dog Breeds' },
                    { value: 'english_literature', label: 'English Literature' },
                    { value: 'feelings_and_emotions', label: 'Feelings and Emotions' },
                    { value: 'math', label: 'Math' },
                    { value: 'music', label: 'Music' },
                    { value: 'nature', label: 'Nature' },
                    { value: 'science', label: 'Science' },
                    { value: 'sports', label: 'Sports' },
                    { value: 'travel', label: 'Travel' },
                    { value: 'categories', label: 'Categories' }
                ];
                break;
            case 'get-to-know-you':
                availableDifficulties = [
                    { value: 'light_questions', label: 'Light Questions' },
                    { value: 'moderate_questions', label: 'Moderate Questions' },
                    { value: 'in_depth_questions', label: 'In-depth Questions' }
                ];
                break;
            case 'wordplay':
                availableDifficulties = [
                    { value: 'adjectives', label: 'Adjectives' },
                    { value: 'verbs', label: 'Verbs' },
                    { value: 'nouns', label: 'Nouns' },
                    { value: 'opposites', label: 'Opposites' }
                ];
                break;
            case 'movies':
                availableDifficulties = [
                    { value: 'animal_movies', label: 'Animal Movies' },
                    { value: 'animated_movies', label: 'Animated Movies' },
                    { value: 'comedies', label: 'Comedies' },
                    { value: 'disney_and_pixar_movies', label: 'Disney and Pixar Movies' },
                    { value: 'dramas', label: 'Dramas' },
                    { value: 'family_movies', label: 'Family Movies' },
                    { value: 'fantasy_movies', label: 'Fantasy Movies' },
                    { value: 'historical_movies', label: 'Historical Movies' },
                    { value: 'live_action_movies', label: 'Live Action Movies' },
                    { value: 'movies_older_than_1970', label: 'Movies Older than 1970' },
                    { value: 'music_movies', label: 'Music Movies' },
                    { value: 'sci_fi_movies', label: 'Sci-Fi Movies' },
                    { value: 'remakes_spinoffs_sequels_and_parodies', label: 'Remakes, Spinoffs, Sequels and Parodies' },
                    { value: 'all_movies', label: 'All Movies' }
                ];
                break;
            case 'individuals':
                availableDifficulties = [
                    { value: 'celebrities', label: 'Celebrities' },
                    { value: 'historical_people', label: 'Historical People' },
                    { value: 'characters', label: 'Characters' }
                ];
                break;
            default:
                availableDifficulties = [{ value: 'easy', label: 'Easy' }];
        }

        if (availableDifficulties.length > 0) {
            setDifficulty(availableDifficulties[0].value);
        }
    };

    const customOptions = (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Game:
                </label>
                <select
                    value={gameType}
                    onChange={(e) => handleGameTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="pictionary">Pictionary</option>
                    <option value="catchphrase">Catchphrase</option>
                    <option value="holidays">Holidays</option>
                    <option value="charades">Charades</option>
                    <option value="subjects">Subjects</option>
                    <option value="get-to-know-you">Get to Know You</option>
                    <option value="wordplay">Wordplay</option>
                    <option value="movies">Movies</option>
                    <option value="individuals">Individuals</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {gameType === 'holidays' ? 'Holiday:' : gameType === 'subjects' ? 'Subject:' : gameType === 'movies' ? 'Movie Type:' : 'Difficulty:'}
                </label>
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {getAvailableDifficulties().map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Pictionary Generator"
            itemName="Pictionary Words"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            showLetterFilters={false}
            showSizeFilter={false}
            customOptions={customOptions}
            {...formState}
        />
    );

    const resultsPanel = (
        <ItemsDisplay
            words={pictionary}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
            itemName="pictionary words"
            textSize="medium"
        />
    );

    const articleContent = (
        <>
            <p>
                If you love Pictionary or Pictionary Air, you've come to the right place. This is especially true if you're looking for random Pictionary words so you can play the game. The Random Pictionary Word generator is helpful if you don't have a gameboard and cards around, but you'd still like to play the game with your friends. Our free online Pictionary word generator does exactly that by letting you and your friends play the game even if you don't have the game cards handy.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How Do You Play Pictionary?</h2>

            <p>
                The joy of playing Pictionary and Pictionary Air is that the rules of the game are simple, but executing them is a challenge and inevitably produces a lot of fun and laughter. Basically, the goal of the game is for one person to draw a picture without using any letters, numbers, words, gestures, verbal cues or nonverbal cues, and their partner has to guess what word corresponds to the picture being drawn. In order for it to be fair for both teams, generating random Pictionary game words is a great way to keep the playing field even.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How Many People Can Play Pictionary?</h2>

            <p>
                While there really isn't a limit on how many people can play, the ideal number is four people (which is also the fewest number of people you need to play the game). This allows for two teams of two to compete against one another. If you happen to have more than four people, it's possible to create more teams or have a larger number of people on each team so that nobody is left out of the fun. For example, if you have eight friends that want to play, you can make four teams of two players or two teams of four players.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">What are the Rules of Pictionary?</h2>

            <p>
                The rules of the game are pretty simple. One person on your team is designated to be the first person to draw a picture of whatever random Pictionary word is generated. Once they see the word, they have 5 seconds to think before they begin to draw. Once they begin drawing, they have 1 minute to try to get their partner to guess the random word. If the partner succeeds in guessing the correct word being drawn, the team gets a point, but they get zero points if they don't. Team two does the same thing, then the person drawing is switched for round two. After a designated number of rounds, the team with the most points wins.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Pictionary Drawing Tips</h2>

            <p>
                Here are some helpful tips for drawing in Pictionary:
            </p>

            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Start with simple shapes and build complexity</li>
                <li>Use gestures to indicate category (hold up fingers for number of words)</li>
                <li>Draw parts of the word if it's a compound word</li>
                <li>Use symbols and icons that are universally understood</li>
                <li>Don't worry about artistic skill - simple drawings often work best</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Frequently Asked Questions</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Can you make sounds while playing Pictionary?</h3>
                    <p>No, you aren't allowed to say words or make other sounds while playing Pictionary. The goal is to have your teammates guess the word through only your drawing ability.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">What is the difference between Pictionary and charades?</h3>
                    <p>The main difference between Pictionary and charades is how the person tries to communicate the word their teammates is supposed to guess. In Pictionary the person draws the word to be guessed while in charades the person acts out the word to be guessed.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How much time do you get in Pictionary?</h3>
                    <p>When you play Pictionary, there is a time limit on how long you can draw. The rule is that you have 5 seconds to think after receiving the word to be drawn, then 1 minute to draw to get your teammates to guess the correct word. If they don't guess in that 1 minute period, time is up and that round is over.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Can you play Pictionary without the game?</h3>
                    <p>Yes. All you need is some place to draw pictures and something to draw with. The biggest challenge of playing Pictionary without the game is coming up with good Pictionary words which can be difficult to do on your own. That's exactly why we created the random Pictionary word generator so that you can have great words to draw without having to try to think them up on your own.</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Pictionary Generator - Random Pictionary Words | RandomWordGenerator.com"
                description="Generate random Pictionary words instantly! Choose from easy to really hard difficulty levels. Perfect for family game night and parties."
                keywords={['pictionary generator', 'random pictionary words', 'pictionary game', 'drawing game', 'family games', 'party games']}
                ogImage="/img/pictionary.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Pictionary Generator"
                currentPage="/pictionary.php"
            >
                {{
                    formPanel,
                    resultsPanel,
                    articleContent
                }}
            </GeneratorPageLayout>
        </>
    );
}