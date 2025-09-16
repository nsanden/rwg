import SEO from '@/Components/SEO';
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';

interface Answer {
    id: number;
    value: string;
}

export default function Decision() {
    const [question, setQuestion] = useState('What do I want to accomplish today?');
    const [answers, setAnswers] = useState<Answer[]>([
        { id: 1, value: 'Work out' },
        { id: 2, value: 'Apply for 2 jobs' },
        { id: 3, value: 'Plant a garden' },
        { id: 4, value: 'Write a letter to an old friend' },
        { id: 5, value: '' },
        { id: 6, value: '' },
        { id: 7, value: '' },
        { id: 8, value: '' },
        { id: 9, value: '' },
        { id: 10, value: '' }
    ]);
    const [showMoreAnswers, setShowMoreAnswers] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Auto-generate decision on page load
    useEffect(() => {
        generateDecision();
    }, []);

    const updateAnswer = (id: number, value: string) => {
        setAnswers(prev => prev.map(answer =>
            answer.id === id ? { ...answer, value } : answer
        ));
    };

    const generateDecision = () => {
        const validAnswers = answers.filter(answer => answer.value.trim() !== '');

        if (validAnswers.length === 0) {
            alert('Please enter at least one answer option.');
            return;
        }

        setLoading(true);

        // Simulate loading time for effect
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * validAnswers.length);
            setSelectedAnswer(validAnswers[randomIndex].value);
            setLoading(false);
        }, 500);
    };

    const formPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Decision Maker</h1>

            <div className="mb-6">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    What is your question?
                </label>
                <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your answers?
                </label>

                {/* First 4 answers always visible */}
                {answers.slice(0, 4).map((answer) => (
                    <input
                        key={answer.id}
                        type="text"
                        value={answer.value}
                        onChange={(e) => updateAnswer(answer.id, e.target.value)}
                        className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={answer.id === 1 ? '' : 'Optional'}
                    />
                ))}

                {!showMoreAnswers && (
                    <button
                        type="button"
                        onClick={() => setShowMoreAnswers(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        + More Answers
                    </button>
                )}

                {/* Additional answers */}
                {showMoreAnswers && (
                    <div className="mt-2">
                        {answers.slice(4).map((answer) => (
                            <input
                                key={answer.id}
                                type="text"
                                value={answer.value}
                                onChange={(e) => updateAnswer(answer.id, e.target.value)}
                                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Optional"
                            />
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={generateDecision}
                disabled={loading}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? 'Deciding...' : 'Generate Random Decision'}
            </button>
        </div>
    );

    const resultsPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Your Decision</h3>
                <button
                    onClick={generateDecision}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Deciding...' : 'Decide Again'}
                </button>
            </div>

            <div className="min-h-[200px] flex items-center justify-center">
                {loading ? (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Making your decision...</p>
                    </div>
                ) : selectedAnswer ? (
                    <div className="text-center">
                        <div className="animate-pulse bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                            <h4 className="text-lg font-medium text-gray-700 mb-2">The decision is:</h4>
                            <p className="text-2xl font-bold text-blue-700 animate-bounce">
                                {selectedAnswer}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">
                        Click "Generate Random Decision" to get your answer
                    </p>
                )}
            </div>
        </div>
    );

    const articleContent = (
        <>
            <p>There are going to be many times in your life when you're going to need to make a decision when you may not really have a preference. Wouldn't it be great to have a decision maker in these instances? That's exactly the reason we created this decision making tool. Using this tool is quite simple. All you need to do is fill in the choices for the decision you need to make and then hit the button. The decision maker will randomly choose one of the choices you provided to give you an answer.</p>

            <p>While you can certainly use this tool when you need to choose between two alternatives, this tool works best when you have three or more choices to choose from. When you only have to choose between two alternatives, it may be easier to <Link href="/coin-flip.php" className="text-blue-600 hover:text-blue-800">flip a coin</Link> or decided by choosing <Link href="/yes-no.php" className="text-blue-600 hover:text-blue-800">yes or no</Link>. The issue is that when you have more than two alternatives, it can often be difficult to find a generator that can help you decide between all the different alternatives. That's exactly what this decision maker does. Here are some of the more common ways that this tool can be used.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Making Everyday Decisions</h2>

            <p>There are a lot of common decisions that need to be made on a daily basis. If you're having trouble deciding on which one to do first, this generator can be of great help. For example, if you have six different chores that need to get done during the day but you can't decide which one to tackle first, you can put them all into the decision maker generator and you'll instantly know which one to begin first. The same goes when <Link href="/dinner-ideas.php" className="text-blue-600 hover:text-blue-800">deciding what to have for dinner</Link>. Instead of having to make a choice on your own, you can input all of the options and let the random decision maker do the deciding.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Settling Different Opinions</h2>

            <p>You want to do one thing, your spouse wants to do another and each of the kids wants to do something else as well. Or maybe you and a group of friends are at an amusement park and everyone has a different opinion on which ride you should go on first. If there is a group of people, there's likely a number of differing opinions. One of the best ways to solve this dilemma is the shortest amount of time (and without any arguing) is to leave the decision making to this tool. Input all of the options and you'll have a choice randomly handed to the group so nobody can complain.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Decidophobia</h2>

            <p>There's actually a fear of making decisions called decidophobia. If you happen to be a person who has this fear, trying to make simple daily decisions can be nearly impossible. This generator can help ease the stress and fear that comes with this disorder by taking the decision making out of your hands and giving it over to a random decision maker. This can make it so you don't spend all your time worrying about the decisions and can get those things that need to be done finished.</p>

            <p>The above are just a few ways that this decision making tool can be used to your benefit. If you have found the tool useful and used it in another way not mentioned, please take a moment to contact us and let us know how it has been useful. Understanding the different ways people use this generator enables us to make adjustments to it and improve it for everyone. In the same way, if you have an idea or suggestion on how we can make this generator better, we'd love for you to share that with us.</p>

            <p><b>Important Disclaimer:</b> This Decision Maker is a fun tool that should be used for entertainment purposes only. It should not be used to make important life decisions. This generator provides random results to the options that you input and should not be viewed as having any knowledge of what the "best" or "right" answer may be. If you're looking for an answer to an important question, please take the time to contact a qualified professional to help you work out the answer to the decision you need to make.</p>
        </>
    );

    return (
        <>
            <SEO
                title="Decision Maker — Random Choice Generator"
                description="The Decision Maker helps you make random decisions from multiple options. Enter your choices and let chance decide for you."
                keywords={['decision maker', 'random choice', 'decision generator', 'random decision', 'choice maker', 'decide for me']}
                ogImage="https://randomwordgenerator.com/img/decision-maker.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Decision Maker - Random Choice Generator"
                currentPage="/decision.php"
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
