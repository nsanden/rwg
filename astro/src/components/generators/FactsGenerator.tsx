import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface FactsGeneratorProps {
    basePath?: string;
}

export default function FactsGenerator({ basePath = '' }: FactsGeneratorProps) {
    const {
        words: facts,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generateFacts,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'factsFavorites',
        apiEndpoint: '/api/generate/facts',
        itemName: 'facts'
    });

    const formState = useGeneratorForm({
        wordType: 'facts',
        onGenerate: () => generateFacts(),
        setShowFavorites,
        setQuantity,
        customParamBuilder: () => ({})
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BaseGeneratorForm
                        title="Random Facts Generator"
                        itemName="Facts"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        onGenerate={formState.handleGenerate}
                        onReset={formState.resetOptions}
                        {...formState}
                    />

                    <div className="w-full">
                        <ItemsDisplay
                            items={facts}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={quantity}
                            loading={showLoading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                            clearAllFavorites={clearAllFavorites}
                            itemName="facts"
                            textSize="medium"
                            onReset={formState.resetAndGenerate}
                        />
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        <ArticleContent>
                            <p>If you're looking for random facts, you've arrived at the correct webpage. The Random Fact Generator has thousands of facts ready to be revealed with a simple click of a mouse. Even better, all the random fun facts also come with a source link so that you know they're true. One of the most frustrating parts of many of the many random fun fact lists on the Internet is that many of the supposed facts aren't actually facts. If you take the time to check the "fact" it ends up not being true or only partially true. By providing the source for every fun fact in our generator, you can research to easily confirm that the fact is actually true.</p>

                            <p>Using this free online tool is quite easy. Simply indicate the number of random facts you want to see at one time and click the button. Your chosen number of random fun facts will automatically appear. A question that sometimes gets asked is why would anyone want or need a random fact generator? There are actually a lot of reasons someone might be interested in getting random fun facts. Below are some of the ways this tool gets used on a regular basis.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Interesting Facts</h2>

                            <p>It can be a lot of fun simply learning interesting facts and that's exactly what this online tool will allow you to do. If you spend even a little time, you're going to quickly expand your knowledge with a lot of random fun facts. Even if you never share them with others (which you likely will at some point), it's fun to know you have that knowledge in your head.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Back Pocket Information</h2>

                            <p>It's always good to have a few interesting or funny facts in your back pocket. You never know when they'll be useful. Sometimes they can be great conversation starters and other times they can be the perfect interjection into a conversation. While you're not likely to use them on a daily basis, having a number of quality random facts in your arsenal always seems to come in handy.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Impress Others</h2>

                            <p>Having a wide-ranging knowledge of random fun facts can be quite impressive to others. This is especially true if the random facts you memorize are interesting. While you don't want to go around bragging about the facts you know, being able to casually slip them into everyday conversations on a regular basis can be quite impressive.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Friend Challenge</h2>

                            <p>A fun fact game to play with friends is to see who can come up with the best specific type of fact each day. For example, it could be a cool fact on Monday, an interesting fact on Tuesday, a weird fact on Wednesday, an impressive fact on Thursday, and a fun fact on Friday. By using this tool, you can find a large number of each type and hopefully have the best one to share each day of the competition.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Social Media</h2>

                            <p>Fun facts are wonderful to share on social media to get a lot of shares and likes. It's even more impressive if you can state the random fact with a source so everyone knows it's true. Everyone loves a good random fun fact, just like a good <a href={`${basePath}/motivational-quote.php`} className="text-blue-600 hover:underline">motivational quote</a>, and sharing random fun facts on a daily basis can be a wonderful way to increase your online presence.</p>

                            <p className="mt-4">The above ways are just a few of the many ways the Random Fact Generator can be used. We're interested in learning how you personally use this generator. While we have a general idea of how we believe our tools will be used when we create them, we've found from time to time people use them in far different ways than we ever anticipated. By understanding how people are actually using the random fun facts tool, we can improve it with updates. If you enjoy this tool and have any suggestions or ideas on how we can make it better, please take a few seconds to let us know.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Are these facts actually true?</h3>
                                        <p>Yes! Every fact in our random fact generator comes with a source link so you can verify the information yourself. We believe it's important to provide accurate information rather than spreading misinformation that's common on many "fun fact" lists around the internet.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How many facts are in your database?</h3>
                                        <p>Our random fact generator contains thousands of verified facts covering a wide range of topics including science, history, animals, geography, and more. We're constantly adding new facts to keep the generator fresh and interesting.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I submit a fact to be added?</h3>
                                        <p>Absolutely! We're always looking for interesting new facts to add to our generator. If you have a fun fact along with a reliable source to verify it, please contact us and we'll consider adding it to our database.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I use these facts for my content?</h3>
                                        <p>Yes, you're free to use the facts generated by this tool for your own content, social media posts, presentations, or any other purpose. We just ask that you verify the fact with the provided source before sharing it widely.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/fact" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
