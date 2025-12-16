import { useState } from 'react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface TruthOrDareGeneratorProps {
    basePath?: string;
}

export default function TruthOrDareGenerator({ basePath = '' }: TruthOrDareGeneratorProps) {
    const [questionType, setQuestionType] = useState('any');

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
        favoritesKey: 'truthOrDareFavorites',
        apiEndpoint: '/api/generate/truth-or-dare',
        itemName: 'questions',
        transformResponse: (data: any) => {
            const questions = data.questions || [];
            return questions.map((item: any) => ({
                word: `${item.type.toUpperCase()}: ${item.question}`
            }));
        }
    });

    const formState = useGeneratorForm({
        wordType: 'truth-or-dare',
        onGenerate: (params) => generateQuestions({ ...params, questionType }),
        setShowFavorites,
        setQuantity
    });

    const customOptions = (
        <div className="mb-4">
            <label htmlFor="questionType" className="font-medium text-gray-700 mr-3">
                Type:
            </label>
            <select
                id="questionType"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="inline-block pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
                <option value="any">Any (Random Mix)</option>
                <option value="truth">Truth Only</option>
                <option value="dare">Dare Only</option>
                <option value="both">Both (One Truth + One Dare)</option>
            </select>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BaseGeneratorForm
                        title="Truth or Dare Questions"
                        itemName="Questions"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        customOptions={customOptions}
                        onGenerate={formState.handleGenerate}
                        onReset={() => {
                            setQuestionType('any');
                            formState.resetOptions();
                        }}
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
                            onReset={() => {
                                setQuestionType('any');
                                formState.resetAndGenerate();
                            }}
                        />
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        <ArticleContent>
                            <p>Playing Truth or Dare is a right of passage for anyone growing up. It's a game that's fun, exciting and a bit nerve-wracking at the same time. One of the most difficult parts of the game is coming up with good truth questions and good dare questions when playing. That's where the Truth or Dare Questions generator comes in. It contains over 1000 good Truth or Dare questions for 2025 so that the game will always be interesting without all the players having to spend time during the game trying to think of good questions to ask. The game of Truth or Dare is a timeless classic that can entertain for hours. Friendships can be forged in the silly and wild or dramatic and moving outcomes that come from the simple question "truth or dare?"</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How Do You Play Truth or Dare?</h2>

                            <p>Truth or Dare is a game played verbally with no equipment or cards necessary. A minimum of two people play the game wherein one person chooses to tell a truthful answer to a question set by another player or to perform a challenge usually of bizarre or difficult nature -- a dare. One gameplay option includes using a Truth or Dare generator that'll produce random questions for each player's turn. This ensures that all players have an equal chance of performing an embarrassing task or answering a difficult question. Another optional rule can be to allow players to skip a certain number of truths or dares after verbalization. This rule is valuable if the game is more casual so that a player doesn't have to do anything too far past their comfort zone. A more serious alternative is to only be allowed the choice between the given dare or truth. For example, if the player chooses dare and decides they don't want to do that dare then they must answer a truth provided by the same person even if they don't want to do that either.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Dare Questions</h2>

                            <p>Playing Truth or Dare can be a great way to have a good time at a gathering. It can be fun to do silly things you might never have the courage to do without a little push from someone else. It can also be a blast to watch your friends do some crazy things or to come up with the wild dares you want to see your friends do. A good dare should be something that gets the person a bit out of their comfort zone but not so bad that the person refuses to do it. It can be a tricky balance coming up with these ideas on your own on the fly and that's where a Truth or Dare questions generator can provide good dares for Truth or Dare games. When coming up with dares on your own, remember to always keep dares safe and never do anything that could hurt someone or upset someone's feelings.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Truth Questions</h2>

                            <p>The truth portion of this game at parties can be a fun time too. Maybe it's time to see which teacher your classmates like the most or who believes in the wildest conspiracy theory. Asking who someone likes can be fun at a party but if you want to keep the topic away from romance, there are many other truth questions that can be asked. For example, you can ask instead which movie star they think is the most attractive. Again, coming up with good truth questions for Truth or Dare can be difficult during the game and that's where using a Truth or Dare generator can be quite helpful. It's also important to not forget that certain truths can be hurtful so be careful not to ask people something that could be derisive towards someone you know.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Truth or Dare Game</h2>

                            <p>At the end of the day, Truth or Dare is a fun game that can be played in a lot of settings with a lot of different groups. It can be a fun way to learn more about your friends or a new companion. This game can also be a great way to be goofy without feeling too self-conscious. Just remember to always play nicely and never intentionally try to offend anyone.</p>

                            <p>If you found this tool useful for your game of Truth or Dare, we'd love to hear about it. We'd also be interested to hear from you if you have truth questions or dare questions that you believe are particularly good that we can add to this generator. We're always looking for great new questions to add to our database that everyone would find fun and entertaining, so please contact us if you have ones you particularly like when playing the game.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What are good dares?</h3>
                                        <p>The best dares are dares that take a person outside their comfort zone, but not too far that they refuse to do it. The better you know a person, the easier it is to come up with dares that meet these criteria. Another way to find good dares is to take some time browsing through a Truth or Dare generator to find dares that you like to use for the next game you play.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What is T or D game?</h3>
                                        <p>T or D is an abbreviation for Truth or Dare. This is a game where a player must either answer a question truthfully (truth) or perform some type of activity designated by the other players (dare).</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can one person play Truth or Dare?</h3>
                                        <p>Technically, no. You need two or more people to play a proper game of Truth or Dare. That being said, you can use a Truth or Dare generator by yourself to practice for a game and decide what truths and what dares you'd be willing to accept in a real game. It's also a good way to prepare both truth and dare questions for others so you don't have to spend a lot of time trying to come up with good questions during the game.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Are these Truth or Dare questions updated?</h3>
                                        <p>Yes! We are constantly updating the questions for this tool as we come up with good truths and dares and have added to the list several times already in 2025. We also periodically go through the list to make sure the questions are still relevant.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/truth-or-dare-question" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
