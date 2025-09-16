import SEO from '@/Components/SEO';
import { Link } from '@inertiajs/react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { HomepageProps } from '@/types';

export default function WritingPrompts({ auth }: HomepageProps) {
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
        favoritesKey: 'randomWritingPromptsGenerator_favorites',
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

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'prompts',
        onGenerate: () => generatePrompts(),
        setShowFavorites,
        setQuantity,
        customParamBuilder: (baseParams) => ({})
    });

    const formPanel = (
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
    );

    const resultsPanel = (
        <ItemsDisplay
            items={prompts}
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
        />
    );

    const articleContent = (
        <>
            <p>
                If you're in search of random things to write about, you're in the correct place. We created the Random
                Writing Prompt Generator for the express purpose of helping you to find interesting things to write
                about. This tool is easy to use. First, choose the number of writing prompts you'd like to see and then
                click on the button. A random assortment of fun writing prompts will instantly appear.
            </p>

            <p>
                Some people wonder why a quick writing prompt generator is needed when there are plenty of these types
                of lists on the Internet. This online tool adds a few advantages that the lists don't have that can make
                it easier to use for some. Below you can find some of the more common ways the writing prompt
                tool is used.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Writing Challenge</h2>

            <p>
                One of the drawbacks of using the fiction writing prompt lists on the Internet is that when you bring it
                up, you get the entire list. This means that even though you're looking for a random writing prompt,
                you're actually getting a list that you can pick and choose from. This inevitably leads to you choosing
                a prompt that you feel more comfortable with than an actual random thing to write about. That's not the
                case with this tool. If you choose to have only one result appear, you're getting a completely random
                writing result which may not be all that easy. This means you're much more likely to get challenged in
                your writing than when you look at list of random things to write about.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Writing Inspiration</h2>

            <p>
                If you're looking for inspiration for your writing, this tool can be a helpful way to find it. With
                hundreds of interesting things to write about in the database, you are bound to come across writing
                prompts that'll be fun things to write about. The unexpected results should help to inspire your
                writing, especially if you've been experiencing writer's block. While not all of the results will create
                instant inspiration, there should be enough that do to get your writing juices flowing.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">The First Line</h2>

            <p>
                The first sentence is often the most difficult one for a lot of writers when they sit down to write. If
                this is an issue, the writing prompts from this generator can be a wonderful way to begin your
                day. No matter what you need to write about during the day, the prompt will likely be nothing like your
                assignment. This will help take off all the pressure and you can simply write <Link
                        href="/sentence.php">a sentence</Link> or <Link
                        href="/paragraph.php">a paragraph</Link>
                on the resulting prompt. Once you have written a few sentences on any topic, it should be much easier to
                begin writing on the project you have for that day.
            </p>

            <p>
                We have a favor to ask. If you have found the random things to write about generator useful, could you
                send us an email letting us know how you have been using it? While we have a general idea of how we
                think people will use our generators, we have found that there are times when they end up getting used
                in ways we never anticipated. The only way we can make additions that improve our tools is to know how
                they are actually being used. If you have an idea of how you think we can improve this tool please send
                us your suggestions.
            </p>
        </>
    );

    return (
        <>
            <SEO
                title="Writing Prompts — Topic Ideas For Writing"
                description="The Writing Prompts generator helps you find random writing topics. Great for journal prompts and creative writing prompts."
                keywords={['random writing prompt generator', 'writing prompts', 'creative writing', 'story ideas', 'writing inspiration']}
                ogImage="https://randomwordgenerator.com/img/writing-prompts.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Writing Prompt Generator"
                currentPage="/writing-prompt.php"
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
