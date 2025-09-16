import React, { ReactNode } from 'react';
import { Share2, Plus, Minus } from 'lucide-react';
import SocialShareBlock from '@/Components/Shared/SocialShareBlock';
import LetterFilters from '@/Components/Forms/LetterFilters';
import WordSizeFilter from '@/Components/Forms/WordSizeFilter';
import GeneratorButtons from '@/Components/Forms/GeneratorButtons';

interface BaseGeneratorFormProps {
    title: string;
    itemName: string; // e.g., "Adjectives", "Nouns", "Verbs", "Letters"
    quantity: number;
    setQuantity: (quantity: number) => void;
    loading: boolean;

    // Form state from useGeneratorForm hook
    showMoreOptions: boolean;
    setShowMoreOptions: (show: boolean) => void;
    showMobileShare: boolean;
    setShowMobileShare: (show: boolean) => void;
    firstLetter: string;
    setFirstLetter: (letter: string) => void;
    lastLetter: string;
    setLastLetter: (letter: string) => void;
    sizeType: string;
    setSizeType: (type: string) => void;
    comparing: string;
    setComparing: (comparing: string) => void;
    count: number;
    setCount: (count: number) => void;

    // Actions
    onGenerate: () => void;
    onReset: () => void;

    // Optional customization
    showLetterFilters?: boolean;
    showSizeFilter?: boolean;
    sizeFilterLabel?: string;
    customOptions?: ReactNode; // For page-specific options like case type
}

export default function BaseGeneratorForm({
    title,
    itemName,
    quantity,
    setQuantity,
    loading,
    showMoreOptions,
    setShowMoreOptions,
    showMobileShare,
    setShowMobileShare,
    firstLetter,
    setFirstLetter,
    lastLetter,
    setLastLetter,
    sizeType,
    setSizeType,
    comparing,
    setComparing,
    count,
    setCount,
    onGenerate,
    onReset,
    showLetterFilters = true,
    showSizeFilter = true,
    sizeFilterLabel,
    customOptions
}: BaseGeneratorFormProps) {
    const generateLabel = `Generate Random ${itemName}`;
    const quantityLabel = `Number of ${itemName}:`;
    const quantityAriaLabel = `Number of ${itemName?.toLowerCase() || 'items'} to generate`;
    const optionsHeading = `Additional ${itemName} Generation Options`;

    return (
        <div>
            <div className="bg-white rounded-lg shadow-lg p-6" style={{ minWidth: '385px' }}>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{title}</h1>

                <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }}>
                    {/* Number of Items */}
                    <div className="mb-4">
                        <label htmlFor="quantity-input" className="font-medium text-gray-700 mr-3">
                            {quantityLabel}
                        </label>
                        <input
                            id="quantity-input"
                            type="number"
                            min="1"
                            max="100"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label={quantityAriaLabel}
                        />
                    </div>

                    {/* More Options - Hidden on mobile by default, always visible on desktop */}
                    <div
                        id="more-options-panel"
                        role="region"
                        aria-labelledby="more-options-heading"
                        className={`${showMoreOptions ? 'block' : 'hidden'} sm:block`}
                    >
                        <h2 id="more-options-heading" className="sr-only">{optionsHeading}</h2>

                        {/* Custom Options (like case type for letters) */}
                        {customOptions}

                        {/* Letter Filters */}
                        {showLetterFilters && (
                            <LetterFilters
                                firstLetter={firstLetter}
                                setFirstLetter={setFirstLetter}
                                lastLetter={lastLetter}
                                setLastLetter={setLastLetter}
                            />
                        )}

                        {/* Size Filter */}
                        {showSizeFilter && (
                            <WordSizeFilter
                                label={sizeFilterLabel || `${itemName} size by:`}
                                sizeType={sizeType}
                                setSizeType={setSizeType}
                                comparing={comparing}
                                setComparing={setComparing}
                                count={count}
                                setCount={setCount}
                            />
                        )}
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
                        onGenerate={onGenerate}
                        onReset={onReset}
                        loading={loading}
                        generateLabel={generateLabel}
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