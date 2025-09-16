import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import { Heart, Copy } from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import toast from 'react-hot-toast';

interface WeddingHashtagForm {
    quantity: number;
    date: string;
    types: string[];
    yourFirstName: string;
    yourLastName: string;
    fianceFirstName: string;
    fianceLastName: string;
}

export default function WeddingHashtags() {
    const [formData, setFormData] = useState<WeddingHashtagForm>({
        quantity: 5,
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
    const [favorites, setFavorites] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('weddingHashtagsFavorites');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);

    // Auto-generate on page load like legacy site
    useEffect(() => {
        generateHashtags();
    }, []); // Empty dependency array means this runs once on mount

    const generateHashtags = async (e?: FormEvent) => {
        if (e) {
            e.preventDefault();
        }

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
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
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
        navigator.clipboard.writeText(textToCopy).then(() => {
            const count = showFavorites ? favorites.length : hashtags.length;
            toast.success(`Copied ${count} wedding hashtag${count !== 1 ? 's' : ''} to clipboard!`);
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    };

    const resetForm = () => {
        setFormData({
            quantity: 5,
            date: new Date().toISOString().split('T')[0],
            types: ['traditional', 'fun'],
            yourFirstName: '',
            yourLastName: '',
            fianceFirstName: '',
            fianceLastName: ''
        });
        setHashtags([]);
        setShowFavorites(false);
        toast.success('Options reset to defaults');
    };

    const handleTypeChange = (type: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            types: checked
                ? [...prev.types, type]
                : prev.types.filter(t => t !== type)
        }));
    };

    const formPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Wedding Hashtag Generator</h2>
            <form onSubmit={generateHashtags} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Hashtags:
                        </label>
                        <select
                            id="quantity"
                            value={formData.quantity}
                            onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
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
                            <label key={key} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.types.includes(key)}
                                    onChange={(e) => handleTypeChange(key, e.target.checked)}
                                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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

                <div className="flex gap-2 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Generating...' : 'Generate Wedding Hashtags'}
                    </button>
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );

    const resultsPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end gap-2 flex-wrap mb-4">
                {favorites.length > 0 && (
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        aria-pressed={showFavorites}
                    >
                        {showFavorites ? (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                        ) : (
                            <>
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                                ({favorites.length})
                            </>
                        )}
                    </button>
                )}
                <button
                    onClick={copyToClipboard}
                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded"
                >
                    <Copy className="w-5 h-5" />
                </button>
            </div>

            {showLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div>
                    <p className="mt-2 text-gray-600">Creating perfect wedding hashtags...</p>
                </div>
            ) : (
                <>
                    {(showFavorites ? favorites : hashtags).length > 0 ? (
                        <div className="space-y-3">
                            {(showFavorites ? favorites : hashtags).map((hashtag, index) => {
                                const isFavorite = favorites.includes(hashtag);
                                return (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                        <span className="text-lg font-mono text-blue-600 flex-1 mr-4">{hashtag}</span>
                                        <button
                                            onClick={() => isFavorite ? removeFromFavorites(hashtag) : addToFavorites(hashtag)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {showFavorites
                                ? 'No favorite hashtags yet. Add some by clicking the heart button on hashtags you like!'
                                : 'Fill out the form above to generate wedding hashtags.'
                            }
                        </div>
                    )}

                    {favorites.length > 0 && showFavorites && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={clearAllFavorites}
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                            >
                                Clear All Favorites
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    const articleContent = (
        <>
            <p>For those planning a wedding, one of the most important decisions in the age of social media is <a href="https://hashtagpicker.com/perfect-wedding-hashtag" className="text-blue-600 hover:text-blue-800">what wedding hashtag to use</a>. Creating a hashtag specifically for your wedding is a wonderful way to connect all the guests who will attend the wedding. It will also make it easy to share information with guests and to let guests share photos to everyone who attends instead of just the bride and groom. With hashtags becoming a more important aspect of weddings today, we have created the wedding hashtag generator to make it easy to find the perfect one for you and your event.</p>

            <p>Creating a hashtag with our generator is simple. All you need to do is complete several fields, then click on the "generate" button to use the wedding hashtag generator. This is the information needed to create the hashtags:</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">The Wedding Date</h2>
            <p>Using the wedding date in your hashtag has several benefits. If both you and your fiance have fairly common names, this is an easy way to differentiate your wedding hashtag from others who have the same or similar name. Including the date is also a friendly reminder to all your guests of the exact date of your wedding as you post information about the upcoming event.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Type of Hashtag</h2>
            <p>The generator allows you to choose between three different types of hashtags depending on the personality of you and your fiance. The choices are:</p>
            <ul className="list-disc list-inside my-4 text-gray-700">
                <li>Traditional</li>
                <li>Fun</li>
                <li>Offbeat</li>
            </ul>
            <p>Depending on the which you choose, the generator will use the information input to create different feeling hashtags. If you aren't 100% sure what type you want, it can be fun to experiment with the different types to find which style works best for your needs.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Your First and Last Name</h2>
            <p>You need to fill in your first and last name, but you have a bit of leeway here. You can go formal and input your formal name, or you can be more informal and list a nickname or the name by which most people call you. Choose what best fits your personality and the wedding event.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Your Fiance's First and Last Name</h2>
            <p>Just as you enter your own name, you need to enter the first and last name of your fiance. Again, you can go formal or informal depending on which better fits your wedding. It probably makes sense to stay consistent whichever you choose. That is, if you decide to use informal for your name, you would want to do the same with your fiance since mixing formal and informal in a hashtag can end up being a bit strange.</p>

            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-800">Use for Inspiration</h2>
            <p>Don't limit yourself to just the generated hashtags. These hashtags should be looked at as inspiration so you can create the best wedding hashtag possible for your specific event. You should look at what's generated, then take the best ideas from them. By incorporating the parts you like best from a variety of hashtags the generator produces, you should be able to create the perfect wedding hashtag for your special event.</p>
        </>
    );

    return (
        <>
            <SEO
                title="Wedding Hashtag Generator - Create Perfect Wedding Hashtags"
                description="Generate unique wedding hashtags for your special day. Choose from traditional, fun, or offbeat styles to create memorable hashtags for social media."
            />
            <GeneratorPageLayout
                title="Wedding Hashtag Generator - Create Perfect Wedding Hashtags"
                currentPage="/wedding-hashtags.php"
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
