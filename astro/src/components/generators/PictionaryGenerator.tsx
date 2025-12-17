import { useState } from 'react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface PictionaryGeneratorProps {
    basePath?: string;
}

const GAME_TYPES = [
    { value: 'pictionary', label: 'Pictionary' },
    { value: 'catchphrase', label: 'Catchphrase' },
    { value: 'holidays', label: 'Holidays' },
    { value: 'charades', label: 'Charades' },
    { value: 'subjects', label: 'Subjects' },
    { value: 'get-to-know-you', label: 'Get to Know You' },
    { value: 'wordplay', label: 'Wordplay' },
    { value: 'movies', label: 'Movies' },
    { value: 'individuals', label: 'Individuals' },
];

const DIFFICULTY_OPTIONS: Record<string, { value: string; label: string }[]> = {
    pictionary: [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
        { value: 'really_hard', label: 'Really Hard' }
    ],
    catchphrase: [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' }
    ],
    holidays: [
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
    ],
    charades: [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
        { value: 'really_hard', label: 'Really Hard' },
        { value: 'actions', label: 'Actions' }
    ],
    subjects: [
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
    ],
    'get-to-know-you': [
        { value: 'light_questions', label: 'Light Questions' },
        { value: 'moderate_questions', label: 'Moderate Questions' },
        { value: 'in_depth_questions', label: 'In-depth Questions' },
        { value: 'qualities_traits_experiences', label: 'Qualities, Traits & Experiences' },
        { value: 'questions_for_youngsters', label: 'Questions for Youngsters' },
        { value: 'this_or_that', label: 'This or That' }
    ],
    wordplay: [
        { value: 'adjectives', label: 'Adjectives' },
        { value: 'adverbs', label: 'Adverbs' },
        { value: 'idioms_and_sayings', label: 'Idioms and Sayings' },
        { value: 'nouns', label: 'Nouns' },
        { value: 'opposites', label: 'Opposites' },
        { value: 'pairs', label: 'Pairs' },
        { value: 'rhyming_opposite_sets', label: 'Rhyming Opposite Sets' },
        { value: 'trios', label: 'Trios' },
        { value: 'verbs', label: 'Verbs' }
    ],
    movies: [
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
    ],
    individuals: [
        { value: 'celebrities', label: 'Celebrities' },
        { value: 'historical_people', label: 'Historical People' },
        { value: 'characters', label: 'Characters' }
    ]
};

export default function PictionaryGenerator({ basePath = '' }: PictionaryGeneratorProps) {
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
        transformResponse: (data: any) => data.pictionary || []
    });

    const formState = useGeneratorForm({
        wordType: 'pictionary',
        onGenerate: (params) => generatePictionary({ ...params, gameType, difficulty }),
        setShowFavorites,
        setQuantity
    });

    // Get label for second dropdown based on game type
    const getSecondDropdownLabel = () => {
        switch (gameType) {
            case 'holidays': return 'Holiday:';
            case 'subjects': return 'Subject:';
            case 'movies': return 'Movie Type:';
            case 'get-to-know-you': return 'Question Type:';
            case 'wordplay': return 'Word Type:';
            case 'individuals': return 'Person Type:';
            default: return 'Difficulty:';
        }
    };

    // Handle game type change - reset difficulty to first option for new game type
    const handleGameTypeChange = (newGameType: string) => {
        setGameType(newGameType);
        const options = DIFFICULTY_OPTIONS[newGameType];
        if (options && options.length > 0) {
            setDifficulty(options[0].value);
        }
    };

    const customOptions = (
        <div className="space-y-4 mb-4">
            <div>
                <label htmlFor="game-type" className="block text-sm font-medium text-gray-700 mb-2">
                    Game:
                </label>
                <select
                    id="game-type"
                    value={gameType}
                    onChange={(e) => handleGameTypeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {GAME_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                    {getSecondDropdownLabel()}
                </label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {(DIFFICULTY_OPTIONS[gameType] || []).map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <BaseGeneratorForm
                        title="Pictionary Generator"
                        itemName="Pictionary Words"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        customOptions={customOptions}
                        onGenerate={formState.handleGenerate}
                        onReset={() => {
                            setGameType('pictionary');
                            setDifficulty('easy');
                            formState.resetOptions();
                        }}
                        {...formState}
                    />

                    {/* Right Column - Results */}
                    <div className="w-full">
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
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        {/* Left Column - Article Content */}
                        <ArticleContent>
                            <p>
                                If you love Pictionary or Pictionary Air, you've come to the right place. This is especially true if you're looking for random Pictionary words so you can play the game. The Random Pictionary Word generator is helpful if you don't have a gameboard and cards around, but you'd still like to play the game with your friends. Our free online Pictionary word generator does exactly that by letting you and your friends play the game even if you don't have the game cards handy. If you're looking for more fun games, please also check out our <a href={`${basePath}/never-have-i-ever-question.php`} className="text-blue-600 hover:text-blue-800">Never Have I Ever questions</a> and our <a href={`${basePath}/would-you-rather-question.php`} className="text-blue-600 hover:text-blue-800">Would You Rather questions</a>.
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

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Random Catchphrase Generator</h2>

                            <p>
                                We didn't stop there! You can also play the game Catchphrase by turning the tool into a random catchphrase word generator. Go to the games drop-down menu and choose "Catchphrase" as the option. This will change the random words to a random Catchphrase word list allowing you to play Catchphrase as much as you like. If you're a Catchphrase game fan, utilizing the random Catchphrase generator option will bring you hours of fun.
                            </p>

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
                                    <p>Yes. All you need is some place to draw pictures and something to draw with. The biggest challenge of playing Pictionary without he game is coming up with good Pictionary words which can be difficult to do on your own. That's exactly why we created the random Pictionary word generator so that you can have great words to draw without having to try to think them up on your own.</p>
                                </div>
                            </div>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/pictionary" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
