import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { Heart, Copy } from 'lucide-react';
import { useState } from 'react';

export default function BooksEveryoneShouldRead() {
    const {
        items,
        loading,
        showLoading,
        quantity,
        setQuantity,
        generateItems,
        copyToClipboard,
    } = useGenerator({
        autoGenerate: true,
        favoritesKey: 'booksEveryoneShouldReadFavorites',
        apiEndpoint: '/api/generate/books-everyone-should-read',
        itemName: 'books'
    });

    // Custom favorites state for book objects
    const [favoriteBooks, setFavoriteBooks] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('booksEveryoneShouldReadFavorites');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);

    const addToFavorites = (book: any) => {
        const updated = [...favoriteBooks, book];
        setFavoriteBooks(updated);
        localStorage.setItem('booksEveryoneShouldReadFavorites', JSON.stringify(updated));
    };

    const removeFromFavorites = (bookKey: string) => {
        const updated = favoriteBooks.filter(book => `${book.title}-${book.author}` !== bookKey);
        setFavoriteBooks(updated);
        localStorage.setItem('booksEveryoneShouldReadFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavoriteBooks([]);
        localStorage.setItem('booksEveryoneShouldReadFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const handleGenerateBooks = () => {
        setShowFavorites(false);
        generateItems({
            quantity
        });
    };

    const formState = useGeneratorForm({
        wordType: 'books',
        onGenerate: handleGenerateBooks,
        setShowFavorites,
        setQuantity
    });

    const articleContent = (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>For those who love books and reading, this generator helps discover must-read books. The tool contains hundreds of top-quality recommended books that appear on various "books everyone should read" lists.</p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Picking Your Next Book</h2>
            <p>One common use is helping choose the next book to read. Since every book in the generator is considered top quality, users can:</p>
            <ul className="list-disc ml-6 space-y-2">
                <li>Generate a single random book using the "I'm Feeling Lucky" method</li>
                <li>Continue generating books until finding an unread title</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Exploring and Discovering</h2>
            <p>The tool is excellent for exploring top books and discovering new reading material. With hundreds of recommended books, users can:</p>
            <ul className="list-disc ml-6 space-y-2">
                <li>Quickly compile a quality reading list</li>
                <li>Discover new books by spending time with the generator</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Surprise Reading Lists</h2>
            <p>Users can create reading lists for themselves, book clubs, or friends by:</p>
            <ul className="list-disc ml-6 space-y-2">
                <li>Generating a random list of books for a specific time period</li>
                <li>Ensuring variety and surprise by using random selection</li>
            </ul>

            <p>The generator offers flexibility in how users discover and select books, making reading selection more engaging and spontaneous.</p>
        </div>
    );

    const faqs = [
        {
            question: "How were these books selected?",
            answer: "These books were selected based on their literary significance, cultural impact, critical acclaim, and enduring popularity. The list includes works that are widely considered essential reading by literary critics, educators, and readers worldwide."
        },
        {
            question: "Are these books suitable for all ages?",
            answer: "The selection includes books for various reading levels and maturity. Some classics contain mature themes or complex language. We recommend researching individual books to determine if they're appropriate for your age or reading level."
        },
        {
            question: "Can I find these books easily?",
            answer: "Yes, most of these books are widely available through bookstores, libraries, and online retailers. Many classics are in the public domain and available for free through services like Project Gutenberg."
        },
        {
            question: "Should I read these books in any particular order?",
            answer: "There's no required reading order. Choose books that interest you or align with your current mood and reading goals. Some readers prefer alternating between genres or time periods for variety."
        },
        {
            question: "What if I don't enjoy classics or 'must-read' books?",
            answer: "Reading should be enjoyable! While these books are considered important, not every book will resonate with every reader. Use this list as a guide, but always prioritize books that genuinely interest you. The best book is the one you'll actually read and enjoy."
        }
    ];

    const formPanel = (
        <BaseGeneratorForm
            title="Random Books Generator"
            itemName="Books"
            quantity={quantity}
            setQuantity={setQuantity}
            loading={loading}
            showLetterFilters={false}
            showSizeFilter={false}
            onGenerate={formState.handleGenerate}
            onReset={formState.resetOptions}
            {...formState}
        />
    );

    const resultsPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                {favoriteBooks.length > 0 && (
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        aria-pressed={showFavorites}
                        aria-label={showFavorites ? 'Switch to view generated books' : `Switch to view saved favorites (${favoriteBooks.length} books)`}
                    >
                        {showFavorites ? (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" aria-hidden="true" />
                        ) : (
                            <>
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" aria-hidden="true" />
                                ({favoriteBooks.length})
                            </>
                        )}
                    </button>
                )}
                <button
                    onClick={copyToClipboard}
                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded touch-manipulation"
                    aria-label={`Copy ${showFavorites ? favoriteBooks.length + ' favorite' : items.length + ' generated'} books to clipboard`}
                >
                    <Copy className="w-5 h-5 transition-colors" aria-hidden="true" />
                </button>
            </div>

            {showLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div>
                    <p className="mt-2 text-gray-600">Finding book recommendations...</p>
                </div>
            ) : (
                <>
                    {(showFavorites ? favoriteBooks : items).length > 0 ? (
                        <div className={`grid gap-4 ${
                            (showFavorites ? favoriteBooks : items).length === 1
                                ? 'grid-cols-1 max-w-3xl mx-auto'
                                : 'grid-cols-1'
                        }`}>
                            {(showFavorites ? favoriteBooks : items).map((item: any, index: number) => {
                                const bookKey = `${item.title}-${item.author}`;
                                const bookTitle = item.title;
                                const bookAuthor = item.author;
                                const bookImage = item.image;
                                const isFavorite = favoriteBooks.some(fav => `${fav.title}-${fav.author}` === bookKey);
                                const isSingle = (showFavorites ? favoriteBooks : items).length === 1;

                                return (
                                    <div key={bookKey} className={`flex items-center gap-6 p-6 bg-gray-50 rounded-lg ${
                                        isSingle ? 'justify-center' : ''
                                    }`}>
                                        {bookImage && (
                                            <img
                                                src={bookImage}
                                                alt={bookTitle}
                                                className={`object-cover rounded flex-shrink-0 ${
                                                    isSingle ? 'w-24 h-36' : 'w-16 h-24'
                                                }`}
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className={`font-semibold text-gray-800 ${
                                                isSingle ? 'text-2xl' : 'text-base'
                                            }`}>{bookTitle}</div>
                                            {bookAuthor && <div className={`text-gray-600 ${
                                                isSingle ? 'text-lg mt-2' : 'text-sm'
                                            }`}>by {bookAuthor}</div>}
                                        </div>
                                        <button
                                            onClick={() => isFavorite ? removeFromFavorites(bookKey) : addToFavorites(item)}
                                            className="ml-4 text-gray-400 hover:text-red-500 transition-colors flex items-center flex-shrink-0"
                                            aria-label={isFavorite ? `Remove "${bookTitle}" from favorites` : `Add "${bookTitle}" to favorites`}
                                        >
                                            <Heart className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''} ${
                                                isSingle ? 'w-7 h-7' : 'w-5 h-5'
                                            }`} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {showFavorites ? 'No favorite books yet. Add some by clicking the heart button on books you like!' : 'Click "Generate Books" to get book recommendations.'}
                        </div>
                    )}

                    {favoriteBooks.length > 0 && showFavorites && (
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
    );

    return (
        <>
            <SEO
                title="Random Books Everyone Should Read Generator - Must-Read Book Recommendations"
                description="Discover essential books everyone should read with our random book generator. Get personalized recommendations from classic literature to modern must-reads."
            />

            <GeneratorPageLayout
                title="Random Books Everyone Should Read Generator"
                currentPage="books-everyone-should-read"
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