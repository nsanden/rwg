import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface WritingPromptGeneratorProps {
    basePath?: string;
}

export default function WritingPromptGenerator({ basePath = '' }: WritingPromptGeneratorProps) {
    const {
        words: prompts,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generatePrompts,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'writingPromptsFavorites',
        apiEndpoint: '/api/generate/writing-prompts',
        itemName: 'prompts',
        transformResponse: (data) => {
            // Transform the API response to match the expected format
            if (data.prompts && Array.isArray(data.prompts)) {
                return data.prompts.map((prompt: any) => ({
                    word: prompt.value,
                    definition: prompt.description
                }));
            }
            return [];
        }
    });

    const formState = useGeneratorForm({
        wordType: 'prompts',
        onGenerate: () => generatePrompts(),
        setShowFavorites,
        setQuantity,
        customParamBuilder: () => ({})
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BaseGeneratorForm
                        title="Random Writing Prompt Generator"
                        itemName="Writing Prompts"
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
                            words={prompts}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={quantity}
                            loading={showLoading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                            clearAllFavorites={clearAllFavorites}
                            itemName="prompts"
                            textSize="medium"
                            onReset={formState.resetAndGenerate}
                        />
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        <ArticleContent>
                            <p>If you're in search of random things to write about, you're in the correct place. We created the Random Writing Prompt Generator for the express purpose of helping you to find interesting things to write about. This tool is easy to use. First, choose the number of writing prompts you'd like to see and then click on the button. A random assortment of fun writing prompts will instantly appear.</p>

                            <p>Some people wonder why a quick writing prompt generator is needed when there are plenty of these types of lists on the Internet. This online tool adds a few advantages that the lists don't have that can make it easier to use for some. Below you can find some of the more common ways the writing prompt tool is used.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Writing Challenge</h2>

                            <p>One of the drawbacks of using the fiction writing prompt lists on the Internet is that when you bring it up, you get the entire list. This means that even though you're looking for a random writing prompt, you're actually getting a list that you can pick and choose from. This inevitably leads to you choosing a prompt that you feel more comfortable with than an actual random thing to write about. That's not the case with this tool. If you choose to have only one result appear, you're getting a completely random writing result which may not be all that easy. This means you're much more likely to get challenged in your writing than when you look at list of random things to write about.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Writing Inspiration</h2>

                            <p>If you're looking for inspiration for your writing, this tool can be a helpful way to find it. With hundreds of interesting things to write about in the database, you are bound to come across writing prompts that'll be fun things to write about. The unexpected results should help to inspire your writing, especially if you've been experiencing writer's block. While not all of the results will create instant inspiration, there should be enough that do to get your writing juices flowing.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">The First Line</h2>

                            <p>The first sentence is often the most difficult one for a lot of writers when they sit down to write. If this is an issue, the writing prompts from this generator can be a wonderful way to begin your day. No matter what you need to write about during the day, the prompt will likely be nothing like your assignment. This will help take off all the pressure and you can simply write <a href={`${basePath}/sentence.php`} className="text-blue-600 hover:underline">a sentence</a> or <a href={`${basePath}/paragraph.php`} className="text-blue-600 hover:underline">a paragraph</a> on the resulting prompt. Once you have written a few sentences on any topic, it should be much easier to begin writing on the project you have for that day.</p>

                            <p>We have a favor to ask. If you have found the random things to write about generator useful, could you send us an email letting us know how you have been using it? While we have a general idea of how we think people will use our generators, we have found that there are times when they end up getting used in ways we never anticipated. The only way we can make additions that improve our tools is to know how they are actually being used. If you have an idea of how you think we can improve this tool please send us your suggestions.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What types of writing prompts are included?</h3>
                                        <p>Our database includes a wide variety of prompts covering fiction, creative nonfiction, journaling, and storytelling. You'll find prompts ranging from character-driven scenarios to imaginative "what if" situations, dialogue starters, and descriptive challenges.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How can I use these prompts for journaling?</h3>
                                        <p>Writing prompts make excellent journal starters. Simply generate a prompt and use it as the starting point for your daily journal entry. You can interpret the prompt literally or let it inspire a related personal reflection or memory.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Are these prompts suitable for kids?</h3>
                                        <p>Yes! Our writing prompts are family-friendly and can be used by writers of all ages. Teachers often use this tool to give students creative writing assignments, and parents can use it to encourage children to practice their writing skills.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I use these prompts for NaNoWriMo or writing groups?</h3>
                                        <p>Absolutely! These prompts are perfect for NaNoWriMo (National Novel Writing Month), writing groups, workshops, or any creative writing exercise. Generate multiple prompts to give your group options, or challenge everyone with the same random prompt.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/writing-prompt" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
