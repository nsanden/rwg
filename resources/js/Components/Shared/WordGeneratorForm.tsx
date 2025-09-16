import { ChevronDown, ChevronUp, Share2, Plus, Minus } from 'lucide-react';
import SocialShareBlock from './SocialShareBlock';
import LetterFilters from '@/Components/Forms/LetterFilters';
import WordSizeFilter from '@/Components/Forms/WordSizeFilter';
import GeneratorButtons from '@/Components/Forms/GeneratorButtons';
import { useState } from 'react';

interface WordGeneratorFormProps {
    quantity: number;
    setQuantity: (value: number) => void;
    wordType: string;
    setWordType: (value: string) => void;
    language: string;
    setLanguage: (value: string) => void;
    firstLetter: string;
    setFirstLetter: (value: string) => void;
    lastLetter: string;
    setLastLetter: (value: string) => void;
    wordSizeType: string;
    setWordSizeType: (value: string) => void;
    comparing: string;
    setComparing: (value: string) => void;
    count: number;
    setCount: (value: number) => void;
    showMoreOptions: boolean;
    setShowMoreOptions: (value: boolean) => void;
    loading: boolean;
    generateWords: () => void;
    resetOptions: () => void;
}

export default function WordGeneratorForm({
    quantity,
    setQuantity,
    wordType,
    setWordType,
    language,
    setLanguage,
    firstLetter,
    setFirstLetter,
    lastLetter,
    setLastLetter,
    wordSizeType,
    setWordSizeType,
    comparing,
    setComparing,
    count,
    setCount,
    showMoreOptions,
    setShowMoreOptions,
    loading,
    generateWords,
    resetOptions,
}: WordGeneratorFormProps) {
    const [showMobileShare, setShowMobileShare] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6" style={{ minWidth: '385px' }}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Random Word Generator</h1>

            <form>
                {/* Number of Words */}
                <div className="mb-4">
                    <label htmlFor="quantity-input" className="font-medium text-gray-700 mr-3">
                        Number of Words:
                    </label>
                    <input
                        id="quantity-input"
                        type="number"
                        min="1"
                        max="100"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Number of words to generate"
                    />
                </div>

                {/* More Options - Hidden on mobile by default, always visible on desktop */}
                <div
                    id="more-options-panel"
                    role="region"
                    aria-labelledby="more-options-heading"
                    className={`${showMoreOptions ? 'block' : 'hidden'} sm:block`}
                >
                    <h2 id="more-options-heading" className="sr-only">Additional Word Generation Options</h2>

                    {/* Word Type */}
                    <div className="mb-4">
                        <label htmlFor="word-type-select" className="font-medium text-gray-700 mr-3">
                            Word Type:
                        </label>
                        <select
                            id="word-type-select"
                            value={wordType}
                            onChange={(e) => setWordType(e.target.value)}
                            className="inline-block pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            aria-label="Select word type"
                        >
                            <option value="all">Common</option>
                            <option value="noun">Nouns</option>
                            <option value="verb">Verbs</option>
                            <option value="adjective">Adjectives</option>
                            <option value="extended">Extended</option>
                            <option value="non-english">Non-English</option>
                        </select>
                    </div>

                    {/* Language (shown only for non-english) */}
                    {wordType === 'non-english' && (
                        <div className="mb-4">
                            <label htmlFor="language-select" className="font-medium text-gray-700 mr-3">
                                Language:
                            </label>
                            <select
                                id="language-select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="inline-block pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                aria-label="Select language for non-English words"
                            >
                                <option value="es">Spanish</option>
                                <option value="hi">Hindi</option>
                                <option value="ar">Arabic</option>
                                <option value="de">German</option>
                                <option value="ru">Russian</option>
                                <option value="zh">Chinese</option>
                                <option value="jp">Japanese</option>
                                <option value="ko">Korean</option>
                                <option value="la">Latin</option>
                                <option value="it">Italian</option>
                            </select>
                        </div>
                    )}

                    {/* Letter Filters */}
                    <LetterFilters
                        firstLetter={firstLetter}
                        setFirstLetter={setFirstLetter}
                        lastLetter={lastLetter}
                        setLastLetter={setLastLetter}
                    />

                    {/* Word Size Filter */}
                    <WordSizeFilter
                        sizeType={wordSizeType}
                        setSizeType={setWordSizeType}
                        comparing={comparing}
                        setComparing={setComparing}
                        count={count}
                        setCount={setCount}
                    />
                </div>

                {/* Mobile toggle for more options and share */}
                <div className="sm:hidden mt-4 flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => setShowMoreOptions(!showMoreOptions)}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                        aria-expanded={showMoreOptions}
                        aria-controls="more-options-panel"
                        aria-label={showMoreOptions ? 'Hide additional options' : 'Show additional options'}
                    >
                        {showMoreOptions ? (
                            <Minus className="w-4 h-4" aria-hidden="true" />
                        ) : (
                            <Plus className="w-4 h-4" aria-hidden="true" />
                        )}
                        {showMoreOptions ? 'Less Options' : 'More Options'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowMobileShare(!showMobileShare)}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label="Toggle social sharing options"
                    >
                        <Share2 className="w-4 h-4" aria-hidden="true" />
                        Share
                    </button>
                </div>

                {/* Generate and Reset Buttons */}
                <GeneratorButtons
                    onGenerate={generateWords}
                    onReset={resetOptions}
                    loading={loading}
                    generateLabel="Generate Random Words"
                />
            </form>

            {/* Social Share Block */}
            <SocialShareBlock
                isExpanded={showMobileShare}
                setIsExpanded={setShowMobileShare}
            />
        </div>
    );
}