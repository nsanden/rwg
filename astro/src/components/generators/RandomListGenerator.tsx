import { useState, useEffect } from 'react';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import ItemsDisplay from '../Shared/ItemsDisplay';
import { RefreshCw } from 'lucide-react';

interface RandomListGeneratorProps {
    basePath?: string;
}

export default function RandomListGenerator({ basePath = '' }: RandomListGeneratorProps) {
    const [listText, setListText] = useState('north\nsouth\neast\nwest');
    const [separatorType, setSeparatorType] = useState('newline');
    const [quantity, setQuantity] = useState(1);
    const [items, setItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);

    // Load favorites from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('listFavorites');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        }
    }, []);

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
            convertedText = listText.split(',').map(item => item.trim()).join('\n');
        } else if (separatorType === 'newline' && newSeparatorType === 'comma') {
            convertedText = listText.split('\n').map(item => item.trim()).join(', ');
        }

        setListText(convertedText);
        setSeparatorType(newSeparatorType);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleGenerateList();
    };

    const resetForm = () => {
        setListText('north\nsouth\neast\nwest');
        setSeparatorType('newline');
        setQuantity(1);
        setItems([]);
        setShowFavorites(false);
    };

    const addToFavorites = (item: string) => {
        const updated = [...favorites, item];
        setFavorites(updated);
        localStorage.setItem('listFavorites', JSON.stringify(updated));
    };

    const removeFromFavorites = (item: string) => {
        const updated = favorites.filter(f => f !== item);
        setFavorites(updated);
        localStorage.setItem('listFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavorites([]);
        localStorage.setItem('listFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const copyToClipboard = () => {
        const textToCopy = (showFavorites ? favorites : items).join('\n');
        navigator.clipboard.writeText(textToCopy);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <div className="bg-white rounded-lg shadow-lg p-6" style={{ minWidth: '385px' }}>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Random List</h1>
                        <form onSubmit={handleSubmit}>
                            {/* Number of Items */}
                            <div className="mb-4">
                                <label htmlFor="quantity-input" className="font-medium text-gray-700 mr-3">
                                    Number of Items:
                                </label>
                                <input
                                    id="quantity-input"
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    className="inline-block w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* List Format */}
                            <fieldset className="mb-4">
                                <legend className="block font-medium text-gray-700 mb-2">List Format:</legend>
                                <div className="space-y-2 mb-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="separator"
                                            value="newline"
                                            checked={separatorType === 'newline'}
                                            onChange={(e) => handleSeparatorChange(e.target.value)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                                        />
                                        <span className="ml-2 text-gray-700">New Line</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="separator"
                                            value="comma"
                                            checked={separatorType === 'comma'}
                                            onChange={(e) => handleSeparatorChange(e.target.value)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
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

                            {/* Buttons */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center font-medium"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2" />
                                            Generate Random Items
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    disabled={loading}
                                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Results */}
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
                </div>

                {/* About Section */}
                <div id="RWG_Below_Generator_Mobile_300px" className="md:hidden google-ad-container flex justify-center mt-8" style={{ height: '280px', maxWidth: '336px', margin: '2rem auto' }}>
                    <div id="div-gpt-ad-1578531360465-0" className="text-center"></div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        {/* Left Column - Article Content */}
                        <ArticleContent>
                            <p>
                                There are a huge number of random generators for virtually anything and everything you can think of on the Internet, but most of these are made to generate specific content. The random word generator generates random words. But what if you have a unique list and you need to pick a specific random entry from that specific list? That's where the Random List Generator comes in. This anything generator is the perfect list randomizer that allows you to input any list you have and it will then pick a random entry from the list.
                            </p>

                            <p>
                                This free online list randomizer tool is easy to use. All you need to do is copy and paste your list into the generator. Once done, choose the appropriate type of list (either each entry separated by a new line or by a comma) and the number of random entries you want to be displayed. Click the button and the number you chose will randomly appear from the list you inserted. It really is that easy. Here are some common ways this random randomizer can be used.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">School Homework Lists</h2>

                            <p>
                                When you're given homework where you have to memorize some type of list, this tool can be the perfect study aid. For example, if part of your science class requires you to memorize the periodic table, you can import the chemical element list. You can then use the list randomizer to study the symbol and the atomic number of each random one displayed. You can use this list generator for any list you need to study at school.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Foreign Language Vocabulary</h2>

                            <p>
                                If you're studying a foreign language, this tool can be an excellent resource. One issue with random foreign language word generators is that the words may not be for the exact level you're at. This isn't a problem with the list generator. Input your current vocabulary lists, click the random generate button and the list randomizer will ensure you have a simple way to study for your next test.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">To-Do Lists</h2>

                            <p>
                                We all have to-do lists and the items on the lists are usually there because you have procrastinated due to not wanting to do them. You stare at the list not being able to decide which one to do out of all the ones that need to be done. One way to jumpstart checking off the items on your to-do list is to have the list randomizer randomly choose the next one you need to complete.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contests</h2>

                            <p>
                                If you're holding a contest and have a long list of names from which you need to pick a winner, why take the extra step of assigning each name a number? It's less time-consuming, and a lot easier, to put the entire list into the generator and have the winner's name come up with a click of your mouse.
                            </p>

                            <p>
                                These are just a few of the many ways this list generator and randomizer can be used. We are interested in how you use it. If you find this tool useful and you want to see it improved, please take a minute to contact us and let us know how you're using it. The more we know about how it is being used, the easier it is for us to improve it. On that same note, if you know a way that would greatly improve this tool for you, we'd love to hear so we can try and implement your ideas.
                            </p>

                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I use the Random List Generator?</h3>
                                        <p>Simply paste your list into the text area, choose whether items are separated by new lines or commas, select how many random items you want, and click generate.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I pick multiple random items at once?</h3>
                                        <p>Yes! Use the "Number of Items" field to specify how many random items you want to pick from your list.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Will the same item be picked twice?</h3>
                                        <p>No, the generator picks items without replacement, so each item can only appear once per generation.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Is there a limit to how many items I can have in my list?</h3>
                                        <p>There's no practical limit. You can paste lists with hundreds or even thousands of items.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/list" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
