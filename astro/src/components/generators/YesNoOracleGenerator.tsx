import { useState, useEffect } from 'react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface YesNoOracleGeneratorProps {
    basePath?: string;
}

export default function YesNoOracleGenerator({ basePath = '' }: YesNoOracleGeneratorProps) {
    const [question, setQuestion] = useState('');
    const [includeMaybe, setIncludeMaybe] = useState(false);
    const [answer, setAnswer] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

    const placeholders = [
        'Will I be a millionaire?',
        'Does he love me?',
        'Should I marry him?',
        'Should I take this job?',
        'Is it time for a change?',
        'Will it rain tomorrow?'
    ];

    // Rotate placeholders every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPlaceholder(prev => (prev + 1) % placeholders.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Auto-generate answer on page load
    useEffect(() => {
        generateAnswer();
    }, []);

    const generateAnswer = () => {
        setLoading(true);

        // Simulate loading time for effect
        setTimeout(() => {
            const options = includeMaybe ? ['Yes', 'No', 'Maybe'] : ['Yes', 'No'];
            const randomIndex = Math.floor(Math.random() * options.length);
            setAnswer(options[randomIndex]);
            setLoading(false);
        }, 500);
    };

    const handleMaybeChange = (checked: boolean) => {
        setIncludeMaybe(checked);
        // If currently showing "Maybe" and unchecking, generate new answer
        if (!checked && answer === 'Maybe') {
            generateAnswer();
        }
    };

    const resetOptions = () => {
        setQuestion('');
        setIncludeMaybe(false);
    };

    const getAnswerColor = (answer: string) => {
        switch (answer) {
            case 'Yes':
                return 'text-green-600';
            case 'No':
                return 'text-red-600';
            case 'Maybe':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    const getAnswerBgColor = (answer: string) => {
        switch (answer) {
            case 'Yes':
                return 'bg-green-50 border-green-200';
            case 'No':
                return 'bg-red-50 border-red-200';
            case 'Maybe':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'yes-no',
        onGenerate: generateAnswer,
        setShowFavorites: () => {},
        setQuantity: () => {}
    });

    // Custom options for the form
    const customOptions = (
        <>
            <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    What is your question? (or leave it blank)
                </label>
                <input
                    type="text"
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={placeholders[currentPlaceholder]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={includeMaybe}
                        onChange={(e) => handleMaybeChange(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Include "Maybe" as a possible answer</span>
                </label>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <BaseGeneratorForm
                        title="Yes or No Oracle"
                        itemName="Answer"
                        quantity={1}
                        setQuantity={() => {}}
                        loading={loading}
                        showQuantity={false}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        showNoDuplicates={false}
                        customOptions={customOptions}
                        onGenerate={generateAnswer}
                        onReset={resetOptions}
                        {...formState}
                    />

                    {/* Right Column - Results */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Your Answer</h3>
                            <button
                                onClick={generateAnswer}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                {loading ? 'Generating...' : 'Ask Again'}
                            </button>
                        </div>

                        <div className="min-h-[200px] flex items-center justify-center">
                            {loading ? (
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Consulting the oracle...</p>
                                </div>
                            ) : answer ? (
                                <div className="text-center w-full">
                                    <div className={`p-8 rounded-lg border-2 ${getAnswerBgColor(answer)} transform transition-all duration-500`}>
                                        <div className={`text-6xl font-bold ${getAnswerColor(answer)}`}>
                                            {answer}
                                        </div>
                                        {question && (
                                            <div className="mt-4 p-3 bg-white rounded-md border">
                                                <p className="text-sm text-gray-600 mb-1">Your question:</p>
                                                <p className="text-gray-800 italic">"{question}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center">
                                    Click "Generate Random Answer" to consult the oracle
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        {/* Left Column - Article Content */}
                        <ArticleContent>
                            <p>Welcome to the Random Yes / No Oracle. If you have a question and you're looking for an answer to it, you've come to the correct place. Our random decision-maker will give a random "yes" or a random "no" to every question you have. Using this free online tool is easy. All you do is type in your question, hit the button and you'll instantly get a "yes" or "no" answer to the question that's been on your mind.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Yes or No or Maybe</h2>

                            <p>What if you need to add a "maybe" into the mix when asking your question? That's no problem at all. If you check the box next to the yes or no button, you'll automatically add a "maybe" into the equation for the answer to your question. This can be important because sometimes a question can't be answered with a simple no or yes.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Get an Answer to Your Questions</h2>

                            <p>Sometimes it can be fun to see what a random answer would be to the questions you have. That's exactly what this free online yes or no oracle does. There's no reason to go out and pay an oracle or a fortune teller to find out the answer to your burning questions. The best part is since the answers are random, if you don't like the answer that's given, you can simply ask it again and again until you get the answer you want. Eventually, you will if you have the patience and try enough times.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Easy Decision Maker</h2>

                            <p>Do you have something simple to solve and you just don't feel like making the decision yourself? Use this tool to make the decision for you. For example, if you can't decide whether to cook chicken or hamburgers for dinner, you can ask "Should I cook chicken tonight?" and the Yes or No Oracle will make the decision for you. Or maybe you can't decide between two tops to wear to school. Ask and you'll have the decision made for you. Sometimes it's just easier for a random tool with nothing invested in the answer to the question to make the decision.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Easier than Flipping a Coin</h2>

                            <p>Sure, you could <a href={`${basePath}/coin-flip.php`} className="text-blue-600 hover:text-blue-800">flip a coin</a> to get the answer to your question, but that's a lot more complicated. It requires you finding a coin, flipping it, and then figuring out if it landed heads or tails. A coin flip takes so much more effort and you can accomplish the same randomness with this Yes or No Oracle and a click of your mouse.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Get inspired</h2>

                            <p>You may have arrived at this site with a question in mind to ask, but why stop there. You can head over to the random question generator and click through all kinds of questions to get inspiration to come back here and ask the oracle. This can be even more fun entertainment than asking the original question that brought you here. Maybe these questions will inspire you to ask a similar question yourself.</p>

                            <p className="mt-6 text-sm text-gray-600 italic">Important Disclaimer: We hope that everyone using this tool realizes that it's a fun tool for entertainment purposes only that should not in any way, shape or form influence your decision making or be construed as the correct response to the question you asked. Since this is a random decision generator, the answers are random and have nothing to do with the questions being asked. This is not a true oracle or fortune teller. If you're in need of a serious answer to your question, please seek out the appropriate help from a qualified professional.</p>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/yes-no" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
