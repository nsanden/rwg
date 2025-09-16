import React, { useState, useEffect } from 'react';
import SEO from '@/Components/SEO';
import GeneratorPageLayout from '@/Components/Layouts/GeneratorPageLayout';
import BaseGeneratorForm from '@/Components/Forms/BaseGeneratorForm';
import { useGenerator } from '@/hooks/useGenerator';
import { useGeneratorForm } from '@/hooks/useGeneratorForm';
import { Heart, Copy } from 'lucide-react';

interface CodeExample {
    language: string;
    code: string;
    description: string;
}

export default function ComputerCode() {
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
        favoritesKey: 'computerCodeFavorites',
        apiEndpoint: '/api/generate/computer-code',
        itemName: 'code examples',
        transformResponse: (data: any) => {
            return data.code_examples || [];
        }
    });

    const codeExamples = items as unknown as CodeExample[];

    // Custom favorites state
    const [favoriteExamples, setFavoriteExamples] = useState<CodeExample[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('computerCodeFavorites');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);

    // Load Prism.js dynamically
    useEffect(() => {
        const loadPrism = async () => {
            if (typeof window !== 'undefined') {
                const Prism = await import('prismjs');
                // @ts-ignore
                await import('prismjs/components/prism-php');
                // @ts-ignore
                await import('prismjs/components/prism-javascript');
                // @ts-ignore
                await import('prismjs/components/prism-python');
                // @ts-ignore
                await import('prismjs/components/prism-css');
                // @ts-ignore
                await import('prismjs/components/prism-markup');
                await import('prismjs/themes/prism.css');

                // Highlight all code blocks
                Prism.highlightAll();
            }
        };

        loadPrism();
    }, [codeExamples, favoriteExamples, showFavorites]);

    const addToFavorites = (example: CodeExample) => {
        const updated = [...favoriteExamples, example];
        setFavoriteExamples(updated);
        localStorage.setItem('computerCodeFavorites', JSON.stringify(updated));
    };

    const removeFromFavorites = (exampleCode: string) => {
        const updated = favoriteExamples.filter(e => e.code !== exampleCode);
        setFavoriteExamples(updated);
        localStorage.setItem('computerCodeFavorites', JSON.stringify(updated));
    };

    const clearAllFavorites = () => {
        setFavoriteExamples([]);
        localStorage.setItem('computerCodeFavorites', JSON.stringify([]));
        setShowFavorites(false);
    };

    const handleGenerateCode = () => {
        setShowFavorites(false);
        generateItems({
            quantity
        });
    };

    // Use the shared form state management hook
    const formState = useGeneratorForm({
        wordType: 'computer-code',
        onGenerate: handleGenerateCode,
        setShowFavorites,
        setQuantity
    });

    const seoData = {
        title: "Random Computer Code Generator - Code Examples & Snippets",
        description: "Generate random computer code examples in PHP, JavaScript, Python, HTML, and CSS. Perfect for learning, practice, and coding inspiration with syntax highlighting.",
        keywords: "random code generator, code examples, programming snippets, PHP code, JavaScript code, Python code, HTML CSS, coding practice, programming learning",
        url: "https://randomwordgenerator.com/computer-code",
    };

    const articleContent = (
        <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
                If you're looking for random computer code, you've come to the right place. We created the Random
                Computer Code Generator with the express purpose of allowing people to generate random code. Using
                this free online tool is easy. All you need to do is choose whether you want to see PHP or
                JavaScript computer code, how many examples you want to see, and then click on the button. You'll
                instantly see random examples of your chosen computer code.
            </p>

            <p>
                Sometimes we get questions on why anyone would need a random computer code generator. It actually has
                a number of practical purposes. Whether you choose to generate random PHP code or random JavaScript
                code, there are a number of ways people use this generator. You'll find a few examples below of how
                this random computer code tool can be beneficial.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Practice</h2>

            <p>
                This random computer code generator is a good way to practice your coding. For example, you can
                generate a single piece of code and then use it to help create a short program. You can make things
                a bit more difficult by generating several random pieces of code and see if you can implement all of
                them into a short program. Since you have no idea what piece of code will show up, if you can take
                it and properly use it, you know that you understand it well. If you aren't able to use it, you know
                you may need to go back and study up a bit more on how to use that particular code.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Learning</h2>

            <p>
                If you're in the process of learning computer coding, this free tool can also be a fun way to learn
                more. You can generate random code and take notes on the new code you come across while reaffirming
                you're knowledge of code you already have studied. Again, since you have no idea what will show up
                when you press the button, you're bound to come across some new computer code you haven't yet
                learned. Learning new code this way can be a bit more interesting due to the randomness than just
                plugging through a book.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Quiz</h2>

            <p>
                If you happen to be learning computer code with a friend, this tool can be an excellent way to test
                each other. Just have one person generate the random PHP or random JavaScript and then see if the
                other is able to get it correct. It can be a little more interesting quizzing each other this way
                than other methods.
            </p>

            <p>
                The examples above are just three possible ways you can use this random computer code generator. If
                you happen to use this online tool in another way, we'd be greatly interested in hearing about how
                you're using it. A lot of the generators we create end up being used in ways we never anticipated.
                Understanding the different ways this computer code tool is being used can help us make improvements
                to when we make updates. If you have a suggestion or idea on how we can make this generator better,
                please take a moment to let us know.
            </p>
        </div>
    );

    const formPanel = (
        <BaseGeneratorForm
            title="Random Computer Code Generator"
            itemName="Code Examples"
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

    const CodeCard = ({ example, index }: { example: CodeExample; index: number }) => {
        const isFavorite = favoriteExamples.some(fav => fav.code === example.code);

        // Clean up the code by removing HTML pre/code tags and decoding entities
        const cleanCode = example.code
            .replace(/<pre><code[^>]*>/g, '')
            .replace(/<\/code><\/pre>/g, '')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&');

        // Map language names to Prism language identifiers
        const languageMap: { [key: string]: string } = {
            'PHP': 'php',
            'Javascript': 'javascript',
            'JavaScript': 'javascript',
            'HTML': 'markup',
            'CSS': 'css',
            'Python': 'python'
        };

        const prismLanguage = languageMap[example.language] || 'javascript';

        return (
            <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                example.language === 'PHP' ? 'bg-purple-100 text-purple-800' :
                                example.language === 'Javascript' || example.language === 'JavaScript' ? 'bg-yellow-100 text-yellow-800' :
                                example.language === 'HTML' ? 'bg-orange-100 text-orange-800' :
                                example.language === 'CSS' ? 'bg-blue-100 text-blue-800' :
                                example.language === 'Python' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {example.language}
                            </span>
                            <h3 className="font-semibold text-gray-800">
                                {example.description}
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={() => isFavorite ? removeFromFavorites(example.code) : addToFavorites(example)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center ml-2"
                        aria-label={isFavorite ? `Remove "${example.description}" from favorites` : `Add "${example.description}" to favorites`}
                    >
                        <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                </div>

                <div className="bg-white rounded-md border overflow-x-auto">
                    <pre className="p-4 text-sm">
                        <code className={`language-${prismLanguage}`}>
                            {cleanCode}
                        </code>
                    </pre>
                </div>
            </div>
        );
    };

    const resultsPanel = (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end gap-2 flex-wrap mb-4 relative z-10">
                {favoriteExamples.length > 0 && (
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`group flex items-center gap-1 text-sm px-3 py-2 rounded ${showFavorites ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'} transition-colors`}
                        aria-pressed={showFavorites}
                        aria-label={showFavorites ? 'Switch to view generated code examples' : `Switch to view saved favorites (${favoriteExamples.length} code examples)`}
                    >
                        {showFavorites ? (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" aria-hidden="true" />
                        ) : (
                            <>
                                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500" aria-hidden="true" />
                                ({favoriteExamples.length})
                            </>
                        )}
                    </button>
                )}
                <button
                    onClick={copyToClipboard}
                    className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition-colors p-2 rounded touch-manipulation"
                    aria-label={`Copy ${showFavorites ? favoriteExamples.length + ' favorite' : codeExamples.length + ' generated'} code examples to clipboard`}
                >
                    <Copy className="w-5 h-5 transition-colors" aria-hidden="true" />
                </button>
            </div>

            {showLoading ? (
                <div className="text-center py-8">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-blue-600 rounded-full"></div>
                    <p className="mt-2 text-gray-600">Generating code examples...</p>
                </div>
            ) : (
                <>
                    {(showFavorites ? favoriteExamples : codeExamples).length > 0 ? (
                        <div className="space-y-6">
                            {(showFavorites ? favoriteExamples : codeExamples).map((example, index) => (
                                <CodeCard
                                    key={example.code + index}
                                    example={example}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            {showFavorites ? 'No favorite code examples yet. Add some by clicking the heart button on examples you like!' : 'Click "Generate Code Examples" to get random computer code.'}
                        </div>
                    )}

                    {favoriteExamples.length > 0 && showFavorites && (
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
                title="Random Computer Code Generator"
                currentPage="/computer-code.php"
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