import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface VocabularyGeneratorProps {
    basePath?: string;
}

export default function VocabularyGenerator({ basePath = '' }: VocabularyGeneratorProps) {
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
        autoGenerate: true,
        favoritesKey: 'vocabularyFavorites',
        apiEndpoint: '/api/generate/vocabulary',
        itemName: 'words'
    });

    // Transform vocabulary words to ItemsDisplay format
    const transformedWords = words.map((item: any) => ({
        word: typeof item === 'object' ? item.word : item,
        definition: typeof item === 'object' ? item.definition : ''
    }));

    const formState = useGeneratorForm({
        wordType: 'vocabulary',
        onGenerate: () => generateWords(),
        setShowFavorites,
        setQuantity,
        customParamBuilder: () => ({})
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BaseGeneratorForm
                        title="Random Vocabulary Generator"
                        itemName="Vocab Words"
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
                            itemName="words"
                            blurDefinitions={true}
                            onReset={formState.resetAndGenerate}
                        />
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        <ArticleContent>
                            <p>Chances are you ended up on this webpage because you're in search of random vocabulary words. Luckily, that's exactly why we created the Random Vocabulary Generator. Using this vocabulary word picker is straightforward. Take a moment to decide how many vocabulary words you would like to see at one time, then press the button. A random set of vocabulary words will instantly appear on the screen.</p>

                            <p>There are quite a few reasons as to why someone would like to see random vocabulary words. If you need to randomize a specific vocabulary list, you can do that using our <a href={`${basePath}/list.php`} className="text-blue-600 hover:underline">Random Any List Generator</a> (this will allow you to study a vocabulary list you have been assigned at school). If not, below you'll find a few reasons why people use our random vocab word tool.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Improving Vocabulary</h2>

                            <p>Using this generator is a wonderful way to improve your vocabulary in an easy and fun way. There are thousands of words that may appear, and there will certainly be ones that you don't yet know. Spending a little time each day going through the vocabulary words in this free online tool will help you improve your overall vocabulary knowledge.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Entrance Exam Tests</h2>

                            <p>If you're going to be graduating from high school and have started to study for the SAT or ACT, you know that vocabulary is an important part of each test. If you are graduating from college, the same is true for the GRE test to get into graduate school. Using this tool to help you get better at and hopefully improve your SAT, ACT, or GRE scores is another way the random vocab generator can be helpful.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Spelling Bees</h2>

                            <p>If your school is having their annual spelling bee contest, generating random vocabulary words can be an excellent way to practice. Have a partner generate random vocabulary and then they can read off the words and have you spell each. Then you can switch and you can give spelling bee words to your friend. Over time, your spelling should greatly improve using this tool.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Vocabulary Lists</h2>

                            <p>If you're a teacher and you want to give your students a challenge, this tool can be a great way to generate vocabulary lists. You can simply generate a random vocabulary list of ten or twenty words and hand them out to your students to challenge their studying.</p>

                            <p>The above are a few examples of how this random vocab generator can be utilized to benefit those wanting to improve their vocabulary. A great way to see if you find this free tool useful is to actually use it. Spend some time exploring whether it can help you reach your vocabulary goals.</p>

                            <p>For those who find this vocabulary tool beneficial, we'd appreciate you taking the time to tell us exactly how you use it. We create all our tools by imagining how we would use them, but we know from experience that isn't how they are always used. In fact, they're often used in ways we never anticipated and if they're being used in different ways, it's helpful for us to know. When we understand how this generator is being used by everyone, we can make adjustments and updates to improve it for all. Please let us know any suggestions or ideas you have to make this random vocabulary generator better.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Why are the definitions blurred?</h3>
                                        <p>The definitions are blurred by default to help you test your vocabulary knowledge. Try to recall the definition of each word before clicking to reveal it. This active recall method is one of the most effective ways to learn and retain new vocabulary.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What level are these vocabulary words?</h3>
                                        <p>Our vocabulary database includes words suitable for a wide range of levels, from high school students preparing for the SAT/ACT to college graduates studying for the GRE. The words are randomly selected, so you'll encounter both familiar and challenging terms.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How can I save words I want to study later?</h3>
                                        <p>Click the heart icon next to any word to add it to your favorites. Your favorites are saved locally in your browser, so you can return anytime to review the words you've collected. Use the copy button to export all your favorites at once.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I use this tool offline?</h3>
                                        <p>This vocabulary generator requires an internet connection to fetch random words from our database. However, once you've saved words to your favorites, you can view them even without generating new ones, as favorites are stored in your browser.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/vocabulary" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
