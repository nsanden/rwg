import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { HomepageProps } from '@/types';

export default function Phrase({ auth }: HomepageProps) {
    const {
        words: phrases,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generatePhrases,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'phrasesFavorites',
        apiEndpoint: '/api/generate/phrases',
        itemName: 'phrases'
    });

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'phrases',
        onGenerate: generatePhrases,
        setShowFavorites,
        setQuantity
    });

    const formPanel = (
        <BaseGeneratorForm
            title="Random Phrase Generator"
            itemName="Phrases"
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
            items={phrases}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
            itemName="phrases"
            textSize="medium"
        />
    );

    const articleContent = (
        <>
            <p>Welcome to the Random Phrase and Idiom Generator. There will be times when you may need more than a random word for what you want to accomplish, and this free online tool can help. The use of this tool is quite simple. All you need to do is indicate the number of random phrases you'd like to be displayed and then hit the "Generate Random Phrases" button. Once done, your chosen number of idioms will be displayed along with the meaning of the idiom.</p>

            <p>Idioms are a wonderful part of the English language that gives it a lot of flavor. They force people to know more than the literal meaning of words. Idioms are commonly used phrases that have a meaning completely different than their literal meaning. This can be quite confusing to those who aren't familiar with the idiom and those who are studying English.</p>

            <p>Using this tool can be excellent practice for students studying English as a second language because it gives the literal meaning of each phrase. This allows you to see the phrase and its meaning at the same time. While there are long idiom lists available online, trying to navigate through them on a single page can be daunting. Being able to create the exact number of random idioms which best suits your learning needs is an advantage this tool has over standard phrase list. In this way, this tool provides an excellent way for those learning English to practice their knowledge of English idioms and to learn new ones in the process.</p>

            <p>It can also be a wonderful way for writers to brainstorm and spur more creativity in their writing. The tool can be used to get writing ideas flowing forcing the writer to use more creativity than they would with a single random word. For example, the writer can use the generated phrase to create a new paragraph or story. Since the writer has no idea what will appear, or even if they will be familiar with the idiom, it forces the writer to use creativity to incorporate it into what they're writing.</p>

            <p>Some people may want to use this tool much like they do a new random daily word. Each day you generate a random idiom and the goal is to use it in a conversation at some point during the day. This can be a bit more difficult than using a daily random word, but the benefit is this challenge can greatly expand the vocabulary and the understanding of idioms. It's an especially useful challenge for those learning English.</p>

            <p>The above are just a few ways this tool can be used. If you happen to use this generator on a fairly regular basis or are using it for a specific project, we would appreciate you taking a moment to let us know exactly how you're using it. While we usually have a general idea of how the tools we create will be used, we're often surprised at some of the creative ways they end up being used we never anticipated. By understanding the various ways it's being used gives us the opportunity to make improvements to it as we update, ultimately making it better for everyone. In addition, if you have a specific suggestion on how we could improve the Random Phrase Generator, we'd love to get your ideas.</p>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What is a phrase?</h3>
                        <p>A phrase is a short selection of words which when put together create a concept. Most phrases are a few words that mean something specific when they are put together.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What is an idiom?</h3>
                        <p>An idiom is a group of words that, when used together, has a meaning that is different from the literal meaning of the individual words. For example, the idiom "It's raining cats and dogs" means it's raining very heavily, not that cats and dogs are actually falling from the sky.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What types of phrases are included?</h3>
                        <p>Our generator includes a wide variety of phrases including common idioms, everyday expressions, proverbs, colloquialisms, and frequently used phrases in English. The collection focuses on phrases that are commonly used in both formal and informal communication.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I use these phrases in my writing?</h3>
                        <p>Yes! All the phrases generated are common expressions in the English language and are free to use in your writing, presentations, or educational materials. No attribution is required, though we always appreciate it when possible.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Are the phrases suitable for all audiences?</h3>
                        <p>Yes, we've carefully curated our phrase collection to ensure all content is appropriate for general audiences and educational use. The phrases included are commonly used in everyday conversation and professional communication.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I suggest new phrases?</h3>
                        <p>We're always looking to expand and improve our phrase collection. If you have suggestions for phrases that should be included, please contact us with your recommendations.</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Random Phrase Generator — 1000+ Phrases and Idioms"
                description="The Random Phrase Generator includes 1000+ random phrases and idioms with definition. Learn random idioms to improve your English."
                keywords={['random phrase generator', 'phrases', 'idioms', 'random phrases', 'english phrases', 'expressions', 'sayings']}
                ogImage="https://randomwordgenerator.com/img/random-phrase-generator.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Phrase Generator - Generate Idioms and Common Phrases"
                currentPage="/phrase.php"
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