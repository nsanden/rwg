import { useState, useEffect } from 'react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';
import { Heart, Copy } from 'lucide-react';

interface BreakfastIdeasGeneratorProps {
    basePath?: string;
}

interface BreakfastIdea {
    url: string;
    image_url: string;
    title: string;
    recipe_url: string;
    description: string;
}

export default function BreakfastIdeasGenerator({ basePath = '' }: BreakfastIdeasGeneratorProps) {
    const [breakfastIdeas, setBreakfastIdeas] = useState<BreakfastIdea[]>([]);
    const [loading, setLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showFavorites, setShowFavorites] = useState(false);
    const [favoriteBreakfasts, setFavoriteBreakfasts] = useState<BreakfastIdea[]>([]);

    // Load favorites from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('breakfastIdeasFavorites');
            if (saved) {
                setFavoriteBreakfasts(JSON.parse(saved));
            }
        }
    }, []);

    const generateBreakfastIdeas = async () => {
        setLoading(true);
        setShowLoading(true);
        setShowFavorites(false);

        try {
            const response = await fetch(`/api/generate/breakfast-ideas?quantity=${quantity}`);
            const data = await response.json();
            setBreakfastIdeas(data.breakfasts || []);
        } catch (error) {
            console.error('Error generating breakfast ideas:', error);
        } finally {
            setLoading(false);
            setTimeout(() => setShowLoading(false), 300);
        }
    };

    // Auto-generate on mount
    useEffect(() => {
        generateBreakfastIdeas();
    }, []);

    const addToFavorites = (breakfast: BreakfastIdea) => {
        const updated = [...favoriteBreakfasts, breakfast];
        setFavoriteBreakfasts(updated);
        localStorage.setItem('breakfastIdeasFavorites', JSON.stringify(updated));
    };

    const removeFromFavorites = (breakfastTitle: string) => {
        const updated = favoriteBreakfasts.filter(b => b.title !== breakfastTitle);
        setFavoriteBreakfasts(updated);
        localStorage.setItem('breakfastIdeasFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavoriteBreakfasts([]);
        localStorage.setItem('breakfastIdeasFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const copyToClipboard = () => {
        const items = showFavorites ? favoriteBreakfasts : breakfastIdeas;
        const text = items.map(b => b.title).join('\n');
        navigator.clipboard.writeText(text);
    };

    const formState = useGeneratorForm({
        wordType: 'breakfast-ideas',
        onGenerate: generateBreakfastIdeas,
        setShowFavorites,
        setQuantity
    });

    const BreakfastCard = ({ breakfast }: { breakfast: BreakfastIdea }) => {
        const isFavorite = favoriteBreakfasts.some(fav => fav.title === breakfast.title);

        // Handle both full URLs and relative paths
        const imageUrl = breakfast.image_url.startsWith('http')
            ? breakfast.image_url
            : `https://randomwordgenerator.com/img/breakfast-ideas-generator/${breakfast.image_url}`;

        return (
            <div className="text-center bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <a href={breakfast.recipe_url} target="_blank" rel="noreferrer nofollow" className="flex-1 text-center">
                        <h3 className="font-bold text-lg text-blue-600 hover:text-blue-800">
                            {breakfast.title}
                        </h3>
                    </a>
                    <button
                        onClick={() => isFavorite ? removeFromFavorites(breakfast.title) : addToFavorites(breakfast)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer ml-2"
                        aria-label={isFavorite ? `Remove "${breakfast.title}" from favorites` : `Add "${breakfast.title}" to favorites`}
                    >
                        <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                </div>
                <a href={breakfast.recipe_url} target="_blank" rel="noreferrer nofollow" className="block">
                    <img
                        src={imageUrl}
                        alt={breakfast.title}
                        className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                    />
                </a>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <BaseGeneratorForm
                        title="Breakfast Ideas"
                        itemName="Breakfast Ideas"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        onGenerate={generateBreakfastIdeas}
                        onReset={formState.resetOptions}
                        {...formState}
                    />

                    {/* Right Column - Results */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                            {favoriteBreakfasts.length > 0 && (
                                <button
                                    onClick={() => setShowFavorites(!showFavorites)}
                                    className={`group flex items-center gap-1 text-sm px-3 py-2 rounded cursor-pointer ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                                    aria-pressed={showFavorites}
                                >
                                    {showFavorites ? (
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                    ) : (
                                        <>
                                            <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                                            ({favoriteBreakfasts.length})
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={copyToClipboard}
                                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded cursor-pointer"
                                aria-label="Copy breakfast ideas to clipboard"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>

                        {showLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div>
                                <p className="mt-2 text-gray-600">Finding delicious breakfast ideas...</p>
                            </div>
                        ) : (
                            <>
                                {(showFavorites ? favoriteBreakfasts : breakfastIdeas).length > 0 ? (
                                    <div className={`grid gap-6 ${
                                        (showFavorites ? favoriteBreakfasts : breakfastIdeas).length === 1
                                            ? 'grid-cols-1 max-w-md mx-auto'
                                            : 'grid-cols-1 md:grid-cols-2'
                                    }`}>
                                        {(showFavorites ? favoriteBreakfasts : breakfastIdeas).map((breakfast) => (
                                            <BreakfastCard
                                                key={breakfast.title}
                                                breakfast={breakfast}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {showFavorites ? 'No favorite breakfast ideas yet. Add some by clicking the heart button on ideas you like!' : 'Click "Generate Breakfast Ideas" to get breakfast suggestions.'}
                                    </div>
                                )}

                                {favoriteBreakfasts.length > 0 && showFavorites && (
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
                </div>

                {/* About Section */}
                <div id="RWG_Below_Generator_Mobile_300px" className="md:hidden google-ad-container flex justify-center mt-8" style={{ height: '280px', maxWidth: '336px', margin: '2rem auto' }}>
                    <div id="div-gpt-ad-1578531360465-0" className="text-center"></div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        {/* Left Column - Article Content */}
                        <ArticleContent>
                            <p>If you've been having trouble deciding what to make for breakfast, you've landed at the perfect spot. We completely understand. You have fallen into a breakfast routine where you have the same or similar breakfasts day after day and you have reached the point where you'd like to try something different. It's completely frustrating knowing you want something new for breakfast but not being able to come up with breakfast ideas for something different. That's exactly why we created the Breakfast Ideas generator. We hope this random breakfast idea generator will help you find new and exciting breakfast ideas by showing you options that you may not have otherwise considered. You may also find our <a href={`${basePath}/dinner-ideas.php`} className="text-blue-600 hover:text-blue-800">dinner ideas</a> tool useful if you're having the same issue of having a difficult time deciding on that meal as well.</p>

                            <p>One of the best aspects of this breakfast idea generator is that it allows you to see breakfast ideas through pictures rather than a long list of recipes. When it comes to food, it's much easier to know what looks appealing through a photo than through a recipe. Then if you see something that looks appealing, you also have a link to the recipe to make it. This makes finding breakfast ideas much easier than trying to look through a long list of breakfast recipes. While you're free to use this generator any way you want to come up with new breakfast ideas, below you can find some of the more common ways people tend to use it.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Breakfast Inspiration</h2>
                            <p>It happens to us all. You wake up and you're hungry but you're just not in the mood for the breakfast you've had the past week. You want something different, but as you look in your refrigerator and cupboards, there doesn't seem to be anything that's appealing. You want something new but you have no idea what that new is. By looking at pictures of different breakfast ideas, you're sure to come across a bunch of new ideas that you have never before considered. Hopefully, a few of those will sound appealing and you have been inspired to try something new for breakfast. It's also great to look through all the random breakfast ideas the night before so you can be inspired and choose your breakfast for the next morning.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Decision Maker</h2>
                            <p>There will be times when you simply want someone to choose breakfast for you. For those who have a difficult time choosing, the breakfast ideas generator can be the perfect tool to help you out. If you're feeling lucky, you can simply click the button and whatever random breakfast idea appears, that's what you'll have for breakfast. For those who aren't quite that adventurous, you can choose to have 5 - 10 different breakfast ideas created and then make your choice for the random results that appear. On days when it's difficult to make a choice, this free online tool can be a fun way to have the decision made for you.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Practice Breakfast Making Skills</h2>
                            <p>If you like a bit of a challenge, this tool is a wonderful way to try new recipes and add additional meals to your breakfast repertoire. Use the breakfast ideas generator to generate a random breakfast idea and use your skills to create that breakfast. One of the best ways to discover the best breakfasts for you and your family is to try a lot of different ones to see what everyone likes best. By generating a lot of different breakfast ideas and making them, you should be able to find a number of new breakfast favorites that you can add to your other regulars to expand the breakfasts that you know you like.</p>

                            <p>We hope that you've found the breakfast ideas presented here to be a useful way to discover new and interesting breakfasts. If so, we'd greatly appreciate you letting others know about it who might also find it beneficial. We're also greatly interested in any suggestions you have on how we can make this breakfast ideas generator better as we want it to be the best it can be. Please feel free to contact us with any suggestions you may have.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Frequently Asked Questions</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">What should I make for breakfast?</h3>
                                    <p>It's common for people to find the breakfast ideas generator because they're searching for the answer to the question, "What should I eat for breakfast?" The breakfast ideas generator was made for exactly this reason. By looking through hundreds of different breakfast pictures, you should be able to find something appealing that you may not have otherwise considered for breakfast.</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Should I eat breakfast?</h3>
                                    <p>Yes, most people should eat a healthy breakfast each morning. If you're considering skipping breakfasts for any reason, you should consult with your doctor to determine if this is appropriate and healthy for you to do.</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Should I eat the same breakfast every morning?</h3>
                                    <p>This is a tricky question and depends a lot on what you eat every day for breakfast. If you eat something healthy for breakfast every day, it's fine to stick to the same meal. If you eat something unhealthy each morning then it's not good to eat the same meal. In most cases, it's better to eat a variety of different foods for breakfast with most of them being healthy, but it's okay to throw in a treat now and then.</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">What is something different for breakfast?</h3>
                                    <p>Many people get into breakfast ruts where they tend to eat the same, or quite similar, meal each morning. The best way to get out of this rut is to find different breakfast ideas that look appealing to try. This is why a breakfast idea generator can be quite helpful. It can show you hundreds of different breakfast photos that make it easy to find new and appealing breakfast food to try. Having the opportunity to find breakfast ideas you may not have thought about on your own can often result in you finding something different for breakfast that you're excited about trying.</p>
                                </div>
                            </div>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/breakfast-ideas" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
