import React, { useState } from 'react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import SEO from '@/Components/SEO';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function TruthOrDare() {
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
        itemName: 'truth or dare questions',
        transformResponse: (data: any) => {
            const questions = data.questions || [];
            // Transform to match ItemsDisplay expected format
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
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Type:
            </label>
            <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="any">Any (Random Mix)</option>
                <option value="truth">Truth Only</option>
                <option value="dare">Dare Only</option>
                <option value="both">Both (One Truth + One Dare)</option>
            </select>
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Truth or Dare Questions Generator"
            itemName="Questions"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            showLetterFilters={false}
            showSizeFilter={false}
            customOptions={customOptions}
            {...formState}
        />
    );

    const resultsPanel = (
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
            itemName="truth or dare questions"
            textSize="medium"
        />
    );

    const articleContent = (
        <>
            <p>
                Looking for engaging Truth or Dare questions for your next party or gathering? Our Truth or Dare generator provides hundreds of entertaining questions to keep the fun going. Whether you're looking for revealing truth questions or exciting dare challenges, we've got you covered with a mix that will create unforgettable memories.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How to Play Truth or Dare</h2>

            <p>
                Truth or Dare is a classic party game that's perfect for breaking the ice and getting to know people better. Here's how to play:
            </p>

            <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>Players sit in a circle or arrange themselves in a group</li>
                <li>One player starts by asking another player "Truth or Dare?"</li>
                <li>The chosen player selects either "Truth" or "Dare"</li>
                <li>If they choose "Truth," they must answer a question honestly</li>
                <li>If they choose "Dare," they must complete a challenge or task</li>
                <li>After completing their turn, that player asks the next person</li>
                <li>Continue until everyone has had multiple turns</li>
            </ol>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Game Rules and Guidelines</h2>

            <p>
                To ensure everyone has fun and feels safe, follow these important guidelines:
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Safety First:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Never force someone to do something they're uncomfortable with</li>
                <li>Allow players to pass or choose an alternative if needed</li>
                <li>Keep dares safe and avoid anything dangerous or harmful</li>
                <li>Respect boundaries and avoid overly personal questions</li>
                <li>Stop if someone becomes upset or uncomfortable</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Fair Play:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Everyone should get an equal number of turns</li>
                <li>Players must complete their truth or dare honestly</li>
                <li>No backing out once you've made your choice</li>
                <li>Keep questions and dares appropriate for the group</li>
                <li>Have consequences ready for players who refuse (like doing an extra dare)</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Types of Questions</h2>

            <p>
                Our generator includes a variety of question types to keep the game interesting:
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Truth Questions:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Personal experiences and embarrassing moments</li>
                <li>Secret confessions and hidden truths</li>
                <li>Relationship questions and crushes</li>
                <li>Funny childhood memories</li>
                <li>Personal habits and quirks</li>
                <li>Dreams, fears, and aspirations</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Dare Challenges:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Silly physical challenges and stunts</li>
                <li>Social media posts and photo challenges</li>
                <li>Food and taste tests</li>
                <li>Acting and performance dares</li>
                <li>Appearance changes and makeovers</li>
                <li>Phone calls and text message challenges</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Tips for a Great Game</h2>

            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Start with lighter questions and build up intensity</li>
                <li>Know your audience - adjust content for the group</li>
                <li>Have props ready for potential dares (food, costumes, etc.)</li>
                <li>Set time limits for dares to keep the game moving</li>
                <li>Create a safe, judgment-free environment</li>
                <li>Mix truth and dare questions to keep variety</li>
                <li>Have backup questions ready if needed</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Frequently Asked Questions</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">What if someone refuses to answer or do a dare?</h3>
                    <p>Players should be allowed to pass if they're truly uncomfortable, but you can also set up consequences like doing an alternative dare, answering two truth questions instead, or performing a silly punishment chosen by the group.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How do you make Truth or Dare appropriate for kids?</h3>
                    <p>Focus on age-appropriate questions about school, hobbies, funny moments, and silly dares like singing songs, doing dance moves, or making funny faces. Avoid personal or mature topics.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Can you play Truth or Dare virtually?</h3>
                    <p>Absolutely! Virtual Truth or Dare works great over video calls. Adapt dares to be camera-friendly and focus more on truth questions, social media challenges, or things players can do in their own space.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How long should a Truth or Dare game last?</h3>
                    <p>Games typically last 30 minutes to 2 hours depending on group size and engagement. Plan for each player to have at least 3-5 turns to keep everyone involved.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">What's the difference between Truth or Dare and other party games?</h3>
                    <p>Truth or Dare combines personal revelation with physical challenges, making it unique. Unlike trivia games, it's about personal sharing, and unlike physical games, it includes deep conversation elements.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How do you keep the game fair and fun for everyone?</h3>
                    <p>Rotate who asks questions, ensure everyone gets equal turns, set clear boundaries beforehand, and maintain a supportive atmosphere where people feel safe to participate.</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Truth or Dare Questions Generator - Random Truth or Dare | RandomWordGenerator.com"
                description="Generate random truth or dare questions instantly! Perfect for parties, sleepovers, and social gatherings. Choose from truth questions, dare challenges, or both."
                keywords={['truth or dare', 'truth or dare questions', 'party games', 'ice breaker games', 'social games', 'dare challenges']}
                ogImage="/img/truth-or-dare.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Truth or Dare Questions Generator"
                currentPage="/truth-or-dare-question.php"
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