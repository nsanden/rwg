import { useState } from 'react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface NeverHaveIEverGeneratorProps {
    basePath?: string;
}

export default function NeverHaveIEverGenerator({ basePath = '' }: NeverHaveIEverGeneratorProps) {
    const [category, setCategory] = useState('all');

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
        favoritesKey: 'neverHaveIEverFavorites',
        apiEndpoint: '/api/generate/never-have-i-ever',
        itemName: 'questions',
        transformResponse: (data: any) => {
            const questions = data.questions || [];
            return questions.map((item: any) => ({
                word: item.question
            }));
        }
    });

    const formState = useGeneratorForm({
        wordType: 'never-have-i-ever',
        onGenerate: (params) => generateQuestions({ ...params, category }),
        setShowFavorites,
        setQuantity
    });

    const customOptions = (
        <div className="mb-4">
            <label htmlFor="category" className="font-medium text-gray-700 mr-3">
                Category:
            </label>
            <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="inline-block pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
                <option value="all">All Categories</option>
                <option value="entertainment">Entertainment</option>
                <option value="funny">Funny</option>
                <option value="good_questions">Good Questions</option>
                <option value="for_kids">For Kids</option>
                <option value="embarrassing">Embarrassing</option>
                <option value="gross">Gross</option>
                <option value="food">Food</option>
                <option value="rule_breaking">Rule Breaking</option>
                <option value="drinking">Drinking</option>
                <option value="dirty">Dirty</option>
            </select>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <BaseGeneratorForm
                        title="Never Have I Ever Questions"
                        itemName="Questions"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        customOptions={customOptions}
                        onGenerate={formState.handleGenerate}
                        onReset={() => {
                            setCategory('all');
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
                                setCategory('all');
                                formState.resetAndGenerate();
                            }}
                        />
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        <ArticleContent>
                            <p>If you arrived here because you're interested in playing a game of Never Have I Ever, you've come to the right place. The Never Have I Ever Questions Generator has hundreds of questions for you to choose from including entertainment, funny, good, for kids, embarrassing, gross, food, rule-breaking, drinking, and dirty. You simply need to choose which of the categories of questions you want to use for your group and then click the button. Once done, a random Never Have I Ever question will appear and the game can begin.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How Do You Play Never Have I Ever?</h2>

                            <p>Playing Never Have I Ever is quite simple, but the results can bring out a lot of fun, laughter and sometimes even shock. In the classic game, one person will say an experience that they have never had. If anyone in the group has done the stated activity, they take a shot or take a drink (this can be modified for the group playing, but it originated as a drinking game). If nobody has done the stated action, then the person who made the Never Have I Ever statement must take the shot or drink (or agreed upon action). If only a single person out of the entire group has done the action, they're usually required to elaborate and give details about how the action came about. That's all there is to this game.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">What Are the Rules to Never Have I Ever?</h2>

                            <p>Above gives the basic ways on how to play Never Have I Ever, but the Never Have I Ever rules can be easily adjusted to what the entire group agrees upon. One common adjustment is instead of each person coming up with a Never Have I Ever question, the groups uses a Never Have I Ever generator. This often makes the game go more quickly and provides questions that are sure to bring fun and excitement to the game. While it's common for people in the group to drink when they have done the experience, this isn't the main point of the game. The main point is to learn more about the people in the group, so whatever action the person takes to indicate they have had the experience can be negotiated among the group.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How Many People Can Play Never Have I Ever?</h2>

                            <p>You need a minimum of two people to play Never Have I Ever, but it's more common to play the game in groups of four or more. That being said, if you want to get to know someone one on one much better, suggesting to play Never Have I Ever can be an excellent way to quickly learn a lot about the other person in a fun and interesting way. There is no limit to the number of people that can play although it can get a bit unwieldy with quite large groups and it may make sense to break a large group into several smaller groups.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Random Never Have I Ever Generator</h2>

                            <p>While the game Never Have I Ever can be played without a question generator, there are some distinct advantages of using one. The first is that it takes the pressure off of individuals to come up with a good statement which can greatly speed up the game and eliminate common questions that aren't of as much interest. In addition, you are able to choose specific types of questions that best fit the group that's playing. For example, if it's a group of kids playing, they can choose to play with only kid-friendly questions. This means you'll get the type of questions that you're most interested in learning about. Finally, there is no embarrassment in asking certain questions because the random generator produces all of the results. This means that everyone can concentrate on the fun of the results rather than coming up with the Never Have I Ever question.</p>

                            <p>We hope that you have found this tool useful for playing Never Have I Ever. We are always interested in improving our generators, so if you feel there is a category that you believe we should add to this game, please take a minute to let us know. We want this to be the best Never Have I Ever generator on the Internet and if you have suggestions on ways we can improve it, we'd be happy to consider them.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What if someone doesn't want to answer a question?</h3>
                                        <p>Players should always have the option to pass on questions they're uncomfortable with. You can set a rule that passing counts as putting down a finger, or simply move to the next question. Creating a judgment-free zone is essential for everyone to have fun.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How do you keep the game appropriate for mixed groups?</h3>
                                        <p>Stick to family-friendly categories like Entertainment, Funny, Good Questions, Food, and For Kids. Avoid categories like Drinking, Dirty, or Gross when playing with diverse age groups or people you don't know well.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can you play Never Have I Ever virtually?</h3>
                                        <p>Absolutely! Virtual Never Have I Ever works great over video calls. Players can hold up fingers to the camera or use a points system in the chat. It's become a popular activity for remote team building and virtual parties.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How long does a typical game last?</h3>
                                        <p>Games usually last 30 minutes to 2 hours depending on group size, how much storytelling occurs, and how many rounds you play. Plan for 3-5 questions per person minimum for a satisfying game experience.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/never-have-i-ever-question" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
