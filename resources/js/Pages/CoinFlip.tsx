import SEO from '@/Components/SEO';
import { useState, useEffect } from 'react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

interface Coin {
    id: number;
    result: 'heads' | 'tails';
    flipping: boolean;
}

export default function CoinFlip() {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const generateCoinFlip = () => {
        setLoading(true);
        setCoins([]);

        // Generate results upfront
        const results = Array.from({ length: quantity }, () =>
            Math.random() < 0.5 ? 'heads' : 'tails'
        );

        // Add coins one by one with staggered timing, just like legacy
        results.forEach((result, index) => {
            setTimeout(() => {
                setCoins(prevCoins => [
                    ...prevCoins,
                    {
                        id: index,
                        result: result,
                        flipping: true
                    }
                ]);

                // Stop flipping after 1 second
                setTimeout(() => {
                    setCoins(prevCoins =>
                        prevCoins.map(coin =>
                            coin.id === index ? { ...coin, flipping: false } : coin
                        )
                    );
                }, 1000);

                // Mark loading as false when the last coin finishes
                if (index === results.length - 1) {
                    setTimeout(() => setLoading(false), 1000);
                }
            }, index * 200);
        });
    };

    // Auto-generate on page load
    useEffect(() => {
        generateCoinFlip();
    }, []);

    const formState = useGeneratorForm({
        wordType: 'coins',
        onGenerate: generateCoinFlip,
        setShowFavorites: () => {},
        setQuantity,
        customState: {}
    });

    const CoinComponent = ({ coin }: { coin: Coin }) => {
        // When not flipping, set the final rotation based on result
        const finalTransform = !coin.flipping
            ? coin.result === 'heads'
                ? 'rotateY(0deg)'
                : 'rotateY(180deg)'
            : '';

        return (
            <div className="flex flex-col items-center mb-5">
                <div
                    className={`coin ${coin.flipping ? `flip-${coin.result}` : ''}`}
                    style={{
                        margin: '0 auto',
                        width: '170px',
                        height: '170px',
                        transformStyle: 'preserve-3d',
                        position: 'relative',
                        transform: finalTransform
                    }}
                >
                    <div
                        className="face front"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            borderRadius: '10px',
                            background: 'url("/img/coin.png") no-repeat 0 0',
                            backgroundSize: '340px',
                            zIndex: 20
                        }}
                    />
                    <div
                        className="face back"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            borderRadius: '10px',
                            background: 'url("/img/coin.png") no-repeat -170px 0',
                            backgroundSize: '340px',
                            transform: 'rotateY(180deg)',
                            zIndex: 10
                        }}
                    />
                </div>

                <style>{`
                    @keyframes flip-heads {
                        0% {
                            transform: scale(1) rotateY(0);
                        }
                        50% {
                            transform: scale(1.5) rotateY(360deg);
                        }
                        100% {
                            transform: scale(1) rotateY(720deg);
                        }
                    }

                    @keyframes flip-tails {
                        0% {
                            transform: scale(1) rotateY(180deg);
                        }
                        50% {
                            transform: scale(1.5) rotateY(520deg);
                        }
                        100% {
                            transform: scale(1) rotateY(900deg);
                        }
                    }

                    .flip-heads {
                        animation: flip-heads 1s ease-out forwards;
                    }

                    .flip-tails {
                        animation: flip-tails 1s ease-out forwards;
                    }
                `}</style>
            </div>
        );
    };

    const formPanel = (
        <BaseGeneratorForm
            title="Coin Flip Generator"
            itemName="Coins"
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
                <h3 className="text-lg font-semibold text-gray-800">Coin Flip Results</h3>
                <button
                    onClick={generateCoinFlip}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? 'Flipping...' : 'Flip Again'}
                </button>
            </div>

            {coins.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center my-6">
                        {coins.map((coin) => (
                            <CoinComponent key={coin.id} coin={coin} />
                        ))}
                    </div>

                    {!loading && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-md font-semibold text-gray-700 mb-3">Summary:</h4>
                            <div className="flex justify-center gap-8 text-center">
                                <div>
                                    <span className="font-medium text-gray-600">Total Flips</span>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {coins.length}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Heads</span>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {coins.filter(coin => coin.result === 'heads').length}
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Tails</span>
                                    <div className="text-2xl font-bold text-gray-600">
                                        {coins.filter(coin => coin.result === 'tails').length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    const articleContent = (
        <div className="space-y-6">
            <p>
                Welcome to the Random Coin Flip Generator, a free online tool that allows you to produce random heads or tails results with a simple click of a mouse. Even better, this coin flipper allows you to flip multiple coins all at once saving you a lot of time and effort if you happen to need to flip a coin 100 times or even 1,000 times. If you're looking for random coin flipping results, you've come to the right place.
            </p>

            <p>
                It may surprise you, but his coin flipper is actually more random than actually flipping a coin. Most people think that flipping a coin is a 50 / 50 chance of landing either heads or tails, but this isn't necessarily true. With some coins, there is a higher chance of heads or tails depending on how it's created. This is because the embossing on various coins can sometimes slightly make the coin weigh more on one side or the other. This creates a bias due to the slight weighted difference to give it a higher chance of landing either heads or tails when you flip it. So, what if you want a really random coin flip? We have the answer right here with this random coin flip generator. Below you can find a number of ways that others commonly use this coin flipper.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Yes or No? Heads or Tails?</h2>

            <p>
                Sometimes we face decisions that have both pros and cons either way, or we don't know the possible outcome but need to make up our minds. A coin flip, or several coin flips, can be an excellent way to help you to decide. Flip a coin once for a definitive decision in a rush, or flip three or five times to get a "best of" random outcome.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Make up Your Mind While the Coin is Flipping</h2>

            <p>
                If you flip a coin and find yourself wishing for a specific result while that coin is still making up its mind, you have a preference even though you may not have initially realized it. In this instance, the actual result of the flip doesn't matter as much as you being able to discover your hidden preference by giving it a whirl. On the other hand, if you find that you're happy with either result, you can leave it up to the coin flip to get a random decision you can act on.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Settle Family Arguments with a Random Coin Flip</h2>

            <p>
                She wants to go to the museum. He wants to hit the beach. Although both of you have a preference of what you want to do, you know either outing will be good. This is one of the times when a random coin flip settles the matter without further discussion. After all, nobody wants to be stuck at home or in the hotel room all day discussing the matter. Often a simple coin toss can make the decision a lot easier than a long discussion.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Use It to Play a Simple Game</h2>

            <p>
                Who can predict the outcome of random coin flips most often? Could they have magic powers? Generate random coin flips and see if anyone in your family or among your friends is particularly lucky at guessing the results. No, they probably aren't psychic, but random results can sometimes make it look that way. This game is easy and fun to play when you're on long road trips. The driver never has to take his or her attention away from the road, but the fun promotes alertness when coffee just isn't enough to do the job.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">How Random is Our Random Coin Flip?</h2>

            <p>
                A random coin flip has two possible results: heads or tails. With our random coin flip generator, you can be sure that either result has a 50/50 chance of coming up. But here's where the mystery comes in: there's nothing to prevent heads from coming up every time in 10 throws. The previous coin flip doesn't influence the next one, so every flip has an equal chance of coming up either heads or tails regardless of how many times you flip the coin.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Flip a Coin 100 Times</h2>

            <p>
                As mentioned above, each flip of the coin has a 50 / 50 chance of landing heads or tails but flipping a coin 100 times doesn't mean that it will end up with results of 50 tails and 50 heads. The fewer times you toss a coin, the more likely they will be skewed. For example, if you flip a coin 10 times, the chances that it's close to 50 / 50 is less than if you flip a coin 100 times. The more you flip, the closer you should get to a 50 / 50 split. That means if you flip a coin 1,000 times, it should show results closer to 50 / 50 than when you flip a coin 100 times. If you flip a coin 10,000 times you should be even closer to a 50 / 50 result.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Let Us Know</h2>

            <p>
                Do you find this coin flipping generator useful? Please let us know and also please tell us exactly why you are using the tool. The more we understand how and why people are using our tools, the better we can make updates to make them more useful for those who come to this webpage.
            </p>
        </div>
    );

    return (
        <>
            <SEO
                title="Coin Flip — Instant Heads or Tails Results"
                description="The Coin Flip Generator is a coin toss coin flipper. Flip a coin and get a heads or tails result."
                keywords={['coin flip', 'coin toss', 'heads or tails', 'coin flipper', 'random decision', 'virtual coin']}
                ogImage="https://randomwordgenerator.com/img/coin-flip.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Coin Flip Generator - Instant Heads or Tails Results"
                currentPage="/coin-flip.php"
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