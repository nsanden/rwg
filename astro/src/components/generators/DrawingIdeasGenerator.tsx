import { useState, useEffect } from 'react';
import { Heart, Copy, RefreshCw, Share2 } from 'lucide-react';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import GeneratorButtons from '../Forms/GeneratorButtons';
import SocialShareBlock from '../Shared/SocialShareBlock';

interface DrawingIdea {
    value: string;
    image_url: string;
}

interface DrawingIdeasGeneratorProps {
    basePath?: string;
}

export default function DrawingIdeasGenerator({ basePath = '' }: DrawingIdeasGeneratorProps) {
    const [drawingIdeas, setDrawingIdeas] = useState<DrawingIdea[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [favoriteDrawings, setFavoriteDrawings] = useState<DrawingIdea[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('drawingIdeasFavorites');
            try {
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        }
        return [];
    });
    const [showShareModal, setShowShareModal] = useState(false);

    const generateDrawingIdeas = async () => {
        setLoading(true);
        setShowFavorites(false);
        try {
            const response = await fetch(`/api/generate/drawing-ideas?quantity=${quantity}`);
            const data = await response.json();

            if (data.drawing_ideas) {
                setDrawingIdeas(data.drawing_ideas);
            }
        } catch (error) {
            console.error('Error generating drawing ideas:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateDrawingIdeas();
    }, []);

    const addToFavorites = (drawing: DrawingIdea) => {
        if (!favoriteDrawings.some(fav => fav.value === drawing.value)) {
            const updated = [...favoriteDrawings, drawing];
            setFavoriteDrawings(updated);
            localStorage.setItem('drawingIdeasFavorites', JSON.stringify(updated));
        }
    };

    const removeFromFavorites = (drawingValue: string) => {
        const updated = favoriteDrawings.filter(d => d.value !== drawingValue);
        setFavoriteDrawings(updated);
        localStorage.setItem('drawingIdeasFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavoriteDrawings([]);
        localStorage.setItem('drawingIdeasFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const copyToClipboard = () => {
        const items = showFavorites ? favoriteDrawings : drawingIdeas;
        const text = items.map(d => d.value).join('\n');
        navigator.clipboard.writeText(text);
    };

    const resetForm = () => {
        setQuantity(1);
        generateDrawingIdeas();
    };

    const DrawingCard = ({ drawing }: { drawing: DrawingIdea }) => {
        const imageUrl = drawing.image_url?.replace('/img/drawing-ideas-generator/', '/img/drawing-ideas/') || '';
        const isFavorite = favoriteDrawings.some(fav => fav.value === drawing.value);

        return (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', flex: 1, textAlign: 'center' }}>
                        {drawing.value}
                    </h3>
                    <button
                        onClick={() => isFavorite ? removeFromFavorites(drawing.value) : addToFavorites(drawing)}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                        <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                </div>
                {imageUrl && (
                    <div>
                        <img
                            src={imageUrl}
                            alt={drawing.value}
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
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Random Things to Draw</h1>

                        <div className="mb-4">
                            <label htmlFor="quantity" className="font-medium text-gray-700 mr-3">
                                Number of Drawing Ideas:
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
                            onGenerate={generateDrawingIdeas}
                            onReset={resetForm}
                            loading={loading}
                            generateLabel="Generate Drawing Ideas"
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
                            title="Random Things to Draw - Drawing Ideas & Art Inspiration"
                            isExpanded={showShareModal}
                            setIsExpanded={setShowShareModal}
                        />
                    </div>

                    {/* Results Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                            {favoriteDrawings.length > 0 && (
                                <button
                                    onClick={() => setShowFavorites(!showFavorites)}
                                    className={`group flex items-center gap-1 text-sm px-3 py-2 rounded cursor-pointer ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                                >
                                    {showFavorites ? (
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                    ) : (
                                        <>
                                            <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                                            ({favoriteDrawings.length})
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
                                <p className="mt-2 text-gray-600">Finding drawing inspiration...</p>
                            </div>
                        ) : (
                            <>
                                {(showFavorites ? favoriteDrawings : drawingIdeas).length > 0 ? (
                                    <div className={`grid gap-6 ${
                                        (showFavorites ? favoriteDrawings : drawingIdeas).length === 1
                                            ? 'grid-cols-1 max-w-sm mx-auto'
                                            : 'grid-cols-1 sm:grid-cols-2'
                                    }`}>
                                        {(showFavorites ? favoriteDrawings : drawingIdeas).map((drawing) => (
                                            <DrawingCard key={drawing.value} drawing={drawing} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {showFavorites ? 'No favorite drawing ideas yet.' : 'Click "Generate Drawing Ideas" to get drawing suggestions.'}
                                    </div>
                                )}

                                {favoriteDrawings.length > 0 && showFavorites && (
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
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        <ArticleContent>
                            <p>If you have wandered onto this page, you are likely here because you're interested in finding cool things to draw, cute things to draw, or at least something to draw. Or maybe you're wondering "What should I draw?" If you're looking for stuff to draw then you have definitely landed in the right place because the random things to draw generator will give you plenty of drawing ideas. While all the drawing ideas are random, the results will be cute drawing ideas, simple drawing ideas, fun drawing ideas, or some other type of interesting drawing ideas.</p>

                            <p>Once you have chosen what types of results you want to have generated, the drawing ideas generator is simple to use. You can indicate the number of results you want to appear and then click on the generate button. Once done, you will have the exact number of drawing ideas that you wanted to see instantly appear. You can then choose the ones that inspire you the most and begin to draw.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Things to Draw</h2>

                            <p>One of the best ways to get better at drawing is to simply draw a lot. The issue is that it can often be difficult to decide what things to draw. The important point is to get drawing and that's where the drawing ideas generator can be of great help. By generating random drawing ideas, you don't have to spend any time thinking about things to draw. In many ways, this can be even superior to deciding what things to draw on your own. Since the results are random, you will often get results that will challenge you more than if you decided on your own. It also will help give you ideas of what to draw when bored or drawing ideas for beginners when you might not have the creativity to decide what things to draw.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Easy Things to Draw</h2>

                            <p>Another advantage of using this random things to draw generator is that it can help you find easy things to draw. It can often be quite difficult to come up with ideas of simple things to draw on your own. Having a drawing ideas generator give you results of a variety of easy things to draw can help you get to drawing instead of obsessing on how difficult everything seems to be when you are thinking of drawing ideas on your own. If you've ever thought you want things to draw easy, this free tool can help you find a wide variety of easy things to draw.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How to Draw Cute Things</h2>

                            <p>Another thing for those looking for drawing inspiration is to find how to draw cute things. It can take a lot of practice and the best way to get better at drawing cute is to attempt to do so with a variety of different ideas. While this can be done in a variety of ways, one of the most common is to create drawings of cute animals. Again, having a wide variety of random drawing ideas presented to you can make it much easier to find subjects that make it much easier to draw cute sketches.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Easy Drawing Ideas</h2>

                            <p>When it comes to drawing, most people want to opt for easy drawing ideas. This is good and bad. Easy drawing ideas can be the perfect thing when time is limited and you want to create some easy cool drawings. The problem is that it's not always best to only draw cool easy things to draw. Beyond easy drawing ideas, it's important to also challenge yourself so that you improve your drawing ability. It's therefore important to know when to opt for easy drawing ideas over sketch drawing ideas that may be a bit more difficult. The drawing ideas generator can help you make sure that you don't always opt for easy drawing ideas.</p>

                            <p>No matter why you ultimately found your way to this drawing ideas tool, we hope that once you did, you found it to be useful in generating quality drawing and sketching ideas. If you did, we'd be interested in knowing what you found to be most useful about it. The better we can understand how people use this generator to get drawing ideas, the better we can improve it in the future.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What if I don't like the drawing idea I get?</h3>
                                        <p>Simply click the generate button again to get new random drawing ideas. You can generate as many ideas as you need until you find something that inspires you. You can also save your favorites by clicking the heart icon.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Are these drawing ideas good for beginners?</h3>
                                        <p>Yes! The drawing ideas range from simple to more complex. Beginners can start with easier subjects and gradually challenge themselves with more difficult ones as their skills improve.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I use these ideas for art projects or assignments?</h3>
                                        <p>Absolutely! These drawing ideas are perfect for art class assignments, personal projects, sketchbook practice, or just for fun. Use them however you like to inspire your creativity.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Why does random drawing help improve skills?</h3>
                                        <p>Random drawing challenges you to draw subjects you might not choose on your own, forcing you to practice a wider variety of techniques. This variety helps you become a more well-rounded artist.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/drawing-idea" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
