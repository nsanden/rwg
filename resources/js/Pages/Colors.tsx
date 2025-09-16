import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import SEO from '@/Components/SEO';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { useState, useEffect } from 'react';
import { Heart, Copy, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface ColorData {
    RAL: string;
    RGB: string;
    HEX: string;
    German: string;
    English: string;
    French: string;
    Spanish: string;
    Italian: string;
    Nederlands: string;
}

export default function Colors() {
    const [colors, setColors] = useState<ColorData[]>([]);
    const [favoriteColors, setFavoriteColors] = useState<ColorData[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('colorsFavoritesObjects');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Check if it's an array of strings (old format) or objects (new format)
                if (parsed.length > 0 && typeof parsed[0] === 'string') {
                    // Old format - just color names, we need to clear this and start fresh
                    // since we can't reconstruct the full color data without loading all colors
                    console.log('Converting old favorites format, clearing favorites...');
                    localStorage.removeItem('colorsFavoritesObjects');
                    // Also clear the useGenerator favorites to keep them in sync
                    localStorage.setItem('colorsFavoritesObjects', JSON.stringify([]));
                    return [];
                }
                // New format - array of color objects
                return parsed;
            }
        }
        return [];
    });

    const {
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        addToFavorites: addToFavoritesHook,
        removeFromFavorites: removeFromFavoritesHook,
        clearAllFavorites: clearAllFavoritesHook,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: false, // We'll handle this manually since colors are different
        favoritesKey: 'colorsFavoritesLegacy', // Use different key to avoid conflicts
        apiEndpoint: '/api/generate/colors',
        itemName: 'colors'
    });

    const addToFavorites = (colorName: string) => {
        const colorData = colors.find(c => c.English === colorName);
        if (colorData && !favoriteColors.some(fc => fc.English === colorName)) {
            const updated = [...favoriteColors, colorData];
            setFavoriteColors(updated);
            // Save the complete color objects to localStorage
            localStorage.setItem('colorsFavoritesObjects', JSON.stringify(updated));
            addToFavoritesHook(colorName);
        }
    };

    const removeFromFavorites = (colorName: string) => {
        const updated = favoriteColors.filter(fc => fc.English !== colorName);
        setFavoriteColors(updated);
        localStorage.setItem('colorsFavoritesObjects', JSON.stringify(updated));
        removeFromFavoritesHook(colorName);
    };

    const clearAllFavorites = () => {
        setFavoriteColors([]);
        localStorage.removeItem('colorsFavoritesObjects');
        clearAllFavoritesHook();
    };

    const generateColors = async () => {
        try {
            const response = await fetch(`/api/generate/colors?quantity=${quantity}`);
            const data = await response.json();

            if (data.success) {
                setColors(data.colors);
                setShowFavorites(false);
            }
        } catch (error) {
            console.error('Error generating colors:', error);
        }
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'colors',
        onGenerate: generateColors,
        setShowFavorites,
        setQuantity
    });

    // Auto-generate on mount
    useEffect(() => {
        generateColors();
    }, []);

    const formPanel = (
        <BaseGeneratorForm
            title="Random Color Generator"
            itemName="Colors"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            showLetterFilters={false}
            showSizeFilter={false}
            {...formState}
        />
    );

    const resultsPanel = (
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col relative min-h-[200px] md:min-h-[400px]">
            {/* Action buttons */}
            <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                {favoriteColors?.length > 0 && (
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        aria-pressed={showFavorites}
                        aria-label={showFavorites ? 'Switch to view generated colors' : `Switch to view saved favorites (${favoriteColors.length} colors)`}
                    >
                        {showFavorites ? (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        ) : (
                            <>
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                                ({favoriteColors.length})
                            </>
                        )}
                    </button>
                )}
                <button
                    onClick={() => {
                        const itemsToCopy = showFavorites ?
                            favoriteColors.map(color => `${color.English} - ${color.HEX}`) :
                            colors.map(c => `${c.English} - ${c.HEX}`);

                        const text = itemsToCopy.join('\n');
                        navigator.clipboard.writeText(text);
                        const count = itemsToCopy.length;
                        const itemType = showFavorites ? 'favorite color' : 'color';
                        toast.success(`Copied ${count} ${itemType}${count !== 1 ? 's' : ''} to clipboard`);
                    }}
                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded touch-manipulation"
                    aria-label={`Copy ${showFavorites ? favoriteColors.length + ' favorite' : colors.length + ' generated'} colors to clipboard`}
                >
                    <Copy className="w-5 h-5 transition-colors" />
                </button>
            </div>

            <div className={`flex-1 flex items-center ${colors.length === 1 && !showFavorites ? '-translate-y-8' : ''}`} style={{ pointerEvents: 'none' }}>
                <div className="w-full" style={{ pointerEvents: 'auto' }}>
                    {showLoading ? (
                        <div className="text-center py-8" role="status" aria-live="polite">
                            <RefreshCw className="w-8 h-8 text-gray-500 animate-spin mx-auto" />
                        </div>
                    ) : (
                        <>
                            {colors?.length === 1 && !showFavorites ? (
                                // Single color display - large format
                                colors?.length > 0 && (
                                    <div className="text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div
                                                className="w-48 h-48 rounded-lg shadow-lg border border-gray-200 mx-auto"
                                                style={{ backgroundColor: colors[0].HEX }}
                                                title={`${colors[0].English} - ${colors[0].HEX}`}
                                            />
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h2 className="text-4xl font-bold text-gray-800">
                                                        {colors[0].English}
                                                    </h2>
                                                    <button
                                                        onClick={() => {
                                                            favoriteColors.some(fc => fc.English === colors[0].English)
                                                                ? removeFromFavorites(colors[0].English)
                                                                : addToFavorites(colors[0].English);
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 transition-colors touch-manipulation"
                                                        aria-label={favoriteColors.some(fc => fc.English === colors[0].English) ? `Remove "${colors[0].English}" from favorites` : `Add "${colors[0].English}" to favorites`}
                                                    >
                                                        <Heart className={`w-6 h-6 transition-colors ${favoriteColors.some(fc => fc.English === colors[0].English) ? 'fill-red-500 text-red-500' : ''}`} />
                                                    </button>
                                                </div>
                                                <div className="text-lg text-gray-600 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span><strong>HEX:</strong> {colors[0].HEX}</span>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(colors[0].HEX);
                                                                toast.success(`Copied ${colors[0].HEX} to clipboard`);
                                                            }}
                                                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                                                            title={`Copy ${colors[0].HEX}`}
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span><strong>RGB:</strong> {colors[0].RGB}</span>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(colors[0].RGB);
                                                                toast.success(`Copied ${colors[0].RGB} to clipboard`);
                                                            }}
                                                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                                                            title={`Copy ${colors[0].RGB}`}
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span><strong>RAL:</strong> {colors[0].RAL}</span>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(colors[0].RAL);
                                                                toast.success(`Copied ${colors[0].RAL} to clipboard`);
                                                            }}
                                                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
                                                            title={`Copy ${colors[0].RAL}`}
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ) : (
                                // Multiple colors or favorites display - grid format
                                <div className="space-y-4">
                                    {showFavorites && favoriteColors.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            No favorites yet
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list" aria-label={showFavorites ? 'Favorite colors' : 'Generated colors'}>
                                                {(showFavorites ? favoriteColors : colors).map((color, index) => (
                                                    <div
                                                        key={index}
                                                        className="group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                        role="listitem"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-12 h-12 rounded-lg shadow border border-gray-200 flex-shrink-0"
                                                                style={{ backgroundColor: color.HEX }}
                                                                title={color.HEX}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-gray-800 truncate">
                                                                    {color.English}
                                                                </div>
                                                                <div className="text-sm text-gray-600 space-y-1">
                                                                    <div className="flex items-center gap-1">
                                                                        <span>{color.HEX}</span>
                                                                        <button
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(color.HEX);
                                                                                toast.success(`Copied ${color.HEX}`);
                                                                            }}
                                                                            className="text-gray-400 hover:text-blue-600 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100"
                                                                            title={`Copy ${color.HEX}`}
                                                                        >
                                                                            <Copy className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-xs">RGB: {color.RGB}</span>
                                                                        <button
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(color.RGB);
                                                                                toast.success(`Copied ${color.RGB}`);
                                                                            }}
                                                                            className="text-gray-400 hover:text-blue-600 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100"
                                                                            title={`Copy ${color.RGB}`}
                                                                        >
                                                                            <Copy className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                {!showFavorites ? (
                                                                    <button
                                                                        onClick={() =>
                                                                            favoriteColors.some(fc => fc.English === color.English)
                                                                                ? removeFromFavorites(color.English)
                                                                                : addToFavorites(color.English)
                                                                        }
                                                                        className="text-gray-400 hover:text-red-500 transition-colors touch-manipulation"
                                                                        aria-label={favoriteColors.some(fc => fc.English === color.English) ? `Remove "${color.English}" from favorites` : `Add "${color.English}" to favorites`}
                                                                    >
                                                                        <Heart className={`w-4 h-4 transition-colors ${favoriteColors.some(fc => fc.English === color.English) ? 'fill-red-500 text-red-500' : ''}`} />
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => removeFromFavorites(color.English)}
                                                                        className="text-gray-400 hover:text-red-500 transition-colors touch-manipulation"
                                                                        aria-label={`Remove "${color.English}" from favorites`}
                                                                    >
                                                                        <X className="w-4 h-4 transition-colors" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {favoriteColors.length > 0 && showFavorites && (
                                                <div className="text-right">
                                                    <button
                                                        onClick={clearAllFavorites}
                                                        className="text-sm px-3 py-1 rounded text-gray-600 hover:text-red-600 transition-colors"
                                                        aria-label={`Clear all ${favoriteColors.length} favorite colors`}
                                                    >
                                                        Clear List
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const articleContent = (
        <div className="space-y-6">
            <p>
                You have likely come to this page because you're interested in colors. If that happens to be the case, we think you'll have some fun using the random color generator. This random color picker is quite easy to use and gives you color information in three different ways. You will get to see the name of the color, the hex color code for the color, and the RGB color code. Which of these will be more useful to you will depend on why you need the random color, but you can use any of them depending on your needs.
            </p>

            <p>
                The default is to display a single random color, but you can choose to generate up to 50 colors depending on the number of colors your want to see. Once you choose the optimum number of colors to be displayed each time, all you need to do is to click on the generate button, and the random different colors will instantly appear. It really is that simple.
            </p>

            <p>
                While you likely found the random color generator for a specific reason, there are actually a number of different reasons people come to this website to use it. We've listed a few of the more common ways people use this random color picker and we hope that by reading through them you may find some other uses for it that you may have never before considered.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Artistic Inspiration</h2>
            <p>
                Sometimes it's helpful to have some inspiration to get the creative juices flowing. A wonderful way to do this is to look through random colors. Since the random color picker will choose the colors randomly, you have no idea what color it will choose. This unknown can be beneficial as it will help you look at the color in a different way than if you were specifically looking for it. The randomness can inspire you to look at the color in a different way and possibly help inspire you to use it in a way that you'd never considered in the past.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Artistic Challenge</h2>
            <p>
                It's also possible to use the random color generator to artistically challenge yourself. For example, you could generate a single random color and then use that as the main color in an artistic project. If you want even more of an artistic challenge, you could use the random color picker to choose five or more different random colors and force yourself to incorporate all of them into your project. There are a large number of ways you can adjust this idea to your specific needs, but having to use random colors creates the opportunity for you to expand your artistic repertoire as it's likely you'll be given colors you wouldn't necessarily choose on your own.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Relaxation</h2>
            <p>
                There's something tremendously relaxing about looking at random colors. Don't believe us? Give yourself five minutes to use the random color picker to see how relaxing it can be. It's incredible how relaxing it can be and how far your mind will wander as you do it. If you're looking for a wonderful way to unwind and relax at the end of the day or before bed, using the random color generator can be an unexpectedly good way to do this.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Color Refresh</h2>
            <p>
                If you're painting a room or need to choose a color for a project, it can sometimes be difficult to make the final choice. This is especially true if you have been looking at the same colors for a long period of time. Using this random color tool can help refresh your mind and help you ultimately choose the best color. By having random colors displayed, your mind is able to break away from the colors you've been spending so much time with allowing you to look at them from a fresh perspective. You might even be surprised by the random color picker and find a color that works that you hadn't been considering.
            </p>

            <p>
                We're quite interested in knowing why you made your way to this random color generator and how exactly you use it. The better we understand how people are using this tool, the more opportunities we have to make improvements to it to make it more useful for everyone who comes by. If you're using the random color picker in a way not mentioned above, please take a few minutes to contact us and explain how you use it so we can share it with others. If you have ideas on how to make it better or have issues that you would like to see changed, we'd love to hear them as well. We hope to make this the best random color generator on the Internet and to do that, we'd love to get your help.
            </p>
        </div>
    );

    return (
        <>
            <SEO
                title="Random Color Generator"
                description="Generate random colors with RAL codes, hex values, and RGB information. Perfect for design inspiration, artistic challenges, and creative projects."
            />
            <GeneratorPageLayout
                title="Random Color Generator"
                currentPage="/color.php"
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