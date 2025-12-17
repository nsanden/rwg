import { useState, useEffect } from 'react';
import { Heart, Copy, RefreshCw, Printer, Share2 } from 'lucide-react';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import GeneratorButtons from '../Forms/GeneratorButtons';
import SocialShareBlock from '../Shared/SocialShareBlock';

interface ColoringPage {
    value: string;
    image_url: string;
}

interface ColoringPagesGeneratorProps {
    basePath?: string;
}

export default function ColoringPagesGenerator({ basePath = '' }: ColoringPagesGeneratorProps) {
    const [coloringPages, setColoringPages] = useState<ColoringPage[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [favoritePages, setFavoritePages] = useState<ColoringPage[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('coloringPagesFavorites');
            try {
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        }
        return [];
    });
    const [showShareModal, setShowShareModal] = useState(false);

    const generateColoringPages = async () => {
        setLoading(true);
        setShowFavorites(false);
        try {
            const response = await fetch(`/api/generate/coloring-pages?quantity=${quantity}`);
            const data = await response.json();

            if (data.coloring_pages) {
                setColoringPages(data.coloring_pages);
            }
        } catch (error) {
            console.error('Error generating coloring pages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateColoringPages();
    }, []);

    const addToFavorites = (page: ColoringPage) => {
        if (!favoritePages.some(fav => fav.value === page.value)) {
            const updated = [...favoritePages, page];
            setFavoritePages(updated);
            localStorage.setItem('coloringPagesFavorites', JSON.stringify(updated));
        }
    };

    const removeFromFavorites = (pageValue: string) => {
        const updated = favoritePages.filter(p => p.value !== pageValue);
        setFavoritePages(updated);
        localStorage.setItem('coloringPagesFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavoritePages([]);
        localStorage.setItem('coloringPagesFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const copyToClipboard = () => {
        const items = showFavorites ? favoritePages : coloringPages;
        const text = items.map(p => p.value).join('\n');
        navigator.clipboard.writeText(text);
    };

    const resetForm = () => {
        setQuantity(1);
        generateColoringPages();
    };

    const printPage = (page: ColoringPage) => {
        const imageUrl = page.image_url?.replace('/img/drawing-ideas-generator/', '/img/drawing-ideas/') || '';
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${page.value} - Coloring Page</title>
                        <style>
                            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                            img { max-width: 100%; max-height: 100vh; }
                            @media print { body { margin: 0; } img { max-width: 100%; } }
                        </style>
                    </head>
                    <body>
                        <img src="${imageUrl}" alt="${page.value}" onload="window.print(); window.close();" />
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const ColoringCard = ({ page }: { page: ColoringPage }) => {
        const imageUrl = page.image_url?.replace('/img/drawing-ideas-generator/', '/img/drawing-ideas/') || '';
        const isFavorite = favoritePages.some(fav => fav.value === page.value);

        return (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', flex: 1, textAlign: 'center' }}>
                        {page.value}
                    </h3>
                    <div className="flex gap-2 ml-2">
                        <button
                            onClick={() => printPage(page)}
                            className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                            title="Print this coloring page"
                        >
                            <Printer className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => isFavorite ? removeFromFavorites(page.value) : addToFavorites(page)}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                            <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                    </div>
                </div>
                {imageUrl && (
                    <div>
                        <img
                            src={imageUrl}
                            alt={page.value}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                objectFit: 'contain',
                                margin: '0 auto',
                                display: 'block',
                                cursor: 'pointer'
                            }}
                            onClick={() => window.open(imageUrl, '_blank')}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6" style={{ minWidth: '385px' }}>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Random Coloring Pages</h1>

                        <div className="mb-4">
                            <label htmlFor="quantity" className="font-medium text-gray-700 mr-3">
                                Number of Coloring Pages:
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                max="20"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <GeneratorButtons
                            onGenerate={generateColoringPages}
                            onReset={resetForm}
                            loading={loading}
                            generateLabel="Generate Coloring Pages"
                        />

                        <div className="mt-4 flex justify-center sm:hidden">
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>

                        <SocialShareBlock
                            url={typeof window !== 'undefined' ? window.location.href : ''}
                            title="Random Coloring Pages Generator - Free Printable Coloring Sheets"
                            isExpanded={showShareModal}
                            setIsExpanded={setShowShareModal}
                        />
                    </div>

                    {/* Results Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                            {favoritePages.length > 0 && (
                                <button
                                    onClick={() => setShowFavorites(!showFavorites)}
                                    className={`group flex items-center gap-1 text-sm px-3 py-2 rounded cursor-pointer ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                                >
                                    {showFavorites ? (
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                    ) : (
                                        <>
                                            <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                                            ({favoritePages.length})
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={copyToClipboard}
                                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded cursor-pointer"
                            >
                                <Copy className="w-5 h-5 transition-colors" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                                <p className="mt-2 text-gray-600">Finding coloring pages...</p>
                            </div>
                        ) : (
                            <>
                                {(showFavorites ? favoritePages : coloringPages).length > 0 ? (
                                    <div className={`grid gap-6 ${
                                        (showFavorites ? favoritePages : coloringPages).length === 1
                                            ? 'grid-cols-1 max-w-sm mx-auto'
                                            : 'grid-cols-1 sm:grid-cols-2'
                                    }`}>
                                        {(showFavorites ? favoritePages : coloringPages).map((page) => (
                                            <ColoringCard key={page.value} page={page} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {showFavorites ? 'No favorite coloring pages yet.' : 'Click "Generate Coloring Pages" to get coloring sheets.'}
                                    </div>
                                )}

                                {favoritePages.length > 0 && showFavorites && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={clearAllFavorites}
                                            className="text-sm px-3 py-1 rounded text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                                        >
                                            Clear All Favorites
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        <ArticleContent>
                            <p>We're happy that you found your way to our little spot on the Internet. If you ended up here because you were looking for coloring pages, you may have found the perfect tool. There are going to be times in your life when you just want to color and when those moments hit, this is the perfect generator for you.</p>

                            <p>The random coloring page generator will display a random coloring page each time you refresh the page. While the default of the generator is one, you do have the option to decide how many pictures get displayed with each click. For example, if you wanted five different coloring picture pages to show up each time, you would set the number of pictures to five. Then all you do is click the generate button and five random coloring picture pages (or however many you chose to display) will appear. You also have the option to print each coloring page so you can get right to coloring.</p>

                            <p>If you really want to see if this generator is something that would be useful for what you had in mind, the best course of action is to play with it a little while. Sit down and click through a number of random coloring pages and see what results you get. It shouldn't take too long for you to figure out if the random coloring pages would be useful to you. If you find that they are, you have found a great little spot on the Internet to visit every time the urge to color hits you.</p>

                            <p>If you're still not sure if random coloring pages is something that could be useful to you, below you can see some of the more common ways this generator typically gets used by others. By seeing how others use it, you may find some creative ways to use it yourself that you hadn't considered.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Project for Kids</h2>

                            <p>If you're looking for a fun project for kids to do to keep them occupied, this random coloring page tool can be a fun way to do it. The kids can watch a random picture appear and then in the next moment sit down to color it. Since each result is random, they're never sure what they will see next to color. It's a fun little game that brings a little extra excitement to coloring.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Relaxation</h2>

                            <p>One of the best ways to relax and reduce your overall anxiety and stress is to color. It doesn't have to be a complex coloring page. Even simple coloring pages will help you relax. The mind has to focus on the act of coloring which helps turn off parts of the brain that produce anxiety so that your stress levels decrease. Coloring a page is a lot like meditation in the way it can calm your mind and soul.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Improve Focus</h2>

                            <p>Sitting down to color a page can be the perfect way to refocus so that you can be more productive for the rest of the day. One of the great things about coloring is that it helps you focus, but it does so in a way that isn't stressful at the same time. Coloring has been shown to increase activity in your frontal lobe which is where the centers for organizing and problem solving reside. By sitting down and coloring, you activate this part of your brain so that you are able to relax and focus better going forward.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Better Sleep</h2>

                            <p>One of the great benefits of coloring is to help you relax, and that's something that is essential when you're ready to go to sleep. Coloring a picture can be the perfect way for your to get ready for bed each night. The act of coloring a page will help your mind relax so that you are able to get a good night's sleep instead of thinking about everything that happened during the day.</p>

                            <p>We hope that you've taken the time to explore the random coloring page generator and have found it useful. If you have any suggestions on how we might make this coloring page generator better, we'd love for you to contact us and let us know. We are always striving to improve our generators and one of the best ways to do that is to hear suggestions from those who are using them. We hope with your suggestions we can continue to improve this coloring page tool and make it the best that it can be.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Are these coloring pages free to print?</h3>
                                        <p>Yes! All coloring pages generated here are completely free to print and use for personal enjoyment. Print as many as you like for yourself, your kids, or your classroom.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What age group are these coloring pages for?</h3>
                                        <p>Our coloring pages range from simple designs suitable for young children to more detailed images that adults might enjoy. The random nature means you'll get a variety of complexity levels.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How do I print a coloring page?</h3>
                                        <p>Click the printer icon on any coloring page card to open a print-friendly version. You can also click on the image to view it full size, then use your browser's print function (Ctrl+P or Cmd+P).</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I save my favorite coloring pages?</h3>
                                        <p>Yes! Click the heart icon on any coloring page to add it to your favorites. Your favorites are saved in your browser so you can access them anytime you return to the site.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/coloring-pages" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
