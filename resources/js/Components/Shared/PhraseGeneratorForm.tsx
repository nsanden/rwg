import { Share2 } from 'lucide-react';
import SocialShareBlock from './SocialShareBlock';
import GeneratorButtons from '@/Components/Forms/GeneratorButtons';
import { useState } from 'react';

interface PhraseGeneratorFormProps {
    quantity: number;
    setQuantity: (value: number) => void;
    loading: boolean;
    generatePhrases: () => void;
    resetOptions: () => void;
}

export default function PhraseGeneratorForm({
    quantity,
    setQuantity,
    loading,
    generatePhrases,
    resetOptions,
}: PhraseGeneratorFormProps) {
    const [showMobileShare, setShowMobileShare] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6" style={{ minWidth: '385px' }}>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Random Phrase Generator</h1>

            <div>
                <form>
                    {/* Number of Phrases */}
                    <div className="mb-4">
                        <label htmlFor="quantity-input" className="font-medium text-gray-700 mr-3">
                            Number of Phrases:
                        </label>
                        <input
                            id="quantity-input"
                            type="number"
                            min="1"
                            max="100"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Number of phrases to generate"
                        />
                    </div>

                    {/* Mobile share button */}
                    <div className="sm:hidden mt-4 flex justify-end">
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
                        onGenerate={generatePhrases}
                        onReset={resetOptions}
                        loading={loading}
                        generateLabel="Generate Random Phrases"
                    />
                </form>

                {/* Social Share Block */}
                <SocialShareBlock
                    isExpanded={showMobileShare}
                    setIsExpanded={setShowMobileShare}
                />
            </div>
        </div>
    );
}