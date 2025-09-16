import SEO from '@/Components/SEO';
import { Link } from '@inertiajs/react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function Paragraph() {
    const {
        words: paragraphs,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generateParagraphs,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        defaultQuantity: 1,
        autoGenerate: true,
        favoritesKey: 'paragraphFavorites',
        apiEndpoint: '/api/generate/paragraphs',
        itemName: 'paragraphs'
    });

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'paragraphs',
        onGenerate: () => generateParagraphs(),
        setShowFavorites,
        setQuantity,
        customParamBuilder: (baseParams) => ({})
    });

    const formPanel = (
        <BaseGeneratorForm
            title="Random Paragraph Generator"
            itemName="Paragraphs"
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
            items={paragraphs}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
            itemName="paragraphs"
            textSize="small"
        />
    );

    const articleContent = (
        <>
            <p>If you're looking for random paragraphs, you've come to the right place. When a random word or a random sentence isn't quite enough, the next logical step is to find a random paragraph. We created the Random Paragraph Generator with you in mind. The process is quite simple. Choose the number of random paragraphs you'd like to see and click the button. Your chosen number of paragraphs will instantly appear.</p>

            <p>While it may not be obvious to everyone, there are a number of reasons creating random paragraphs can be useful. A few examples of how some people use this generator are listed in the following paragraphs.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Creative Writing</h2>

            <p>Generating random paragraphs can be an excellent way for writers to get their creative flow going at the beginning of the day. The writer has no idea what topic the random paragraph will be about when it appears. This forces the writer to use creativity to complete one of three common writing challenges. The writer can use the paragraph as the first one of a short story and build upon it. A second option is to use the random paragraph somewhere in a short story they create. The third option is to have the random paragraph be the ending paragraph in a short story. No matter which of these challenges is undertaken, the writer is forced to use creativity to incorporate the paragraph into their writing.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Tackle Writers' Block</h2>

            <p>A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete. By inserting a completely random paragraph from which to begin, it can take down some of the issues that may have been causing the writers' block in the first place.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Beginning Writing Routine</h2>

            <p>Another productive way to use this tool to begin a daily writing routine. One way is to generate a random paragraph with the intention to try to rewrite it while still keeping the original meaning. The purpose here is to just get the writing started so that when the writer goes onto their day's writing projects, words are already flowing from their fingers.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Writing Challenge</h2>

            <p>Another writing challenge can be to take the individual sentences in the random paragraph and incorporate a single sentence from that into a new paragraph to create a short story. Unlike the <Link href="/sentence.php" className="text-blue-600 hover:text-blue-700 underline">random sentence generator</Link>, the sentences from the random paragraph will have some connection to one another so it will be a bit different. You also won't know exactly how many sentences will appear in the random paragraph.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Programmers</h2>

            <p>It's not only writers who can benefit from this free online tool. If you're a programmer who's working on a project where blocks of text are needed, this tool can be a great way to get that. It's a good way to test your programming and that the tool being created is working well.</p>

            <p>Above are a few examples of how the random paragraph generator can be beneficial. The best way to see if this random paragraph picker will be useful for your intended purposes is to give it a try. Generate a number of paragraphs to see if they are beneficial to your current project.</p>

            <p>If you do find this paragraph tool useful, please do us a favor and let us know how you're using it. It's greatly beneficial for us to know the different ways this tool is being used so we can improve it with updates. This is especially true since there are times when the generators we create get used in completely unanticipated ways from when we initially created them. If you have the time, please send us a quick note on what you'd like to see changed or added to make it better in the future.</p>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I use these random paragraphs for my project?</h3>
                        <p>Yes! All of the random paragraphs in our generator are free to use for your projects.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Does a computer generate these paragraphs?</h3>
                        <p>No! All of the paragraphs in the generator are written by humans, not computers. When first building this generator we thought about using computers to generate the paragraphs, but they weren't very good and many times didn't make any sense at all. We therefore took the time to create paragraphs specifically for this generator to make it the best that we could.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I contribute random paragraphs?</h3>
                        <p>Yes. We're always interested in improving this generator and one of the best ways to do that is to add new and interesting paragraphs to the generator. If you'd like to contribute some random paragraphs, please contact us.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">How many words are there in a paragraph?</h3>
                        <p>There are usually about 200 words in a paragraph, but this can vary widely. Most paragraphs focus on a single idea that's expressed with an introductory sentence, then followed by two or more supporting sentences about the idea. A short paragraph may not reach even 50 words while long paragraphs can be over 400 words long, but generally speaking they tend to be approximately 200 words in length.</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Random Paragraph Generator — 1000's of random paragraphs"
                description="The Random Paragraph Generator is a free online tool to generate random paragraphs to help writers."
                keywords={['random paragraph generator', 'paragraphs', 'random paragraphs', 'creative writing', 'writing tool', 'content generator']}
                ogImage="https://randomwordgenerator.com/img/random-paragraph-generator.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Paragraph Generator - Generate Random Paragraphs Online"
                currentPage="/paragraph.php"
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
