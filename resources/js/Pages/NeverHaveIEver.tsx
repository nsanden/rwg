import React, { useState } from 'react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import SEO from '@/Components/SEO';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function NeverHaveIEver() {
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
        itemName: 'never have I ever questions',
        transformResponse: (data: any) => {
            const questions = data.questions || [];
            // Transform to match ItemsDisplay expected format
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
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Category:
            </label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

    const formPanel = (
        <BaseGeneratorForm
            title="Never Have I Ever Questions Generator"
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
            itemName="never have I ever questions"
            textSize="medium"
        />
    );

    const articleContent = (
        <>
            <p>
                Never Have I Ever is a classic party game that's perfect for getting to know friends better and sharing hilarious stories. Our generator provides hundreds of questions across multiple categories to keep your game entertaining and engaging for hours.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How to Play Never Have I Ever</h2>

            <p>
                Never Have I Ever is simple to play and requires no equipment other than creative questions. Here's how to play:
            </p>

            <ol className="list-decimal list-inside space-y-2 mb-4">
                <li>All players sit in a circle or arrange themselves comfortably</li>
                <li>Each player starts with 10 fingers raised (or 10 points/lives)</li>
                <li>Players take turns reading "Never have I ever..." statements</li>
                <li>Anyone who HAS done the activity mentioned must put down a finger</li>
                <li>Continue until someone has put down all their fingers</li>
                <li>The last person with fingers remaining wins!</li>
            </ol>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Question Categories</h2>

            <p>
                Our generator includes 10 different categories to match your group and occasion:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Family-Friendly Categories:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>For Kids:</strong> School and childhood experiences</li>
                        <li><strong>Entertainment:</strong> Movies, music, and pop culture</li>
                        <li><strong>Funny:</strong> Silly situations and mishaps</li>
                        <li><strong>Good Questions:</strong> Travel and life experiences</li>
                        <li><strong>Food:</strong> Culinary adventures and eating habits</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Adult Categories:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Embarrassing:</strong> Awkward and cringe-worthy moments</li>
                        <li><strong>Gross:</strong> Bodily functions and hygiene</li>
                        <li><strong>Rule Breaking:</strong> Legal and illegal activities</li>
                        <li><strong>Drinking:</strong> Alcohol-related experiences</li>
                        <li><strong>Dirty:</strong> Adult and intimate topics</li>
                    </ul>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Game Variations</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Classic Version:</h3>
            <p>Use 10 fingers and put one down for each "yes" answer. Last person standing wins.</p>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Storytelling Version:</h3>
            <p>When someone puts down a finger, they must tell the story behind their experience.</p>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Points Version:</h3>
            <p>Give points for rare experiences (if only 1-2 people have done it) and fewer points for common ones.</p>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Drinking Game Version:</h3>
            <p>Adults can take a drink instead of putting down fingers (play responsibly).</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Tips for a Great Game</h2>

            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Start with lighter categories and progress to more personal ones</li>
                <li>Encourage storytelling when people share experiences</li>
                <li>Choose appropriate categories for your group's comfort level</li>
                <li>Set ground rules about what topics are off-limits</li>
                <li>Create a judgment-free zone where people feel safe sharing</li>
                <li>Mix categories to keep the game interesting</li>
                <li>Have backup questions ready if some fall flat</li>
                <li>Consider the group size - smaller groups allow for more personal sharing</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Game Etiquette</h2>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Do:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Be honest about your experiences</li>
                <li>Respect others' boundaries and comfort levels</li>
                <li>Share stories if you're comfortable doing so</li>
                <li>Keep the atmosphere light and fun</li>
                <li>Support friends who share vulnerable experiences</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">Don't:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Judge others for their experiences (or lack thereof)</li>
                <li>Pressure anyone to share details they don't want to</li>
                <li>Use information shared against someone later</li>
                <li>Make fun of someone's answers</li>
                <li>Force participation in uncomfortable categories</li>
            </ul>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Frequently Asked Questions</h2>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">What if someone doesn't want to answer a question?</h3>
                    <p>Players should always have the option to pass on questions they're uncomfortable with. You can set a rule that passing counts as putting down a finger, or simply move to the next question.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How do you keep the game appropriate for mixed groups?</h3>
                    <p>Stick to family-friendly categories like Entertainment, Funny, Good Questions, and For Kids. Avoid categories like Drinking, Dirty, or Gross when playing with diverse age groups.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Can you play Never Have I Ever virtually?</h3>
                    <p>Absolutely! Virtual Never Have I Ever works great over video calls. Players can hold up fingers to the camera or use a points system in the chat.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How long does a typical game last?</h3>
                    <p>Games usually last 30 minutes to 2 hours depending on group size, how much storytelling occurs, and how many rounds you play. Plan for 3-5 questions per person minimum.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">What makes a good Never Have I Ever question?</h3>
                    <p>Good questions are relatable enough that some people will have done them, but not so common that everyone has. They should spark interesting conversations and be appropriate for your group.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">How do you make the game more competitive?</h3>
                    <p>You can award points for rare experiences, create teams, or have elimination rounds. Some groups play multiple rounds with different categories and keep running scores.</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Never Have I Ever Questions Generator - Random Questions | RandomWordGenerator.com"
                description="Generate random Never Have I Ever questions instantly! Choose from 10 categories including funny, embarrassing, and family-friendly options. Perfect for parties and icebreakers."
                keywords={['never have I ever', 'party games', 'icebreaker questions', 'social games', 'drinking games', 'never have I ever questions']}
                ogImage="/img/never-have-i-ever.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Never Have I Ever Questions Generator"
                currentPage="/never-have-i-ever-question.php"
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