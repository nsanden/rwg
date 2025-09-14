import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

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
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Random Word Generator</h1>

            <form>
                {/* Number of Words */}
                <div className="mb-4">
                    <label className="font-medium text-gray-700 mr-3">
                        Number of Words:
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* More Options */}
                {showMoreOptions && (
                    <div>
                        {/* Word Type */}
                        <div className="mb-4">
                            <label className="font-medium text-gray-700 mr-3">
                                Word Type:
                            </label>
                            <select
                                value={wordType}
                                onChange={(e) => setWordType(e.target.value)}
                                className="inline-block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All</option>
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
                                <label className="font-medium text-gray-700 mr-3">
                                    Language:
                                </label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="inline-block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                        {/* First and Last Letter */}
                        <div className="mb-4">
                            <label className="font-medium text-gray-700 mr-3">
                                First letter:
                            </label>
                            <input
                                type="text"
                                maxLength={1}
                                value={firstLetter}
                                onChange={(e) => setFirstLetter(e.target.value)}
                                className="inline-block w-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-6"
                            />
                            <label className="font-medium text-gray-700 mr-3">
                                Last letter:
                            </label>
                            <input
                                type="text"
                                maxLength={1}
                                value={lastLetter}
                                onChange={(e) => setLastLetter(e.target.value)}
                                className="inline-block w-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Word Size */}
                        <div className="mb-4">
                            <span className="font-medium text-gray-700 mr-4">Word size by:</span>
                            <label className="inline-flex items-center mr-4">
                                <input
                                    type="radio"
                                    value="syllables"
                                    checked={wordSizeType === 'syllables'}
                                    onChange={(e) => setWordSizeType(e.target.value)}
                                    className="mr-2"
                                />
                                <span>Syllables</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="letters"
                                    checked={wordSizeType === 'letters'}
                                    onChange={(e) => setWordSizeType(e.target.value)}
                                    className="mr-2"
                                />
                                <span>Letters</span>
                            </label>

                            {wordSizeType && (
                                <div className="mt-3">
                                    <select
                                        value={comparing}
                                        onChange={(e) => setComparing(e.target.value)}
                                        className="inline-block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                                    >
                                        <option value="equals">Equals</option>
                                        <option value="less_than">Less Than</option>
                                        <option value="greater_than">Greater Than</option>
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        value={count}
                                        onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                                        className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Reset Button and More Options Toggle */}
                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={resetOptions}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                            >
                                Reset Options
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowMoreOptions(!showMoreOptions)}
                                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {showMoreOptions ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                                {showMoreOptions ? 'Less' : 'More'} Options
                            </button>
                        </div>
                    </div>
                )}

                {!showMoreOptions && (
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowMoreOptions(!showMoreOptions)}
                            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {showMoreOptions ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                            {showMoreOptions ? 'Hide' : 'Show'} More Options
                        </button>
                    </div>
                )}

                {/* Generate Button */}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={generateWords}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? (
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <RefreshCw className="w-5 h-5 mr-2" />
                        )}
                        Generate Random Words
                    </button>
                </div>
            </form>
        </div>
    );
}