import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface VerbGeneratorProps {
    basePath?: string;
}

export default function VerbGenerator({ basePath = '' }: VerbGeneratorProps) {
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
        defaultType: 'verb',
        autoGenerate: true,
        favoritesKey: 'verbsFavorites',
        apiEndpoint: '/api/generate/words',
        itemName: 'words'
    });

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'verb',
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
                        title="Random Verb Generator"
                        itemName="Verbs"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        sizeFilterLabel="Verb size by:"
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
                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        {/* Left Column - Article Content */}
                        <ArticleContent>
                            <p>For those who need to create a random word or a list of random words, there are times when it's beneficial to have a specific word type generated as opposed to just a list of words in general. If you find yourself in need of creating a random verb, the Random Verb Generator is exactly the tool you need. It sifts through over 1,000 verbs to pick out the number of random verbs you need for your particular project.</p>

                            <p>For those who need a quick refresher, a verb is a word of action, occurrence or state of being. Below you'll find examples of the different verb types.</p>

                            <p><strong>Action Verbs</strong> (these are also known as "dynamic verbs") are the ones that can be performed or you can ask someone to demonstrate that action. Some examples of action verbs would be words such as deliver, run, kick, and push.</p>

                            <p><strong>State of Being Verbs</strong> are usually more difficult to identify. These don't describe a type of action but instead describe a position or property. Some examples of "state of being" verbs are the words be, exist, belong, and depend.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How to Use Random Verbs</h2>

                            <p>There are any number of reasons you may need to use a random verb. One example would be a writer who is trying to push their creativity. Having an unanticipated verb generated creates a situation where a writer must use their creativity to work the verb into their writing. This could be as simple as putting together a paragraph on a particular topic utilizing the verb, or as complex as creating an entire story around the verb. The key is that it's unexpected so the writer has to use their wits to create a piece of writing that utilizes it.</p>

                            <p>Generating a random verb can also be a great way to expand the description of a product or service one may be offering. After it's generated, try to think of all the ways that this verb may be used to describe your particular product. This brainstorming may allow you to flush out beneficial characteristics you may not have ever considered in the past. It may also allow you to use more beneficial actions to associate with your product and service than you may have thought of on your own.</p>

                            <p>The above are just a few ways the Random Verb Generation could be helpful to you or your project, but it's not an exhaustive list. For anyone who is trying to expand their creativity, using this tool can be an excellent way to achieve that goal. Give it a try to see how a variety of new verbs can get numerous ideas flowing.</p>

                            <p>We are always attempting to produce the best tools out there. If you have an idea or suggestion on how we can make this particular generation tool better, please feel free to contact us to let us know. We do take suggestions seriously, and we try to implement those ideas we feel will add value to our tools.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Is random a verb?</h3>
                                        <p>No, random is not a verb. Random is an adjective.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How many random verbs are there?</h3>
                                        <p>There are over 1000 verbs in the random verb generator. There are estimated to be 60,000 to 100,000 verbs in the English language, but we have curated this list down so that most people using this tool will know the meaning of the verb and the verbs aren't too common.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What is the most common verb?</h3>
                                        <p>The most common verb is "to be" in English. It's used when referring to yourself and others, as well as when we talk about things that exist or are happening.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Do you have a list of verbs?</h3>
                                        <p>No, we do not have a complete list of all the verbs we use in this generator. You can create a list of verbs by inputting the number of verbs you'd like to be displayed in our generator.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/verb" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
