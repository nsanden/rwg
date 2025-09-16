import { Heart, Copy, X, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Type for word data - can be string or object with synonyms/definition
export type WordItem = string | { word: string; synonyms?: string; definition?: string } | { value: string; definition?: string };

interface ItemsDisplayProps {
    words?: WordItem[];  // Keep for backward compatibility
    items?: (string | WordItem)[];    // New generic prop that can handle both
    favorites: string[];
    showFavorites: boolean;
    setShowFavorites: (value: boolean) => void;
    quantity: number;
    loading: boolean;
    addToFavorites: (item: string) => void;
    removeFromFavorites: (item: string) => void;
    copyToClipboard: () => void;
    clearAllFavorites: () => void;
    fontFamily?: 'default' | 'mono';
    itemName?: string;    // For ARIA labels: "words", "sentences", "phrases", "paragraphs"
    textSize?: 'small' | 'medium' | 'large';  // For different content types
    blurDefinitions?: boolean;  // Enable blur/reveal functionality for definitions
}

export default function ItemsDisplay({
    words,
    items,
    favorites,
    showFavorites,
    setShowFavorites,
    quantity,
    loading,
    addToFavorites,
    removeFromFavorites,
    copyToClipboard,
    clearAllFavorites,
    fontFamily = 'default',
    itemName = 'words',
    textSize = 'large',
    blurDefinitions = false,
}: ItemsDisplayProps) {
    const wordRef = useRef<HTMLDivElement>(null);
    const [visibleDefinitions, setVisibleDefinitions] = useState<Set<string>>(new Set());

    // Toggle definition visibility for blur/reveal feature
    const toggleDefinition = (word: string) => {
        setVisibleDefinitions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(word)) {
                newSet.delete(word);
            } else {
                newSet.add(word);
            }
            return newSet;
        });
    };

    // Reset visible definitions when new words are generated
    useEffect(() => {
        if (blurDefinitions) {
            setVisibleDefinitions(new Set());
        }
    }, [words, blurDefinitions]);

    // Helper function to get word string from WordItem - must be defined first
    const getWordString = (item: WordItem): string => {
        if (typeof item === 'string') return item;
        if ('word' in item) return item.word;
        if ('value' in item) return item.value;
        return String(item);
    };

    // Helper function to check if item has synonyms or definition
    const hasAdditionalInfo = (item: WordItem): boolean => {
        return typeof item === 'object' && (('synonyms' in item && !!item.synonyms) || ('definition' in item && !!item.definition));
    };

    // Helper function to get additional info (synonyms or definition)
    const getAdditionalInfo = (item: WordItem): string => {
        if (typeof item === 'object') {
            if ('definition' in item && item.definition) return item.definition;
            if ('synonyms' in item && item.synonyms) return item.synonyms;
        }
        return '';
    };

    // Unified data handling - support both old and new prop patterns
    const displayItems: string[] = (items || words || []).map(item =>
        typeof item === 'string' ? item : getWordString(item)
    );

    // Get font class based on fontFamily prop
    const getFontClass = () => {
        return fontFamily === 'mono' ? 'font-mono' : '';
    };

    // Get text size class based on textSize prop
    const getTextSizeClass = () => {
        switch (textSize) {
            case 'small': return 'text-sm';
            case 'medium': return 'text-base';
            case 'large': return 'text-lg';
            default: return 'text-lg';
        }
    };

    // Get ARIA labels based on item type
    const getAriaLabel = (context: 'generated' | 'favorites') => {
        const type = context === 'favorites' ? `Favorite ${itemName}` : `Generated ${itemName}`;
        return type;
    };

    useEffect(() => {
        if (wordRef.current && displayItems && displayItems[0]) {
            const container = wordRef.current.parentElement;
            if (container) {
                const containerWidth = container.clientWidth - 100; // Account for heart button space
                const item = displayItems[0];
                if (!item) return;

                // Start with a size based on item length and text size setting
                let fontSize = textSize === 'small' ? 40 : textSize === 'medium' ? 60 : 80;
                if (item.length > 18) fontSize = textSize === 'small' ? 16 : textSize === 'medium' ? 20 : 28;
                else if (item.length > 16) fontSize = textSize === 'small' ? 18 : textSize === 'medium' ? 24 : 32;
                else if (item.length > 14) fontSize = textSize === 'small' ? 20 : textSize === 'medium' ? 28 : 36;
                else if (item.length > 12) fontSize = textSize === 'small' ? 24 : textSize === 'medium' ? 32 : 44;
                else if (item.length > 10) fontSize = textSize === 'small' ? 28 : textSize === 'medium' ? 40 : 52;
                else if (item.length > 8) fontSize = textSize === 'small' ? 32 : textSize === 'medium' ? 48 : 60;
                else if (item.length > 6) fontSize = textSize === 'small' ? 36 : textSize === 'medium' ? 54 : 68;

                // Apply the initial size
                wordRef.current.style.fontSize = fontSize + 'px';

                // Adjust down if it doesn't fit
                while (wordRef.current.scrollWidth > containerWidth && fontSize > 20) {
                    fontSize -= 2;
                    wordRef.current.style.fontSize = fontSize + 'px';
                }
            }
        }
    }, [displayItems?.[0], showFavorites, textSize]);

    const getFontSize = () => {
        return '5rem'; // Fallback, will be overridden by useEffect
    };

    // Auto-exit favorites mode when no favorites exist
    useEffect(() => {
        if (showFavorites && favorites?.length === 0) {
            setShowFavorites(false);
        }
    }, [showFavorites, favorites?.length, setShowFavorites]);
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col relative min-h-[200px] md:min-h-[400px]">
            {/* Action buttons - floating on desktop, inline on mobile */}
            <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                {favorites?.length > 0 && (
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        aria-pressed={showFavorites}
                        aria-label={showFavorites ? `Switch to view generated ${itemName}` : `Switch to view saved favorites (${favorites.length} ${itemName})`}
                    >
                        {showFavorites ? (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" aria-hidden="true" />
                        ) : (
                            <>
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" aria-hidden="true" />
                                ({favorites.length})
                            </>
                        )}
                    </button>
                )}
                <button
                    onClick={copyToClipboard}
                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded touch-manipulation"
                    aria-label={`Copy ${showFavorites ? favorites.length + ' favorite' : displayItems.length + ' generated'} ${itemName} to clipboard`}
                >
                    <Copy className="w-5 h-5 transition-colors" aria-hidden="true" />
                </button>
            </div>

            <div className={`flex-1 flex items-center ${displayItems.length === 1 && !showFavorites ? '-translate-y-8' : ''}`} style={{ pointerEvents: 'none' }}>
                <div className="w-full" style={{ pointerEvents: 'auto' }}>
                    {loading ? (
                        <div className="text-center py-8" role="status" aria-live="polite">
                            <RefreshCw className="w-8 h-8 text-gray-500 animate-spin mx-auto" aria-hidden="true" />
                        </div>
                    ) : (
                        <>
                            {displayItems?.length === 1 && !showFavorites ? (
                                // Single item display - large format
                                displayItems?.length > 0 && (
                                    <div className="text-center">
                                        <div className="flex items-baseline justify-center gap-3 w-full">
                                            <div
                                                ref={wordRef}
                                                className={`font-bold text-gray-800 max-w-full ${getFontClass()}`}
                                                style={{
                                                    fontSize: getFontSize(),
                                                    lineHeight: '1.1',
                                                    whiteSpace: 'pre-line'
                                                }}
                                                dangerouslySetInnerHTML={{ __html: displayItems?.[0] || '' }}
                                            />
                                            <button
                                                onClick={() => {
                                                    if (displayItems?.[0]) {
                                                        const itemStr = displayItems[0];
                                                        favorites.includes(itemStr) ? removeFromFavorites(itemStr) : addToFavorites(itemStr);
                                                    }
                                                }}
                                                className="text-gray-400 hover:text-red-500 transition-colors self-center touch-manipulation"
                                                aria-label={(() => {
                                                    if (!displayItems?.[0]) return '';
                                                    const itemStr = displayItems[0];
                                                    return favorites.includes(itemStr) ? `Remove "${itemStr}" from favorites` : `Add "${itemStr}" to favorites`;
                                                })()}
                                            >
                                                <Heart className={`w-6 h-6 transition-colors ${displayItems?.[0] && favorites.includes(displayItems[0]) ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                                            </button>
                                        </div>
                                        {words?.[0] && hasAdditionalInfo(words[0]) && (
                                            <div className="mt-4 text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
                                                {blurDefinitions ? (
                                                    <div
                                                        className={`cursor-pointer transition-all duration-200 ${
                                                            visibleDefinitions.has(getWordString(words[0])) ? '' : 'select-none blur-[2.5px]'
                                                        }`}
                                                        onClick={() => !visibleDefinitions.has(getWordString(words[0])) && toggleDefinition(getWordString(words[0]))}
                                                        title={!visibleDefinitions.has(getWordString(words[0])) ? "Click to show the definition if you don't know the word!" : ""}
                                                    >
                                                        {getAdditionalInfo(words[0])}
                                                    </div>
                                                ) : (
                                                    getAdditionalInfo(words[0])
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            ) : (
                                // Multiple words or favorites display - list format
                                <div>
                                    {showFavorites && favorites.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No favorites yet
                                        </div>
                                    ) : (
                                        <div className="space-y-2" role="list" aria-label={getAriaLabel(showFavorites ? 'favorites' : 'generated')}>
                                            {(showFavorites ? favorites : displayItems).map((item, index) => {
                                            // For favorites, item is always a string
                                            // For displayItems, item is always a string
                                            // Handle both old word format and new item format
                                            const itemStr = typeof item === 'string' ? item :
                                                           (showFavorites ? item as string :
                                                           (words && words[index] ? getWordString(words[index] as WordItem) : item as string));
                                            const additionalInfo = !showFavorites && words && words[index] ? getAdditionalInfo(words[index] as WordItem) : '';
                                            const hasItemAdditionalInfo = !showFavorites && words && words[index] && hasAdditionalInfo(words[index] as WordItem);

                                            return (
                                                <div
                                                    key={index}
                                                    className="group p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                                                    role="listitem"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div
                                                                className={`text-gray-800 font-medium ${getFontClass()} ${getTextSizeClass()}`}
                                                                dangerouslySetInnerHTML={{ __html: itemStr }}
                                                            />
                                                            {hasItemAdditionalInfo && (
                                                                <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                                                                    {blurDefinitions ? (
                                                                        <div
                                                                            className={`cursor-pointer transition-all duration-200 ${
                                                                                visibleDefinitions.has(itemStr) ? '' : 'select-none blur-[2.5px]'
                                                                            }`}
                                                                            onClick={() => !visibleDefinitions.has(itemStr) && toggleDefinition(itemStr)}
                                                                            title={!visibleDefinitions.has(itemStr) ? "Click to show the definition if you don't know the word!" : ""}
                                                                        >
                                                                            {additionalInfo}
                                                                        </div>
                                                                    ) : (
                                                                        additionalInfo
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 ml-3">
                                                            {!showFavorites ? (
                                                                <button
                                                                    onClick={() => favorites.includes(itemStr) ? removeFromFavorites(itemStr) : addToFavorites(itemStr)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors touch-manipulation flex-shrink-0"
                                                                    aria-label={favorites.includes(itemStr) ? `Remove "${itemStr}" from favorites` : `Add "${itemStr}" to favorites`}
                                                                >
                                                                    <Heart className={`w-4 h-4 transition-colors ${favorites.includes(itemStr) ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => removeFromFavorites(itemStr)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors touch-manipulation flex-shrink-0"
                                                                    aria-label={`Remove "${itemStr}" from favorites`}
                                                                >
                                                                    <X className="w-4 h-4 transition-colors" aria-hidden="true" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                            })}
                                        </div>
                                    )}
                                    {favorites.length > 0 && showFavorites && (
                                        <div className="mt-4 text-right">
                                            <button
                                                onClick={clearAllFavorites}
                                                className="text-sm px-3 py-1 rounded text-gray-600 hover:text-red-600 transition-colors"
                                                aria-label={`Clear all ${favorites.length} favorite words`}
                                            >
                                                Clear List
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}