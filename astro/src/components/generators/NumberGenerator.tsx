import { useState } from 'react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import ItemsDisplay from '../Shared/ItemsDisplay';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGenerator } from '../../hooks/useGenerator';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';

interface NumberGeneratorProps {
    basePath?: string;
}

export default function NumberGenerator({ basePath = '' }: NumberGeneratorProps) {
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

    const [selectedRange, setSelectedRange] = useState('custom');
    const [customMin, setCustomMin] = useState(1);
    const [customMax, setCustomMax] = useState(100);

    const getRangeValues = (range: string) => {
        switch (range) {
            case '1-10': return { min: 1, max: 10 };
            case '1-100': return { min: 1, max: 100 };
            case '1-1000': return { min: 1, max: 1000 };
            case '-100-100': return { min: -100, max: 100 };
            case 'custom': return { min: customMin, max: customMax };
            default: return { min: 1, max: 100 };
        }
    };

    const formState = useGeneratorForm({
        wordType: 'numbers',
        onGenerate: () => {
            const { min, max } = getRangeValues(selectedRange);
            generateNumbers({ min, max, allowDuplicates: true, sortOrder: 'random' });
        },
        setShowFavorites,
        setQuantity,
        customState: {
            selectedRange: { value: selectedRange, setter: setSelectedRange, defaultValue: 'custom' },
            customMin: { value: customMin, setter: setCustomMin, defaultValue: 1 },
            customMax: { value: customMax, setter: setCustomMax, defaultValue: 100 }
        }
    });

    const rangeOptions = (
        <div className="mb-4">
            <fieldset>
                <div className="space-y-2">
                    {/* Custom range option with inline inputs */}
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="range"
                            value="custom"
                            checked={selectedRange === 'custom'}
                            onChange={() => setSelectedRange('custom')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Number between</span>
                        <input
                            type="number"
                            value={customMin}
                            onChange={(e) => {
                                setCustomMin(parseInt(e.target.value) || 1);
                                setSelectedRange('custom');
                            }}
                            onClick={() => setSelectedRange('custom')}
                            className="ml-2 w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            aria-label="Minimum value"
                        />
                        <span className="mx-2 text-gray-700">and</span>
                        <input
                            type="number"
                            value={customMax}
                            onChange={(e) => {
                                setCustomMax(parseInt(e.target.value) || 100);
                                setSelectedRange('custom');
                            }}
                            onClick={() => setSelectedRange('custom')}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            aria-label="Maximum value"
                        />
                    </label>

                    {/* Preset options */}
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="range"
                            value="1-10"
                            checked={selectedRange === '1-10'}
                            onChange={() => setSelectedRange('1-10')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Random number between 1 and 10</span>
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
                        <span className="ml-2 text-gray-700">Random number between 1 and 100</span>
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
                        <span className="ml-2 text-gray-700">Random number between 1 and 1000</span>
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
                        <span className="ml-2 text-gray-700">Random number between -100 and 100</span>
                    </label>
                </div>
            </fieldset>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                    <div className="w-full">
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
                            onReset={() => {
                                setSelectedRange('custom');
                                setCustomMin(1);
                                setCustomMax(100);
                                formState.resetOptions();
                                generateNumbers({ min: 1, max: 100, allowDuplicates: true, sortOrder: 'random' });
                            }}
                        />
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        <ArticleContent>
                            <p>If you're looking to generate random numbers, you've found the correct website. Our Random Number Generator gives you several different options when you need to generate random numbers. The entire process is quite simple. First, pick the number of random numbers you need to be generated, then choose the number range you'd like the random number to be generated between. Once done, click the "Generate Random Numbers" button and they will instantly appear. You can determine a specific range of numbers or you can use one of the several set number generators. These include random numbers between 1 and 10, random numbers between 1 and 100, and random numbers between 1 and 1000. For those who may need to generate negative numbers, we also have the option of random numbers from -100 to 100.</p>

                            <p>There are a variety of reasons someone might need to use a randomized number generator. They have applications in a wide variety of fields including statistical sampling, cryptography, and computer simulation. For the purpose of visiting this page, however, it's more likely for a much less sophisticated reason. Below you can find some of the more common reasons people are looking to generate random numbers.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Contests</h2>

                            <p>If you're having a contest and need to award a prize to a random person in the contest, this can be the perfect tool. Assign each entry a number and then use the random number generator to give you the winner. If you have multiple prizes to give away randomly, simply choose the number needed and click. By generating random numbers you ensure that the prizes are going to random entries so the contest is fair for all.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Choosing Order</h2>

                            <p>If you have a group of people and you need to designate them into a specific order, one way this can be done is to assign each person a number. You can then use the tool to decide the order of each person in the group. For example, if you have 10 people that you need to have randomly lined up, you can assign each a number and then generate a list of random numbers for all ten in the numbers generator. The top number generated would place the person assigned the first spot to that place with the other people in the group moved to the appropriate places from there. This way the numbers generator gives each person a random position.</p>

                            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Picking Numbers</h2>

                            <p>Often there's a reason that you need to pick a random number between a specific set of numbers. This can be done by using the pick your own number option. This allows you to pick the specific number range you need for picking your numbers. Below you can find some of the more common number ranges people are looking to use with this random tool.</p>

                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(2); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 2</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(3); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 3</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(4); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 4</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(5); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 5</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(6); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 6</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(7); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 7</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(8); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 8</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(9); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 9</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(10); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 10</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(25); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 25</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(50); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 50</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(75); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 75</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(100); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 100</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(500); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 500</button></li>
                                <li>Pick a number between <button onClick={() => { setCustomMin(1); setCustomMax(1000); setSelectedRange('custom'); }} className="text-blue-600 hover:underline cursor-pointer">1 and 1000</button></li>
                            </ul>

                            <p className="mt-4">These are a few of many reasons you may want to use this free online number generator. If you have found the random number generator useful, we'd love to hear from you and how you use it. It's through hearing from those who use it that we are able to improve it when we do updates. We'd also love to hear any suggestions you may have to make the tool better for everyone.</p>

                            <div className="mt-8" id="faq">
                                <h2 className="text-2xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">How random is this Random Number Generator?</h3>
                                        <p>As random as we can make it! We use javascript's internal Math.random() function which returns a Psuedo-random number in the range 0 to less than 1. We then just transform that number into an integer. The internals are complicated but rest assured, these numbers are as random as it gets.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What is the minimum number you can use in your Number Generator?</h3>
                                        <p>There is no minimum number, you can use 0 or even a negative number. Currently only integers are supported but we'll be adding an option for floating numbers soon.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">What is the maximum number you can use in your Number Generator?</h3>
                                        <p>The maximum number that you can use in the random number generator is 1000000000 (1 billion)</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Do you have a Random Number Generator mobile app?</h3>
                                        <p>No, we don't have a mobile application, but our website is 100% mobile friendly.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        <div>
                            <OtherGenerators currentPage="/number" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
