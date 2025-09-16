import SEO from '@/Components/SEO';
import { useState } from 'react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function GiftIdeas() {
    const {
        items,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        generateItems,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'giftIdeasFavorites',
        apiEndpoint: '/api/generate/gift-ideas',
        itemName: 'gift ideas'
    });

    // Form state specific to Gift Ideas page
    const [selectedCategory, setSelectedCategory] = useState(0);

    const handleGenerateGiftIdeas = () => {
        generateItems({
            quantity,
            category: selectedCategory
        });
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'gift-ideas',
        onGenerate: handleGenerateGiftIdeas,
        setShowFavorites,
        setQuantity,
        customState: {
            selectedCategory: {
                value: selectedCategory,
                setter: setSelectedCategory,
                defaultValue: 0
            }
        }
    });

    // Category selection component for customOptions
    const categoryOptions = (
        <div className="mb-4">
            <fieldset>
                <legend className="block font-medium text-gray-700 mb-2">For whom:</legend>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={0}
                            checked={selectedCategory === 0}
                            onChange={() => setSelectedCategory(0)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Anyone</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={1}
                            checked={selectedCategory === 1}
                            onChange={() => setSelectedCategory(1)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Men</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={2}
                            checked={selectedCategory === 2}
                            onChange={() => setSelectedCategory(2)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Women</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={4}
                            checked={selectedCategory === 4}
                            onChange={() => setSelectedCategory(4)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Babies</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={8}
                            checked={selectedCategory === 8}
                            onChange={() => setSelectedCategory(8)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Toddlers</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={16}
                            checked={selectedCategory === 16}
                            onChange={() => setSelectedCategory(16)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Kids 4-7</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={32}
                            checked={selectedCategory === 32}
                            onChange={() => setSelectedCategory(32)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Kids 8-12</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="category"
                            value={64}
                            checked={selectedCategory === 64}
                            onChange={() => setSelectedCategory(64)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Teens</span>
                    </label>
                </div>
            </fieldset>
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Random Gift Ideas Generator"
            itemName="Gift Ideas"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            showLetterFilters={false}
            showSizeFilter={false}
            customOptions={categoryOptions}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            {...formState}
        />
    );

    const resultsPanel = (
        <ItemsDisplay
            items={items}
            favorites={favorites}
            showFavorites={showFavorites}
            setShowFavorites={setShowFavorites}
            quantity={quantity}
            loading={showLoading}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            copyToClipboard={copyToClipboard}
            clearAllFavorites={clearAllFavorites}
            itemName="gift ideas"
        />
    );

    const articleContent = (
        <>
            <p>There's nothing worse than needing to buy a gift for someone and have absolutely no idea what to get. If that happens to be your problem, you've come to the correct place. The Random Gift Idea Generator was specifically created to help you come up with quality gift ideas when you're at a loss. It's as simple as a click of a mouse. Choose who you are picking the gift for, how many results you'd like to see and hit the button. You'll have random gift ideas within seconds so you no longer have to worry about what to buy.</p>

            <p>The Random Gift generator gives you the option of picking who will be getting the gift. This allows for you to find random gifts specific to the age of the recipient. Your choices include men, women, teens, kids 8-12, kids 4-7, toddlers and babies. These options should make it even more likely you'll find the perfect gift for the person you need to buy for. Below are some of the ways you can use this free online gift idea tool.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Overcome Gift Block</h2>
            <p>A lot of the time the major issue with buying a gift is your mind is just blank on what to get. Sometimes all you need to do is see a few random gift ideas to get your own gift-giving juices flowing and to overcome the block. In this sense, the random gift idea generator can be used to inspire you to find the perfect gift by jumpstarting your gift-giving creativity by pushing you in the right direction.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Helping Others</h2>
            <p>Sometimes it's not you, but a friend or partner who needs some good gift ideas. While you may be able to come up with a few ideas off the top of your head, if that isn't enough to help, you can simply come to this page and generate a number of random gift ideas to give to get their ideas flowing again. Sometimes reading out loud gift ideas can help overcome the gift block the friend or partner may have.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Literal Gifts to Give</h2>
            <p>While this online tool can be used to help you get your creative juices flowing and to help you come up with your own idea of the perfect gift, the gifts in the generator are also great gift ideas on their own. There's no reason you need to come up with your own creative spinoff of one of the ideas if you don't want. Simply use the random gift idea given for a wonderful gift.</p>

            <p>We are interested in learning from you exactly how you use this random gift generator. We created it with the express idea of helping ourselves out when we have difficulty coming up with quality gift ideas for our friends and family. In that sense, we know how we would use it. We know from experience, however, that many of our online tools end up being used in a much different way than we initially intended. By getting a good understanding of all the different ways this gift-giving tool is being used, we can make future updates that can benefit all users. We're also interested in specific improvements and changes you'd like to see us implement in the future to make this random gift idea tool the best it can be.</p>
        </>
    );

    return (
        <>
            <SEO
                title="Random Gift Ideas Generator - Creative Present Ideas"
                description="Generate random gift ideas for men, women, kids, babies, and more. Get creative present inspiration when you're stuck on what to buy."
            />
            <GeneratorPageLayout
                title="Random Gift Ideas Generator - Creative Present Ideas"
                currentPage="/gift-ideas.php"
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
