import React, { useState } from 'react';
import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { Heart, Copy, Printer } from 'lucide-react';

interface ColoringPage {
    value: string;
    image_url: string;
}

export default function ColoringPages() {
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
        favoritesKey: 'coloringPagesFavorites',
        apiEndpoint: '/api/generate/coloring-pages',
        itemName: 'coloring pages',
        transformResponse: (data: any) => {
            return data.coloring_pages || [];
        }
    });

    const coloringPages = items as unknown as ColoringPage[];

    // Custom favorites state for coloring page objects
    const [favoritePages, setFavoritePages] = useState<ColoringPage[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('coloringPagesFavorites');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);

    const addToFavorites = (page: ColoringPage) => {
        const updated = [...favoritePages, page];
        setFavoritePages(updated);
        localStorage.setItem('coloringPagesFavorites', JSON.stringify(updated));
    };

    const removeFromFavorites = (pageValue: string) => {
        const updated = favoritePages.filter(p => p.value !== pageValue);
        setFavoritePages(updated);
        localStorage.setItem('coloringPagesFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavoritePages([]);
        localStorage.setItem('coloringPagesFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const handleGenerateColoringPages = () => {
        setShowFavorites(false);
        generateItems({
            quantity
        });
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'coloring-pages',
        onGenerate: handleGenerateColoringPages,
        setShowFavorites,
        setQuantity
    });

    const printPage = (page: ColoringPage) => {
        const imageUrl = page.image_url?.replace('/img/drawing-ideas-generator/', '/img/coloring-pages/') || '';
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Coloring Page: ${page.value}</title>
                        <style>
                            body { margin: 0; padding: 20px; text-align: center; font-family: Arial, sans-serif; }
                            h1 { font-size: 24px; margin-bottom: 20px; }
                            img { max-width: 100%; height: auto; }
                            @media print {
                                body { margin: 0; padding: 10px; }
                                h1 { margin-bottom: 10px; }
                            }
                        </style>
                    </head>
                    <body>
                        <h1>${page.value}</h1>
                        <img src="${imageUrl}" alt="${page.value} coloring page" onload="window.print(); window.close();" />
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const seoData = {
        title: "Random Coloring Pages Generator - Free Printable Coloring Pages",
        description: "Generate random coloring pages instantly! Perfect for kids, relaxation, and creative activities. Print-friendly coloring pages with various themes and difficulty levels.",
        keywords: "coloring pages, printable coloring pages, random coloring pages, kids coloring, adult coloring, free coloring pages, coloring book generator",
        url: "https://randomwordgenerator.com/coloring-pages",
    };

    const articleContent = (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
                We're happy that you found your way to our little spot on the Internet. If you ended up here because you
                were looking for coloring pages, you may have found the perfect tool. There are going to be times in
                your life when you just want to color and when those moments hit, this is the perfect generator for you.
            </p>

            <p>
                The random coloring page generator will display a random coloring page each time you refresh the page.
                While the default of the generator is one, you do have the option to decide how many pictures get
                displayed with each click. For example, if you wanted five different coloring picture pages to show up
                each time, you would set the number of pictures to five. Then all you do is click the generate button
                and five random coloring picture pages (or however many you chose to display) will appear. You also have
                the option to print each coloring page so you can get right to coloring.
            </p>

            <p>
                If you really want to see if this generator is something that would be useful for what you had in mind,
                the best course of action is to play with it a little while. Sit down and click through a number of
                random coloring pages and see what results you get. It shouldn't take too long for you to figure out if
                the random coloring pages would be useful to you. If you find that they are, you have found a great
                little spot on the Internet to visit every time the urge to color hits you.
            </p>

            <p>
                If you're still not sure if random coloring pages is something that could be useful to you, below you
                can see some of the more common ways this generator typically gets used by others. By seeing how others
                use it, you may find some creative ways to use it yourself that you hadn't considered.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Project for Kids</h2>

            <p>
                If you're looking for a fun project for kids to do to keep them occupied, this random coloring page tool
                can be a fun way to do it. The kids can watch a random picture appear and then in the next moment sit
                down to color it. Since each result is random, they're never sure what they will see next to color. It's
                a fun little game that brings a little extra excitement to coloring.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Relaxation</h2>

            <p>
                One of the best ways to relax and reduce your overall anxiety and stress is to color. It doesn't have to
                be a complex coloring page. Even simple coloring pages will help you relax. The mind has to focus on the
                act of coloring which helps turn off parts of the brain that produce anxiety so that your stress levels
                decrease. Coloring a page is a lot like meditation in the way it can calm your mind and soul.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Improve Focus</h2>

            <p>
                Sitting down to color a page can be the perfect way to refocus so that you can be more productive for
                the rest of the day. One of the great things about coloring is that it helps you focus, but it does so
                in a way that isn't stressful at the same time. Coloring has been shown to increase activity in your
                frontal lobe which is where the centers for organizing and problem solving reside. By sitting down and
                coloring, you activate this part of your brain so that you are able to relax and focus better going
                forward.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Better Sleep</h2>

            <p>
                One of the great benefits of coloring is to help you relax, and that's something that is essential when
                you're ready to go to sleep. Coloring a picture can be the perfect way for your to get ready for bed
                each night. The act of coloring a page will help your mind relax so that you are able to get a good
                night's sleep instead of thinking about everything that happened during the day.
            </p>

            <p>
                We hope that you've taken the time to explore the random coloring page generator and have found it
                useful. If you have any suggestions on how we might make this coloring page generator better, we'd love
                for you to contact us and let us know. We are always striving to improve our generators and one of the
                best ways to do that is to hear suggestions from those who are using them. We hope with your suggestions
                we can continue to improve this coloring page tool and make it the best that it can be.
            </p>
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Random Coloring Pages Generator"
            itemName="Coloring Pages"
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

    const ColoringPageCard = ({ page, index }: { page: ColoringPage; index: number }) => {
        const imageUrl = page.image_url?.replace('/img/drawing-ideas-generator/', '/img/coloring-pages/') || '';
        const isFavorite = favoritePages.some(fav => fav.value === page.value);

        return (
            <div className="text-center">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-2xl text-gray-800 flex-1 text-center">
                        {page.value}
                    </h3>
                    <div className="flex items-center gap-2 ml-2">
                        <button
                            onClick={() => printPage(page)}
                            className="text-gray-400 hover:text-blue-600 transition-colors flex items-center"
                            aria-label={`Print "${page.value}" coloring page`}
                        >
                            <Printer className="w-6 h-6 transition-colors" />
                        </button>
                        <button
                            onClick={() => isFavorite ? removeFromFavorites(page.value) : addToFavorites(page)}
                            className="text-gray-400 hover:text-red-500 transition-colors flex items-center"
                            aria-label={isFavorite ? `Remove "${page.value}" from favorites` : `Add "${page.value}" to favorites`}
                        >
                            <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                    </div>
                </div>
                {imageUrl && (
                    <div>
                        <img
                            src={imageUrl}
                            alt={`${page.value} coloring page`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                objectFit: 'contain',
                                margin: '0 auto',
                                display: 'block',
                                cursor: 'pointer'
                            }}
                            onClick={() => window.open(imageUrl, '_blank')}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                )}
            </div>
        );
    };

    const resultsPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                {favoritePages.length > 0 && (
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        aria-pressed={showFavorites}
                        aria-label={showFavorites ? 'Switch to view generated coloring pages' : `Switch to view saved favorites (${favoritePages.length} coloring pages)`}
                    >
                        {showFavorites ? (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" aria-hidden="true" />
                        ) : (
                            <>
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" aria-hidden="true" />
                                ({favoritePages.length})
                            </>
                        )}
                    </button>
                )}
                <button
                    onClick={copyToClipboard}
                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded touch-manipulation"
                    aria-label={`Copy ${showFavorites ? favoritePages.length + ' favorite' : coloringPages.length + ' generated'} coloring pages to clipboard`}
                >
                    <Copy className="w-5 h-5 transition-colors" aria-hidden="true" />
                </button>
            </div>

            {showLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div>
                    <p className="mt-2 text-gray-600">Finding coloring pages...</p>
                </div>
            ) : (
                <>
                    {(showFavorites ? favoritePages : coloringPages).length > 0 ? (
                        <div className={`grid gap-6 ${
                            (showFavorites ? favoritePages : coloringPages).length === 1
                                ? 'grid-cols-1 max-w-sm mx-auto'
                                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        }`}>
                            {(showFavorites ? favoritePages : coloringPages).map((page, index) => (
                                <ColoringPageCard
                                    key={page.value}
                                    page={page}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {showFavorites ? 'No favorite coloring pages yet. Add some by clicking the heart button on pages you like!' : 'Click "Generate Coloring Pages" to get random coloring pages.'}
                        </div>
                    )}

                    {favoritePages.length > 0 && showFavorites && (
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
            <SEO {...seoData} />
            <GeneratorPageLayout
                title="Random Coloring Pages Generator"
                currentPage="/coloring-pages.php"
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