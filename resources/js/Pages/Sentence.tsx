import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { HomepageProps } from '@/types';

export default function Sentence({ auth }: HomepageProps) {
    const {
        words: sentences,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generateSentences,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'randomSentenceGenerator_favorites',
        apiEndpoint: '/api/generate/sentences',
        itemName: 'sentences'
    });

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'sentences',
        onGenerate: () => generateSentences(),
        setShowFavorites,
        setQuantity,
        customParamBuilder: (baseParams) => ({})
    });

    const formPanel = (
        <BaseGeneratorForm
            title="Random Sentence Generator"
            itemName="Sentences"
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
            items={sentences}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
            itemName="sentences"
            textSize="medium"
        />
    );

    const articleContent = (
        <>
            <p>If you're visiting this page, you're likely here because you're searching for a random sentence. Sometimes a random word just isn't enough, and that is where the random sentence generator comes into play. By inputting the desired number, you can make a list of as many random sentences as you want or need. Producing random sentences can be helpful in a number of different ways.</p>

            <p>For writers, a random sentence can help them get their creative juices flowing. Since the topic of the sentence is completely unknown, it forces the writer to be creative when the sentence appears. There are a number of different ways a writer can use the random sentence for creativity. The most common way to use the sentence is to begin a story. Another option is to include it somewhere in the story. A much more difficult challenge is to use it to end a story. In any of these cases, it forces the writer to think creatively since they have no idea what sentence will appear from the tool.</p>

            <p>For those writers who have writers' block, this can be an excellent way to take a step to crumbling those walls. By taking the writer away from the subject matter that is causing the block, a random sentence may allow them to see the project they're working on in a different light and perspective. Sometimes all it takes is to get that first sentence down to help break the block.</p>

            <p>It can also be successfully used as a daily exercise to get writers to begin writing. Being shown a random sentence and using it to complete a paragraph each day can be an excellent way to begin any writing session.</p>

            <p>Random sentences can also spur creativity in other types of projects being done. If you are trying to come up with a new concept, a new idea or a new product, a random sentence may help you find unique qualities you may not have considered. Trying to incorporate the sentence into your project can help you look at it in different and unexpected ways than you would normally on your own.</p>

            <p>It can also be a fun way to surprise others. You might choose to share a random sentence on social media just to see what type of reaction it garners from others. It's an unexpected move that might create more conversation than a typical post or tweet.</p>

            <p>These are just a few ways that one might use the random sentence generator for their benefit. If you're not sure if it will help in the way you want, the best course of action is to try it and see. Have several random sentences generated and you'll soon be able to see if they can help with your project.</p>

            <p>Our goal is to make this tool as useful as possible. For anyone who uses this tool and comes up with a way we can improve it, we'd love to know your thoughts. Please contact us so we can consider adding your ideas to make the random sentence generator the best it can be.</p>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Are random sentences computer generated?</h3>
                        <p>No, the random sentences in our generator are not computer generated. We considered using computer generated sentences when building this tool, but found the results to be disappointing. Even though it took a lot of time, all the sentences in this generator were created by us.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I use these random sentences for my project?</h3>
                        <p>Yes! Feel free to use any of the random sentences for any project that you may be doing.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I write random sentences?</h3>
                        <p>Sure. We are always looking to expand the database of random sentences. If you have some random sentences that you've created yourself and you'd like to share them with others, fell free to send them to us for addition to this generator.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What is a sentence?</h3>
                        <p>In order to have a complete sentence, the sentence must have a minimum of three word types: a subject, a verb, and an object. In most cases, the subject is a noun or a pronoun. For example, the sentence "Jack loves candy" is a complete sentence because it has all three elements needed to make a complete sentence. Jack (the subject) loves (the verb) candy (the object).</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Random Sentence Generator — 1000+ Random Sentences"
                description="The Random Sentence Generator contains 1000+ random sentences created specifically for this free writing tool and found nowhere else."
                keywords={['random sentence generator', 'sentences', 'random sentences', 'creative writing', 'writing prompts', 'writing tool']}
                ogImage="https://randomwordgenerator.com/img/random-sentence-generator.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Sentence Generator - Generate Creative Writing Prompts"
                currentPage="/sentence.php"
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