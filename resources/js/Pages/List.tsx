import SEO from '@/Components/SEO';
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import ItemsDisplay from '@/Components/Shared/ItemsDisplay';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';

export default function List() {
    const {
        items,
        quantity,
        favorites,
        showFavorites,
        setQuantity,
        setShowFavorites,
        setItems,
        generateItems,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: false,
        favoritesKey: 'listFavorites',
        itemName: 'list items'
    });

    // Form state specific to List page
    const [listText, setListText] = useState('north\nsouth\neast\nwest');
    const [separatorType, setSeparatorType] = useState('newline');
    const [loading, setLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const handleGenerateList = () => {
        if (!listText.trim()) return;

        // Split the list based on separator type
        const wordArray = separatorType === 'comma'
            ? listText.split(',').map(item => item.trim()).filter(item => item)
            : listText.split('\n').map(item => item.trim()).filter(item => item);

        if (wordArray.length === 0) return;

        // Show brief loading indicator
        setLoading(true);
        setShowLoading(true);

        // Add a brief delay to show the spinner
        setTimeout(() => {
            // Determine how many items to pick
            const itemsToGenerate = Math.min(quantity, wordArray.length);

            // Pick random items without replacement
            const shuffled = [...wordArray];
            const randomItems: string[] = [];

            for (let i = 0; i < itemsToGenerate; i++) {
                const randomIndex = Math.floor(Math.random() * shuffled.length);
                randomItems.push(shuffled[randomIndex]);
                shuffled.splice(randomIndex, 1);
            }

            // Set items directly instead of making API call
            setItems(randomItems);
            setShowFavorites(false);
            setLoading(false);
            setShowLoading(false);
        }, 200);
    };

    // Auto-generate on first load
    useEffect(() => {
        handleGenerateList();
    }, []);

    const handleSeparatorChange = (newSeparatorType: string) => {
        let convertedText = listText;

        if (separatorType === 'comma' && newSeparatorType === 'newline') {
            convertedText = listText.replace(/,/g, '\n').replace(/ /g, '');
        } else if (separatorType === 'newline' && newSeparatorType === 'comma') {
            convertedText = listText.replace(/\n/g, ',').replace(/ /g, '');
        }

        setListText(convertedText);
        setSeparatorType(newSeparatorType);
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'list',
        onGenerate: handleGenerateList,
        setShowFavorites,
        setQuantity,
        customState: {
            listText: {
                value: listText,
                setter: setListText,
                defaultValue: 'north\nsouth\neast\nwest'
            },
            separatorType: {
                value: separatorType,
                setter: setSeparatorType,
                defaultValue: 'newline'
            }
        }
    });

    // List input component for customOptions
    const listOptions = (
        <div className="mb-4">
            <fieldset>
                <legend className="block font-medium text-gray-700 mb-2">List Format:</legend>
                <div className="space-y-2 mb-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="separator"
                            value="newline"
                            checked={separatorType === 'newline'}
                            onChange={(e) => handleSeparatorChange(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">New Line</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="separator"
                            value="comma"
                            checked={separatorType === 'comma'}
                            onChange={(e) => handleSeparatorChange(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-gray-700">Comma</span>
                    </label>
                </div>

                <div>
                    <label htmlFor="listText" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Your List:
                    </label>
                    <textarea
                        id="listText"
                        value={listText}
                        onChange={(e) => setListText(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={separatorType === 'comma' ? 'item1, item2, item3' : 'item1\nitem2\nitem3'}
                    />
                </div>
            </fieldset>
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Random List Generator"
            itemName="Items"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            showLetterFilters={false}
            showSizeFilter={false}
            customOptions={listOptions}
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
            itemName="list items"
        />
    );

    const articleContent = (
        <>
            <p>There are a huge number of random generators for virtually anything and everything you can think of on the Internet, but most of these are made to generate specific content. The random word generator generates random words. But what if you have a unique list and you need to pick a specific random entry from that specific list? That's where the Random List Generator comes in. This anything generator is the perfect list randomizer that allows you to input any list you have and it will then pick a random entry from the list.</p>

            <p>This free online list randomizer tool is easy to use. All you need to do is copy and paste your list into the generator. Once done, choose the appropriate type of list (either each entry separated by a new line or by a comma) and the number of random entries you want to be displayed. Click the button and the number you chose will randomly appear from the list you inserted. It really is that easy. Here are some common ways this random randomizer can be used.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">School Homework Lists</h2>
            <p>When you're given homework where you have to memorize some type of list, this tool can be the perfect study aid. For example, if part of your science class requires you to memorize the periodic table, you can import the chemical element list. You can then use the list randomizer to study the symbol and the atomic number of each random one displayed. You can use this list generator for any list you need to study at school.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Foreign Language Vocabulary</h2>
            <p>If you're studying a foreign language, this tool can be an excellent resource. One issue with random foreign language word generators is that the words may not be for the exact level you're at. This isn't a problem with the list generator. Input your current vocabulary lists, click the random generate button and the list randomizer will ensure you have a simple way to study for your next test.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">To-Do Lists</h2>
            <p>We all have to-do lists and the items on the lists are usually there because you have procrastinated due to not wanting to do them. You stare at the list not being able to decide which one to do out of all the ones that need to be done. One way to jumpstart checking off the items on your to-do list is to have the list randomizer randomly choose the next one you need to complete.</p>

            <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800">Contests</h2>
            <p>If you're holding a contest and have a long list of names from which you need to pick a winner, why take the extra step of assigning each name a number? It's less time-consuming, and a lot easier, to put the entire list into the generator and have the winner's name come up with a click of your mouse. Our <Link href="/name.php" className="text-blue-600 hover:text-blue-800">Random Name Generator</Link> also help with this task.</p>

            <p>These are just a few of the many ways this list generator and randomizer can be used. We are interested in how you use it. If you find this tool useful and you want to see it improved, please take a minute to contact us and let us know how you're using it. The more we know about how it is being used, the easier it is for us to improve it. On that same note, if you know a way that would greatly improve this tool for you, we'd love to hear so we can try and implement your ideas.</p>
        </>
    );

    return (
        <>
            <SEO
                title="Random List Generator - Pick Random Items from Your List"
                description="The Random List Generator helps you pick random results from your own random list. Perfect for choosing random items from any custom list."
            />
            <GeneratorPageLayout
                title="Random List Generator - Pick Random Items from Your List"
                currentPage="/list.php"
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