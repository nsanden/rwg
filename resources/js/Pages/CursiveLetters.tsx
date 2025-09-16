import SEO from '@/Components/SEO';
import { useState, useEffect } from 'react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from "@/hooks/useGenerator";
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { Heart, Copy, X } from 'lucide-react';

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

export default function CursiveLetters() {
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

    // Load Google Fonts dynamically and clean up corrupted favorites
    useEffect(() => {
        const googleFonts = ['Cookie', 'Monsieur La Doulaise', 'Parisienne', 'Allura', 'Satisfy'];
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?${googleFonts.map(font => `family=${font.replace(' ', '+')}`).join('&')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Clean up any corrupted favorites data (objects instead of strings)
        const saved = localStorage.getItem('cursiveLettersFavorites');
        if (saved) {
            try {
                const favorites = JSON.parse(saved);
                const cleanFavorites = favorites.filter((item: any) => typeof item === 'string');
                if (cleanFavorites.length !== favorites.length) {
                    localStorage.setItem('cursiveLettersFavorites', JSON.stringify(cleanFavorites));
                }
            } catch (e) {
                localStorage.removeItem('cursiveLettersFavorites');
            }
        }

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
            baseParams.font = selectedFont;
            baseParams.showPrinted = showPrintedLetter;
            return baseParams;
        },
        customState: {
            caseType: {
                value: caseType,
                setter: setCaseType,
                defaultValue: 'mixed'
            },
            selectedFont: {
                value: selectedFont,
                setter: setSelectedFont,
                defaultValue: 'dnealian'
            },
            showPrintedLetter: {
                value: showPrintedLetter,
                setter: setShowPrintedLetter,
                defaultValue: false
            }
        }
    });

    // Case type options component
    const caseOptions = (
        <div className="mb-4">
            <fieldset>
                <legend className="block font-medium text-gray-700 mb-2">
                    Letter Case:
                </legend>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="case-type"
                            value="mixed"
                            checked={caseType === 'mixed'}
                            onChange={(e) => setCaseType(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Mixed Case (A-Z, a-z)</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="case-type"
                            value="uppercase"
                            checked={caseType === 'uppercase'}
                            onChange={(e) => setCaseType(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Capital Letters (A-Z)</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="case-type"
                            value="lowercase"
                            checked={caseType === 'lowercase'}
                            onChange={(e) => setCaseType(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Lowercase Letters (a-z)</span>
                    </label>
                </div>
            </fieldset>
        </div>
    );

    // Font selection component
    const fontOptions = (
        <div className="mb-4">
            <label htmlFor="font-select" className="block font-medium text-gray-700 mb-2">
                Cursive Font Style:
            </label>
            <select
                id="font-select"
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
                {Object.entries(CURSIVE_FONTS).map(([key, font]) => (
                    <option key={key} value={key}>
                        {font.name}
                    </option>
                ))}
            </select>
        </div>
    );

    // Show printed letter option
    const printedLetterOption = (
        <div className="mb-4">
            <label className="flex items-center">
                <input
                    type="checkbox"
                    checked={showPrintedLetter}
                    onChange={(e) => setShowPrintedLetter(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">Include printed letter</span>
            </label>
        </div>
    );

    const customOptions = (
        <>
            {caseOptions}
            {fontOptions}
            {printedLetterOption}
        </>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Cursive Letters Generator"
            itemName="Cursive Letters"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            showLetterFilters={false}
            showSizeFilter={false}
            customOptions={customOptions}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            {...formState}
        />
    );

    // Custom cursive display component that handles printed letter option
    const CursiveDisplay = () => {
        const currentFont = CURSIVE_FONTS[selectedFont as keyof typeof CURSIVE_FONTS];

        if (showLoading) {
            return (
                <div className="bg-white rounded-lg shadow-lg p-6 flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        if (words.length === 0) {
            return (
                <div className="bg-white rounded-lg shadow-lg p-6 flex justify-center items-center min-h-[200px]">
                    <div className="text-center py-8 text-gray-500">
                        Click "Generate Cursive Letters" to start
                    </div>
                </div>
            );
        }

        // Helper function to extract display value from WordItem
        const getDisplayValue = (item: any): string => {
            if (typeof item === 'string') return item;
            return item?.word || item?.value || String(item);
        };

        const displayItems = showFavorites ? favorites : words.map(getDisplayValue);

        return (
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col relative min-h-[200px]">
                {/* Action buttons */}
                <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                    {favorites.length > 0 && (
                        <button
                            onClick={() => setShowFavorites(!showFavorites)}
                            className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        >
                            <Heart className={`w-5 h-5 ${showFavorites ? 'fill-red-500 text-red-500' : 'text-gray-600 group-hover:text-red-500'}`} />
                            {!showFavorites && `(${favorites.length})`}
                        </button>
                    )}
                    <button
                        onClick={copyToClipboard}
                        className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded"
                    >
                        <Copy className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center">
                    <div className="w-full">
                        {displayItems.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No favorites yet
                            </div>
                        ) : displayItems.length === 1 ? (
                            /* Single item display */
                            <div className="text-center">
                                <div className="flex items-baseline justify-center gap-3 w-full">
                                    <div className="font-bold text-gray-800 max-w-full text-6xl">
                                        <div
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
                                    </div>
                                    {!showFavorites && (
                                        <button
                                            onClick={() => favorites.includes(displayItems[0]) ? removeFromFavorites(displayItems[0]) : addToFavorites(displayItems[0])}
                                            className="text-gray-400 hover:text-red-500 transition-colors self-center"
                                            style={{ marginLeft: '10px' }}
                                        >
                                            <Heart className={`w-6 h-6 transition-colors ${favorites.includes(displayItems[0]) ? 'fill-red-500 text-red-500' : ''}`} />
                                        </button>
                                    )}
                                </div>
                                {showPrintedLetter && (
                                    <div className="mt-4 text-2xl font-bold text-gray-600 text-center">
                                        {displayItems[0]} <span className="text-sm text-gray-500">(printed)</span>
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
                                                    className="text-gray-800 font-medium text-lg"
                                                    style={{
                                                        fontFamily: currentFont.fontFamily,
                                                        fontSize: '24px',
                                                        lineHeight: currentFont.lineHeight,
                                                        paddingTop: selectedFont === 'fifth-grade' ? '10px' : '5px',
                                                        paddingBottom: '5px',
                                                    }}
                                                >
                                                    {item}
                                                </div>
                                                {showPrintedLetter && (
                                                    <div className="text-sm text-gray-600 mt-1">
                                                        {item} <span className="text-xs text-gray-500">(printed)</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-3">
                                                {!showFavorites ? (
                                                    <button
                                                        onClick={() => favorites.includes(item) ? removeFromFavorites(item) : addToFavorites(item)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                        style={{ marginLeft: '10px' }}
                                                    >
                                                        <Heart className={`w-4 h-4 transition-colors ${favorites.includes(item) ? 'fill-red-500 text-red-500' : ''}`} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => removeFromFavorites(item)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
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

                {/* Clear List button - shown below favorites when viewing favorites */}
                {showFavorites && favorites.length > 0 && (
                    <div className="mt-4 text-right">
                        <button
                            onClick={clearAllFavorites}
                            className="text-sm px-3 py-1 rounded text-gray-600 hover:text-red-600 transition-colors"
                            aria-label={`Clear all ${favorites.length} favorite cursive letters`}
                        >
                            Clear List
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const resultsPanel = <CursiveDisplay />;

    const articleContent = (
        <>
            <p>The Cursive Letters Generator creates cursive letters including cursive capital letters. You can choose from multiple cursive font styles and practice both uppercase and lowercase cursive writing. This tool is perfect for students learning cursive handwriting, teachers creating practice sheets, or anyone wanting to see letters in beautiful cursive script.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">What are Cursive Letters?</h2>

            <p>Cursive letters are a style of handwriting where letters are connected in a flowing manner. Also known as script or longhand, cursive writing was once the standard form of writing taught in schools. The cursive alphabet includes both capital letters (uppercase) and lowercase letters, each with their own distinctive flowing style.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Benefits of Learning Cursive Writing</h2>

            <p>Learning cursive writing offers several educational and developmental benefits:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Fine Motor Skills:</strong> Cursive writing helps develop hand-eye coordination and fine motor control</li>
                <li><strong>Reading Historical Documents:</strong> Many historical documents are written in cursive, making this skill valuable for reading primary sources</li>
                <li><strong>Brain Development:</strong> Studies suggest cursive writing can improve brain development and memory retention</li>
                <li><strong>Writing Speed:</strong> Once mastered, cursive writing can be faster than print writing</li>
                <li><strong>Personal Signature:</strong> Cursive skills are essential for developing a distinctive personal signature</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Cursive Capital Letters</h2>

            <p>Cursive capital letters (uppercase letters) are often more decorative and complex than their lowercase counterparts. Each capital letter in cursive has its own unique form and connecting strokes. Some cursive capital letters like A, G, and Q have particularly distinctive appearances that differ significantly from their printed forms.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Cursive Lowercase Letters</h2>

            <p>Cursive lowercase letters are designed to connect smoothly to the next letter in a word. These letters form the foundation of cursive writing and are typically taught first. The connections between cursive lowercase letters create the flowing appearance that makes cursive writing distinctive.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Different Cursive Font Styles</h2>

            <p>Our cursive letters generator offers several different cursive font styles to choose from:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>D'Nealian Cursive:</strong> A modern teaching style that bridges print and cursive writing</li>
                <li><strong>5th Grade Cursive:</strong> Traditional school cursive style commonly taught in elementary schools</li>
                <li><strong>Adult Cursive:</strong> A mature, elegant cursive style suitable for formal writing</li>
                <li><strong>Fancy Cursive Styles:</strong> Decorative cursive fonts perfect for invitations and artistic purposes</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How to Use This Tool</h2>

            <p>Using our cursive letters generator is simple:</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
                <li>Select the number of cursive letters you want to generate</li>
                <li>Choose between capital letters, lowercase letters, or mixed case</li>
                <li>Pick your preferred cursive font style from the dropdown menu</li>
                <li>Optionally include the printed letter alongside the cursive version for comparison</li>
                <li>Click "Generate Cursive Letters" to see your results</li>
            </ol>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Educational Applications</h2>

            <p>This cursive letters generator is perfect for various educational purposes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Handwriting Practice:</strong> Generate random letters for daily cursive writing practice</li>
                <li><strong>Letter Recognition:</strong> Help students identify and memorize cursive letter forms</li>
                <li><strong>Worksheet Creation:</strong> Teachers can use this tool to create custom practice worksheets</li>
                <li><strong>Assessment:</strong> Test students' ability to read and write cursive letters</li>
                <li><strong>Home Schooling:</strong> Parents can create cursive writing activities for their children</li>
            </ul>

            <div className="mt-8" id="faq">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What is the difference between cursive and print letters?</h3>
                        <p>Cursive letters are connected in a flowing style, while print letters are separate and distinct. Cursive writing allows for faster writing once mastered, as the pen doesn't need to be lifted between letters within a word.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Should I learn cursive capital letters or lowercase letters first?</h3>
                        <p>Most educators recommend starting with cursive lowercase letters, as they are used more frequently and form the foundation of cursive writing. Once lowercase letters are mastered, you can move on to cursive capital letters.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Is cursive writing still taught in schools?</h3>
                        <p>Cursive writing instruction varies by location and school district. While some schools have reduced cursive instruction in favor of keyboarding skills, many educators and parents still value cursive writing for its cognitive and historical benefits.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I use this tool to practice reading cursive?</h3>
                        <p>Absolutely! This tool is excellent for practicing cursive reading skills. You can generate random cursive letters and practice identifying them, which helps improve your ability to read cursive handwriting and historical documents.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What's the best way to practice cursive writing?</h3>
                        <p>Start with proper posture and pencil grip, practice basic cursive strokes, then move to individual letters. Use this generator to practice random letters, which helps prevent memorizing letter sequences. Regular practice with proper technique is key to developing good cursive handwriting.</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Cursive Letters — The Cursive Alphabet Including Cursive Capital Letters"
                description="The Cursive Letters Generator creates cursive letters including cursive capital letters."
                keywords={['cursive letters', 'cursive alphabet', 'cursive capital letters', 'cursive writing', 'cursive generator', 'handwriting practice']}
                ogImage="https://randomwordgenerator.com/img/cursive-letters.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Cursive Letters Generator - Practice Cursive Writing"
                currentPage="/cursive-letter.php"
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