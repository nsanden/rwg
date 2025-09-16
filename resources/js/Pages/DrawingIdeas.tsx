import React, { useState } from 'react';
import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { Heart, Copy } from 'lucide-react';

interface DrawingIdea {
    value: string;
    image_url: string;
}

export default function DrawingIdeas() {
    const {
        items,
        loading,
        showLoading,
        quantity,
        setQuantity,
        generateItems,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'drawingIdeasFavorites',
        apiEndpoint: '/api/generate/drawing-ideas',
        itemName: 'drawing ideas',
        transformResponse: (data: any) => {
            return data.drawing_ideas || [];
        }
    });

    const drawingIdeas = items as unknown as DrawingIdea[];

    // Custom favorites state for drawing objects
    const [favoriteDrawings, setFavoriteDrawings] = useState<DrawingIdea[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('drawingIdeasFavorites');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);

    const addToFavorites = (drawing: DrawingIdea) => {
        const updated = [...favoriteDrawings, drawing];
        setFavoriteDrawings(updated);
        localStorage.setItem('drawingIdeasFavorites', JSON.stringify(updated));
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

    const handleGenerateDrawingIdeas = () => {
        setShowFavorites(false);
        generateItems({
            quantity
        });
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'drawing-ideas',
        onGenerate: handleGenerateDrawingIdeas,
        setShowFavorites,
        setQuantity
    });

    const seoData = {
        title: "Random Things to Draw Generator - Drawing Ideas & Art Inspiration",
        description: "Get instant drawing inspiration with our random things to draw generator! Perfect for artists, beginners, and anyone looking for creative drawing ideas and art prompts.",
        keywords: "drawing ideas, things to draw, art inspiration, drawing prompts, random drawing generator, sketch ideas, creative drawing, easy things to draw",
        url: "https://randomwordgenerator.com/drawing-idea",
    };

    const articleContent = (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
                If you have wandered onto this page, you are likely here because you're interested in finding cool
                things to draw, cute things to draw, or at least something to draw. Or maybe you're wondering "What
                should I draw?" If you're looking for stuff to draw then you have definitely landed in the right place
                because the random things to draw generator will give you plenty of drawing ideas. While all the drawing
                ideas are random, the results will be cute drawing ideas, simple drawing ideas, fun drawing ideas, or
                some other type of interesting drawing ideas.
            </p>

            <p>
                If you have a specific type of drawing you want to do, the random things to draw generator can help you
                narrow the focus. There are checkboxes that can help you narrow the type of random drawing suggestions
                you receive. For example, if you choose "fun" then the random drawing ideas will come from a list of fun
                things to draw. If you choose "easy" then you'll get results that are simple drawing ideas. If you
                choose "cool" then you will get a list of cool drawing ideas. By choosing the types of results you want,
                you can help to narrow the drawing prompts to get ideas of what you want to draw.
            </p>

            <p>
                Once you have chosen what types of results you want to have generated, the drawing ideas generator is
                simple to use. You can indicate the number of results you want to appear and then click on the generate
                button. Once done, you will have the exact number of drawing ideas that you wanted to see instantly
                appear. You can then choose the ones that inspire you the most and begin to draw.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Things to Draw</h2>

            <p>
                One of the best ways to get better at drawing is to simply draw a lot. The issue is that it can often be
                difficult to decide what things to draw. The important point is to get drawing and that's where the
                drawing ideas generator can be of great help. By generating random drawing ideas, you don't have to
                spend any time thinking about things to draw. In many ways, this can be ever superior to deciding what
                things to draw on your own. Since the results are random, you will often get results that will challenge
                you more than if you decided on your own. It also will help give you ideas of what to draw when bored or
                drawing ideas for beginners when you might not have the creativity to decide what things to draw.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Easy Things to Draw</h2>

            <p>
                Another advantage of using this random things to draw generator is that it can help you find easy things
                to draw. It can often be quite difficult to come up with ideas of simple things to draw on your own.
                Having a drawing ideas generator give you results of a variety of easy things to draw can help you get
                to drawing instead of obsessing on how difficult everything seems to be when you are thinking of drawing
                ideas on your own. If you've ever thought you want things to draw easy, this free tool can help you find
                a wide variety of easy things to draw.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How to Draw Cute Things</h2>

            <p>
                Another thing for those looking for drawing inspiration is to find how to draw cute things. It can take
                a lot of practice and the best way to get better at drawing cute is to attempt to do so
                with a variety of different ideas. While this can be done in a variety of ways, one of the most common
                is to create drawings of cute animals. Another way to achieve this is to generate sketch drawing ideas
                that can be used to draw cute animals. Again, having a wide variety of random drawing ideas presented to
                you can make it much easier to find subjects than make it much easier to draw cute sketches.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Easy Drawing Ideas</h2>

            <p>
                When it comes to drawing, most people want to opt for easy drawing ideas. This is good and bad. Easy
                drawing ideas can be the perfect thing when time is limited and you want to create some easy cool
                drawings. The problem is that it's not always best to only draw cool easy things to draw. Beyond easy
                drawing ideas, it's important to also challenge yourself so that you improve your drawing ability. It's
                therefore important to know when to opt for easy drawing ideas over sketch drawing ideas that may be a
                bit more difficult. The drawing ideas generator can help you make sure that you don't always opt for
                easy drawing ideas.
            </p>

            <p>
                No matter why you ultimately found your way to this drawing ideas tool, we hope that once you did, you
                found it to be useful in generating quality drawing and sketching ideas. If you did, we'd be interested
                in knowing what you found to be most useful about it. The better we can understand how people use this
                generator to get drawing ideas, the better we can improve it in the future. We'd also greatly appreciate
                it if you let us know if there are aspects of this tool you didn't like or think that we should improve.
                The better we understand what people like and dislike about how this generator produces drawing ideas,
                the better chance we have of improving it for everyone in the future.
            </p>
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Random Things to Draw Generator"
            itemName="Drawing Ideas"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            showLetterFilters={false}
            showSizeFilter={false}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            {...formState}
        />
    );

    const DrawingCard = ({ drawing, index }: { drawing: DrawingIdea; index: number }) => {
        const imageUrl = drawing.image_url?.replace('/img/drawing-ideas-generator/', '/img/drawing-ideas/') || '';
        const isFavorite = favoriteDrawings.some(fav => fav.value === drawing.value);

        return (
            <div className="text-center">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-2xl text-gray-800 flex-1 text-center">
                        {drawing.value}
                    </h3>
                    <button
                        onClick={() => isFavorite ? removeFromFavorites(drawing.value) : addToFavorites(drawing)}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors flex items-center"
                        aria-label={isFavorite ? `Remove "${drawing.value}" from favorites` : `Add "${drawing.value}" to favorites`}
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

    const resultsPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                {favoriteDrawings.length > 0 && (
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        aria-pressed={showFavorites}
                        aria-label={showFavorites ? 'Switch to view generated drawing ideas' : `Switch to view saved favorites (${favoriteDrawings.length} drawing ideas)`}
                    >
                        {showFavorites ? (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" aria-hidden="true" />
                        ) : (
                            <>
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" aria-hidden="true" />
                                ({favoriteDrawings.length})
                            </>
                        )}
                    </button>
                )}
                <button
                    onClick={copyToClipboard}
                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded touch-manipulation"
                    aria-label={`Copy ${showFavorites ? favoriteDrawings.length + ' favorite' : drawingIdeas.length + ' generated'} drawing ideas to clipboard`}
                >
                    <Copy className="w-5 h-5 transition-colors" aria-hidden="true" />
                </button>
            </div>

            {showLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div>
                    <p className="mt-2 text-gray-600">Finding drawing inspiration...</p>
                </div>
            ) : (
                <>
                    {(showFavorites ? favoriteDrawings : drawingIdeas).length > 0 ? (
                        <div className={`grid gap-6 ${
                            (showFavorites ? favoriteDrawings : drawingIdeas).length === 1
                                ? 'grid-cols-1 max-w-sm mx-auto'
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        }`}>
                            {(showFavorites ? favoriteDrawings : drawingIdeas).map((drawing, index) => (
                                <DrawingCard
                                    key={drawing.value}
                                    drawing={drawing}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {showFavorites ? 'No favorite drawing ideas yet. Add some by clicking the heart button on ideas you like!' : 'Click "Generate Drawing Ideas" to get drawing suggestions.'}
                        </div>
                    )}

                    {favoriteDrawings.length > 0 && showFavorites && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={clearAllFavorites}
                                className="text-blue-600 hover:text-blue-800 underline text-sm bg-transparent border-none cursor-pointer"
                            >
                                Clear All Favorites
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    return (
        <>
            <SEO {...seoData} />
            <GeneratorPageLayout
                title="Random Things to Draw Generator"
                currentPage="/drawing-idea.php"
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