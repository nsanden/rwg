import { Heart, Copy, X } from 'lucide-react';

interface WordsDisplayProps {
    words: string[];
    favorites: string[];
    showFavorites: boolean;
    setShowFavorites: (value: boolean) => void;
    quantity: number;
    loading: boolean;
    addToFavorites: (word: string) => void;
    removeFromFavorites: (word: string) => void;
    copyToClipboard: () => void;
}

export default function WordsDisplay({
    words,
    favorites,
    showFavorites,
    setShowFavorites,
    quantity,
    loading,
    addToFavorites,
    removeFromFavorites,
    copyToClipboard,
}: WordsDisplayProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {showFavorites ? `Saved Words (${favorites.length})` : ''}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`text-sm px-3 py-1 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600'} transition-colors`}
                        aria-pressed={showFavorites}
                        aria-label={showFavorites ? 'Switch to view generated words' : `Switch to view saved favorites (${favorites.length} words)`}
                    >
                        {showFavorites ? 'View Generated' : `View Saved (${favorites.length})`}
                    </button>
                    <button
                        onClick={copyToClipboard}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        aria-label={`Copy ${showFavorites ? favorites.length + ' favorite' : words.length + ' generated'} words to clipboard`}
                    >
                        <Copy className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8" role="status" aria-live="polite">
                        <div className="text-gray-500">Loading...</div>
                    </div>
                ) : (
                    <>
                        {quantity === 1 && !showFavorites ? (
                            // Single word display - large format
                            words.length > 0 && (
                                <div className="text-center py-12">
                                    <div className="text-5xl font-bold text-gray-800 mb-4">
                                        {words[0]}
                                    </div>
                                    <button
                                        onClick={() => favorites.includes(words[0]) ? removeFromFavorites(words[0]) : addToFavorites(words[0])}
                                        className="inline-flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors duration-200"
                                        aria-label={favorites.includes(words[0]) ? `Remove "${words[0]}" from favorites` : `Add "${words[0]}" to favorites`}
                                    >
                                        <Heart className={`w-4 h-4 mr-2 ${favorites.includes(words[0]) ? 'fill-red-500' : ''}`} aria-hidden="true" />
                                        {favorites.includes(words[0]) ? 'Remove' : 'Add to favorites'}
                                    </button>
                                </div>
                            )
                        ) : (
                            // Multiple words or favorites display - list format
                            <div className="space-y-2" role="list" aria-label={showFavorites ? 'Favorite words' : 'Generated words'}>
                                {(showFavorites ? favorites : words).map((word, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
                                        role="listitem"
                                    >
                                        <span className="text-gray-800 font-medium">{word}</span>
                                        <div className="flex items-center gap-2">
                                            {!showFavorites ? (
                                                <button
                                                    onClick={() => addToFavorites(word)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                    aria-label={`Add "${word}" to favorites`}
                                                >
                                                    <Heart className={`w-4 h-4 ${favorites.includes(word) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} aria-hidden="true" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => removeFromFavorites(word)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500"
                                                    aria-label={`Remove "${word}" from favorites`}
                                                >
                                                    <X className="w-4 h-4" aria-hidden="true" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {favorites.length > 0 && !showFavorites && (
                <div className="mt-4 text-sm text-gray-600 text-center">
                    {favorites.length} word{favorites.length !== 1 ? 's' : ''} saved to favorites
                </div>
            )}
        </div>
    );
}