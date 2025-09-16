import SEO from '@/Components/SEO';
import { Link } from '@inertiajs/react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { Heart, Copy } from 'lucide-react';
import { useState } from 'react';

interface DinnerIdea {
    url: string;
    image_url: string;
    title: string;
    recipe_url: string;
    description: string;
}

export default function DinnerIdeas() {
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
        favoritesKey: 'dinnerIdeasFavorites',
        apiEndpoint: '/api/generate/dinner-ideas',
        itemName: 'dinner ideas',
        transformResponse: (data: any) => {
            return data.dinners || [];
        }
    });

    const dinnerIdeas = items as unknown as DinnerIdea[];

    // Custom favorites state for dinner objects
    const [favoriteDinners, setFavoriteDinners] = useState<DinnerIdea[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dinnerIdeasFavorites');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);

    const addToFavorites = (dinner: DinnerIdea) => {
        const updated = [...favoriteDinners, dinner];
        setFavoriteDinners(updated);
        localStorage.setItem('dinnerIdeasFavorites', JSON.stringify(updated));
    };

    const removeFromFavorites = (dinnerTitle: string) => {
        const updated = favoriteDinners.filter(d => d.title !== dinnerTitle);
        setFavoriteDinners(updated);
        localStorage.setItem('dinnerIdeasFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavoriteDinners([]);
        localStorage.setItem('dinnerIdeasFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const handleGenerateDinnerIdeas = () => {
        setShowFavorites(false);
        generateItems({
            quantity
        });
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'dinner-ideas',
        onGenerate: handleGenerateDinnerIdeas,
        setShowFavorites,
        setQuantity
    });

    const formPanel = (
        <BaseGeneratorForm
            title="Dinner Ideas Generator"
            itemName="Dinner Ideas"
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

    const DinnerCard = ({ dinner, index }: { dinner: DinnerIdea; index: number }) => {
        const imageUrl = dinner.image_url.startsWith('https')
            ? dinner.image_url
            : `https://randomwordgenerator.com/img/dinner-ideas-generator/${dinner.image_url}`;

        const isFavorite = favoriteDinners.some(fav => fav.title === dinner.title);

        return (
            <div className="dinner-item bg-white rounded-lg overflow-hidden flex">
                <a href={dinner.recipe_url} target="_blank" rel="noreferrer nofollow" className="block flex-1">
                    <img
                        src={imageUrl}
                        alt={dinner.title}
                        className="w-full h-48 object-cover"
                        width="400"
                        height="192"
                    />
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-blue-600 hover:text-blue-800">
                            {dinner.title}
                        </h3>
                        {dinner.description && (
                            <p className="text-gray-600 text-sm">
                                {dinner.description}
                            </p>
                        )}
                    </div>
                </a>
                <div className="flex items-start p-4">
                    <button
                        onClick={() => isFavorite ? removeFromFavorites(dinner.title) : addToFavorites(dinner)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={isFavorite ? `Remove "${dinner.title}" from favorites` : `Add "${dinner.title}" to favorites`}
                    >
                        <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                </div>
            </div>
        );
    };

    const resultsPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                {favoriteDinners.length > 0 && (
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        aria-pressed={showFavorites}
                        aria-label={showFavorites ? 'Switch to view generated dinner ideas' : `Switch to view saved favorites (${favoriteDinners.length} dinner ideas)`}
                    >
                        {showFavorites ? (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" aria-hidden="true" />
                        ) : (
                            <>
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" aria-hidden="true" />
                                ({favoriteDinners.length})
                            </>
                        )}
                    </button>
                )}
                <button
                    onClick={copyToClipboard}
                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded touch-manipulation"
                    aria-label={`Copy ${showFavorites ? favoriteDinners.length + ' favorite' : dinnerIdeas.length + ' generated'} dinner ideas to clipboard`}
                >
                    <Copy className="w-5 h-5 transition-colors" aria-hidden="true" />
                </button>
            </div>

            {showLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div>
                    <p className="mt-2 text-gray-600">Finding delicious dinner ideas...</p>
                </div>
            ) : (
                <>
                    {(showFavorites ? favoriteDinners : dinnerIdeas).length > 0 ? (
                        <div className={`grid gap-6 ${
                            (showFavorites ? favoriteDinners : dinnerIdeas).length === 1
                                ? 'grid-cols-1 max-w-2xl mx-auto'
                                : 'grid-cols-1 lg:grid-cols-2'
                        }`}>
                            {(showFavorites ? favoriteDinners : dinnerIdeas).map((dinner, index) => (
                                <DinnerCard
                                    key={dinner.title}
                                    dinner={dinner}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {showFavorites ? 'No favorite dinner ideas yet. Add some by clicking the heart button on ideas you like!' : 'Click "Generate New Ideas" to get dinner suggestions.'}
                        </div>
                    )}

                    {favoriteDinners.length > 0 && showFavorites && (
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

    const articleContent = (
        <>
            <p>Welcome to Dinner Ideas. You're likely here because it's time to think about what you want to eat for dinner and you can't decide. Even more frustrating is that nothing that you can think of sounds appealing. We've all been there. In fact, we created the Dinner Ideas Generator for exactly that reason. Nothing is more frustrating than knowing it's time to decide what meal to make and not being able to come up with anything that sounds appealing. We hope that this random dinner idea generator will help you solve this issue by presenting a number of meal ideas you may not have previously considered. We've found that people use this free online tool in a variety of ways, but below you'll find a few of the more common ones. If you find this tool useful, you may also be interested in checking out some <Link href="/breakfast-ideas.php" className="text-blue-600 hover:text-blue-800">breakfast ideas</Link>.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Dinner Inspiration</h2>
            <p>At some point, we all find ourselves knowing it's time to think about what will be for dinner and we realize we're simply tired of all the usual meals we make. This tool can help with this dilemma. With a simple click of a mouse, you can get hundreds of random dinner ideas that can help you get out of the food rut you find yourself in. Looking at a wide variety of dinner ideas, especially ones you would have never thought of on your own, can be exactly what you need to find the inspiration to try something new.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Can't Decide</h2>
            <p>There are times when faced with a number of dinner choices, nobody seems to be able to come to a consensus decision. At these times, it's often easiest to have a random dinner idea presented to you (or the group) instead of trying to figure out which meal would be best. When you find yourself in a position like this, click to get one or more dinner ideas and the decision has been solved.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Test Cooking Skills</h2>
            <p>For those who like cooking challenges, this generator can be an excellent way to test your cooking skills. Since you have no idea what meal will appear or what foods will be part of it, it can test how well you can cook at the last minute with an unknown menu. How good are you at creating a meal that has been shown to you that you have never seen before? This can also be done with other meals. While this tool is more geared toward random dinner ideas, the same process can be used to challenge you to create lunch ideas as well.</p>

            <p>We're always looking for ways to improve our tools. If you think of something that would be a beneficial addition to this tool, we'd love to hear from you. Please contact with any other ideas you have to make this free online generator better for all. We're constantly striving to make all of our tools the best that we can and your input is a tremendous help in doing this.</p>

            <div className="mt-8" id="faq">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What should I make for dinner tonight?</h3>
                        <p>Most people end up at our dinner ideas generator because of the questions, "What should I make for dinner tonight?" In fact, that's exactly the reason be built this generator. It allows you to generate dinner ideas through pictures to help you look at different dining options you may have not considered and ultimately help you decide what you should make for dinner tonight.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What's the difference between supper and dinner?</h3>
                        <p>In the US, supper and dinner are used interchangeably and both are considered to be the same when referring to the meal we eat in the evening. The chief difference is that dinner is sometimes considered to be a more formal way of referring to the meal with supper being less formal.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What should I make for dinner this week?</h3>
                        <p>When attempting to plan out meals for an entire week, it can often get difficult to come up with good dinner ideas. The dinner ideas generator is a great way to help with coming up and deciding on what you should make for dinner this week. Spending a bit of time going through the many options will help to give you new dinner ideas and focus on the ones that sound most appetizing for the week to come.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What is something different for dinner tonight?</h3>
                        <p>There will be times when you get tired of the same old dinners and want something different for dinner. The best way to find new dinner ideas is to use this random dinner idea generator. Since the dinner ideas are presented randomly, you're bound to come across many ideas you would have never considered or thought of on your own. This will give you a good opportunity to discover dinner ideas that sound appetizing that are also different from your usual dinner meals.</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Dinner Ideas Generator - 500+ Easy and Healthy Dinner Ideas"
                description="The Dinner Ideas Generator helps you find both healthy and easy dinner ideas. Get inspired with random dinner recipes when you can't decide what to cook."
            />
            <GeneratorPageLayout
                title="Dinner Ideas Generator - 500+ Easy and Healthy Dinner Ideas"
                currentPage="/dinner-ideas.php"
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
