import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface HangmanGeneratorProps {
    basePath?: string;
}

export default function HangmanGenerator({ basePath = '' }: HangmanGeneratorProps) {
    const {
        words: hangmanWords,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generateHangmanWords,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'hangmanFavorites',
        apiEndpoint: '/api/generate/hangman',
        itemName: 'hangman words',
        transformResponse: (data: any) => {
            const words = data.hangman || [];
            return words.map((item: any) => ({
                word: item.word,
                definition: `Characters: ${item.word.length}`
            }));
        }
    });

    const formState = useGeneratorForm({
        wordType: 'hangman',
        onGenerate: generateHangmanWords,
        setShowFavorites,
        setQuantity
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BaseGeneratorForm
                        title="Hangman Words"
                        itemName="Hangman Words"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        onGenerate={formState.handleGenerate}
                        onReset={formState.resetOptions}
                        {...formState}
                    />

                    <div className="w-full">
                        <ItemsDisplay
                            words={hangmanWords}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={quantity}
                            loading={showLoading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                            clearAllFavorites={clearAllFavorites}
                            itemName="hangman words"
                            textSize="medium"
                            onReset={formState.resetAndGenerate}
                        />
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        <ArticleContent>
                            <p>Hangman is a great game for plenty of occasions. It's a great way for kids to entertain themselves in the car on a long trip or if you need to keep them occupied for a bit before dinner. A group of students can entertain themselves if there is extra time at the end of class. It's a good suggestion for friends who "have nothing to do." In fact, it's a fun game to play for anyone at any time they have some free time and aren't sure what to do to fill it. Hangman can even be used to reveal a surprise like a question or exciting news.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How to Play Hangman</h2>

                            <p>Hangman is a word game that requires guessing the letters to a word or phrase. The person who comes up with the word to be guessed draws blanks to show how many letters there are in that word. The catch is that the players who are guessing letters have a limited number of guesses based on the hangman. The player who created the word or phrase draws a body part of a stick figure hanging from a gallows every time an incorrect letter is guessed. Traditionally the hangman is drawn with a head, torso, arms, and legs (or six incorrect guesses). However, in more complicated games the drawer can add feet, hands, and a hat giving more guesses. If the person guessing can guess the word before all the body parts are drawn, the guesser wins. If the guesser doesn't guess the word before all the body parts are drawn, the guesser loses.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Guessing Hangman Words</h2>

                            <p>A good trick for those guessing hangman words is to start with vowels because vowels often end up being the most helpful when trying to decipher the hangman word. For example, if E and A fill in the vowel spots on a word being guessed, then it's often best not to guess the remaining vowels since it would be a waste of guesses. In this case, if the board looks like "_ A _ _ E" then it is unlikely any more vowels are in the word. The next best guesses are common consonants. Guessing Z, Q, or J might not be a good letter to guess if you aren't sure those letters belong to the word since they don't appear in many words. T, R, S, L, N, P, and D are the most common letters. In the example above, guessing T and S would reveal the word is "TASTE".</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Deciding Hangman Words</h2>

                            <p>When deciding what hangman word to use, it's a good idea to play to the opposite of the above recommendations. Uncommon words with uncommon letters are wonderful hangman words as they are difficult to guess using the above strategy. Words that use Y as the only vowel can throw the guessers off. "MYTH", "PAPYRUS", or "BAYOU" are good examples of words that can trick the guesser. Using words with Q or Z can also throw off the guess. For this reason, "QUIZ" is a greater word but "QUIZZING" is even better. Another good trick is to modify common words. Instead of "BOOK" try "BOOKKEEPER" - while "book" could be guessed rather easily, "bookkeeper" can throw off the guessers by making a recognizable word less obvious.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Hangman Phrases</h2>

                            <p>Hangman can also be used for phrases. It is unsportsmanlike to use phrases that don't make sense like "shoes spider filet" so avoid nonsense like this. On the other hand, a phrase like "shoes are smelly" is silly but makes sense so is a reasonable phrase to use in the game. This is also a good time to ask someone a question. Maybe that girl you have a crush on really likes word games. Hangman is a great way to ask her to prom. Or if you want your cousin to guess that you got him a trip to the Grand Canyon for Christmas, you can use the phrase "you are going to the Grand Canyon".</p>

                            <p>If you're just looking for a way to pass the time and can't think of a word, this hangman words generator is a great place to start. If you know you're going to be playing hangman and want to have some difficult to guess words ready for the game, using a generator to find some to keep in your back pocket also makes sense. Because the fun of hangman can be as simple as playing it or as important as asking someone to a dance, hangman can be played at any time. This hangman words generator provides the words for those times you want to make the game a little more difficult or the playing field a bit more even.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How many wrong guesses are allowed in Hangman?</h3>
                                        <p>Traditionally, players are allowed 6 wrong guesses, which corresponds to drawing a head, body, two arms, and two legs. However, you can adjust this number to make the game easier or harder by adding features like hands, feet, or a hat.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What makes a good Hangman word?</h3>
                                        <p>Good Hangman words are challenging but not impossible to guess. Words with uncommon letters like Q, Z, X, or J work well. Words that use Y as the only vowel (like MYTH or BAYOU) can also trick guessers. Modifying common words like using BOOKKEEPER instead of BOOK adds difficulty.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What letters should I guess first?</h3>
                                        <p>Start with vowels (A, E, I, O, U) since almost every word contains at least one. Then try common consonants like T, R, S, L, N, P, and D. Save uncommon letters like Q, X, Z, and J for later unless you have a strong hunch.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can you use phrases in Hangman?</h3>
                                        <p>Yes! Phrases add an extra layer of challenge. Just make sure the phrase makes sense - avoid random word combinations. Phrases are also great for special occasions like asking someone to prom or revealing exciting news.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/hangman" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
