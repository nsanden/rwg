import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import SEO from '@/Components/SEO';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function Hangman() {
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
            return data.hangman || [];
        }
    });

    const formState = useGeneratorForm({
        wordType: 'hangman',
        onGenerate: generateHangmanWords,
        setShowFavorites,
        setQuantity
    });

    const formPanel = (
        <BaseGeneratorForm
            title="Hangman Words Generator"
            itemName="Hangman Words"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            showLetterFilters={false}
            showSizeFilter={false}
            {...formState}
        />
    );

    const resultsPanel = (
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
        />
    );

    const articleContent = (
        <>
            <p>
                The Hangman word generator can be used for inspiration when playing Hangman. This tool provides a curated list of challenging words specifically chosen to make your Hangman games more engaging and fun. Whether you're playing at home, in the classroom, or at a party, these words will test players' vocabulary and spelling skills.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How to Play Hangman</h2>

            <p>
                Hangman is a classic word-guessing game that's perfect for players of all ages. One player thinks of a word and draws a series of dashes representing each letter. The other player guesses letters one at a time. If the letter is in the word, it's filled in wherever it appears. If not, a part of a stick figure is drawn. The goal is to guess the word before the drawing is completed.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Why These Words Are Perfect for Hangman</h2>

            <p>
                Our Hangman word list is carefully curated to include words that are challenging but fair. These words feature:
            </p>

            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Uncommon letter combinations that make guessing harder</li>
                <li>Words with challenging letters like Q, X, Z, and J</li>
                <li>Double letters that can trick players</li>
                <li>Unusual vowel patterns</li>
                <li>Silent letters and tricky spellings</li>
                <li>A good mix of word lengths from 3 to 10+ letters</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Tips for Playing Hangman</h2>

            <p>
                Here are some strategies to help you become better at Hangman:
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">For Guessers:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Start with common vowels (A, E, I, O, U)</li>
                <li>Try frequent consonants next (R, S, T, L, N)</li>
                <li>Look for common word patterns and endings</li>
                <li>Consider the word length when making guesses</li>
                <li>Think about word categories (animals, objects, etc.)</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">For Word Choosers:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Choose words with uncommon letters</li>
                <li>Avoid words with many repeated letters</li>
                <li>Pick words that aren't too obvious from context</li>
                <li>Use words with unexpected spellings</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Educational Benefits</h2>

            <p>
                Hangman is more than just a fun game—it's an excellent educational tool that helps with:
            </p>

            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Spelling and vocabulary development</li>
                <li>Letter recognition and phonics</li>
                <li>Strategic thinking and pattern recognition</li>
                <li>Memory and concentration skills</li>
                <li>Social interaction and communication</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Frequently Asked Questions</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How many wrong guesses are allowed in Hangman?</h3>
                    <p>Traditionally, players are allowed 6 wrong guesses, which corresponds to drawing a head, body, two arms, and two legs. However, you can adjust this number to make the game easier or harder.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">What makes a good Hangman word?</h3>
                    <p>Good Hangman words are challenging but not impossible to guess. They often contain uncommon letters, unusual spelling patterns, or unexpected letter combinations. Words that are too easy (like "cat") or too obscure (like technical jargon) don't make for engaging gameplay.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Can you use proper nouns in Hangman?</h3>
                    <p>This depends on the rules you set. Some players allow proper nouns (names of people, places, etc.) while others stick to common nouns. It's best to agree on the rules before starting the game.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How do you make Hangman more challenging?</h3>
                    <p>You can increase the difficulty by using longer words, words with unusual spellings, reducing the number of allowed wrong guesses, or using phrases instead of single words. Our word generator includes many challenging options perfect for advanced players.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Is Hangman educational?</h3>
                    <p>Yes! Hangman is an excellent educational game that helps with spelling, vocabulary, letter recognition, and strategic thinking. It's commonly used in classrooms to make learning fun and interactive.</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Hangman Words Generator - Random Hangman Words | RandomWordGenerator.com"
                description="Generate random hangman words instantly! Perfect challenging words for the classic word-guessing game. Great for family fun and educational activities."
                keywords={['hangman words', 'hangman generator', 'word games', 'spelling games', 'educational games', 'family games']}
                ogImage="/img/hangman.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Hangman Words Generator"
                currentPage="/hangman.php"
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