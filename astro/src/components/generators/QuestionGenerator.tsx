import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface QuestionGeneratorProps {
    basePath?: string;
}

export default function QuestionGenerator({ basePath = '' }: QuestionGeneratorProps) {
    const {
        words: questions,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateWords: generateQuestions,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'questionFavorites',
        apiEndpoint: '/api/generate/questions',
        itemName: 'questions'
    });

    const formState = useGeneratorForm({
        wordType: 'questions',
        onGenerate: () => generateQuestions(),
        setShowFavorites,
        setQuantity,
        customParamBuilder: () => ({})
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BaseGeneratorForm
                        title="Random Questions"
                        itemName="Questions"
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
                            items={questions}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={quantity}
                            loading={showLoading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                            clearAllFavorites={clearAllFavorites}
                            itemName="questions"
                            textSize="medium"
                            onReset={formState.resetAndGenerate}
                        />
                    </div>
                </div>

                <div id="RWG_Below_Generator_Mobile_300px" className="md:hidden google-ad-container flex justify-center mt-8" style={{ height: '280px', maxWidth: '336px', margin: '2rem auto' }}>
                    <div id="div-gpt-ad-1578531360465-0" className="text-center"></div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        <ArticleContent>
                            <p>If you've been searching for a way to get random questions, you've landed on the correct webpage. We created the Random Question Generator to ask you as many random questions as your heart desires. The process is straightforward. Indicate the number of random questions you want to see and then click on the "Generate Random Questions" button. You will instantly see a random assortment of questions corresponding to the number you indicated you wanted to see. There are a number of ways random questions can be useful.</p>

                            <p>Questions can be an excellent way for a writer to jumpstart their creativity. Much like a <a href={`${basePath}/sentence.php`} className="text-blue-600 hover:underline">random sentence</a>, producing a random question leaves the writer blind to what that question is going to be about. The writer can then use the question in a variety of different ways. One challenge would be to use the question as to the first sentence of a story. Another would be to insert the questions somewhere in the first few paragraphs of the story. A more difficult challenge would be to use the question as the end sentence of a story. By having to incorporate an unknown question into a story, the writer is sure to have their creativity challenged.</p>

                            <p>Getting a random question can also be a great way to fight writers' block. Since the question gives a prompt that has nothing to do with the current writing block, it can help get the writing flowing so that the block ultimately disappears. Many times all it takes is a simple question to be answered or used to destroy the block that was there.</p>

                            <p>Random questions can be a wonderful way to begin a writing session each day. Before doing anything else, generate a random question and then choose to incorporate it into a paragraph or write a paragraph answering the question. While this may have nothing to do with the actual writing topic of that day, simply starting to put words down on paper often helps all writing.</p>

                            <p>Using this free online tool can also be a fun and interesting game to play with friends. You can produce one random question after another with each person in the group required to answer the one that appears when it's their turn. Not only can this be a fun game, but you'll also likely learn new things about each other at the same time.</p>

                            <p>The tool can be a wonderful way to gather a number of quality questions for future conversations. It's always good to have some interesting questions that can be brought up in daily conversations to either keep the conversations going or to get more insight into the person you're having the conversation with. Searching through the hundreds of random questions in the database of this tool will help you find some of each.</p>

                            <p>It's always our goal to create the best and most useful generators possible. We take a lot of time putting them together and predicting how they will be used. This allows us to add to them in ways we think will benefit the user. That being said, there are times that these tools get used in ways we never anticipated. We, therefore, find it quite useful when we hear from people using this tool on how exactly they use it. That will help us so we can make improvements from what we learn on future updates. In addition, if you have a specific idea or suggestion on how this random question generator can be changed to make it better, we'd love to hear it.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What are some random questions to ask?</h3>
                                        <p>That's exactly the reason we created this random question generator. There are hundreds of random questions to choose from so you're able to find the perfect random question to ask friends, family and people you want to get to know better.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Do you include common questions?</h3>
                                        <p>This generator doesn't include most common questions. The thought is that you can come up with common questions on your own so most of the questions in this generator are questions that elicit a bit more information that a typical common question.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I use this for 21 questions?</h3>
                                        <p>Yes! there are two ways that you can use this question generator depending on what you're after. You can indicate that you want 21 questions generated and you'll instantly have a random list of 21 questions to use. If you want to curate the 21 questions to use, you can spend some time on the generator until you find 21 questions you like, then use those the next time you play the 21 questions game.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Are these questions for girls or for boys?</h3>
                                        <p>The questions in this generator are gender neutral and can be used to ask either male of females (or any other gender the person identifies with). These questions were created to elicit interesting and thoughtful answers and aren't specific to a specific type of person.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/question" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
