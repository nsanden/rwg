import React, { useState } from 'react';
import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { Heart, Copy } from 'lucide-react';

interface LetterSequence {
    sequence: string;
}

export default function LetterSequence() {
    const [sequenceLength, setSequenceLength] = useState(5);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [language, setLanguage] = useState('English');

    const {
        items,
        loading,
        showLoading,
        quantity,
        setQuantity,
        generateItems,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'letterSequenceFavorites',
        apiEndpoint: '/api/generate/letter-sequences',
        itemName: 'letter sequences',
        transformResponse: (data: any) => {
            return data.letter_sequences || [];
        }
    });

    const sequences = items as unknown as LetterSequence[];

    // Custom favorites state
    const [favoriteSequences, setFavoriteSequences] = useState<LetterSequence[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('letterSequenceFavorites');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);

    const addToFavorites = (sequence: LetterSequence) => {
        const updated = [...favoriteSequences, sequence];
        setFavoriteSequences(updated);
        localStorage.setItem('letterSequenceFavorites', JSON.stringify(updated));
    };

    const removeFromFavorites = (sequenceValue: string) => {
        const updated = favoriteSequences.filter(s => s.sequence !== sequenceValue);
        setFavoriteSequences(updated);
        localStorage.setItem('letterSequenceFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavoriteSequences([]);
        localStorage.setItem('letterSequenceFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const handleGenerateSequences = () => {
        if (!includeUppercase && !includeLowercase) {
            alert('You must check at least one letter case option');
            return;
        }

        setShowFavorites(false);
        generateItems({
            quantity,
            sequence_length: sequenceLength,
            include_uppercase: includeUppercase,
            include_lowercase: includeLowercase,
            language: language
        });
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'letter-sequences',
        onGenerate: handleGenerateSequences,
        setShowFavorites,
        setQuantity
    });

    const seoData = {
        title: "Random Letter Sequence Generator - Generate Random Letter Sequences",
        description: "Generate random letter sequences for learning, practice, and creative writing. Choose sequence length, language, and case options. Perfect for alphabet practice and vocabulary exercises.",
        keywords: "random letter sequence, letter generator, alphabet practice, letter sequences, random letters, language learning, writing practice",
        url: "https://randomwordgenerator.com/letter-sequence",
    };

    const articleContent = (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
                You have found the Random Letter Sequence Generator. This easy to use tool will generate random letter sequences. There are a few options that you can choose from depending on your needs. To begin, simply choose how many letter sequences you want displayed and the number of letters to be in each sequence. You also have the option of choosing all upper case letters, all lower case letters or a combination of the two. While the default language is English, you can also choose from seven other languages if desired. Once you have chosen all options, click on the "Generate" button to have a random letter sequence generated to your specifications. It's possible to set this free online tool to one letter to only get a single letter, but it can be easier to do this using our sister Random Letter Generator.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">English Letter Sequences</h2>

            <p>
                As mentioned above, the default for this generator is the English language. The sequence generator can be a wonderful tool to help foreign language students learning English or young children just learning the alphabet better understand and recognize the 26 different letters in the English alphabet. This can be especially useful for those who are having difficulty distinguishing the differences between upper and lower case letters. With the option to choose either (or a combination of both), you can quiz the students to see their true understanding of both with each sequence of letters produced.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">German, French and Spanish Letter Sequences</h2>

            <p>
                One of the wonderful benefits of this tool is that it isn't limited to English like many others. The Spanish, German and French alphabet letters are similar to those used in English, but they aren't exactly the same. Each contains a few more than the 26 letters found in English. If you choose to create letter sequences in French, German or Spanish, and additional letters in their alphabet will also randomly appear with the letter sequences chosen.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Armenian, Chinese, Japanese and Russian Letter Sequences</h2>

            <p>
                For those studying non-Latin languages such as Russian, Japanese, Chinese, and Armenian, this generator can be quite useful. Since the letters in the alphabets found in these languages use characters that aren't even close to similar to what English letters look like, this generator is a great way to study these characters and alphabets. If you happen to be studying Japanese or Chinese, you can find all of the Japanese Hiragana characters and over 3,000 Chinese characters.
            </p>

            <p>
                This easy to use tool is a wonderful way to test and practice any of the languages available, especially when you're just beginning to practice writing and pronunciation. The more time you spend practicing, the sooner you'll be able to master the basics of each of the alphabets.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Vocabulary Tool</h2>

            <p>
                Using this generator can be a good exercise to increase and test your current vocabulary level for those beginning to learn a language. For example, once a letter sequence is generated, you can try to come up with words that begin with each letter in the sequence. For those who are more advanced, you can try to create a sentence with each word in the sentence matching the randomly created sequence.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Writing Practice</h2>

            <p>
                This generator's usefulness isn't limited to those who are beginning to learn a language. When used creatively, it can also challenge writers to better develop their writing skills. One way to do this is to generate a random letter sequence of 15 letters. It's then up to the writer to produce a fun story with each sentence or paragraph beginning with each of the random letters in the sequence.
            </p>

            <p>
                We are interested to hear how you use this tool. By understanding how individuals use it, we can make adjustments to provide a better user experience. Please let us know if you have a few moments to tell us how we can make it better for you or what future improvements you'd like to see incorporated.
            </p>
        </div>
    );

    const customFormPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Random Letter Sequence Generator</h1>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Number of Sequences:
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        min="1"
                        max="50"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label htmlFor="sequenceLength" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Length of Sequence:
                    </label>
                    <input
                        type="number"
                        id="sequenceLength"
                        min="1"
                        max="26"
                        value={sequenceLength}
                        onChange={(e) => setSequenceLength(parseInt(e.target.value) || 5)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <label htmlFor="language" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Choose Language:
                    </label>
                    <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="Armenian">Armenian</option>
                        <option value="Chinese">Chinese</option>
                        <option value="English">English</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Russian">Russian</option>
                        <option value="Spanish">Spanish</option>
                    </select>
                </div>

                <div className="flex items-center gap-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={includeUppercase}
                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Capital letters</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={includeLowercase}
                            onChange={(e) => setIncludeLowercase(e.target.checked)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Lowercase letters</span>
                    </label>
                </div>
                {!includeUppercase && !includeLowercase && (
                    <p className="text-red-500 text-sm">You must check at least one of the options above</p>
                )}

                <div className="pt-4">
                    <button
                        onClick={handleGenerateSequences}
                        disabled={loading || (!includeUppercase && !includeLowercase)}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        {loading ? 'Generating...' : 'Generate Random Letter Sequences'}
                    </button>
                </div>
            </div>
        </div>
    );

    const SequenceCard = ({ sequence, index }: { sequence: LetterSequence; index: number }) => {
        const isFavorite = favoriteSequences.some(fav => fav.sequence === sequence.sequence);

        return (
            <div className="text-center bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-gray-800 flex-1 text-center font-mono">
                        {sequence.sequence}
                    </span>
                    <button
                        onClick={() => isFavorite ? removeFromFavorites(sequence.sequence) : addToFavorites(sequence)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center ml-2"
                        aria-label={isFavorite ? `Remove "${sequence.sequence}" from favorites` : `Add "${sequence.sequence}" to favorites`}
                    >
                        <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                </div>
            </div>
        );
    };

    const resultsPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                {favoriteSequences.length > 0 && (
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        aria-pressed={showFavorites}
                        aria-label={showFavorites ? 'Switch to view generated sequences' : `Switch to view saved favorites (${favoriteSequences.length} sequences)`}
                    >
                        {showFavorites ? (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" aria-hidden="true" />
                        ) : (
                            <>
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" aria-hidden="true" />
                                ({favoriteSequences.length})
                            </>
                        )}
                    </button>
                )}
                <button
                    onClick={copyToClipboard}
                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded touch-manipulation"
                    aria-label={`Copy ${showFavorites ? favoriteSequences.length + ' favorite' : sequences.length + ' generated'} letter sequences to clipboard`}
                >
                    <Copy className="w-5 h-5 transition-colors" aria-hidden="true" />
                </button>
            </div>

            {showLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div>
                    <p className="mt-2 text-gray-600">Generating letter sequences...</p>
                </div>
            ) : (
                <>
                    {(showFavorites ? favoriteSequences : sequences).length > 0 ? (
                        <div className="grid gap-4 grid-cols-1 max-w-md mx-auto">
                            {(showFavorites ? favoriteSequences : sequences).map((sequence, index) => (
                                <SequenceCard
                                    key={sequence.sequence + index}
                                    sequence={sequence}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {showFavorites ? 'No favorite sequences yet. Add some by clicking the heart button on sequences you like!' : 'Click "Generate Random Letter Sequences" to get letter sequences.'}
                        </div>
                    )}

                    {favoriteSequences.length > 0 && showFavorites && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={clearAllFavorites}
                                className="text-blue-600 hover:text-blue-800 underline text-sm bg-transparent border-none cursor-pointer"
                            >
                                Clear All Favorites
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    return (
        <>
            <SEO {...seoData} />
            <GeneratorPageLayout
                title="Random Letter Sequence Generator"
                currentPage="/letter-sequence.php"
            >
                {{
                    formPanel: customFormPanel,
                    resultsPanel,
                    articleContent
                }}
            </GeneratorPageLayout>

        </>
    );
}