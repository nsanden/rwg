import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function FakeWords() {
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
        defaultType: 'fake',
        autoGenerate: true,
        favoritesKey: 'fakeWordsFavorites',
        apiEndpoint: '/api/generate/words',
        itemName: 'words'
    });

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'fake',
        onGenerate: () => generateWords({ type: 'fake' }),
        setShowFavorites,
        setQuantity,
        customParamBuilder: (baseParams) => ({ type: 'fake' })
    });

    const formPanel = (
        <BaseGeneratorForm
            title="Random Fake Words Generator"
            itemName="Fake Words"
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
            <p>You have arrived at this webpage in all likelihood because you are in need of some fake words or a fake word generator. If that's the case, you're in exactly the right place. We created the Random Fake Word Generator specifically so you can find a bunch of fake words (sometimes called pseudo words, made up words, or nonsense words). Creating these made-up words is simple. All you need to do is choose the number of fake words you'd like to see and then hit the button. You'll instantly see the results.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">What is a Fake Word?</h2>

            <p>Fake words are simply made up words that appear to be real, but actually don't exist and don't have any meaning. They initially appear real because they can be pronounced which makes it seem like they would be real words. This leads to the question of why in the world would anyone needs to find fake words or use a fake word generator? It does seem a bit strange at first, but there are actually a number of legitimate reasons why people find this free nonsense word tool useful. Below we list a few of the more common reasons that people might want to generate random pseudo words.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Creativity</h2>

            <p>If you're in need of some creative inspiration, using nonsense words can be a great way to get the creative juices flowing. Simply generate a fake word and then come up with a definition of what that word could mean. Since it's not a real word, there's no right or wrong answer. You can let your imagination go wild and that should help to get the creative juices flowing. It's a great way to use a made up word generator.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Writing Challenges</h2>

            <p>Fake words can be an excellent way for writers to begin putting words to paper. Whether they're looking to overcome a bit of writer's block or just need a quality way to begin writing each day, having a random pseudo word generated can be an ideal way to do this. Once the writer has a created a random fake word using the fake word generator, he or she can attempt to write a paragraph about the meaning of that nonsense word, or simply come up with a definition, and then use the word in a sentence. Since the words aren't real, it should help overcome writer's block and help to make it an easy way to begin writing each day.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Naming Projects</h2>

            <p>If you're in a situation where you need to come up with a name for a project or some other entity, using a fake word generator can be a great way to begin. While none of the random fake words will likely be the exact word you ultimately decide to use, they can be a good beginning point to create the perfect new word for your needs. Generate random nonsense words and begin saying them out loud. This should help you find the sounds you like and it can ultimately help you create the perfect new word for your project.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Codewords</h2>

            <p>If you and your friends want to be able to tell each other information without anyone else being able to know what you're talking about, creating a set of pseudo words is a great way to do this. You and your friends come up with a definition of each of the fake words and you can say them anytime with anyone listening. While you'll know what you're talking about, nobody else around you will understand the nonsense words coming out of your mouths. You now have secret codewords that you can use at any time!</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Improve Your Gibberish</h2>

            <p>A wonderful way to improve your gibberish is to find fake words and pronounce them so they easily roll off your tongue. All those nonsense words coming out of your mouth are now your own gibberish language. The more pseudo words and made up words you can use when speaking without hesitation will improve your overall gibberish. This is a skill that every baby you meet will absolutely love!</p>

            <p>We appreciate you taking the time to use our fake word generator. While we know some of the ways that this tool is being used, if you happen to be using it for another reason not listed above, we'd love to hear from you. We know from experience that the tools we create are sometimes used in ways we never anticipated. When this happens, it helps us a lot to know these unique ways the fake word generator is being used as it can help us make improvements to the tool when we make updates. If you have any ideas or suggestions on how to make this made up word generator more useful, please send us an email to let us know.</p>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What are made up words?</h3>
                        <p>Made up words are words that sound like they should be real words, but aren't. Our fake word generator has hundreds of made up words for you to find and look at.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What are pseudo words?</h3>
                        <p>Pseudo words are another name for fake words. You can find hundreds of pseudowords in our generator.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What are nonsense words?</h3>
                        <p>Nonsense words are often used with teaching kids phonetics. They are letters strung together and pronounced by each letter's most common sounds but the "word" has no meaning. Many fake words are nonsense words and can be found in our tool.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What is gibberish?</h3>
                        <p>Gibberish are words used to describe a person talking that sounds like speech but has no real meaning. It's often used to "talk" to babies. Many of the fake words in our generator would be considered gibberish when pronounced out loud.</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Fake Words — Find pseudo words and made up words"
                description="The Fake Word Generator creates fake words, pseudo words, made up words, nonsense words, and gibberish."
                keywords={['fake words', 'pseudo words', 'made up words', 'nonsense words', 'gibberish', 'word generator', 'artificial words']}
                ogImage="https://randomwordgenerator.com/img/fake-words.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Fake Words Generator - Generate Pseudo Words"
                currentPage="/fake-word.php"
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
