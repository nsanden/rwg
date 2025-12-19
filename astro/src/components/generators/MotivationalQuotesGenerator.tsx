import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface MotivationalQuotesGeneratorProps {
    basePath?: string;
}

export default function MotivationalQuotesGenerator({ basePath = '' }: MotivationalQuotesGeneratorProps) {
    const {
        words: quotes,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generateQuotes,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'motivationalQuotesFavorites',
        apiEndpoint: '/api/generate/motivational-quotes',
        itemName: 'quotes',
        transformResponse: (data: any) => {
            return data.quotes.map((quote: { quote: string; author: string }) => quote.quote);
        }
    });

    const formState = useGeneratorForm({
        wordType: 'motivational',
        onGenerate: generateQuotes,
        setShowFavorites,
        setQuantity
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <BaseGeneratorForm
                        title="Motivational Quotes"
                        itemName="Quotes"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        onGenerate={formState.handleGenerate}
                        onReset={formState.resetOptions}
                        {...formState}
                    />

                    {/* Right Column - Results */}
                    <div className="w-full">
                        <ItemsDisplay
                            words={quotes}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={quantity}
                            loading={showLoading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                            clearAllFavorites={clearAllFavorites}
                            itemName="quotes"
                            textSize="medium"
                        />
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
                            <p>
                                We all need motivation and encouragement from time to time, and if you don't need either of these at the moment, you certainly have friends or family who could benefit from both. If you're looking for some motivational quotes or inspirational quotes to positively influence your day, you've come to the right place. This is exactly what the Random Motivational Quotes Generator is able to do. With over 1000 motivational quotes in the database, you're sure to find more than a few that will inspire you and help uplift your day.
                            </p>

                            <p>
                                The best part of using this motivational generator is how simple it is to use. You just need to indicate how many motivational quotes you'd like to see at one time and then use your mouse to click the generate button. You should see a list of motivational and inspirational quotes appear and you'll have all the words you need to help make your day as positive as it can be. For those who would like a list of motivational quotes, you can create one by indicating how many inspirational quotes you'd like to see at one time.
                            </p>

                            <p>
                                With so many lists of motivational quotes and even books devoted entirely to them, some people question why there's a need for a random motivational quote generator. While there are actually a number of ways it can be useful, the main one is that it's a different way to digest the information than those other methods. The long lists of inspirational quotes can quickly get overwhelming. With this free quote generator, you get to pick the exact number of motivational quotes you want to see each time. By avoiding the long lists, you have a better chance to digest and retain the encouraging quotes you see. It simply is an alternative way to read the quotes so you can hopefully find more of them that motivate and encourage you each day. If you're not sure if this free tool would benefit you, a good way to decide is to read a few of the ways it's commonly used by others.
                            </p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Begin Your Day Right</h2>
                            <p>
                                The beginning of the day is vitally important to how the rest of your day is likely to go. If you don't want to get up on the wrong side of the bed, make it a habit to start your day off with a motivational quote or even more than one. It can help put you in the right frame of mind so that you have a much more positive day than you would've otherwise had. Everyone needs a little help to get the day started on a positive note, and there's nothing better to do this than a good cup of coffee and an inspirational and motivational quote.
                            </p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Encourage Your Friends</h2>
                            <p>
                                Everyone needs someone on their side to help brighten their day, help them see something in a new way, or start a discussion about something which they hadn't thought about. Use the motivational quote generator to start this conversation with a friend or family member. You never know how much an inspirational idea from you might help someone else. Maybe they'll continue to pass it on to encourage even more people as well.
                            </p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Write On It</h2>
                            <p>
                                Using a motivational quote that speaks to you is a great way to start a journal page or begin your writing for the day. Just having that first quote to get the ideas going is an invaluable tool - you never know where that one idea will take you. In addition, sometimes writers tend to pick a quote or subject that they're more familiar with. Since you won't know what the inspirational quote will be or who the author is beforehand, it may force you to be more creative and think in a new direction about the idea.
                            </p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Make Your Students Write On It</h2>
                            <p>
                                If you're a teacher and have ever had a student or your own homeschool student complain about not having something to write about, this generator may be the answer. Instead of having them stare at a blank page, provide them with a motivational and encouraging quote to get them started. They can even research the author of the quote to create a built-in history lesson as well.
                            </p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Sleep On It</h2>
                            <p>
                                It's always nice to have good thoughts running through your head right before you head off to sleep. Help quiet your busy brain by using the generator to provide a motivational quote for you as you place your head on the pillow. Not only will you go to bed on a positive note, but the thoughts can also often carry through the night so that you wake up feeling positive as well.
                            </p>

                            <p>
                                The above examples are just a few ways this online tool can be used. We hope that the quotes inspire you to use your imagination for many other ideas! If you find you use this tool in ways not mentioned in this article, please contact us to let us know how you found it useful. Finding out the specific ways the motivational quote generator is being used helps us to find ways to make it better. If you also happen to have ideas on how this generator would be more useful to yourself, or how we can improve it, letting us know would be greatly appreciated.
                            </p>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/motivational-quote" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
