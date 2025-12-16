import { useState, useEffect } from 'react';
import { Heart, Copy, X, RefreshCw } from 'lucide-react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface CursiveLettersGeneratorProps {
    basePath?: string;
}

// Font configurations based on legacy implementation
const CURSIVE_FONTS = {
    'dnealian': {
        name: "D'Nealian Cursive",
        fontFamily: "'DNealian', cursive",
        fontSize: '60px',
        lineHeight: '1.2'
    },
    'fifth-grade': {
        name: "5th Grade Cursive",
        fontFamily: "'FifthGradeCursive', cursive",
        fontSize: '50px',
        lineHeight: '1.5'
    },
    'cookie': {
        name: "Adult Cursive",
        fontFamily: "'Cookie', cursive",
        fontSize: '80px',
        lineHeight: '1.1'
    },
    'monsieur': {
        name: "Fancy Cursive 1",
        fontFamily: "'Monsieur La Doulaise', cursive",
        fontSize: '70px',
        lineHeight: '1.2'
    },
    'parisienne': {
        name: "Fancy Cursive 2",
        fontFamily: "'Parisienne', cursive",
        fontSize: '60px',
        lineHeight: '1.3'
    },
    'allura': {
        name: "Fancy Cursive 3",
        fontFamily: "'Allura', cursive",
        fontSize: '70px',
        lineHeight: '1.2'
    },
    'satisfy': {
        name: "Fancy Cursive 4",
        fontFamily: "'Satisfy', cursive",
        fontSize: '50px',
        lineHeight: '1.4'
    }
};

