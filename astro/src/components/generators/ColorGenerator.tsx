import { useState, useEffect } from 'react';
import { Heart, Copy, X, RefreshCw } from 'lucide-react';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import GeneratorButtons from '../Forms/GeneratorButtons';

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

interface ColorGeneratorProps {
    basePath?: string;
}

export default function ColorGenerator({ basePath = '' }: ColorGeneratorProps) {
    const [colors, setColors] = useState<ColorData[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [favoriteColors, setFavoriteColors] = useState<ColorData[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('colorsFavoritesObjects');
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch {
                    return [];
                }
            }
        }
        return [];
    });

    const generateColors = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/generate/colors?quantity=${quantity}`);
            const data = await response.json();

            if (data.success) {
                setColors(data.colors);
                setShowFavorites(false);
            }
        } catch (error) {
            console.error('Error generating colors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateColors();
    }, []);

    const addToFavorites = (colorName: string) => {
        const colorData = colors.find(c => c.English === colorName);
        if (colorData && !favoriteColors.some(fc => fc.English === colorName)) {
            const updated = [...favoriteColors, colorData];
            setFavoriteColors(updated);
            localStorage.setItem('colorsFavoritesObjects', JSON.stringify(updated));
        }
    };

    const removeFromFavorites = (colorName: string) => {
        const updated = favoriteColors.filter(fc => fc.English !== colorName);
        setFavoriteColors(updated);
        localStorage.setItem('colorsFavoritesObjects', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavoriteColors([]);
        localStorage.removeItem('colorsFavoritesObjects');
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast notification here
    };

    const resetForm = () => {
        setQuantity(1);
        generateColors();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6" style={{ minWidth: '385px' }}>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Random Color Generator</h1>

                        <div className="mb-4">
                            <label htmlFor="quantity" className="font-medium text-gray-700 mr-3">
                                Number of Colors:
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                max="50"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <GeneratorButtons
                            onGenerate={generateColors}
                            onReset={resetForm}
                            loading={loading}
                            generateLabel="Generate Random Colors"
                        />
                    </div>

                    {/* Results Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col relative min-h-[200px] md:min-h-[400px]">
                        {/* Action buttons */}
                        <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                            {favoriteColors?.length > 0 && (
                                <button
                                    onClick={() => setShowFavorites(!showFavorites)}
                                    className={`group flex items-center gap-1 text-sm px-3 py-2 rounded cursor-pointer ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
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
                                }}
                                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded cursor-pointer"
                            >
                                <Copy className="w-5 h-5 transition-colors" />
                            </button>
                        </div>

                        <div className={`flex-1 flex items-center ${colors.length === 1 && !showFavorites ? '-translate-y-8' : ''}`} style={{ pointerEvents: 'none' }}>
                            <div className="w-full" style={{ pointerEvents: 'auto' }}>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <RefreshCw className="w-8 h-8 text-gray-500 animate-spin mx-auto" />
                                    </div>
                                ) : (
                                    <>
                                        {colors?.length === 1 && !showFavorites ? (
                                            // Single color display - large format
                                            <div className="text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div
                                                        className="rounded-lg shadow-lg border border-gray-200 mx-auto"
                                                        style={{ backgroundColor: colors[0].HEX, width: '192px', height: '192px' }}
                                                        title={`${colors[0].English} - ${colors[0].HEX}`}
                                                    />
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3 justify-center">
                                                            <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                                                                {colors[0].English}
                                                            </h2>
                                                            <button
                                                                onClick={() => {
                                                                    favoriteColors.some(fc => fc.English === colors[0].English)
                                                                        ? removeFromFavorites(colors[0].English)
                                                                        : addToFavorites(colors[0].English);
                                                                }}
                                                                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                            >
                                                                <Heart className={`w-6 h-6 transition-colors ${favoriteColors.some(fc => fc.English === colors[0].English) ? 'fill-red-500 text-red-500' : ''}`} />
                                                            </button>
                                                        </div>
                                                        <div style={{ fontSize: '0.875rem', color: '#4b5563' }} className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span><strong>HEX:</strong> {colors[0].HEX}</span>
                                                                <button
                                                                    onClick={() => copyToClipboard(colors[0].HEX, 'HEX')}
                                                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded cursor-pointer"
                                                                >
                                                                    <Copy className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span><strong>RGB:</strong> {colors[0].RGB}</span>
                                                                <button
                                                                    onClick={() => copyToClipboard(colors[0].RGB, 'RGB')}
                                                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded cursor-pointer"
                                                                >
                                                                    <Copy className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span><strong>RAL:</strong> {colors[0].RAL}</span>
                                                                <button
                                                                    onClick={() => copyToClipboard(colors[0].RAL, 'RAL')}
                                                                    className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded cursor-pointer"
                                                                >
                                                                    <Copy className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Multiple colors or favorites display - grid format
                                            <div className="space-y-4">
                                                {showFavorites && favoriteColors.length === 0 ? (
                                                    <div className="text-center py-8 text-gray-500">
                                                        No favorites yet
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {(showFavorites ? favoriteColors : colors).map((color, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div
                                                                            className="rounded-lg shadow border border-gray-200 flex-shrink-0"
                                                                            style={{ backgroundColor: color.HEX, width: '48px', height: '48px' }}
                                                                            title={color.HEX}
                                                                        />
                                                                        <div className="flex-1 min-w-0">
                                                                            <div className="font-medium text-gray-800 truncate">
                                                                                {color.English}
                                                                            </div>
                                                                            <div className="text-sm text-gray-600 space-y-1">
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="text-xs">HEX: {color.HEX}</span>
                                                                                    <button
                                                                                        onClick={() => copyToClipboard(color.HEX, 'HEX')}
                                                                                        className="text-gray-400 hover:text-blue-600 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100 cursor-pointer"
                                                                                    >
                                                                                        <Copy className="w-3 h-3" />
                                                                                    </button>
                                                                                </div>
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="text-xs">RGB: {color.RGB}</span>
                                                                                    <button
                                                                                        onClick={() => copyToClipboard(color.RGB, 'RGB')}
                                                                                        className="text-gray-400 hover:text-blue-600 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100 cursor-pointer"
                                                                                    >
                                                                                        <Copy className="w-3 h-3" />
                                                                                    </button>
                                                                                </div>
                                                                                <div className="flex items-center gap-1">
                                                                                    <span className="text-xs">RAL: {color.RAL}</span>
                                                                                    <button
                                                                                        onClick={() => copyToClipboard(color.RAL, 'RAL')}
                                                                                        className="text-gray-400 hover:text-blue-600 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100 cursor-pointer"
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
                                                                                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                                                >
                                                                                    <Heart className={`w-4 h-4 transition-colors ${favoriteColors.some(fc => fc.English === color.English) ? 'fill-red-500 text-red-500' : ''}`} />
                                                                                </button>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={() => removeFromFavorites(color.English)}
                                                                                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
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
                                                                    className="text-sm px-3 py-1 rounded text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
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
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        <ArticleContent>
                            <p>You have likely come to this page because you're interested in colors. If that happens to be the case, we think you'll have some fun using the random color generator. This random color picker is quite easy to use and gives you color information in three different ways. You will get to see the name of the color, the hex color code for the color, and the RGB color code. Which of these will be more useful to you will depend on why you need the random color, but you can use any of them depending on your needs.</p>

                            <p>The default is to display a single random color, but you can choose to generate up to 50 colors depending on the number of colors you want to see. Once you choose the optimum number of colors to be displayed each time, all you need to do is to click on the generate button, and the random different colors will instantly appear. It really is that simple.</p>

                            <p>While you likely found the random color generator for a specific reason, there are actually a number of different reasons people come to this website to use it. We've listed a few of the more common ways people use this random color picker and we hope that by reading through them you may find some other uses for it that you may have never before considered.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Artistic Inspiration</h2>

                            <p>Sometimes it's helpful to have some inspiration to get the creative juices flowing. A wonderful way to do this is to look through random colors. Since the random color picker will choose the colors randomly, you have no idea what color it will choose. This unknown can be beneficial as it will help you look at the color in a different way than if you were specifically looking for it. The randomness can inspire you to look at the color in a different way and possibly help inspire you to use it in a way that you'd never considered in the past.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Artistic Challenge</h2>

                            <p>It's also possible to use the random color generator to artistically challenge yourself. For example, you could generate a single random color and then use that as the main color in an artistic project. If you want even more of an artistic challenge, you could use the random color picker to choose five or more different random colors and force yourself to incorporate all of them into your project. There are a large number of ways you can adjust this idea to your specific needs, but having to use random colors creates the opportunity for you to expand your artistic repertoire as it's likely you'll be given colors you wouldn't necessarily choose on your own.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Relaxation</h2>

                            <p>There's something tremendously relaxing about looking at random colors. Don't believe us? Give yourself five minutes to use the random color picker to see how relaxing it can be. It's incredible how relaxing it can be and how far your mind will wander as you do it. If you're looking for a wonderful way to unwind and relax at the end of the day or before bed, using the random color generator can be an unexpectedly good way to do this.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Color Refresh</h2>

                            <p>If you're painting a room or need to choose a color for a project, it can sometimes be difficult to make the final choice. This is especially true if you have been looking at the same colors for a long period of time. Using this random color tool can help refresh your mind and help you ultimately choose the best color. By having random colors displayed, your mind is able to break away from the colors you've been spending so much time with allowing you to look at them from a fresh perspective. You might even be surprised by the random color picker and find a color that works that you hadn't been considering.</p>

                            <p>We're quite interested in knowing why you made your way to this random color generator and how exactly you use it. The better we understand how people are using this tool, the more opportunities we have to make improvements to it to make it more useful for everyone who comes by. If you're using the random color picker in a way not mentioned above, please take a few minutes to contact us and explain how you use it so we can share it with others. If you have ideas on how to make it better or have issues that you would like to see changed, we'd love to hear them as well. We hope to make this the best random color generator on the Internet and to do that, we'd love to get your help.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What color formats does the generator provide?</h3>
                                        <p>The random color generator provides colors in three formats: the color name (in English), the HEX color code (like #FF5733), and the RGB color code (like 255, 87, 51). It also includes RAL codes for industrial and paint applications.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How many colors can I generate at once?</h3>
                                        <p>You can generate anywhere from 1 to 50 colors at a time. The default is a single color displayed in a large format, but generating multiple colors shows them in a convenient grid view.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I save colors I like?</h3>
                                        <p>Yes! Click the heart icon next to any color to add it to your favorites. Your favorites are saved in your browser so you can access them later. Click the heart icon in the results area to view all your saved colors.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What is a RAL color code?</h3>
                                        <p>RAL is a color matching system used mainly in Europe for paint, coatings, and plastics. RAL codes are standardized colors that ensure consistency across different manufacturers and applications.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/color" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
