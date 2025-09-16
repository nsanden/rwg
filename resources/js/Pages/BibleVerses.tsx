import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function BibleVerses() {
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

    const formPanel = (
        <BaseGeneratorForm
            title="Random Bible Verse Generator"
            itemName="Verses"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            showLetterFilters={false}
            showSizeFilter={false}
            {...formState}
        />
    );

    const resultsPanel = (
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
        />
    );

    const articleContent = (
        <>
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
        </>
    );

    return (
        <>
            <SEO
                title="Random Bible Verse Generator — 31,000+ Bible Verses"
                description="The Random Bible Verse Generator includes 31,000+ Bible verses from the Old and New Testament. Find inspiration with random verses for daily reading."
                keywords={['random bible verses', 'bible verse generator', 'daily bible verse', 'scripture', 'biblical quotes', 'verse of the day']}
                ogImage="https://randomwordgenerator.com/img/random-bible-verses.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Bible Verse Generator - Generate Random Bible Verses"
                currentPage="/bible-verse.php"
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