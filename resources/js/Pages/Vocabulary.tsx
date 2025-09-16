import SEO from '@/Components/SEO';
import { Link } from '@inertiajs/react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

interface VocabularyWord {
    word: string;
    definition: string;
}

export default function Vocabulary() {
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
        favoritesKey: "vocabularyFavorites",
        apiEndpoint: "/api/generate/vocabulary",
        itemName: "words",
        autoGenerate: true
    });

    // Transform vocabulary words to ItemsDisplay format
    const transformedWords = words.map((item: any) => ({
        word: typeof item === 'object' ? item.word : item,
        definition: typeof item === 'object' ? item.definition : ''
    }));


    const formProps = useGeneratorForm({
        onGenerate: generateWords,
        wordType: 'vocabulary',
        setQuantity,
        setShowFavorites
    });

    const formPanel = (
        <BaseGeneratorForm
            {...formProps}
            title="Random Vocabulary Generator"
            itemName="Vocab Words"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            onGenerate={() => generateWords()}
            onReset={() => {}}
        />
    );

    const resultsPanel = (
        <ItemsDisplay
            words={transformedWords}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
            blurDefinitions={true}
        />
    );

    const articleContent = (
        <>
            <p>Chances are you ended up on this webpage because you're in search of random vocabulary words. Luckily, that's exactly why we created the Random Vocabulary Generator. Using this vocabulary word picker is straightforward. Take a moment to decide how many vocabulary words you would like to see at one time, then press the button. A random set of vocabulary words will instantly appear on the screen.</p>

            <p>There are quite a few reasons as to why someone would like to see random vocabulary words. If you need to randomize a specific vocabulary list, you can do that using our <Link href="/list.php">Random Any List Generator</Link> (this will allow you to study a vocabulary list you have been assigned at school). If not, below you'll find a few reasons why people use our random vocab word tool.</p>

            <h2 className="text-xl">Improving Vocabulary</h2>

            <p>Using this generator is a wonderful way to improve your vocabulary in an easy and fun way. There are thousands of words that may appear, and there will certainly be ones that you don't yet know. Spending a little time each day going through the vocabulary words in this free online tool will help you improve your overall vocabulary knowledge.</p>

            <h2 className="text-xl">Entrance Exam Tests</h2>

            <p>If you're going to be graduating from high school and have started to study for the SAT or ACT, you know that vocabulary is an important part of each test. If you are graduating from college, the same is true for the GRE test to get into graduate school. Using this tool to help you get better at and hopefully improve your SAT, ACT, or GRE scores is another way the random vocab generator can be helpful.</p>

            <h2 className="text-xl">Spelling Bees</h2>

            <p>If your school is having their annual spelling bee contest, generating random vocabulary words can be an excellent way to practice. Have a partner generate random vocabulary and then they can read off the words and have you spell each. Then you can switch and you can give spelling bee words to your friend. Over time, your spelling should greatly improve using this tool.</p>

            <h2 className="text-xl">Vocabulary Lists</h2>

            <p>If you're a teacher and you want to give your students a challenge, this tool can be a great way to generate vocabulary lists. You can simply generate a random vocabulary list of ten or twenty words and hand them out to your students to challenge their studying.</p>

            <p>The above are a few examples of how this random vocab generator can be utilized to benefit those wanting to improve their vocabulary. A great way to see if you find this free tool useful is to actually use it. Spend some time exploring whether it can help you reach your vocabulary goals.</p>

            <p>For those who find this vocabulary tool beneficial, we'd appreciate you taking the time to tell us exactly how you use it. We create all our tools by imagining how we would use them, but we know from experience that isn't how they are always used. In fact, they're often used in ways we never anticipated and if they're being used in different ways, it's helpful for us to know. When we understand how this generator is being used by everyone, we can make adjustments and updates to improve it for all. Please let us know any suggestions or ideas you have to make this random vocabulary generator better.</p>
        </>
    );

    return (
        <>
            <SEO
                title="Vocabulary Words — Generate 1000+ Vocab Words"
                description="The Vocabulary Words Generator contains 1000+ vocabulary words with definitions. Study vocab and increase your English vocabulary."
                keywords={['random vocabulary words', 'vocabulary generator', 'SAT vocabulary', 'ACT vocabulary', 'GRE vocabulary', 'spelling bee words']}
                ogImage="https://randomwordgenerator.com/img/vocabulary-words.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Vocabulary Words - Vocabulary Generator"
                currentPage="/vocabulary.php"
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
