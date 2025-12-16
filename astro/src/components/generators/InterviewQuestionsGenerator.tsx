import { useState, useEffect } from 'react';
import { Heart, Copy, RefreshCw, Share2 } from 'lucide-react';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import GeneratorButtons from '../Forms/GeneratorButtons';
import SocialShareBlock from '../Shared/SocialShareBlock';

interface InterviewQuestionsGeneratorProps {
    basePath?: string;
}

export default function InterviewQuestionsGenerator({ basePath = '' }: InterviewQuestionsGeneratorProps) {
    const [questions, setQuestions] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);
    const [favorites, setFavorites] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('interviewQuestionsFavorites');
            try {
                return saved ? JSON.parse(saved) : [];
            } catch {
                return [];
            }
        }
        return [];
    });
    const [showShareModal, setShowShareModal] = useState(false);

    const generateQuestions = async () => {
        setLoading(true);
        setShowFavorites(false);
        try {
            const response = await fetch(`/api/generate/interview-questions?quantity=${quantity}`);
            const data = await response.json();

            if (data.questions) {
                setQuestions(data.questions);
            }
        } catch (error) {
            console.error('Error generating interview questions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateQuestions();
    }, []);

    const addToFavorites = (question: string) => {
        if (!favorites.includes(question)) {
            const updated = [...favorites, question];
            setFavorites(updated);
            localStorage.setItem('interviewQuestionsFavorites', JSON.stringify(updated));
        }
    };

    const removeFromFavorites = (question: string) => {
        const updated = favorites.filter(q => q !== question);
        setFavorites(updated);
        localStorage.setItem('interviewQuestionsFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavorites([]);
        localStorage.setItem('interviewQuestionsFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const copyToClipboard = () => {
        const items = showFavorites ? favorites : questions;
        const text = items.join('\n');
        navigator.clipboard.writeText(text);
    };

    const resetForm = () => {
        setQuantity(1);
        generateQuestions();
    };

    const QuestionCard = ({ question }: { question: string }) => {
        const isFavorite = favorites.includes(question);

        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                    <p style={{ fontSize: '1.25rem', fontWeight: '500', color: '#1f2937', flex: 1, textAlign: 'center', lineHeight: '1.6' }}>
                        {question}
                    </p>
                    <button
                        onClick={() => isFavorite ? removeFromFavorites(question) : addToFavorites(question)}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
                    >
                        <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6" style={{ minWidth: '385px' }}>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Job Interview Questions</h1>

                        <div className="mb-4">
                            <label htmlFor="quantity" className="font-medium text-gray-700 mr-3">
                                Number of Questions:
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                max="20"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <GeneratorButtons
                            onGenerate={generateQuestions}
                            onReset={resetForm}
                            loading={loading}
                            generateLabel="Generate Questions"
                        />

                        <div className="mt-4 flex justify-center sm:hidden">
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>

                        <SocialShareBlock
                            url={typeof window !== 'undefined' ? window.location.href : ''}
                            title="Random Interview Questions Generator - Practice Job Interviews"
                            isExpanded={showShareModal}
                            setIsExpanded={setShowShareModal}
                        />
                    </div>

                    {/* Results Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                            {favorites.length > 0 && (
                                <button
                                    onClick={() => setShowFavorites(!showFavorites)}
                                    className={`group flex items-center gap-1 text-sm px-3 py-2 rounded cursor-pointer ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                                >
                                    {showFavorites ? (
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                    ) : (
                                        <>
                                            <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                                            ({favorites.length})
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={copyToClipboard}
                                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded cursor-pointer"
                            >
                                <Copy className="w-5 h-5 transition-colors" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-8">
                                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                                <p className="mt-2 text-gray-600">Generating interview questions...</p>
                            </div>
                        ) : (
                            <>
                                {(showFavorites ? favorites : questions).length > 0 ? (
                                    <div className={`grid gap-4 ${
                                        (showFavorites ? favorites : questions).length === 1
                                            ? 'grid-cols-1 max-w-lg mx-auto'
                                            : 'grid-cols-1'
                                    }`}>
                                        {(showFavorites ? favorites : questions).map((question, index) => (
                                            <QuestionCard key={`${question}-${index}`} question={question} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {showFavorites ? 'No favorite questions yet.' : 'Click "Generate Questions" to get interview questions.'}
                                    </div>
                                )}

                                {favorites.length > 0 && showFavorites && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={clearAllFavorites}
                                            className="text-sm px-3 py-1 rounded text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                                        >
                                            Clear All Favorites
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        <ArticleContent>
                            <p>One of the most important aspects of getting the job you want is doing well during your job interview. While there are a wide variety of factors that play into how a job interview ultimately goes, one key aspect is how well you manage to answer interview questions given to you by those at the company. The truth is it's impossible to know exactly what questions you will be asked during your job interview, but that doesn't mean you should leave this part of the job interview to chance. In fact, the best course of action you can take is to practice your responses to job interview questions as this will provide the opportunity to improve your answers and increase the likelihood of landing the job.</p>

                            <p>A key problem with trying to practice interview questions is that you are answering a question you already know is coming which won't be the case in your real interview. That's where the Random Job Interview Questions generator can be of great help. It has the 1000 most common interview questions along with some non-typical interview questions to keep you on your toes. By using the generator, you will have no idea what job interview question will come next allowing you to practice your responses in a way that is more similar to a real job interview than if you were picking out the questions yourself.</p>

                            <p>Using a Random Job Interview Questions generator to practice how you answer comes with numerous benefits that will help you present the best version of yourself during the interview. A key element among these is building your confidence. Nothing gives a better impression during a job interview than confidence when answering questions. While you likely won't be familiar with 100% of the questions you'll be asked after using this generator, you will be familiar with the vast majority of them and with this knowledge will come confidence that the interviewers will be able to see. The more you use this tool to practice, the more confident you'll be during the actual interview.</p>

                            <p>Another important benefit to practicing with a random interview questions generator is the ability to refine your responses with practice. When you answer interview questions for the first time, you will likely have portions of your response that you like and think are strong while you perceive other portions as not quite as good as you hoped. This time practicing interview questions will allow for the opportunity to keep the strong aspects of your response while refining the weaker areas to make them stronger. This all means that when you ultimately answer interview questions, you will have already refined your answers to be more coherent allowing you to present your best and strongest answers to each question.</p>

                            <p>By having to answer interview questions that are random and unknown to you, the process will also help you identify weaknesses you have when answering interview questions. This is vitally important as it will allow you to find ways to address those weaknesses and turn them into strengths before the actual interview. By understanding these weaknesses before going into the interview, you have the opportunity to address them so that they don't come across as a red flag in the interview.</p>

                            <p>Just as practicing interview questions with this tool will uncover some weaknesses you may have, it will also help you discover and reaffirm your strengths. Again, knowing these will allow you to highlight them more prominently in your answers to the interviewer allowing you to give an overall better impression than if you hadn't practiced. It will also help you better articulate to the interviewer how hiring you to the company will be a benefit to them due to the strengths you bring to the table.</p>

                            <p>Ultimately, practicing with this generator will also help improve your overall communication skills. The more you practice, the better your responses will become as you're able to clearly state your answer in a more concise manner. As mentioned above, the ability to refine your responses will allow you to get your points across in a more effective manner than if you didn't practice at all. Using a tool providing random interview questions will only further improve your interview responses to be the best that they can be so that you're able to confidently answer all the interviewer's questions.</p>

                            <p>To further enhance your interview preparation, consider using the <strong><a href="https://sheetsresume.com/mock-interview" className="text-blue-600 hover:text-blue-800">AI Mock Interviewer</a></strong> from Colin and Nate's famous <a href="https://sheetsresume.com" className="text-blue-600 hover:text-blue-800">SheetsResume.com</a>. This tool provides a diverse set of randomized interview questions and offers personalized feedback, allowing you to practice in a realistic and dynamic environment. By simulating actual interview scenarios, the AI Mock Interviewer can help you refine your responses and build the confidence needed to perform your best during the real interview.</p>

                            <p>And of course, don't forget your resume! A standout, well-crafted resume can make all the difference in catching the attention of employers. The <a href="https://sheetsresume.com" className="text-blue-600 hover:text-blue-800">AI Resume Builder</a> at SheetsResume.com is there to transform your outdated resume into a polished, professional masterpiece that sets you apart from the competition.</p>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/interview-question" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
