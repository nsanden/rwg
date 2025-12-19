import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface BibleVersesGeneratorProps {
    basePath?: string;
}

export default function BibleVersesGenerator({ basePath = '' }: BibleVersesGeneratorProps) {
    const {
        words,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        defaultType: 'bible',
        autoGenerate: true,
        favoritesKey: 'bibleVersesFavorites',
        apiEndpoint: '/api/generate/bible-verses',
        itemName: 'verses',
        transformResponse: (data: any) => {
            return data.verses || [];
        }
    });

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'bible',
        onGenerate: generateWords,
        setShowFavorites,
        setQuantity
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <BaseGeneratorForm
                        title="Random Bible Verses"
                        itemName="Bible Verses"
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
                            words={words}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={quantity}
                            loading={showLoading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                            clearAllFavorites={clearAllFavorites}
                            onReset={formState.resetAndGenerate}
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
                            <p>You're likely on this webpage because you're interested in finding new and interesting Bible verses. If that's the case, you're in luck. We created the Random Bible Verses Generator for the express purpose of allowing people to discover all the wonderful Bible verses within the Holy Book. Using this free Bible tool is quite simple. You simply need to choose the number of Bible verses you want to see and then click on the button. You'll instantly see your Bible verses appear before your eyes.</p>

                            <p>Getting in your daily Bible verse is important to a lot of people, but it can sometimes be difficult to do with how busy everyone is these days. Being busy, however, isn't a good excuse for missing out on reading a daily Bible verse. This is another reason we created the Random Bible Verse Generator. If you've never used a tool to find random Bible verses, you may wonder if this tool would be useful to you. The best way to know is to read how others are using it and see if it makes sense for your goals as well.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Bible Verse of the Day</h2>

                            <p>If you're looking for a wonderful way to begin the day, generating a random Bible verse of the day can be an excellent way to do so. There's something special beginning the day with the word of God. Since the verse that appears will be completely random, it'll be a surprise and give you a chance to consider it deeply throughout the day. By focusing on a single verse of the day, you can delve thoroughly into what it means to you and your life.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">New Bible Verses</h2>

                            <p>Another benefit of never being sure which Bible verse is going to appear is the random generator gives you the opportunity to read Bible verses you may have forgotten or not thought thoroughly about. While you likely have your favorite parts of the Bible, having Bible verses appear at random can help you find appreciation for other parts of the Bible you don't spend as much time reading. This can be a wonderful way to expand your love of the Bible.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Test Your Bible Knowledge</h2>

                            <p>This free Bible tool can be an excellent way for you to test your Bible knowledge, especially when using it with a friend. Once random Bible verses have been generated, you can read out one of the verses to see if your partner can recite the Bible passage. You can also do the opposite and read the Bible passage and see if your partner can tell you the verse. The more you study the Bible together in the way, the better acquainted you'll become with all of the Bible verses in the Holy Book.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Stay in Touch with the Bible</h2>

                            <p>While you may have the best intentions to read the Bible every day, daily life can sometimes leave you short on time. While reading a single Bible verse of the day isn't as productive as reading many Bible verses for a set period of time, it can be a great way to stay connected with the Lord's Book when you have a busy day. You can simply generate a random verse for the day whenever you have a free minute which can help you stay connected even on the busiest of days.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Great Way to End a Day</h2>

                            <p>If you've gone through an entire day without opening your Bible, clicking on this generator can be an excellent way to end the day. You'll get a random verse that you can ponder and think about as you fall asleep. Again, since you have no idea which Bible verses will appear, this can be an excellent way to expand your knowledge of the Bible. This may give you new insights about the Bible passage and help you get closer to the Book.</p>

                            <p>The examples above are by no means a comprehensive list of why you may want to create random Bible verses, but they show how using this tool can help you better understand the Bible. It can also be a wonderful alternative to reading the Bible page by page. Since you get to choose the number of results you get each time you click for Bible verses, you can set it to the number that's best for you to consume the information. This will make it more likely you have the time to ponder and examine the Bible verses and may help bring you closer to the Book.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Specific Bible Verses</h2>

                            <p>There may be times when you're searching for Bible verses on a specific topic. In this case, you may want to visit a more specific <a href="https://bibleversegenerator.com/" className="text-blue-600 hover:text-blue-700">Bible verses generator</a>. For example, if you've recently experienced the death of a loved one, you may be interested in <a href="https://bibleversegenerator.com/death-verses" className="text-blue-600 hover:text-blue-700">Bible verses about death</a> rather than all of the verses that are in the Holy Book. You may also be searching for more meaning on <a href="https://bibleversegenerator.com/life-verses" className="text-blue-600 hover:text-blue-700">Bible verses about life</a> and <a href="https://bibleversegenerator.com/faith-verses" className="text-blue-600 hover:text-blue-700">verses about faith</a>. You may even be interested in <a href="https://bibleversegenerator.com/strength-verses" className="text-blue-600 hover:text-blue-700">Bible verses about strength</a> in this situation depending on how the death of the loved one is affecting you. All these specific Bible quote generators may also be of interest in a wide variety of other situations.</p>

                            <p>In a more positive light, we all experience times in our life when <a href="https://bibleversegenerator.com/love-verses" className="text-blue-600 hover:text-blue-700">Bible verses about love</a> are important to us. This could be regarding love in your life or about God's love. In the same way, there are times when <a href="https://bibleversegenerator.com/friendship-verses" className="text-blue-600 hover:text-blue-700">Bible verses about friendship</a> and <a href="https://bibleversegenerator.com/family-verses" className="text-blue-600 hover:text-blue-700">verses about family</a> are important for you to better understand because of specific situations about friends and family that are taking place in your life at that particular moment. When you have questions about love, family and friendship and what the Bible says about these topics, it's great to have Bible quote generators where you can find what God and the Bible say about all of these.</p>

                            <p>Then there are times when things may not be going as well as you want in your life and you need to learn how to make the situation better or help others who may be a bit down. When this happens, you may be interested in finding <a href="https://bibleversegenerator.com/inspirational-verses" className="text-blue-600 hover:text-blue-700">inspirational Bible verses</a> to inspire yourself or your friend. You could also want to learn about <a href="https://bibleversegenerator.com/motivational-verses" className="text-blue-600 hover:text-blue-700">motivational Bible verses</a> if you find you're not able to accomplish what you need to get done, or possibly <a href="https://bibleversegenerator.com/encouraging-verses" className="text-blue-600 hover:text-blue-700">encouraging Bible verses</a> if you just need to know that God and the Bible have you back or have a friend that needs a bit of encouragement.</p>

                            <p>We're always interested in the ways people use this free tool. If you find you're using this generator to read Bible verses or to get your verse of the day and you have suggestions on how we can make it better for you, please take a moment to contact us and let us know. We hope to make this the best Bible verse generator as possible with your help.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Frequently Asked Questions</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">What Bible translation does this generator use?</h3>
                                    <p>This random Bible verse generator uses verses from the King James Version (KJV) of the Bible, one of the most widely recognized and historically significant English translations.</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">How many Bible verses are in the database?</h3>
                                    <p>Our database contains thousands of verses from throughout the Bible, including both the Old Testament and New Testament. This ensures you'll discover a wide variety of scripture each time you use the generator.</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Can I use this for daily devotions?</h3>
                                    <p>Absolutely! Many people use this generator as part of their daily devotional practice. Simply generate one verse each morning to meditate on throughout the day, or generate several verses for a more in-depth study session.</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Is this generator free to use?</h3>
                                    <p>Yes, this Bible verse generator is completely free to use. You can generate as many random Bible verses as you'd like without any cost or registration required.</p>
                                </div>
                            </div>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/bible" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
