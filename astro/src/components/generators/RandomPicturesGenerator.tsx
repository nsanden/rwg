import { useState, useEffect } from 'react';
import BaseGeneratorForm from '../Forms/BaseGeneratorForm';
import OtherGenerators from '../Shared/OtherGenerators';
import ArticleContent from '../Shared/ArticleContent';
import { useGeneratorForm } from '../../hooks/useGeneratorForm';
import { Heart, Copy } from 'lucide-react';

interface RandomPicturesGeneratorProps {
    basePath?: string;
}

interface RandomPicture {
    image_url: string;
    description: string;
    url: string;
}

const CATEGORIES = [
    { value: 'all', label: 'All' },
    { value: 'car', label: 'Cars' },
    { value: 'cat', label: 'Cats' },
    { value: 'dog', label: 'Dogs' },
    { value: 'dragon', label: 'Dragons' },
    { value: 'flower', label: 'Flowers' },
    { value: 'lion', label: 'Lions' },
    { value: 'love', label: 'Love' },
    { value: 'national-park', label: 'National Parks' },
    { value: 'people', label: 'People' },
];

export default function RandomPicturesGenerator({ basePath = '' }: RandomPicturesGeneratorProps) {
    const [pictures, setPictures] = useState<RandomPicture[]>([]);
    const [loading, setLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState('all');
    const [showFavorites, setShowFavorites] = useState(false);
    const [favoritePictures, setFavoritePictures] = useState<RandomPicture[]>([]);

    // Load favorites from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('randomPicturesFavorites');
            if (saved) {
                setFavoritePictures(JSON.parse(saved));
            }
        }
    }, []);

    const generatePictures = async () => {
        setLoading(true);
        setShowLoading(true);
        setShowFavorites(false);

        try {
            const response = await fetch(`/api/generate/pictures?quantity=${quantity}&category=${category}`);
            const data = await response.json();
            setPictures(data.pictures || []);
        } catch (error) {
            console.error('Error generating pictures:', error);
        } finally {
            setLoading(false);
            setTimeout(() => setShowLoading(false), 300);
        }
    };

    // Auto-generate on mount
    useEffect(() => {
        generatePictures();
    }, []);

    const addToFavorites = (picture: RandomPicture) => {
        const updated = [...favoritePictures, picture];
        setFavoritePictures(updated);
        localStorage.setItem('randomPicturesFavorites', JSON.stringify(updated));
    };

    const removeFromFavorites = (pictureUrl: string) => {
        const updated = favoritePictures.filter(p => p.image_url !== pictureUrl);
        setFavoritePictures(updated);
        localStorage.setItem('randomPicturesFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavoritePictures([]);
        localStorage.setItem('randomPicturesFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const copyToClipboard = () => {
        const items = showFavorites ? favoritePictures : pictures;
        const text = items.map(p => p.description).join('\n');
        navigator.clipboard.writeText(text);
    };

    const formState = useGeneratorForm({
        wordType: 'pictures',
        onGenerate: generatePictures,
        setShowFavorites,
        setQuantity
    });

    const PictureCard = ({ picture }: { picture: RandomPicture }) => {
        // image_url now comes with full path from API
        const imageUrl = picture.image_url;
        const isFavorite = favoritePictures.some(fav => fav.image_url === picture.image_url);

        return (
            <div className="text-center bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-800 flex-1 text-center">
                        {picture.description}
                    </h3>
                    <button
                        onClick={() => isFavorite ? removeFromFavorites(picture.image_url) : addToFavorites(picture)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center ml-2 cursor-pointer"
                        aria-label={isFavorite ? `Remove "${picture.description}" from favorites` : `Add "${picture.description}" to favorites`}
                    >
                        <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                </div>
                <div className="mb-3">
                    <img
                        src={imageUrl}
                        alt={picture.description}
                        className="w-full h-64 object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(imageUrl, '_blank')}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            </div>
        );
    };

    const categoryOptions = (
        <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700">Category:</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
                {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <BaseGeneratorForm
                        title="Random Picture Generator"
                        itemName="Pictures"
                        quantity={quantity}
                        setQuantity={setQuantity}
                        loading={loading}
                        showLetterFilters={false}
                        showSizeFilter={false}
                        customOptions={categoryOptions}
                        onGenerate={generatePictures}
                        onReset={() => {
                            setCategory('all');
                            formState.resetOptions();
                        }}
                        {...formState}
                    />

                    {/* Right Column - Results */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                            {favoritePictures.length > 0 && (
                                <button
                                    onClick={() => setShowFavorites(!showFavorites)}
                                    className={`group flex items-center gap-1 text-sm px-3 py-2 rounded cursor-pointer ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                                    aria-pressed={showFavorites}
                                >
                                    {showFavorites ? (
                                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                                    ) : (
                                        <>
                                            <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                                            ({favoritePictures.length})
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={copyToClipboard}
                                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded cursor-pointer"
                                aria-label="Copy picture descriptions to clipboard"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                        </div>

                        {showLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div>
                                <p className="mt-2 text-gray-600">Finding random pictures...</p>
                            </div>
                        ) : (
                            <>
                                {(showFavorites ? favoritePictures : pictures).length > 0 ? (
                                    <div className={`grid gap-6 ${
                                        (showFavorites ? favoritePictures : pictures).length === 1
                                            ? 'grid-cols-1 max-w-md mx-auto'
                                            : 'grid-cols-1 md:grid-cols-2'
                                    }`}>
                                        {(showFavorites ? favoritePictures : pictures).map((picture) => (
                                            <PictureCard
                                                key={picture.image_url}
                                                picture={picture}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        {showFavorites ? 'No favorite pictures yet. Add some by clicking the heart button on pictures you like!' : 'Click "Generate Pictures" to get random images.'}
                                    </div>
                                )}

                                {favoritePictures.length > 0 && showFavorites && (
                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={clearAllFavorites}
                                            className="text-blue-600 hover:text-blue-800 underline text-sm bg-transparent border-none cursor-pointer"
                                        >
                                            Clear All Favorites
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* About Section */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-8">
                        {/* Left Column - Article Content */}
                        <ArticleContent>
                            <p>
                                If you're in search of random pictures, you should love all of the random images we've collected in this random picture generator. With over 1000 pictures in the database, you're sure to find some that meet your particular needs. One of the best aspects of this free image tool is that you can determine the exact number of random pictures you want to see at one time. This allows you to digest the photos in the number that best suits your needs and it can make finding what you want a lot easier.
                            </p>

                            <p>
                                We are constantly expanding this tool by adding specific random picture categories. These categories are geared to a specific topic with only photos of that topic. For example, if you wanted to see random dogs, you would go to the category dropdown and choose "dogs" and then all the random pictures would be of random dogs. If you have a particular category you would like to see us create, feel free to contact us. We hope to one day have hundreds of specific random categories for you to choose from and it's helpful to know which categories you'd like to see.
                            </p>

                            <p>
                                For those who came here and you're not sure whether this random image generator will work for your needs, the best approach is to simply begin using it. You should know pretty quickly if the random images you're getting will be of use, and taking a bit of time to play with the tool will allow you to see the different ways you can adjust it to make it the most useful it can be. It may even show you some opportunities to use it in ways that you had never considered before playing with it. If you're looking for a bit more inspiration, below you can find a number of ways that others typically use this picture generator.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Writing Inspiration</h2>

                            <p>
                                Writers are always looking for different ways to help their creative writing and inspire them to write more. It's common for them to use a <a href={`${basePath}/`} className="text-blue-600 hover:text-blue-800">random word</a>, a <a href={`${basePath}/sentence.php`} className="text-blue-600 hover:text-blue-800">random sentence</a>, or even a <a href={`${basePath}/paragraph.php`} className="text-blue-600 hover:text-blue-800">random paragraph</a> to help with their writing. While all of these options are word-based, a random image is also an excellent way to help that's a bit different that'll make you use your creativity in a different way than with words. The simplest form would be to generate a random picture and then write a paragraph or short story about the image. For those who want to make it a bit more of a challenge, they can use the random picture as inspiration for a paragraph or short story that's somehow related to it, but not a description of it. There are dozens of other ways this can be adapted depending on how difficult you want to make the writing challenge, but the base point is that all will make you use creativity in your writing to get the words on paper.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Artistic Inspiration</h2>

                            <p>
                                These random pictures aren't limited to giving writers inspiration. They can be used by virtually any artistic pursuit in a similar way to also inspire creativity. A musician could use one to create a short piece of music. A painter could use it to practice their sketching. A quilter could use it to inspire a new quilt pattern. No matter what your artistic discipline, using this random image generator can be a wonderful way to begin the day to get your creativity flowing and inspire you to work on your artistic abilities.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Brainstorming</h2>

                            <p>
                                No matter what your group happens to be brainstorming, interjecting random images can be a wonderful way to expand the brainstorming session. There's something about a photo that gives a different perspective to whatever you happen to be brainstorming about. This can unleash new ideas and better define the issues you're tackling with the brainstorming session. Throw a random image into a brainstorming session about a new product idea and watch the creativity soar.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Relaxation</h2>

                            <p>
                                Another wonderful way to use these random images is to simply look at them for relaxation purposes. There's something about looking at photos that can help your mind relax and generating a lot of random pictures can help let your mind wander away from daily life stresses. It's always amazing to see where a random picture will take you depending on your mood and what's going on in your life, but it can often be an excellent way to put all the things in life that are stressing you out onto the back-burner.
                            </p>

                            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Image Placeholder</h2>

                            <p>
                                For those who need to find random images to use as placeholders for the different projects you're creating, this tool can be an excellent source. In fact, using this tool to find image placeholders can add some fun and whimsy to any project. Since the photos aren't your typical landscape, they can add interest to any project. In addition, since all of the images are copyright free and free to use commercially, they can make the perfect image placeholder for all your projects.
                            </p>

                            <p>
                                If you have found this random image generator useful for your purposes, please consider taking a few moments to email us and let us know how you've been using it. While we have a pretty good general idea of how our tools will be used when we create them, we're often surprised to learn of unconventional ways they also end up being used. The better we understand how everyone is using the tool, the better we're able to add features and make adjustments to make it more useful for all.
                            </p>

                            <div className="mt-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Where can I find random pictures?</h3>
                                        <p>Our <a href={`${basePath}/picture.php`} className="text-blue-600 hover:text-blue-800">Random Picture Generator</a> will be able to help you with that! Simply click the Generate Random Picture button and we'll show you one of the hundreds of random pictures in our library.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Where do these random pictures come from?</h3>
                                        <p>We hand-picked some totally random (and somewhat bizarre) pictures from some of the leading free-to-use image/photo websites.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Are these random pictures free to use commercially?</h3>
                                        <p>Luckily, yes! These photos are free to use, no attribution required photos. The photographers of these photos have generously made their photos available for re-use both personally and commercially.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I submit my own pictures to your generator?</h3>
                                        <p>Sure! We just ask that you first upload your picture to a photo sharing website such as <a href="https://pixabay.com" rel="nofollow" className="text-blue-600 hover:text-blue-800">Pixabay</a> or <a href="https://flickr.com" rel="nofollow" className="text-blue-600 hover:text-blue-800">Flickr</a>. Be sure to license your picture appropriately (so we can use it). Once done, simply copy your picture URL to us in an <a href="mailto:info@1s0s.com" className="text-blue-600 hover:text-blue-800">email</a>.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I use these images as placeholders in a website i'm building?</h3>
                                        <p>Yes, of course. Since these photos are free to use, even commercially, you can use them as image placeholders for any website you're building.</p>
                                    </div>
                                </div>
                            </div>
                        </ArticleContent>

                        {/* Right Column - Other Random Generators */}
                        <div>
                            <OtherGenerators currentPage="/picture" basePath={basePath} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
