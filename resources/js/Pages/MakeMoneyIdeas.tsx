import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { Heart, Copy } from 'lucide-react';

export default function MakeMoneyIdeas() {
    const {
        items,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateItems,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'makeMoneyIdeasFavorites',
        apiEndpoint: '/api/generate/make-money-ideas',
        itemName: 'ideas'
    });

    const handleGenerateMakeMoneyIdeas = () => {
        generateItems({
            quantity
        });
    };

    const formState = useGeneratorForm({
        wordType: 'make-money-ideas',
        onGenerate: handleGenerateMakeMoneyIdeas,
        setShowFavorites,
        setQuantity
    });

    const articleContent = (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>When you need some ideas on how to make money or generate passive income, this random generator tool can help spark inspiration. Whether you're looking for active income strategies or passive income opportunities, this tool provides a variety of options to consider.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What Are Make Money and Passive Income Ideas?</h2>
            <p>This generator includes two main types of income generation ideas:</p>
            <p><strong>Active Income Ideas:</strong> These are ways to make money that require your direct involvement and time investment, such as freelancing, consulting, or starting a business.</p>
            <p><strong>Passive Income Ideas:</strong> These are strategies that can potentially generate income with less ongoing time investment once established, such as dividend investing, rental properties, or creating digital products.</p>
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How to Use This Generator</h2>
            <p>Using the Random Make Money Ideas Generator is simple:</p>
            <ol className="list-decimal ml-6 space-y-2">
                <li>Choose how many ideas you want to generate (1-50)</li>
                <li>Click the "Generate Make Money Ideas" button</li>
                <li>Browse through the random selection of income generation ideas</li>
                <li>Save your favorite ideas for later reference</li>
                <li>Generate new ideas for more inspiration</li>
            </ol>
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Benefits of Exploring Different Income Ideas</h2>
            <p>Considering various income generation strategies can help you:</p>
            <ul className="list-disc ml-6 space-y-2">
                <li>Diversify your income streams</li>
                <li>Find opportunities that match your skills and interests</li>
                <li>Discover passive income possibilities</li>
                <li>Build financial resilience</li>
                <li>Achieve your financial goals</li>
            </ul>
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Important Considerations</h2>
            <p>While this generator provides ideas for making money and generating passive income, remember that:</p>
            <ul className="list-disc ml-6 space-y-2">
                <li>All investments carry risks and require careful research</li>
                <li>Success with any income strategy requires effort, planning, and often initial capital</li>
                <li>What works for one person may not work for another</li>
                <li>Always do your due diligence before pursuing any income opportunity</li>
                <li>Consider consulting with financial advisors for investment-related decisions</li>
            </ul>
            <p>Use this generator as a starting point for brainstorming and research, not as financial advice.</p>
        </div>
    );

    const faqs = [
        {
            question: "Are these make money ideas guaranteed to work?",
            answer: "No, these are simply ideas and suggestions for potential income generation. Success depends on many factors including your skills, effort, market conditions, and available resources. Always research thoroughly before pursuing any income opportunity."
        },
        {
            question: "What's the difference between active and passive income?",
            answer: "Active income requires ongoing work and time investment (like a job or freelancing), while passive income can potentially generate money with less ongoing effort once established (like rental income or dividends). However, most 'passive' income still requires initial work and ongoing management."
        },
        {
            question: "How much money do I need to start?",
            answer: "This varies greatly depending on the idea. Some options like freelancing or online services can start with minimal investment, while others like real estate or certain investments require significant capital. Research each idea to understand the requirements."
        },
        {
            question: "Is this financial advice?",
            answer: "No, this generator is for educational and inspirational purposes only. It's not financial advice. Always consult with qualified financial professionals before making investment decisions or significant financial commitments."
        },
        {
            question: "Can I combine multiple ideas?",
            answer: "Absolutely! Many successful people have multiple income streams. Diversifying your income sources can provide more financial stability and opportunities for growth."
        }
    ];

    const formPanel = (
        <BaseGeneratorForm
            title="Random Make Money Ideas Generator"
            itemName="Ideas"
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

    const resultsPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                {favorites.length > 0 && (
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        aria-pressed={showFavorites}
                        aria-label={showFavorites ? 'Switch to view generated ideas' : `Switch to view saved favorites (${favorites.length} ideas)`}
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
                    aria-label={`Copy ${showFavorites ? favorites.length + ' favorite' : items.length + ' generated'} ideas to clipboard`}
                >
                    <Copy className="w-5 h-5 transition-colors" aria-hidden="true" />
                </button>
            </div>

            {showLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div>
                    <p className="mt-2 text-gray-600">Finding money-making ideas...</p>
                </div>
            ) : (
                <>
                    {(showFavorites ? favorites : items).length > 0 ? (
                        <div className={`grid gap-4 ${
                            (showFavorites ? favorites : items).length === 1
                                ? 'grid-cols-1 max-w-2xl mx-auto'
                                : 'grid-cols-1'
                        }`}>
                            {(showFavorites ? favorites : items).map((item: any, index: number) => {
                                const ideaText = typeof item === 'string' ? item : item.idea;
                                const isFavorite = favorites.includes(ideaText);

                                return (
                                    <div key={ideaText} className={`flex items-center justify-between p-6 bg-gray-50 rounded-lg ${
                                        (showFavorites ? favorites : items).length === 1 ? 'text-center' : ''
                                    }`}>
                                        <div className="flex-1">
                                            <div className={`font-medium text-gray-800 ${
                                                (showFavorites ? favorites : items).length === 1 ? 'text-xl' : 'text-base'
                                            }`}>{ideaText}</div>
                                        </div>
                                        <button
                                            onClick={() => isFavorite ? removeFromFavorites(ideaText) : addToFavorites(ideaText)}
                                            className="ml-4 text-gray-400 hover:text-red-500 transition-colors flex items-center"
                                            aria-label={isFavorite ? `Remove "${ideaText}" from favorites` : `Add "${ideaText}" to favorites`}
                                        >
                                            <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {showFavorites ? 'No favorite ideas yet. Add some by clicking the heart button on ideas you like!' : 'Click "Generate Ideas" to get money-making suggestions.'}
                        </div>
                    )}

                    {favorites.length > 0 && showFavorites && (
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
            <SEO
                title="Random Make Money Ideas & Passive Income Generator"
                description="Generate random make money ideas and passive income strategies. Discover various ways to earn active and passive income with our free idea generator."
            />

            <GeneratorPageLayout
                title="Random Make Money Ideas & Passive Income Generator"
                currentPage="make-money-ideas"
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