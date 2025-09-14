import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import GeneratorLayout from '@/Layouts/GeneratorLayout';
import WordGeneratorForm from '@/Components/Homepage/WordGeneratorForm';
import WordsDisplay from '@/Components/Homepage/WordsDisplay';
import ArticleContent from '@/Components/Homepage/ArticleContent';
import OtherGenerators from '@/Components/Homepage/OtherGenerators';
import AdSpace from '@/Components/AdSpace';

interface HomepageProps {
    auth: {
        user: any;
    };
}

export default function Homepage({ auth }: HomepageProps) {
    const [words, setWords] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);

    // Form state
    const [quantity, setQuantity] = useState(1);
    const [wordType, setWordType] = useState('all');
    const [language, setLanguage] = useState('es');
    const [firstLetter, setFirstLetter] = useState('');
    const [lastLetter, setLastLetter] = useState('');
    const [wordSizeType, setWordSizeType] = useState('');
    const [comparing, setComparing] = useState('equals');
    const [count, setCount] = useState(5);

    const generateWords = async () => {
        setLoading(true);
        try {
            const mockWords = [
                'serendipity', 'ephemeral', 'wanderlust', 'mellifluous', 'ineffable',
                'petrichor', 'solitude', 'luminous', 'cascade', 'whisper',
                'harmony', 'reverie', 'tranquil', 'radiant', 'mystique',
                'eloquent', 'pristine', 'enigma', 'velvet', 'crimson',
                'adventure', 'brilliant', 'delightful', 'fascinating', 'gorgeous'
            ];

            const shuffled = mockWords.sort(() => Math.random() - 0.5);
            const selectedWords = shuffled.slice(0, quantity);

            setWords(selectedWords);
        } catch (error) {
            console.error('Error generating words:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateWords();
    }, []);

    const addToFavorites = (word: string) => {
        if (!favorites.includes(word)) {
            setFavorites([...favorites, word]);
            toast.success(`"${word}" added to favorites!`);
        } else {
            toast.error(`"${word}" is already in favorites`);
        }
    };

    const removeFromFavorites = (word: string) => {
        setFavorites(favorites.filter(fav => fav !== word));
        toast.success(`"${word}" removed from favorites!`);
    };

    const copyToClipboard = () => {
        const text = showFavorites ? favorites.join('\n') : words.join('\n');
        navigator.clipboard.writeText(text);
        const count = showFavorites ? favorites.length : words.length;
        toast.success(`${count} word${count !== 1 ? 's' : ''} copied to clipboard!`);
    };

    const resetOptions = () => {
        setQuantity(1);
        setWordType('all');
        setLanguage('es');
        setFirstLetter('');
        setLastLetter('');
        setWordSizeType('');
        setComparing('equals');
        setCount(5);
    };

    return (
        <GeneratorLayout user={auth.user}>
            <Head title="Random Word Generator - Generate Random Words for Creative Ideas" />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Top Banner Ad */}
                    <AdSpace
                        adId="div-gpt-ad-1586096937154-0"
                        className="mb-12 google-ad-container morethan728px"
                        style={{ height: '250px', maxWidth: '970px', margin: '0 auto 3rem auto' }}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Options Panel - Left Column */}
                        <WordGeneratorForm
                            quantity={quantity}
                            setQuantity={setQuantity}
                            wordType={wordType}
                            setWordType={setWordType}
                            language={language}
                            setLanguage={setLanguage}
                            firstLetter={firstLetter}
                            setFirstLetter={setFirstLetter}
                            lastLetter={lastLetter}
                            setLastLetter={setLastLetter}
                            wordSizeType={wordSizeType}
                            setWordSizeType={setWordSizeType}
                            comparing={comparing}
                            setComparing={setComparing}
                            count={count}
                            setCount={setCount}
                            showMoreOptions={showMoreOptions}
                            setShowMoreOptions={setShowMoreOptions}
                            loading={loading}
                            generateWords={generateWords}
                            resetOptions={resetOptions}
                        />

                        {/* Results Panel - Right Column */}
                        <WordsDisplay
                            words={words}
                            favorites={favorites}
                            showFavorites={showFavorites}
                            setShowFavorites={setShowFavorites}
                            quantity={quantity}
                            loading={loading}
                            addToFavorites={addToFavorites}
                            removeFromFavorites={removeFromFavorites}
                            copyToClipboard={copyToClipboard}
                        />
                    </div>

                    {/* Middle Mobile Ad */}
                    <div className="lg:hidden mb-8">
                        <AdSpace
                            adId="div-gpt-ad-1578531360465-0"
                            className="google-ad-container lessthan970px"
                            style={{ height: '280px', maxWidth: '336px', margin: '0 auto' }}
                        />
                    </div>

                    {/* About Section */}
                    <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                            {/* Left Column - Article Content */}
                            <ArticleContent />

                            {/* Right Column - Other Random Generators */}
                            <div>
                                <OtherGenerators />

                                {/* Bottom Sidebar Ad */}
                                <div className="mt-5">
                                    <AdSpace
                                        adId="div-gpt-ad-1378532080619-0"
                                        className="google-ad-container"
                                        style={{ height: '600px', maxWidth: '336px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Banner Desktop */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="hidden lg:block">
                    <AdSpace
                        adId="div-gpt-ad-1586097229156-0"
                        className="google-ad-container morethan728px"
                        style={{ height: '250px', maxWidth: '970px', margin: '0 auto' }}
                    />
                </div>

                {/* Bottom Mobile Ad */}
                <div className="lg:hidden">
                    <AdSpace
                        adId="div-gpt-ad-1578531621024-0"
                        className="google-ad-container lessthan970px"
                        style={{ height: '280px', maxWidth: '336px', margin: '0 auto' }}
                    />
                </div>
            </div>
            {/* Large Desktop Vertical Banners - Only show on very wide screens */}
            <div className="fixed top-12 left-0 h-96 hidden 2xl:block">
                <AdSpace
                    adId="div-gpt-ad-1594596253835-0"
                    className="google-ad-container"
                    style={{ width: '160px', height: '600px' }}
                />
            </div>

            <div className="fixed top-12 right-0 h-96 hidden 2xl:block">
                <AdSpace
                    adId="div-gpt-ad-1594596361194-0"
                    className="google-ad-container"
                    style={{ width: '160px', height: '600px' }}
                />
            </div>
        </GeneratorLayout>
    );
}