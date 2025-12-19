import { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import GeneratorButtons from '../Forms/GeneratorButtons';
import SocialShareBlock from '../Shared/SocialShareBlock';

interface Coin {
    id: number;
    result: 'heads' | 'tails';
    flipping: boolean;
}

interface CoinFlipGeneratorProps {
    basePath?: string;
}

export default function CoinFlipGenerator({ basePath = '' }: CoinFlipGeneratorProps) {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const generateCoinFlip = () => {
        setLoading(true);
        setCoins([]);

        // Generate results upfront
        const results = Array.from({ length: quantity }, () =>
            Math.random() < 0.5 ? 'heads' : 'tails'
        ) as ('heads' | 'tails')[];

        // Add coins one by one with staggered timing
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

    useEffect(() => {
        generateCoinFlip();
    }, []);

    const resetForm = () => {
        setQuantity(1);
    };

    const CoinComponent = ({ coin, size }: { coin: Coin; size: number }) => {
        const finalTransform = !coin.flipping
            ? coin.result === 'heads'
                ? 'rotateY(0deg)'
                : 'rotateY(180deg)'
            : '';

        return (
            <div className="flex flex-col items-center">
                <div
                    className={`coin ${coin.flipping ? `flip-${coin.result}` : ''}`}
                    style={{
                        margin: '0 auto',
                        width: `${size}px`,
                        height: `${size}px`,
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
                            backgroundSize: `${size * 2}px ${size}px`,
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
                            background: `url("/img/coin.png") no-repeat -${size}px 0`,
                            backgroundSize: `${size * 2}px ${size}px`,
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6" style={{ minWidth: '385px' }}>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Coin Flip</h1>

                        <div className="mb-4">
                            <label htmlFor="quantity" className="font-medium text-gray-700 mr-3">
                                Number of Coins:
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
                            onGenerate={generateCoinFlip}
                            onReset={resetForm}
                            loading={loading}
                            generateLabel="Flip Coins"
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
                            title="Coin Flip Generator - Instant Heads or Tails Results"
                            isExpanded={showShareModal}
                            setIsExpanded={setShowShareModal}
                        />
                    </div>

                    {/* Results Panel */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Coin Flip Results</h3>
                            <button
                                onClick={generateCoinFlip}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                {loading ? 'Flipping...' : 'Flip Again'}
                            </button>
                        </div>

                        {coins.length > 0 && (
                            <>
                                <div className={`${coins.length === 1 ? 'flex justify-center' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center'} my-6`}>
                                    {coins.map((coin) => (
                                        <CoinComponent key={coin.id} coin={coin} size={coins.length === 1 ? 170 : 120} />
                                    ))}
                                </div>

                                {!loading && coins.length > 1 && (
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
                </div>

                <div id="RWG_Below_Generator_Mobile_300px" className="md:hidden google-ad-container flex justify-center mt-8" style={{ height: '280px', maxWidth: '336px', margin: '2rem auto' }}>
                    <div id="div-gpt-ad-1578531360465-0" className="text-center"></div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        <ArticleContent>
                            <p>Welcome to the Random Coin Flip Generator, a free online tool that allows you to produce random heads or tails results with a simple click of a mouse. Even better, this coin flipper allows you to flip multiple coins all at once saving you a lot of time and effort if you happen to need to flip a coin 100 times or even 1,000 times. If you're looking for random coin flipping results, you've come to the right place.</p>

                            <p>It may surprise you, but his coin flipper is actually more random than actually flipping a coin. Most people think that flipping a coin is a 50 / 50 chance of landing either heads or tails, but this isn't necessarily true. With some coins, there is a higher chance of heads or tails depending on how it's created. This is because the embossing on various coins can sometimes slightly make the coin weigh more on one side or the other. This creates a bias due to the slight weighted difference to give it a higher chance of landing either heads or tails when you flip it. So, what if you want a really random coin flip? We have the answer right here with this random coin flip generator. Below you can find a number of ways that others commonly use this coin flipper.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Yes or No? Heads or Tails?</h2>

                            <p>Sometimes we face decisions that have both pros and cons either way, or we don't know the possible outcome but need to make up our minds. A coin flip, or several coin flips, can be an excellent way to help you to decide. Flip a coin once for a definitive decision in a rush, or flip three or five times to get a "best of" random outcome.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Make up Your Mind While the Coin is Flipping</h2>

                            <p>If you flip a coin and find yourself wishing for a specific result while that coin is still making up its mind, you have a preference even though you may not have initially realized it. In this instance, the actual result of the flip doesn't matter as much as you being able to discover your hidden preference by giving it a whirl. On the other hand, if you find that you're happy with either result, you can leave it up to the coin flip to get a random decision you can act on.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Settle Family Arguments with a Random Coin Flip</h2>

                            <p>She wants to go to the museum. He wants to hit the beach. Although both of you have a preference of what you want to do, you know either outing will be good. This is one of the times when a random coin flip settles the matter without further discussion. After all, nobody wants to be stuck at home or in the hotel room all day discussing the matter. Often a simple coin toss can make the decision a lot easier than a long discussion.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Use It to Play a Simple Game</h2>

                            <p>Who can predict the outcome of random coin flips most often? Could they have magic powers? Generate random coin flips and see if anyone in your family or among your friends is particularly lucky at guessing the results. No, they probably aren't psychic, but random results can sometimes make it look that way. This game is easy and fun to play when you're on long road trips. The driver never has to take his or her attention away from the road, but the fun promotes alertness when coffee just isn't enough to do the job.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">How Random is Our Random Coin Flip?</h2>

                            <p>A random coin flip has two possible results: heads or tails. With our random coin flip generator, you can be sure that either result has a 50/50 chance of coming up. But here's where the mystery comes in: there's nothing to prevent heads from coming up every time in 10 throws. The previous coin flip doesn't influence the next one, so every flip has an equal chance of coming up either heads or tails regardless of how many times you flip the coin.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Flip a Coin 100 Times</h2>

                            <p>As mentioned above, each flip of the coin has a 50 / 50 chance of landing heads or tails but flipping a coin 100 times doesn't mean that it will end up with results of 50 tails and 50 heads. The fewer times you toss a coin, the more likely they will be skewed. For example, if you flip a coin 10 times, the chances that it's close to 50 / 50 is less than if you flip a coin 100 times. The more you flip, the closer you should get to a 50 / 50 split. That means if you flip a coin 1,000 times, it should show results closer to 50 / 50 than when you flip a coin 100 times. If you flip a coin 10,000 times you should be even closer to a 50 / 50 result.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Let Us Know</h2>

                            <p>Do you find this coin flipping generator useful? Please let us know and also please tell us exactly why you are using the tool. The more we understand how and why people are using our tools, the better we can make updates to make them more useful for those who come to this webpage.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Is this coin flip truly random?</h3>
                                        <p>Yes! Our coin flip generator uses a random number generator to ensure each flip has an equal 50/50 chance of landing on heads or tails, making it more random than a physical coin which can have slight biases.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Can I flip multiple coins at once?</h3>
                                        <p>Absolutely! You can flip up to 100 coins at once by adjusting the number in the input field. This is perfect for probability experiments or when you need multiple random decisions quickly.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Why would I use a virtual coin flip instead of a real coin?</h3>
                                        <p>A virtual coin flip is more convenient (no coin needed), more random (no physical biases), and allows you to flip many coins at once. It's also great when you need to record results for games or experiments.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Does previous flip results affect future flips?</h3>
                                        <p>No, each coin flip is completely independent. Even if you get heads 10 times in a row, the next flip still has a 50/50 chance. This is known as the gambler's fallacy - past results don't influence future random events.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/coin-flip" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
