import SEO from '@/Components/SEO';
import { useState } from 'react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function Number() {
    const {
        words,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateNumbers,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'numbersFavorites',
        apiEndpoint: '/api/generate/numbers',
        itemName: 'numbers'
    });

    // Form state specific to Number page
    const [selectedRange, setSelectedRange] = useState('custom');
    const [customMin, setCustomMin] = useState(1);
    const [customMax, setCustomMax] = useState(1000);

    const getRangeValues = (range: string) => {
        switch (range) {
            case '1-10':
                return { min: 1, max: 10 };
            case '1-100':
                return { min: 1, max: 100 };
            case '1-1000':
                return { min: 1, max: 1000 };
            case '-100-100':
                return { min: -100, max: 100 };
            case 'custom':
                return { min: customMin, max: customMax };
            default:
                return { min: 1, max: 100 };
        }
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'numbers',
        onGenerate: () => {
            const { min, max } = getRangeValues(selectedRange);
            generateNumbers({
                min,
                max,
                allowDuplicates: true,
                sortOrder: 'random',
            });
        },
        setShowFavorites,
        setQuantity,
        customState: {
            selectedRange: {
                value: selectedRange,
                setter: setSelectedRange,
                defaultValue: 'custom'
            },
            customMin: {
                value: customMin,
                setter: setCustomMin,
                defaultValue: 1
            },
            customMax: {
                value: customMax,
                setter: setCustomMax,
                defaultValue: 1000
            }
        }
    });

    // Range selection component for customOptions
    const rangeOptions = (
        <div className="mb-4">
            <fieldset>
                <legend className="block font-medium text-gray-700 mb-2">Range:</legend>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="range"
                            value="1-10"
                            checked={selectedRange === '1-10'}
                            onChange={() => setSelectedRange('1-10')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">1 to 10</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="range"
                            value="1-100"
                            checked={selectedRange === '1-100'}
                            onChange={() => setSelectedRange('1-100')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">1 to 100</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="range"
                            value="1-1000"
                            checked={selectedRange === '1-1000'}
                            onChange={() => setSelectedRange('1-1000')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">1 to 1,000</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="range"
                            value="-100-100"
                            checked={selectedRange === '-100-100'}
                            onChange={() => setSelectedRange('-100-100')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">-100 to 100</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="range"
                            value="custom"
                            checked={selectedRange === 'custom'}
                            onChange={() => setSelectedRange('custom')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Custom range</span>
                    </label>

                    {/* Custom Range Inputs */}
                    {selectedRange === 'custom' && (
                        <div className="ml-6 mt-2 mb-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="custom-min" className="block text-sm font-medium text-gray-700 mb-1">
                                        Min Value
                                    </label>
                                    <input
                                        id="custom-min"
                                        type="number"
                                        value={customMin}
                                        onChange={(e) => setCustomMin(parseInt(e.target.value) || 1)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="custom-max" className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Value
                                    </label>
                                    <input
                                        id="custom-max"
                                        type="number"
                                        value={customMax}
                                        onChange={(e) => setCustomMax(parseInt(e.target.value) || 1000)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </fieldset>
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Random Number Generator"
            itemName="Numbers"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            showLetterFilters={false}
            showSizeFilter={false}
            customOptions={rangeOptions}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            {...formState}
        />
    );

    const resultsPanel = (
        <ItemsDisplay
            items={words}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
            itemName="numbers"
        />
    );

    const articleContent = (
        <>
            <p>If you're looking to generate random numbers, you've found the correct website. Our Random Number Generator gives you several different options when you need to generate random numbers. The entire process is quite simple. First, pick the number of random numbers you need to be generated, then choose the number range you'd like the random number to be generated between. Once you've done that, just hit the button to generate random numbers.</p>

            <p>While this tool isn't a word creator, it will help you generate random words by using the power of your own imagination. If you need to create a name for a product, an event, a band or for anything else, this tool can be quite helpful. As you consider names, generate a number of random words and see how they impact what you have already come up with. Chances are you'll find a combination that sounds good.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Contests</h2>

            <p>If you're having a contest and need to award a prize to a random person in the contest, this can be the perfect tool. Assign each entry a number and then use the random number generator to give you the winner. For example, if you have 100 entries but you only have 1 prize, choose a number between 1 and 100 and that entry will be the winner. This gives a completely fair and random method to use when awarding prizes.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Choosing Order</h2>

            <p>If you have a group of people and you need to designate them into a specific order, one way this can be done is to assign each person a number. You can then use the random number generator to give you the order that the people should go in. This way, you don't have to worry about making the selection yourself and being biased. For example, if there are 25 people, choose the numbers 1 to 25 and assign the people that number order.</p>

            <p>We also offer a wide variety of number ranges to make this tool as flexible as possible to use. You can choose to have random numbers in the following ranges: 1-2, 1-3, 1-4, 1-5, 1-10, 1-50, 1-100, and 1-1000. Since this is a fairly common way to use this generator, if you need to generate a random number between a different range of numbers, we have additional number generators that may be more appropriate for your needs.</p>

            <p>Those were just a few ways you can use this random number generator. If you've found a way to use it in another way, we'd love to hear about it. We're always interested in learning new ways our free tools are being used and whether we can improve them in any way. If you have an idea for how we could better serve your needs, please let us know.</p>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">How random are these numbers?</h3>
                        <p>As random as we can make it! We use javascript's internal Math.random() function which returns a Psuedo-random number in the range 0 to less than 1. We then just transform that number into an integer.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What's the minimum number I can use?</h3>
                        <p>There's no minimum number limit. You can use this random number generator to pick a truly random number between any lesser number and any greater number. This random number picker can pick a random number from 0 to whatever number you want and it can also pick negative random numbers.</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What's the maximum number I can use?</h3>
                        <p>This random number generator can generate numbers from the range of 0 up to 1,000,000,000 (1 billion).</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I get decimal numbers?</h3>
                        <p>Currently we don't support decimal numbers in this random number generator, only integer numbers.</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <SEO
                title="Random Number Generator — Easy Number Picker"
                description="The Random Number Generator produces random numbers within a chosen range. Pick a number with this random number picker."
                keywords={['random number generator', 'numbers', 'random numbers', 'number picker', 'random picker', 'lottery numbers']}
                ogImage="https://randomwordgenerator.com/img/random-number-generator.jpg"
                ogType="website"
            />
            <GeneratorPageLayout
                title="Random Number Generator - Generate Random Numbers"
                currentPage="/number.php"
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