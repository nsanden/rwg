import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { HomepageProps } from '@/types';

export default function Questions({ auth }: HomepageProps) {
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
        favoritesKey: 'randomQuestionsGenerator_favorites',
        apiEndpoint: '/api/generate/questions',
        itemName: 'questions'
    });

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'questions',
        onGenerate: () => generateQuestions(),
        setShowFavorites,
        setQuantity,
        customParamBuilder: (baseParams) => ({})
    });

    const formPanel = (
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
    );

    const resultsPanel = (
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
        />
    );

    const articleContent = (
        <>
            <p>The Random Questions Generator creates random questions so you have random question to ask. There are a number of different ways you can use this random question generator depending on what you're hoping to accomplish. It works well to give writers a way to begin their writing with a random writing prompt, or to jumpstart their creativity if they are experiencing writer's block and can't seem to think of a topic to write about.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">For Writers</h2>
            <p>Writers can use the random question generator to help fight writer's block and get the creativity flowing again. If you're a writer and can't decide what to write about, this tool can help you begin your writing session on a creative note. If you're struggling with ideas to write about, the random questions can work as a wonderful creative writing prompt to give you direction as to where your creative energy should go. They can also be used as a prompt for writing a paragraph, short story, poem, or any other type of creative writing.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Daily Writing Sessions</h2>
            <p>Writing daily is a worthwhile goal for writers looking to improve their skills. The random question generator can be an excellent way to begin these daily writing sessions. Rather than sitting in front of a blank piece of paper or computer screen trying to decide what to write about, simply generate a random question and use that as your topic to write about for at least 10 minutes each day. You'll be amazed at how much your writing improves when you do this daily writing exercise for a month or longer.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Group Games</h2>
            <p>The random questions can be used to create fun group games and activities. They work well as conversation starters where everyone in the group answers the question, or they can be used as a way to get to know people better since many of the questions ask about personal experiences and opinions. They can also be used to create more elaborate games where people have to guess who would answer a specific question in a certain way.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Conversation Starters</h2>
            <p>If you're looking to have a meaningful conversation with friends, family, or even strangers, the random questions can be a great way to get that conversation going. Rather than struggling to think of something interesting to talk about, simply generate a random question and use that to begin your conversation. You'll find that many of the questions lead to fascinating discussions and allow you to learn more about the people you're talking with.</p>

            <p>These are just a few of the ways you can use this random question generator, but there are many more. We hope you find it useful and if you have any feedback or suggestions for improvement, please let us know.</p>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What are some random questions to ask?</h3>
                        <p>That's exactly why this free random question generator was created. Rather than trying to think up random questions to ask on your own, this generator gives you a large variety of random questions that can be used for any purpose you can imagine.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Do you include common questions?</h3>
                        <p>We've purposely attempted to stay away from questions that are commonly asked. We wanted this generator to give you questions that you most likely have never seen or heard before so that you receive a truly random question that's unique and interesting.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I use this for 21 questions?</h3>
                        <p>Yes, this random question generator can be excellent to use if you want to play 21 questions or any other game that requires questions. While the generator gives you far more than 21 questions, you can simply use the first 21 questions generated, or generate new random questions until you have 21 questions you like for your game.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Are these questions for girls or for boys?</h3>
                        <p>The random questions generated are meant to be applicable for both girls and boys. We don't generate questions that are specifically for one gender or the other. The questions should be interesting and thought-provoking for everyone regardless of gender.</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Random Questions — 1200+ Random Questions to Ask"
                description="Generate random questions to ask. The Random Questions Generator creates random questions so you have random question to ask."
                keywords={['random questions', 'questions to ask', 'random question generator', 'conversation starters', 'writing prompts', 'creative writing']}
                ogImage="https://randomwordgenerator.com/img/random-questions.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Questions - Generate Random Questions to Ask"
                currentPage="/question.php"
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