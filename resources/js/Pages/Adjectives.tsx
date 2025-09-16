import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from "@/hooks/useGenerator";
import { useGeneratorForm } from "@/hooks/useGeneratorForm";

export default function Adjectives() {
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
        favoritesKey: "wordsFavorites",
        apiEndpoint: "/api/generate/words",
        itemName: "words",
        defaultType: 'adjective',
        autoGenerate: true
    });

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'adjective',
        onGenerate: generateWords,
        setShowFavorites,
        setQuantity
    });

    const formPanel = (
        <BaseGeneratorForm
            title="Random Adjective Generator"
            itemName="Adjectives"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            sizeFilterLabel="Adjective size by:"
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
            <p>You're likely here looking for a number of different adjectives. If you are, you have come exactly to the right page. This random adjective calculator has hundreds of commonly used adjectives which will randomly appear with a click of a mouse depending on the number you would like to generate. Whether you're stuck trying to come up with new ways to describe something or you're just looking for creative adjectives to spice up your writing, the random adjective calculator should be a great help.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Adjectives for Writers</h2>

            <p>While there are a number of reasons you may want to create random adjectives, one of the most common is writers looking for new ways to better describe their writing. The great thing about this adjective tool is that it can help spark creative juices just by generating new adjectives. Simply seeing a random adjective can spark the imagination to come up with the perfect vocabulary for your writing. If nothing else, this tool will give you options you likely had never considered which in itself can be a great help.</p>

            <p>This free calculator is also an excellent way to improve your creative writing. A fun and easy way to challenge yourself is to generate a random adjective and then use it in a paragraph. Writers can expand on this and generate 5 to 10 adjectives and write a page or short story using all of them. Since what will be generated is unknown, it forces the writer to use creativity to use the adjectives to make a great paragraph or short story.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Types of Adjectives</h2>

            <p>Did you know that there are actually three types of adjectives in the Eglish language? Can you guess what they are? The following are the three different types of adjectives that are included in the calculator:</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Descriptive Adjectives</h2>

            <p>Descriptive adjectives are the ones that most people think of when they hear the word "adjective." These are used to describe a specific characteristic of a noun. These are the words that help explain the noun's color, size, and shape among other things. In the sentence, "I walked past a sleek, yellow car on my way home," the words "sleek" and "yellow" are descriptive adjectives.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Quantitative Adjectives</h2>

            <p>Another type of adjective is the quantitative adjective. When a qualitative adjective is used, it helps to describe an approximate amount (or sometimes the exact amount) of a particular noun. In the sentence, "There were a few cars and many bicycles in front of the store" the words "few" and "many" are quantitative adjectives describing the number of cars and bicycles. Additional examples of quantitative adjectives would be a little, no, and all.</p>

            <p>Numerical adjectives are a type of quantitative adjective. Instead of a general amount, numerical adjectives give a specific number quantity. Some examples of this would be one, five, ten, second, and twentieth. In the sentence, "There were three cars and thirty bicycles in front of the store" the words "three" and "thirty" are numerical quantitative adjectives.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Demonstrative Adjectives</h2>

            <p>The third type of adjective is the demonstrative adjective. These are used when "which one?" needs to be answered by specifying a certain noun. In the sentence, "I love the color of this car, but not the color of that one" the words "this" and "that" are demonstrative adjectives describing which car is being referred to. Additional demonstrative adjectives are those and these.</p>

            <p>It's our hope you've found this free tool to be useful. We are always looking for ways to increase the quality of all of our calculators, so if you have a suggestion on how we could improve it, please take the time to contact us. We would love to get your input so we can continue to provide the best possible word generators.</p>

            <div className="mt-8" id="faq">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Is random an adjective?</h3>
                        <p>Yes, the word "random" is an adjective. It can also be used informally as a noun.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Do you have a list of adjectives?</h3>
                        <p>We do not have a full list of adjectives that are in the adjective generator's data base, but you can create your own list of adjectives for whatever you need. Best of all, you can make the adjective list the exact number you need. If you want a list of 10 adjectives, simply set the number to generate to ten. If you want a list of 25 adjectives, set the number to 25. This allows you to create adjective lists to your exact specifications.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What are the three most common adjectives?</h3>
                        <p>According to Oxford English Dictionary, the three most common adjectives are good, new and first.</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What is an adjective?</h3>
                        <p>Adjectives are words which modify nouns or pronouns to make the noun or pronoun more specific. They help to make both nouns and pronouns more specific so you can better communicate their meaning. For example, "the girl has a ball" is not as specific as "the young girl has a large, red ball."</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Random Adjective Generator — Generate 1000+ Random Adjectives"
                description="The Random Adjective Generator contains 1000+ random adjectives including common adjectives."
                keywords={['random adjective generator', 'adjectives', 'random adjectives', 'vocabulary', 'creative writing', 'word games']}
                ogImage="https://randomwordgenerator.com/img/random-adjective-generator.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Adjective Generator - Generate Random Adjectives"
                currentPage="/adjective.php"
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