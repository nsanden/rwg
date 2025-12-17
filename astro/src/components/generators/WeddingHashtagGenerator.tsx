import { useState, useEffect } from 'react';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import ItemsDisplay from '../Shared/ItemsDisplay';
import { RefreshCw } from 'lucide-react';

interface WeddingHashtagGeneratorProps {
    basePath?: string;
}

interface WeddingHashtagForm {
    quantity: number;
    date: string;
    types: string[];
    yourFirstName: string;
    yourLastName: string;
    fianceFirstName: string;
    fianceLastName: string;
}

export default function WeddingHashtagGenerator({ basePath = '' }: WeddingHashtagGeneratorProps) {
    const [formData, setFormData] = useState<WeddingHashtagForm>({
        quantity: 1,
        date: new Date().toISOString().split('T')[0],
        types: ['traditional', 'fun'],
        yourFirstName: 'Emma',
        yourLastName: 'Smith',
        fianceFirstName: 'John',
        fianceLastName: 'Davis'
    });

    const [hashtags, setHashtags] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);

    // Load favorites from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('weddingHashtagsFavorites');
            if (saved) {
                setFavorites(JSON.parse(saved));
            }
        }
    }, []);

    // Auto-generate on page load
    useEffect(() => {
        generateHashtags();
    }, []);

    const generateHashtags = async () => {
        // Validation
        if (!formData.yourFirstName.trim() || !formData.yourLastName.trim() ||
            !formData.fianceFirstName.trim() || !formData.fianceLastName.trim()) {
            return;
        }

        setLoading(true);
        setShowLoading(true);
        setShowFavorites(false);

        try {
            const response = await fetch('/api/generate/wedding-hashtags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                setHashtags(data.hashtags);
            }
        } catch (error) {
            console.error('Error generating wedding hashtags:', error);
        } finally {
            setLoading(false);
            setShowLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        generateHashtags();
    };

    const addToFavorites = (hashtag: string) => {
        const updated = [...favorites, hashtag];
        setFavorites(updated);
        localStorage.setItem('weddingHashtagsFavorites', JSON.stringify(updated));
    };

    const removeFromFavorites = (hashtag: string) => {
        const updated = favorites.filter(h => h !== hashtag);
        setFavorites(updated);
        localStorage.setItem('weddingHashtagsFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavorites([]);
        localStorage.setItem('weddingHashtagsFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const copyToClipboard = () => {
        const textToCopy = (showFavorites ? favorites : hashtags).join('\n');
        navigator.clipboard.writeText(textToCopy);
    };

    const resetForm = () => {
        setFormData({
            quantity: 1,
            date: new Date().toISOString().split('T')[0],
            types: ['traditional', 'fun'],
            yourFirstName: '',
            yourLastName: '',
            fianceFirstName: '',
            fianceLastName: ''
        });
        setHashtags([]);
        setShowFavorites(false);
    };

    const handleTypeChange = (type: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            types: checked
                ? [...prev.types, type]
                : prev.types.filter(t => t !== type)
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Wedding Hashtag Generator</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Hashtags:
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min="1"
                                        max="100"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                        Wedding Date:
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hashtag Style:
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { key: 'traditional', label: 'Traditional' },
                                        { key: 'fun', label: 'Fun' },
                                        { key: 'offbeat', label: 'Offbeat' }
                                    ].map(({ key, label }) => (
                                        <label key={key} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.types.includes(key)}
                                                onChange={(e) => handleTypeChange(key, e.target.checked)}
                                                className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="yourFirstName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="yourFirstName"
                                        value={formData.yourFirstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, yourFirstName: e.target.value }))}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="yourLastName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="yourLastName"
                                        value={formData.yourLastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, yourLastName: e.target.value }))}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fianceFirstName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Fiancé's First Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="fianceFirstName"
                                        value={formData.fianceFirstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fianceFirstName: e.target.value }))}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fianceLastName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Fiancé's Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="fianceLastName"
                                        value={formData.fianceLastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fianceLastName: e.target.value }))}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-2 sm:px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center font-medium"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2" />
                                            Generate Wedding Hashtags
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
                    <div className="flex flex-col gap-4">
                        <ItemsDisplay
                            items={hashtags}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={formData.quantity}
                            loading={showLoading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                            clearAllFavorites={clearAllFavorites}
                            itemName="hashtags"
                        />

                        {/* Honeymoon promo */}
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <p className="text-gray-700">
                                Ready to plan your honeymoon?<br />
                                My wife Cindi Sanden at{' '}
                                <a
                                    href="https://awakentravels.com/"
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Awaken Travels
                                </a>
                                {' '}can help!
                            </p>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_355px] gap-8">
                        {/* Left Column - Article Content */}
                        <ArticleContent>
                            <p>
                                For those planning a wedding, one of the most important decisions in the age of social media is <a href="https://hashtagpicker.com/perfect-wedding-hashtag" className="text-blue-600 hover:text-blue-800">what wedding hashtag to use</a>. Creating a hashtag specifically for your wedding is a wonderful way to connect all the guests who will attend the wedding. It will also make it easy to share information with guests and to let guests share photos to everyone who attends instead of just the bride and groom. With hashtags becoming a more important aspect of weddings today, we have created the wedding hashtag generator to make it easy to find the perfect one for you and your event.
                            </p>

                            <p>
                                Creating a hashtag with our generator is simple. All you need to do is complete several fields, then click on the "generate" button to use the wedding hashtag generator. This is the information needed to create the hashtags:
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">The Wedding Date</h2>

                            <p>
                                Using the wedding date in your hashtag has several benefits. If both you and your fiance have fairly common names, this is an easy way to differentiate your wedding hashtag from others who have the same or similar name. Including the date is also a friendly reminder to all your guests of the exact date of your wedding as you post information about the upcoming event.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Type of Hashtag</h2>

                            <p>
                                The generator allows you to choose between three different types of hashtags depending on the personality of you and your fiance. The choices are:
                            </p>

                            <ul className="list-disc list-inside my-4 text-gray-700">
                                <li>Traditional</li>
                                <li>Fun</li>
                                <li>Offbeat</li>
                            </ul>

                            <p>
                                Depending on the which you choose, the generator will use the information input to create different feeling hashtags. If you aren't 100% sure what type you want, it can be fun to experiment with the different types to find which style works best for your needs.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Your First and Last Name</h2>

                            <p>
                                You need to fill in your first and last name, but you have a bit of leeway here. You can go formal and input your formal name, or you can be more informal and list a nickname or the name by which most people call you. Choose what best fits your personality and the wedding event.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Your Fiance's First and Last Name</h2>

                            <p>
                                Just as you enter your own name, you need to enter the first and last name of your fiance. Again, you can go formal or informal depending on which better fits your wedding. It probably makes sense to stay consistent whichever you choose. That is, if you decide to use informal for your name, you would want to do the same with your fiance since mixing formal and informal in a hashtag can end up being a bit strange.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Use for Inspiration</h2>

                            <p>
                                Don't limit yourself to just the generated hashtags. These hashtags should be looked at as inspiration so you can create the best wedding hashtag possible for your specific event. You should look at what's generated, then take the best ideas from them. By incorporating the parts you like best from a variety of hashtags the generator produces, you should be able to create the perfect wedding hashtag for your special event.
                            </p>

                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I create a unique wedding hashtag?</h3>
                                        <p>Enter your names and your fiance's names, select a hashtag style, and click generate. The tool will create personalized hashtags based on your information.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Should I include the wedding date in my hashtag?</h3>
                                        <p>Including the date can help differentiate your hashtag from others with similar names and serves as a reminder for guests about when the wedding is.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">What's the difference between Traditional, Fun, and Offbeat styles?</h3>
                                        <p>Traditional hashtags are more formal and classic. Fun hashtags are playful and lighthearted. Offbeat hashtags are quirky and unconventional.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I modify the generated hashtags?</h3>
                                        <p>Absolutely! The generated hashtags are meant to inspire you. Feel free to take elements from different suggestions to create your perfect wedding hashtag.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/wedding-hashtags" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
