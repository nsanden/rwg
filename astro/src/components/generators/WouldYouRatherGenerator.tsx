import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface WouldYouRatherGeneratorProps {
    basePath?: string;
}

export default function WouldYouRatherGenerator({ basePath = '' }: WouldYouRatherGeneratorProps) {
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
        favoritesKey: 'wouldYouRatherFavorites',
        apiEndpoint: '/api/generate/would-you-rather',
        itemName: 'questions',
        transformResponse: (data) => {
            if (data.questions && Array.isArray(data.questions)) {
                return data.questions.map((question: any) => ({
                    word: question.question_would_you_rather || question.value || question
                }));
            }
            return [];
        }
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
                        title="Would You Rather Questions"
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
                            words={questions}
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

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        <ArticleContent>
                            <p>Are you ready to play a game of Would You Rather but you're having trouble coming up with good Would You Rather questions? You've ended up at exactly the place to solve that dilemma. With over 500 Would You Rather questions appearing randomly, you're sure to find plenty of questions to make you think long and hard about which you'd prefer. You can decide to generate one random question at a time or several and choose the one that you like best. No matter how you decide to use the generator, you're bound to have a lot of fun deciding which option you would choose with these Would You Rather questions.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How Do You Play Would You Rather?</h2>

                            <p>Even though playing Would You Rather is quite easy, it can produce a lot of laughter and give you situations where you have to critically think about which of the two choices is the best alternative. You play by having one person pose a question giving two alternatives and the other people in the group have to choose which one of the two alternatives they would prefer. There aren't points given in this game. It's more of a discussion with each player giving their reasoning why they prefer one option over the other. The key aspect to make a successful Would You Rather question is to pose two alternatives that are equally as good or bad so it's difficult for the person to pick one over the other.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">What Are the Rules to Would You Rather?</h2>

                            <p>The only rule to Would You Rather is that you have to give two alternatives in the question for the others to choose from. While this rule is quite broad, it can be quite difficult to actually create quality Would You Rather questions. While it's not part of the rules, you can tell if you have asked a good Would You Rather question by how long it takes for the other players to answer. If they are able to answer immediately, then the question wasn't as good as it could have been. If they have to ponder and go back and forth multiple times before finally deciding, then you have created a good question. A general rule of thumb is the longer it takes for the other players to decide, and the more discussion of which of the alternatives should be chosen, the better the question.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How Many People Can Play Would You Rather?</h2>

                            <p>In most cases, you need a minimum of two people to play Would You Rather (although with a Would You Rather generator you can play by yourself). Two people will allow for one person to ask the questions and the other to answer. In fact, playing Would You Rather can be an excellent way to get to know someone better as you'll get a unique look at how they think about a wide variety of situations. There's no limit to the number of people who can play, and it's often fun to play this game in a large group due to the wide variety of opinions that can arise. This can give everyone new and different perspectives on how to think about situations they may not have considered on their own or playing with one other person.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Random Would You Rather Generator</h2>

                            <p>While a Would You Rather game can certainly be played without a random generator, using one can often make the game a lot more interesting and fun. It can be difficult to come up with good Would You Rather questions and players can spend a lot of time trying to come up with ones they think are good to ask. This can slow the game down. Using a tool like this allows the game to move at a quicker pace which allows for more discussion within the group. It also takes the pressure off the person asking the question to try and come up with alternatives that are equal. In the end, having hundreds of random Would You Rather questions at your disposal can make the game a lot more fun and lively.</p>

                            <p>It's our goal to make this tool the best Would You Rather question generator on the Internet. With that in mind, if you have great questions for this game that always seems to make it difficult for people to choose one or the other and they create a lot of discussion, we'd love for you to share those questions with us so we can add them to our question database. Please contact us to let us know. We'd also be interested in any ideas or suggestions you may have to improve this generator for everyone.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What makes a good Would You Rather question?</h3>
                                        <p>The best Would You Rather questions present two options that are equally appealing or equally unappealing, making it genuinely difficult to choose. If players can answer immediately without thinking, the question isn't challenging enough. Great questions spark debate and discussion.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can kids play Would You Rather?</h3>
                                        <p>Absolutely! Would You Rather is a great game for kids and families. It helps children develop critical thinking skills and learn to articulate their preferences and reasoning. Just make sure the questions are age-appropriate for your group.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Is Would You Rather a good icebreaker?</h3>
                                        <p>Yes! Would You Rather is one of the best icebreaker games because it's easy to understand, doesn't require any equipment, and naturally leads to interesting conversations. It's perfect for getting to know new people in a fun, low-pressure way.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can you play Would You Rather online?</h3>
                                        <p>Would You Rather works great for virtual hangouts and video calls. Simply share your screen with the generator or read the questions aloud. It's become a popular activity for remote teams and virtual parties.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/would-you-rather-question" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
