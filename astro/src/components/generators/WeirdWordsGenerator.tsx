import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface WeirdWordsGeneratorProps {
    basePath?: string;
}

export default function WeirdWordsGenerator({ basePath = '' }: WeirdWordsGeneratorProps) {
    const {
        words,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        defaultType: 'weird',
        autoGenerate: true,
        favoritesKey: 'weirdWordsFavorites',
        apiEndpoint: '/api/generate/words',
        itemName: 'words'
    });

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'weird',
        onGenerate: generateWords,
        setShowFavorites,
        setQuantity
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <BaseGeneratorForm
                        title="Random Weird Words Generator"
                        itemName="Words"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        sizeFilterLabel="Word size by:"
                        onGenerate={formState.handleGenerate}
                        onReset={formState.resetOptions}
                        {...formState}
                    />

                    {/* Right Column - Results */}
                    <div className="w-full">
                        <ItemsDisplay
                            words={words}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={quantity}
                            loading={showLoading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                            clearAllFavorites={clearAllFavorites}
                            onReset={formState.resetAndGenerate}
                        />
                    </div>
                </div>

                {/* About Section */}
                <div id="RWG_Below_Generator_Mobile_300px" className="md:hidden google-ad-container flex justify-center mt-8" style={{ height: '280px', maxWidth: '336px', margin: '2rem auto' }}>
                    <div id="div-gpt-ad-1578531360465-0" className="text-center"></div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        {/* Left Column - Article Content */}
                        <ArticleContent>
                            <p>
                                You likely made it to the website because you were searching for a <a
                                    href={`${basePath}/`} className="text-blue-600 hover:text-blue-700">random word generator</a> which our
                                main page tool does an excellent job of doing.
                                As would be expected, the main tool produces more common words used on a regular basis by most people.
                                But what if you want to find weird English words? That's exactly why we created the Random Unusual
                                Word Generator.
                            </p>
                            <p>
                                If you're looking for words that are part of the English language, but you may have never heard used in
                                conversation before, this is the online tool you've been looking for. It has hundreds of odd, unusual,
                                weird, funny, and just plain entertaining words that you'll never likely use in a normal conversation,
                                but are definitely fun to know. When you think, "I would like to learn a new word today" in your mind,
                                the words in this generator are exactly the type you're thinking of. Since these words are uncommon, the
                                definition of each word is also included in the results so you know exactly what each word means. Below
                                you'll find a number of ways this online tool can be used.
                            </p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Fun</h2>
                            <p>
                                Seriously, this is a fun generator to just enjoy with no other purpose in mind. There are a lot of
                                people who just happen across this free tool, but once they find it, spend much more time than they
                                anticipated generating unusual random words again and again. Time may fly by as you play with this tool.
                            </p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">New Word of the Day</h2>
                            <p>
                                If you're the type of person who loves to learn a new word a day, this may be the perfect tool for you
                                to visit each morning. Since the words in the generator are fun and quirky, it's actually a lot of fun
                                (and not a chore) learning that new word a day. In fact, they're the type of words that you're likely to
                                share with your friends or try to use in a conversation just to see the surprised looks on all the other
                                people's faces when you use it.
                            </p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Expand Your Vocabulary</h2>
                            <p>
                                Beyond learning a new word a day, this tool is an excellent way to expand your vocabulary in an easy,
                                interesting way. While going through vocabulary lists can take a lot of time and at times be quite
                                boring, you're guaranteed to have some unusual word pop up with every click which can make it a lot of
                                fun. Improving your vocabulary doesn't need to be a drag.
                            </p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Guessing Game</h2>
                            <p>
                                This generator can also provide a lot of fun when you're with friends. All you need to do is generate a
                                random unusual word and then let your friends try and guess the meaning of it. Again, this is a great
                                way to group learn new vocabulary in a nontraditional study method. The guesses of what the words mean
                                can often be as entertaining as the unusual words themselves.
                            </p>
                            <p>
                                Above are just a few ways this tool can be used. If you happen to use this generator on a fairly regular
                                basis or are using it for a specific project, we would appreciate you taking a moment to let us know
                                exactly how you're using it. While we usually have a general idea of how the tools we create will be
                                used, we're often surprised at some of the creative ways they end up being used we never anticipated. By
                                understanding the various ways it's being used gives us the opportunity to make improvements to it as we
                                update, ultimately making it better for everyone. In addition, if you have a specific suggestion on how
                                we could improve the Random Unusual Word Generator, we'd love to get your ideas.
                            </p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What makes a word "weird" or unusual?</h3>
                                        <p>Weird words are typically those that are rarely used in everyday conversation. They may have unusual spellings, uncommon letter combinations, strange pronunciations, or meanings that are highly specific to particular contexts. Many of these words have fallen out of common usage over time but remain part of the English language.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Are these real English words?</h3>
                                        <p>Yes, all the words in our weird word generator are real English words that can be found in dictionaries. While they may sound made-up or strange, they are legitimate words with actual definitions and historical usage in the English language.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How many weird words are in this generator?</h3>
                                        <p>Our weird words database contains hundreds of unusual, quirky, and uncommon English words. We're constantly adding new words to the collection to keep the generator fresh and interesting for regular users.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I use these words in word games like Scrabble?</h3>
                                        <p>Many of the weird words in our generator are valid for word games like Scrabble, Words With Friends, and crossword puzzles. However, we recommend verifying with the official word list for your specific game, as some obscure words may not be included in all game dictionaries.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/weird-word" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
