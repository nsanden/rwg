import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import SEO from '@/Components/SEO';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function Nouns() {
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
        defaultType: 'noun',
        autoGenerate: true,
        favoritesKey: 'wordsFavorites',
        apiEndpoint: '/api/generate/words',
        itemName: 'words'
    });

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'noun',
        onGenerate: generateWords,
        setShowFavorites,
        setQuantity
    });

    const formPanel = (
        <BaseGeneratorForm
            title="Random Noun Generator"
            itemName="Nouns"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            sizeFilterLabel="Noun size by:"
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
                                <p>There may be times when you'll want to generate a random list of a particular part of speech rather than all words in general. For example, you may want to create a random list of just nouns. That's exactly what the random noun generator does.</p>

                                <p>A noun is a word that functions as the name of some specific thing, people or place. Nouns are one of the main parts of speech and sentence. They most often occur as the main word in the subject of a clause or the object of a verb.</p>

                                <p>Even if there is no exact agreed upon number of nouns in the English language, a rough calculation suggests there are at least hundreds of thousands of them, and likely more than one million. If we estimate there are approximately 2 million words in the English language, and a look at any dictionary shows approximately 75% of them are nouns, then we can estimate there should be around 1,500,000 nouns in the English language. This goes to show how important nouns are in English and why you may want to create a random list of just them in particular.</p>

                                <p>It's important to note that not all nouns are the same. They can be classified into a number of different categories. Here are some of the type of nouns that exist:</p>

                                <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Classification of Nouns</h2>

                                <ul className="space-y-2 list-disc list-inside">
                                    <li><strong>Proper Nouns</strong> are unique nouns and usually capitalized. Examples: Germany, January, Nebraska, White House.</li>
                                    <li><strong>Common Nouns</strong> refer to general, unspecific categories of entities. Examples: country, month, university.</li>
                                    <li><strong>Countable Nouns</strong> are all nouns which can be pluralized. Examples: bike, dog, car, university.</li>
                                    <li><strong>Uncountable Nouns</strong> (also known as Mass Nouns) are nouns which don't have plurals. Examples: weather, happiness, milk, air.</li>
                                    <li><strong>Collective Nouns</strong> are nouns that refer to a group of something. Examples: gaggle, bevy, team, faculty.</li>
                                    <li><strong>Concrete Nouns</strong> refer to real things that can be touched, smelled, seen or tasted. Examples: animal, flower, computer, car.</li>
                                    <li><strong>Abstract Nouns</strong> refer to theoretical concepts. Examples: freedom, love, brightness.</li>
                                    <li><strong>Pronouns</strong> are types of nouns that can be used instead of nouns. Examples: he, she, them.</li>
                                </ul>

                                <p className="mt-4">There are a great many ways you may want to use the random noun generator. Here are a few examples:</p>

                                <ul className="space-y-1 list-disc list-inside">
                                    <li>to help form new concepts, ideas, and products</li>
                                    <li>to stimulate creativity through nouns you may have never considered</li>
                                    <li>to brainstorm marketing slogans and product names</li>
                                    <li>to form unique domain names or product names</li>
                                    <li>to spur you to think in unexpected ways</li>
                                </ul>

                                <p>This is not an exhaustive list, but the above list does give a few ideas on how some people might use random nouns to help them solve issues. The best way to see the possibilities is to actually create a number of random lists with this tool and consider how the generated words might be able to help you with your current projects.</p>

                                <p>We hope that you find this tool useful. If you have any ideas on how we may improve it, please feel free to contact us with your input as we always strive to provide the best generators possible.</p>

                                <div className="mt-8" id="faq">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 text-gray-800">What is a noun?</h3>
                                            <p>Nouns are parts of speech that give the names to people, things, places, actions, ideas or qualities.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 text-gray-800">What are proper nouns?</h3>
                                            <p>Proper nouns are unique and give a specific name to a person, place or thing. They're usually capitalized. A few examples of proper nouns would be San Francisco, George Washington, or Tesla.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 text-gray-800">What are common nouns?</h3>
                                            <p>Common nouns are less specific than proper nouns and refer to general entities. They're usually not capitalized. A few examples of common nouns would be city, president, or car.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold mb-2 text-gray-800">What are the types of common nouns?</h3>
                                            <p>Common noun are usually divided into a number of different categories. These include countable nouns, uncountable nouns, collective nouns. concrete nouns, abstract nouns and pronouns. Examples of each of these can be found in the main body of this article on this page.</p>
                                        </div>
                                    </div>
                                </div>
        </>
    );

    return (
        <>
            <SEO
                title="Random Noun Generator — 1000+ Random Nouns"
                description="The Random Noun Generator includes 1000+ random nouns including proper, common, countable, uncountable, collective, concrete, abstract and pronouns."
                keywords={['random noun generator', 'nouns', 'random nouns', 'vocabulary', 'creative writing', 'word games']}
                ogImage="https://randomwordgenerator.com/img/random-noun-generator.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Noun Generator - Generate Random Nouns"
                currentPage="/noun.php"
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