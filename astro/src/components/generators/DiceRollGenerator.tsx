import { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import GeneratorButtons from '../Forms/GeneratorButtons';
import SocialShareBlock from '../Shared/SocialShareBlock';

interface Die {
    id: number;
    value: number;
    rolling: boolean;
}

interface DiceRollGeneratorProps {
    basePath?: string;
}

export default function DiceRollGenerator({ basePath = '' }: DiceRollGeneratorProps) {
    const [dice, setDice] = useState<Die[]>([]);
    const [quantity, setQuantity] = useState(2);
    const [loading, setLoading] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const generateDiceRoll = () => {
        setLoading(true);

        // Create new dice with rolling animation
        const newDice = Array.from({ length: quantity }, (_, index) => ({
            id: index,
            value: 1,
            rolling: true
        }));

        setDice(newDice);

        // Simulate rolling animation, then set final values
        setTimeout(() => {
            const finalDice = newDice.map(die => ({
                ...die,
                value: Math.floor(Math.random() * 6) + 1,
                rolling: false
            }));
            setDice(finalDice);
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        generateDiceRoll();
    }, []);

    const resetForm = () => {
        setQuantity(2);
    };

    const DiceComponent = ({ die, size }: { die: Die; size: number }) => {
        const dotSize = Math.round(size * 0.2);
        const padding = Math.round(size * 0.125);

        // Render dots based on die value using a grid pattern
        const renderDots = (value: number) => {
            const dotStyle: React.CSSProperties = {
                width: `${dotSize}px`,
                height: `${dotSize}px`,
                backgroundColor: '#1f2937',
                borderRadius: '50%',
            };

            const emptyStyle: React.CSSProperties = {
                width: `${dotSize}px`,
                height: `${dotSize}px`,
            };

            // 3x3 grid positions for each die value
            const patterns: Record<number, boolean[]> = {
                1: [false, false, false, false, true, false, false, false, false],
                2: [true, false, false, false, false, false, false, false, true],
                3: [true, false, false, false, true, false, false, false, true],
                4: [true, false, true, false, false, false, true, false, true],
                5: [true, false, true, false, true, false, true, false, true],
                6: [true, false, true, true, false, true, true, false, true],
            };

            const pattern = patterns[value] || patterns[1];

            return pattern.map((hasDot, index) => (
                <div key={index} style={hasDot ? dotStyle : emptyStyle} />
            ));
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                    className={die.rolling ? 'animate-spin' : ''}
                    style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
                        border: '2px solid #d1d5db',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(3, 1fr)',
                        padding: `${padding}px`,
                        placeItems: 'center',
                    }}
                >
                    {renderDots(die.value)}
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
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Dice Roll</h1>

                        <div className="mb-4">
                            <label htmlFor="quantity" className="font-medium text-gray-700 mr-3">
                                Number of Dice:
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                min="1"
                                max="100"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <GeneratorButtons
                            onGenerate={generateDiceRoll}
                            onReset={resetForm}
                            loading={loading}
                            generateLabel="Roll Dice"
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
                            title="Dice Roll Generator - Fast Online Dice Roller"
                            isExpanded={showShareModal}
                            setIsExpanded={setShowShareModal}
                        />
                    </div>

                    {/* Results Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Dice Results</h3>
                            <button
                                onClick={generateDiceRoll}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                {loading ? 'Rolling...' : 'Roll Again'}
                            </button>
                        </div>

                        {dice.length > 0 && (
                            <>
                                <div className={`${dice.length === 1 ? 'flex justify-center' : 'flex flex-wrap gap-5 justify-center'} my-5`}>
                                    {dice.map((die) => (
                                        <DiceComponent key={die.id} die={die} size={dice.length === 1 ? 120 : 80} />
                                    ))}
                                </div>

                                {!loading && dice.length > 1 && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                        <h4 className="text-md font-semibold text-gray-700 mb-2">Summary:</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium">Individual Results:</span>
                                                <div className="mt-1">
                                                    {dice.map((die, index) => (
                                                        <span key={die.id} className="inline-block mr-2">
                                                            Die {index + 1}: {die.value}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium">Total Sum:</span>
                                                <div className="mt-1 text-xl font-bold text-blue-600">
                                                    {dice.reduce((sum, die) => sum + die.value, 0)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div id="RWG_Below_Generator_Mobile_300px" className="md:hidden google-ad-container flex justify-center mt-8" style={{ height: '280px', maxWidth: '336px', margin: '2rem auto' }}>
                    <div id="div-gpt-ad-1578531360465-0" className="text-center"></div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        <ArticleContent>
                            <p>In all likelihood, you've reached this web-page because you're in search of a tool that'll allow you to roll dice. You're in luck since this is exactly why the Random Dice Roll Generator was created. One of the best aspects of this free online tool is that you can choose to roll as many dice as you want which can save you countless hours trying to locate the right number of dice in your house. It also makes it much easier to record the results if you need to roll the dice hundreds of times.</p>

                            <p>Even better, the dice roller generator will roll a die more randomly than using actual dice. In many cases, random dice rolls aren't truly random when you use standard dice. A study using high-speed cameras recently showed that there's a slight bias towards the side of the die that faces upward before the throw. That's even true when the dice have been perfectly balanced and not all dice are. We've all heard of dice that have been deliberately "loaded" to come up with specific numbers when thrown. When they aren't perfectly balanced, there's more probability that each roll isn't random. In fact, to combat unbalanced dice, some casinos balance their dice by drilling holes to ensure that all sides are evenly weighted and more likely to produce a completely random throw.</p>

                            <p>The good news is you can be sure of an absolutely random dice roll by using our generator and you don't even have to waste time looking for a dice to use it. Since you're visiting our random dice roller, you already have a specific reason for wanting a completely random dice roll. If you aren't completely sure, below are a few more reasons why you might find this generator useful.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Family Board Games</h2>

                            <p>Board games are fun and many of them come with dice. What's the first thing that goes missing from board game sets? Nine out of ten times, it's the dice that vanish. There's no need to turn the house upside down looking for one, two or more just so you can play your game. Now all you have to do is simply grab your mobile phone or laptop and you're all set.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Choosing Between Options</h2>

                            <p>Choices can be difficult to make. Who gets to go first in a game? Roll a die to get a random number and the person with the highest number gets to go first. Do you have a choice to make with more than two options? Assign each option a number on the die and let it roll. Random dice rolls can be especially handy in these situations when you have multiple options to choose from and just can't make up your mind.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Kill Time With Random Dice Games</h2>

                            <p>Since time immemorial, we've found ourselves killing time with simple games involving random dice throws. Today, they're as valid as boredom fighters as ever. Whether you have a long airport layover or are in a lengthy queue, making up a simple game involving a few dice throws can help to pass the time.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Test Your Luck With a Roll of the Dice</h2>

                            <p>How lucky do you feel today? Do you think you can predict the numbers that are going to come next? It can be fun to see with one or more dice rolls. Of course, your luck is as random as our dice roll, but it can be fun to see whether the powers of chaos seem to be on your side.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Generate Random Numbers Any Way You Like</h2>

                            <p>These are just a few ways you can use this dice roller. In fact, the limits to it are only your imagination. You can play and adjust to fit these dice rolls to help you out in countless ways. In fact, if you're using this tool in a way that requires you to make adjustments, we'd love to hear about it. We want the tools to be as user-friendly as possible and if we better understand how you're using it, we may be able to make adjustments when we update to make your life even easier. Please take a moment to contact us and let us know and we'll see what we can do.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Is this dice roller truly random?</h3>
                                        <p>Yes! Our dice roller uses a random number generator that gives each side of the die an equal 1 in 6 chance of being rolled. This is actually more random than physical dice which can have slight imperfections.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How many dice can I roll at once?</h3>
                                        <p>You can roll up to 100 dice at once by changing the number in the input field. The generator will display all dice and calculate the total sum for you automatically.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I use this for board games?</h3>
                                        <p>Absolutely! This dice roller is perfect for any board game that requires dice. It's especially useful when you've lost your game dice or need to roll more dice than you have available.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What's the probability of rolling a specific number?</h3>
                                        <p>With a standard six-sided die, each number (1-6) has a 1 in 6 chance, or approximately 16.67%. When rolling multiple dice, the probabilities for totals follow a bell curve, with middle values being more likely than extremes.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/dice-roll" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