export default function CursiveLettersGenerator({ basePath = '' }: CursiveLettersGeneratorProps) {
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
        addToFavorites: originalAddToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        favoritesKey: "cursiveLettersFavorites",
        apiEndpoint: "/api/generate/words",
        itemName: "cursive letters",
        defaultType: 'cursive-letter',
        autoGenerate: true
    });

    // Ensure we only add strings to favorites
    const addToFavorites = (item: any) => {
        const itemStr = typeof item === 'string' ? item : (item?.word || String(item));
        originalAddToFavorites(itemStr);
    };

    // Cursive-specific state
    const [caseType, setCaseType] = useState('mixed');
    const [selectedFont, setSelectedFont] = useState('dnealian');
    const [showPrintedLetter, setShowPrintedLetter] = useState(false);

    // Load Google Fonts dynamically
    useEffect(() => {
        const googleFonts = ['Cookie', 'Monsieur La Doulaise', 'Parisienne', 'Allura', 'Satisfy'];
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?${googleFonts.map(font => `family=${font.replace(' ', '+')}`).join('&')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    // Use the shared form state management hook with custom param builder
    const formState = useGeneratorForm({
        wordType: 'cursive-letter',
        onGenerate: generateWords,
        setShowFavorites,
        setQuantity,
        customParamBuilder: (baseParams) => {
            baseParams.case = caseType;
            return baseParams;
        }
    });

    const handleReset = () => {
        setCaseType('mixed');
        setSelectedFont('dnealian');
        setShowPrintedLetter(false);
        formState.resetOptions();
    };

    // Custom options for the form
    const customOptions = (
        <>
            {/* Case Type Radio Buttons */}
            <div className="mb-4">
                <fieldset>
                    <legend className="block font-medium text-gray-700 mb-2">
                        Letter Case:
                    </legend>
                    <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="case-type"
                                value="mixed"
                                checked={caseType === 'mixed'}
                                onChange={(e) => setCaseType(e.target.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            />
                            <span className="ml-2 text-gray-700">Mixed Case (A-Z, a-z)</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="case-type"
                                value="uppercase"
                                checked={caseType === 'uppercase'}
                                onChange={(e) => setCaseType(e.target.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            />
                            <span className="ml-2 text-gray-700">Capital Letters (A-Z)</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="case-type"
                                value="lowercase"
                                checked={caseType === 'lowercase'}
                                onChange={(e) => setCaseType(e.target.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                            />
                            <span className="ml-2 text-gray-700">Lowercase Letters (a-z)</span>
                        </label>
                    </div>
                </fieldset>
            </div>

            {/* Font Selection Dropdown */}
            <div className="mb-4">
                <label htmlFor="font-select" className="block font-medium text-gray-700 mb-2">
                    Cursive Font Style:
                </label>
                <select
                    id="font-select"
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                    {Object.entries(CURSIVE_FONTS).map(([key, font]) => (
                        <option key={key} value={key}>
                            {font.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Show Printed Letter Checkbox */}
            <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showPrintedLetter}
                        onChange={(e) => setShowPrintedLetter(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-gray-700">Include printed letter</span>
                </label>
            </div>
        </>
    );

    // Custom cursive display component
    const CursiveDisplay = () => {
        const currentFont = CURSIVE_FONTS[selectedFont as keyof typeof CURSIVE_FONTS];

        // Helper function to extract display value from WordItem
        const getDisplayValue = (item: any): string => {
            if (typeof item === 'string') return item;
            return item?.word || item?.value || String(item);
        };

        const displayItems = showFavorites ? favorites : words.map(getDisplayValue);

        return (
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col relative min-h-[200px] md:min-h-[400px]">
                {/* Action buttons */}
                <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                    {favorites.length > 0 && (
                        <button
                            onClick={() => setShowFavorites(!showFavorites)}
                            className={`group flex items-center gap-1 text-sm px-3 py-2 rounded cursor-pointer ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        >
                            <Heart className={`w-5 h-5 ${showFavorites ? 'fill-red-500 text-red-500' : 'text-gray-600 group-hover:text-red-500'}`} />
                            {!showFavorites && `(${favorites.length})`}
                        </button>
                    )}
                    {displayItems.length > 0 && (
                        <button
                            onClick={copyToClipboard}
                            className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded cursor-pointer"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className={`flex-1 flex items-center ${displayItems.length === 1 && !showFavorites ? '-translate-y-8' : ''}`}>
                    <div className="w-full">
                        {showLoading ? (
                            <div className="text-center py-8">
                                <RefreshCw className="w-8 h-8 text-gray-500 animate-spin mx-auto" />
                            </div>
                        ) : displayItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                {showFavorites ? 'No favorites yet' : 'Click "Generate" to start'}
                            </div>
                        ) : displayItems.length === 1 && !showFavorites ? (
                            /* Single item display - large format */
                            <div className="text-center">
                                <div className="flex items-baseline justify-center gap-6 w-full">
                                    <div
                                        className="font-bold text-gray-800"
                                        style={{
                                            fontFamily: currentFont.fontFamily,
                                            fontSize: currentFont.fontSize,
                                            lineHeight: currentFont.lineHeight,
                                            paddingTop: selectedFont === 'fifth-grade' ? '20px' : '10px',
                                            paddingBottom: '10px',
                                        }}
                                    >
                                        {displayItems[0]}
                                    </div>
                                    <button
                                        onClick={() => favorites.includes(displayItems[0]) ? removeFromFavorites(displayItems[0]) : addToFavorites(displayItems[0])}
                                        className="text-gray-400 hover:text-red-500 transition-colors self-center cursor-pointer"
                                    >
                                        <Heart className={`w-6 h-6 transition-colors ${favorites.includes(displayItems[0]) ? 'fill-red-500 text-red-500' : ''}`} />
                                    </button>
                                </div>
                                {showPrintedLetter && (
                                    <div className="mt-4 text-5xl font-bold text-gray-600 text-center">
                                        {displayItems[0]}
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Multiple items display */
                            <div className="space-y-2">
                                {displayItems.map((item, index) => (
                                    <div key={index} className="group p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div
                                                    className="text-gray-800 font-medium"
                                                    style={{
                                                        fontFamily: currentFont.fontFamily,
                                                        fontSize: '32px',
                                                        lineHeight: currentFont.lineHeight,
                                                        paddingTop: selectedFont === 'fifth-grade' ? '10px' : '5px',
                                                        paddingBottom: '5px',
                                                    }}
                                                >
                                                    {item}
                                                </div>
                                                {showPrintedLetter && (
                                                    <div className="text-2xl font-bold text-gray-600 mt-1">
                                                        {item}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-3">
                                                {!showFavorites ? (
                                                    <button
                                                        onClick={() => favorites.includes(item) ? removeFromFavorites(item) : addToFavorites(item)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    >
                                                        <Heart className={`w-4 h-4 transition-colors ${favorites.includes(item) ? 'fill-red-500 text-red-500' : ''}`} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => removeFromFavorites(item)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Clear List button */}
                {showFavorites && favorites.length > 0 && (
                    <div className="mt-4 text-right">
                        <button
                            onClick={clearAllFavorites}
                            className="text-sm px-3 py-1 rounded text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                        >
                            Clear List
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <BaseGeneratorForm
                        title="Cursive Letters Generator"
                        itemName="Cursive Letters"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        showNoDuplicates={false}
                        customOptions={customOptions}
                        onGenerate={formState.handleGenerate}
                        onReset={handleReset}
                        {...formState}
                    />

                    {/* Right Column - Results */}
                    <div className="w-full">
                        <CursiveDisplay />
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        {/* Left Column - Article Content */}
                        <ArticleContent>
                            <p>In all likelihood, you ended up on this page because you were searching for cursive letters. If that happens to be the case, you're in luck. The Cursive Letters Generator was built specifically for those who were looking for cursive writing and all of the letters of the cursive alphabet. The best part is that this tool offers a number of different cursive letter options so you're able to adapt it to your specific needs. You can also go to <a href="https://cursiveletters.com/" className="text-blue-600 hover:underline">Cursive Letters</a> if you're looking for information on how to actually write the different letters of the alphabet in cursive.</p>

                            <p>One of the most useful options of this generator is that you aren't limited to a single cursive font. Cursive writing looks quite different depending on who is doing the writing. 5th-grade cursive letters often look a lot different than adult cursive letters. This generator allows you to pick between a number of different cursive fonts so you can use the one that best meets your needs.</p>

                            <p>Once making your cursive font choice, the next step is to decide on whether you want to see lowercase or capital cursive letters. You can also choose to display both lowercase and capital cursive letters at the same time. Then the last step is to choose the number of random cursive letters you want to be displayed. That's really all there is to it. You can then click the "generate cursive letters" button and the number of letters you chose to view will instantly appear. If you're more interested in cursive words, you can check that box and have these appear. You also have the option to see cursive sentences and cursive paragraphs.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Cursive Alphabet</h2>

                            <p>One of the most common ways people use this generator is to get better with the cursive alphabet. They may need to know something as simple as what a <a href="https://cursiveletters.com/cursive-f" className="text-blue-600 hover:underline">cursive f</a> looks like, or something as advanced as practicing reading from cursive paragraphs. Whatever your current needs are with cursive letters, taking the time to learn the cursive alphabet and then practicing what you learn will help you become more comfortable with it.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Cursive Capital Letters</h2>

                            <p>One of the issues a lot of people have is with cursive capital letters. Some of them are distinctly different than printed letters so they can get quite confusing. This is especially true with the <a href="https://cursiveletters.com/cursive-capital-g" className="text-blue-600 hover:underline">capital cursive G</a> and the <a href="https://cursiveletters.com/cursive-capital-i" className="text-blue-600 hover:underline">capital cursive I</a>. The cursive letters generator allows you to randomly produce capital letters so you can become more familiar with all of them. Again, since there are a number of different cursive fonts to choose from when displaying the letters, you can see how different cursive writing can vary.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Cursive Lower Case Letters</h2>

                            <p>In the same way that there are certain capital cursive letters that give people issues, the same is also true with lowercase cursive letters. The big one seems to be the lowercase cursive f, but also includes the <a href="https://cursiveletters.com/cursive-s" className="text-blue-600 hover:underline">cursive s</a> and the <a href="https://cursiveletters.com/cursive-j" className="text-blue-600 hover:underline">cursive j</a>. Just as with the capital cursive letters, the generator gives you plenty of options to practice all of these lower case cursive letters.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Cursive Writing</h2>

                            <p>For those who want to better their cursive writing, this can be an excellent tool. You can generate random letters and then write them out on a piece of paper. Then once you have mastered letter cursive writing, you can move onto cursive words. The progression can then follow to cursive sentences and even cursive paragraphs. The more you practice writing in cursive, the more comfortable you'll become using it in everyday life.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Cursive Reading</h2>

                            <p>One of the main reasons a lot of kids want to learn cursive writing is so they can read what their parents are writing. The problem is that there often aren't many good opportunities to practice reading cursive writing. This generator gives anyone that opportunity. There are plenty of cursive sentences and paragraphs to generate to practice your cursive reading skills.</p>

                            <p>We appreciate that you found our cursive letters generator and would love to hear your opinions about it. We'd especially be interested in learning exactly how you personally use it. We're often surprised by the ways our generators get used that we never anticipated when we first created them, but understanding how they're used can help us improve them in the future. Please take a minute to contact us and let us know your suggestions on how we can make this tool better.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Do I still need to learn cursive writing?</h3>
                                        <p>While cursive writing isn't as prevalent as it was 50 years ago, there are still quite a few advantages to learning it. One of the biggest is that it increases your writing speed when compared to printing. It has also been shown that cursive writing improves neural connections and fine motor skills.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What are difficult lower case cursive letters to write?</h3>
                                        <p>Some of the lower case cursive letters that many people have difficulty learning when they first begin cursive writing are the cursive b, the cursive f, the cursive k, and the cursive z.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What are difficult capital cursive letters to write?</h3>
                                        <p>While it varies from person to person, some of the capital cursive letters people have difficulty learning when they begin writing in cursive are the capital cursive G, the capital cursive Q, and the capital cursive S.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/cursive-letter" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
