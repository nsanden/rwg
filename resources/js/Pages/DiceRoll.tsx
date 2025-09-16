import SEO from '@/Components/SEO';
import { useState, useEffect } from 'react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

interface Die {
    id: number;
    value: number;
    rolling: boolean;
}

export default function DiceRoll() {
    const [dice, setDice] = useState<Die[]>([]);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(2);

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

    // Auto-generate on page load
    useEffect(() => {
        generateDiceRoll();
    }, []);

    const formState = useGeneratorForm({
        wordType: 'dice',
        onGenerate: generateDiceRoll,
        setShowFavorites: () => {},
        setQuantity,
        customState: {}
    });

    const DiceComponent = ({ die }: { die: Die }) => {
        const getDotPositions = (value: number) => {
            const positions = {
                1: [{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }],
                2: [
                    { top: '20%', left: '20%' },
                    { bottom: '20%', right: '20%' }
                ],
                3: [
                    { top: '20%', left: '20%' },
                    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
                    { bottom: '20%', right: '20%' }
                ],
                4: [
                    { top: '20%', left: '20%' },
                    { top: '20%', right: '20%' },
                    { bottom: '20%', left: '20%' },
                    { bottom: '20%', right: '20%' }
                ],
                5: [
                    { top: '20%', left: '20%' },
                    { top: '20%', right: '20%' },
                    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
                    { bottom: '20%', left: '20%' },
                    { bottom: '20%', right: '20%' }
                ],
                6: [
                    { top: '20%', left: '20%' },
                    { top: '20%', right: '20%' },
                    { top: '50%', left: '20%', transform: 'translateY(-50%)' },
                    { top: '50%', right: '20%', transform: 'translateY(-50%)' },
                    { bottom: '20%', left: '20%' },
                    { bottom: '20%', right: '20%' }
                ]
            };

            return positions[value as keyof typeof positions] || [];
        };

        const dotPositions = getDotPositions(die.value);

        return (
            <div className={`w-20 h-20 ${die.rolling ? 'animate-spin' : ''} transition-transform duration-1000 ease-in-out`}>
                <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-100 border-2 border-gray-300 rounded-xl relative shadow-lg">
                    {dotPositions.map((position, index) => (
                        <div
                            key={index}
                            className="w-3 h-3 bg-gray-800 rounded-full absolute"
                            style={position}
                        />
                    ))}
                </div>
            </div>
        );
    };

    const formPanel = (
        <BaseGeneratorForm
            title="Dice Roll Generator"
            itemName="Dice"
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
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Dice Results</h3>
                <button
                    onClick={generateDiceRoll}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Rolling...' : 'Roll Again'}
                </button>
            </div>

            {dice.length > 0 && (
                <>
                    <div className="flex flex-wrap gap-5 justify-center my-5">
                        {dice.map((die) => (
                            <DiceComponent key={die.id} die={die} />
                        ))}
                    </div>

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
                </>
            )}
        </div>
    );

    const articleContent = (
        <div className="space-y-6">
            <p>
                In all likelihood, you've reached this web-page because you're in search of a tool that'll allow you to roll dice. You're in luck since this is exactly why the Random Dice Roll Generator was created. One of the best aspects of this free online tool is that you can choose to roll as many dice as you want which can save you countless hours trying to locate the right number of dice in your house. It also makes it much easier to record the results if you need to roll the dice hundreds of times.
            </p>

            <p>
                Even better, the dice roller generator will roll a die more randomly than using actual dice. In many cases, random dice rolls aren't truly random when you use standard dice. A study using high-speed cameras recently showed that there's a slight bias towards the side of the die that faces upward before the throw. That's even true when the dice have been perfectly balanced and not all dice are. We've all heard of dice that have been deliberately "loaded" to come up with specific numbers when thrown. When they aren't perfectly balanced, there's more probability that each roll isn't random. In fact, to combat unbalanced dice, some casinos balance their dice by drilling holes to ensure that all sides are evenly weighted and more likely to produce a completely random throw.
            </p>

            <p>
                The good news is you can be sure of an absolutely random dice roll by using our generator and you don't even have to waste time looking for a dice to use it. Since you're visiting our random dice roller, you already have a specific reason for wanting a completely random dice roll. If you aren't completely sure, below are a few more reasons why you might find this generator useful.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Family Board Games</h2>

            <p>
                Board games are fun and many of them come with dice. What's the first thing that goes missing from board game sets? Nine out of ten times, it's the dice that vanish. There's no need to turn the house upside down looking for one, two or more just so you can play your game. Now all you have to do is simply grab your mobile phone or laptop and you're all set.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Choosing Between Options</h2>

            <p>
                Choices can be difficult to make. Who gets to go first in a game? Roll a die to get a random number and the person with the highest number gets to go first. Do you have a choice to make with more than two options? Assign each option a number on the die and let it roll. Random dice rolls can be especially handy in these situations when you have multiple options to choose from and just can't make up your mind.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Kill Time With Random Dice Games</h2>

            <p>
                Since time immemorial, we've found ourselves killing time with simple games involving random dice throws. Today, they're as valid as boredom fighters as ever. Whether you have a long airport layover or are in a lengthy queue, making up a simple game involving a few dice throws can help to pass the time.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Test Your Luck With a Roll of the Dice</h2>

            <p>
                How lucky do you feel today? Do you think you can predict the numbers that are going to come next? It can be fun to see with one or more dice rolls. Of course, your luck is as random as our dice roll, but it can be fun to see whether the powers of chaos seem to be on your side.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Generate Random Numbers Any Way You Like</h2>

            <p>
                These are just a few ways you can use this dice roller. In fact, the limits to it are only your imagination. You can play and adjust to fit these dice rolls to help you out in countless ways. In fact, if you're using this tool in a way that requires you to make adjustments, we'd love to hear about it. We want the tools to be as user-friendly as possible and if we better understand how you're using it, we may be able to make adjustments when we update to make your life even easier. Please take a moment to contact us and let us know and we'll see what we can do.
            </p>
        </div>
    );

    return (
        <>
            <SEO
                title="Dice Roll Generator — Fast Online Dice Roller"
                description="The Dice Roll Generator will roll dice to give you a random die roll. The best online dice roller!"
                keywords={['dice roll', 'dice roller', 'random dice', 'virtual dice', 'online dice', 'dice generator']}
                ogImage="https://randomwordgenerator.com/img/dice-roll.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Dice Roll Generator - Fast Online Dice Roller"
                currentPage="/dice-roll.php"
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