import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

const getRandomColor = () => {
    const colors = [
        { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626' }, // red
        { bg: '#fff7ed', border: '#fdba74', text: '#ea580c' }, // orange
        { bg: '#fefce8', border: '#fde047', text: '#ca8a04' }, // yellow
        { bg: '#f0fdf4', border: '#86efac', text: '#16a34a' }, // green
        { bg: '#ecfeff', border: '#67e8f9', text: '#0891b2' }, // cyan
        { bg: '#eff6ff', border: '#93c5fd', text: '#2563eb' }, // blue
        { bg: '#f5f3ff', border: '#c4b5fd', text: '#7c3aed' }, // violet
        { bg: '#fdf4ff', border: '#f0abfc', text: '#c026d3' }, // fuchsia
        { bg: '#fdf2f8', border: '#f9a8d4', text: '#db2777' }, // pink
        { bg: '#f0fdfa', border: '#5eead4', text: '#0d9488' }, // teal
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

interface Generator {
    href: string;
    label: string;
    description: string;
}

interface Category {
    title: string;
    description: string;
    generators: Generator[];
}

interface AllGeneratorsPageProps {
    basePath?: string;
}

const GeneratorCard = ({ generator, basePath }: { generator: Generator; basePath: string }) => {
    const [hoverColor, setHoverColor] = useState<{ bg: string; border: string; text: string } | null>(null);

    const handleMouseEnter = () => {
        setHoverColor(getRandomColor());
    };

    const handleMouseLeave = () => {
        setHoverColor(null);
    };

    return (
        <a
            href={`${basePath}${generator.href}`}
            className="block p-4 border rounded-lg transition-colors"
            style={{
                backgroundColor: hoverColor?.bg || 'white',
                borderColor: hoverColor?.border || '#e5e7eb',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <h3
                className="font-medium mb-1"
                style={{ color: hoverColor?.text || '#1f2937' }}
            >
                {generator.label}
            </h3>
            <p
                className="text-sm"
                style={{ color: hoverColor ? '#374151' : '#4b5563' }}
            >
                {generator.description}
            </p>
        </a>
    );
};

export default function AllGeneratorsPage({ basePath = '' }: AllGeneratorsPageProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const generatorCategories: Category[] = [
        {
            title: "Core Word Generators",
            description: "Generate random words of different types and categories",
            generators: [
                { href: '/', label: 'Random Word Generator', description: 'Generate random words, nouns, verbs, adjectives, letters, phrases, sentences or numbers to brainstorm and create new ideas at Random Word Generator.' },
                { href: '/noun.php', label: 'Random Noun Generator', description: 'The Random Noun Generator includes 1000+ random nouns including proper, common, countable, uncountable, collective, concrete, abstract and pronouns.' },
                { href: '/verb.php', label: 'Random Verb Generator', description: 'The Random Verb Generator includes 1000+ random verbs including action verbs and state of being verbs.' },
                { href: '/adjective.php', label: 'Random Adjective Generator', description: 'The Random Adjective Generator contains 1000+ random adjectives including common adjectives.' },
                { href: '/synonym.php', label: 'Random Synonym Generator', description: 'The Random Synonym Generator contains 1000+ words and their synonyms to help you improve your vocabulary.' },
            ]
        },
        {
            title: "Text & Writing Generators",
            description: "Create random sentences, paragraphs, and writing content",
            generators: [
                { href: '/sentence.php', label: 'Random Sentence Generator', description: 'The Random Sentence Generator contains 1000+ random sentences created specifically for this free writing tool and found nowhere else.' },
                { href: '/paragraph.php', label: 'Random Paragraph Generator', description: 'The Random Paragraph Generator is a free online tool to generate random paragraphs to help writers.' },
                { href: '/phrase.php', label: 'Random Phrase Generator', description: 'The Random Phrase Generator includes 1000+ random phrases and idioms with definition. Learn random idioms to improve your English.' },
                { href: '/writing-prompt.php', label: 'Writing Prompts', description: 'The Writing Prompts generator helps you find random writing topics. Great for journal prompts and creative writing prompts.' },
                { href: '/vocabulary.php', label: 'Vocabulary Words', description: 'The Vocabulary Words Generator contains 1000+ vocabulary words with definitions. Study vocab and increase your English vocabulary.' },
            ]
        },
        {
            title: "Numbers & Utility Generators",
            description: "Generate numbers, letters, passwords, and other utilities",
            generators: [
                { href: '/number.php', label: 'Random Number Generator', description: 'The Random Number Generator produces random numbers within a chosen range. Pick a number with this random number picker.' },
                { href: '/letter.php', label: 'Random Letter Generator', description: 'The Random Letter Generator allows you to generate random letters, English letters, capital letters and more!' },
                { href: '/password.php', label: 'Random Password Generator', description: 'The Random Password Generator creates secure and strong passwords.' },
                { href: '/color.php', label: 'Random Color Generator', description: 'The color generator can be used for a variety of uses from web development to painting.' },
                { href: '/list.php', label: 'Random List', description: 'The Random List Generator helps you pick random results from your own random list.' },
            ]
        },
        {
            title: "Names & People",
            description: "Generate random names and personal identifiers",
            generators: [
                { href: '/name.php', label: 'Random Name Generator', description: 'The Random Name Generator creates random names including girl names, boy names, baby names and last names. Use this random name picker to create the best names for your characters.' },
            ]
        },
        {
            title: "Games & Entertainment",
            description: "Fun generators for games, activities, and entertainment",
            generators: [
                { href: '/charades.php', label: 'Charades', description: 'The Charades word generator can be used to play Charades anywhere. It also has a charades word generator and catchphrase word generator options to play charades and catchphrase.' },
                { href: '/pictionary.php', label: 'Pictionary Generator', description: 'The Pictionary word generator can be used to play Pictionary or Pictionary Air anywhere. It also has a charades word generator and catchphrase word generator options to play charades and catchphrase.' },
                { href: '/hangman.php', label: 'Hangman Words', description: 'The Hangman word generator can be used for inspiration when playing Hangman.' },
                { href: '/dice-roll.php', label: 'Dice Roll', description: 'The Dice Roll Generator will roll dice to give you a random die roll. The best online dice roller!' },
                { href: '/coin-flip.php', label: 'Coin Flip', description: 'The Coin Flip Generator is a coin toss coin flipper. Flip a coin and get a heads or tails result.' },
                { href: '/fake-word.php', label: 'Fake Words', description: 'The Fake Word Generator creates fake words, pseudo words, made up words, nonsense words, and gibberish.' },
                { href: '/weird-word.php', label: 'Weird Words', description: 'The Weird Words Generator has 1000+ words and their weird definitions. Have fun learning new weird words, strange words and uncommon words.' },
            ]
        },
        {
            title: "Questions & Conversation",
            description: "Random questions for conversations, games, and icebreakers",
            generators: [
                { href: '/question.php', label: 'Random Questions', description: 'The Random Questions Generator creates random questions so you have random question to ask.' },
                { href: '/would-you-rather-question.php', label: 'Would You Rather Questions', description: 'The Would You Rather question generator contains 500+ good Would You Rather questions. Funny questions, hard questions, kid questions and more! Would you rather...?' },
                { href: '/truth-or-dare-question.php', label: 'Truth or Dare Questions', description: 'The Truth or Dare Questions generator contains over 1000 truth questions and dare questions for a great Truth or Dare game for you and friends.' },
                { href: '/never-have-i-ever-question.php', label: 'Never Have I Ever Questions', description: 'The random Never Have I Ever Questions Generator has over 500 good Never Have I Ever questions for kids and more.' },
                { href: '/interview-question.php', label: 'Job Interview Questions', description: 'Learn how to interview better for your next job with these random interview questions.' },
            ]
        },
        {
            title: "Ideas & Inspiration",
            description: "Get random ideas for various activities and projects",
            generators: [
                { href: '/dinner-ideas.php', label: 'Dinner Ideas Generator', description: 'The Dinner Ideas Generator helps you find both healthy and easy dinner ideas.' },
                { href: '/breakfast-ideas.php', label: 'Breakfast Ideas', description: 'Over 500 breakfast ideas for when you want to know what to have for breakfast.' },
                { href: '/drawing-idea.php', label: 'Random Things to Draw', description: 'The drawing idea generator can be a great way to get inspiration for new things to draw.' },
                { href: '/wedding-hashtags.php', label: 'Wedding Hashtags Generator', description: 'The Wedding Hashtag Generator is a free wedding hashtag generator to help find the best wedding hashtags for your wedding.' },
            ]
        },
        {
            title: "Decision & Choice Makers",
            description: "Let chance make decisions for you",
            generators: [
                { href: '/decision.php', label: 'Decision Maker', description: 'This Decision Maker generator helps all types of decision making. Use it to make all kinds of decisions.' },
                { href: '/yes-no.php', label: 'Yes or No Oracle', description: 'The Yes or No Oracle gives you a yes or no answer to any question that you ask it. The Yes No Oracle is better than a live oracle or fortune teller!' },
            ]
        },
        {
            title: "Educational & Learning",
            description: "Tools for education, learning, and personal growth",
            generators: [
                { href: '/cursive-letter.php', label: 'Cursive Letters', description: 'The Cursive Letters Generator creates cursive letters including cursive capital letters.' },
                { href: '/motivational-quote.php', label: 'Motivational Quotes', description: 'A free online tool that will generate random motivational quotes including uplifting quotes, inspirational quotes, and interesting quotes.' },
                { href: '/bible.php', label: 'Random Bible Verses', description: 'The Bible Verse Generator produces random Bible verses, Bible quotes, and Bible scriptures to help you better understand God\'s words and the Holy Book.' },
                { href: '/fact.php', label: 'Random Facts', description: 'The Random Fact Generator has 1000+ random facts including fun facts, interesting facts and amazing facts.' },
                { href: '/tongue-twisters.php', label: 'Tongue Twisters', description: 'The tongue twister generator is full of fun tongue twisters.' },
            ]
        },
        {
            title: "Visual & Creative",
            description: "Visual generators for creative projects",
            generators: [
                { href: '/coloring-pages.php', label: 'Random Coloring Pages', description: 'The coloring page generator is full of unique, custom, coloring pages you can print and color in absolutely free.' },
                { href: '/picture.php', label: 'Random Pictures', description: 'The Random Picture Generator contains 1,000+ random images. Enjoy finding random pictures and photos.' },
            ]
        }
    ];

    const filterGenerators = (categories: Category[], query: string): Category[] => {
        if (!query.trim()) return categories;

        const lowerQuery = query.toLowerCase();

        return categories
            .map(category => ({
                ...category,
                generators: category.generators.filter(
                    gen => gen.label.toLowerCase().includes(lowerQuery) ||
                           gen.description.toLowerCase().includes(lowerQuery)
                )
            }))
            .filter(category => category.generators.length > 0);
    };

    const filteredCategories = filterGenerators(generatorCategories, searchQuery);
    const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.generators.length, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">More Random Generators</h1>

                    {/* Search Box */}
                    <div className="mb-6">
                        <div className="relative max-w-md mx-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search generators..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        {searchQuery && (
                            <p className="mt-2 text-sm text-gray-600 text-center">
                                Found {totalResults} generator{totalResults !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    <div>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category, categoryIndex) => (
                                <div key={categoryIndex} style={{ marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>{category.title}</h2>
                                    <p style={{ color: '#4b5563', marginBottom: '1rem', fontSize: '0.875rem' }}>{category.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {category.generators.map((generator, index) => (
                                            <GeneratorCard key={index} generator={generator} basePath={basePath} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No generators found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
