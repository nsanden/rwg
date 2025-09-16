import SEO from '@/Components/SEO';
import GeneratorLayout from '@/Layouts/GeneratorLayout';
import ErrorBoundary from '@/Components/ErrorBoundary';
import { Link } from '@inertiajs/react';

export default function AllGenerators() {
    const generatorCategories = [
        {
            title: "Core Word Generators",
            description: "Generate random words of different types and categories",
            generators: [
                { href: '/', label: 'Random Word Generator', description: 'Generate random words, nouns, verbs, adjectives, letters, phrases, sentences or numbers' },
                { href: '/noun.php', label: 'Random Noun Generator', description: 'Includes 1000+ random nouns including proper, common, countable, uncountable, collective' },
                { href: '/verb.php', label: 'Random Verb Generator', description: 'Includes 1000+ random verbs including action verbs and state of being verbs' },
                { href: '/adjective.php', label: 'Random Adjective Generator', description: 'Contains 1000+ random adjectives including common adjectives' },
                { href: '/synonym.php', label: 'Random Synonym Generator', description: 'Contains 1000+ words and their synonyms to help improve vocabulary' },
            ]
        },
        {
            title: "Text & Writing Generators",
            description: "Create random sentences, paragraphs, and writing content",
            generators: [
                { href: '/sentence.php', label: 'Random Sentence Generator', description: 'Contains 1000+ random sentences created specifically for this free writing tool' },
                { href: '/paragraph.php', label: 'Random Paragraph Generator', description: 'A free online tool to generate random paragraphs to help writers' },
                { href: '/phrase.php', label: 'Random Phrase Generator', description: 'Includes 1000+ random phrases and idioms with definition' },
                { href: '/writing-prompt.php', label: 'Writing Prompts', description: 'The Writing Prompts generator helps you find random writing topics. Great for journal prompts and creative writing prompts' },
                { href: '/vocabulary.php', label: 'Vocabulary Words', description: 'The Vocabulary Words Generator contains 1000+ vocabulary words with definitions. Study vocab and increase your English vocabulary' },
            ]
        },
        {
            title: "Numbers & Utility Generators",
            description: "Generate numbers, letters, passwords, and other utilities",
            generators: [
                { href: '/number.php', label: 'Random Number Generator', description: 'Produces random numbers within a chosen range' },
                { href: '/letter.php', label: 'Random Letter Generator', description: 'Allows generation of random letters, English letters, capital letters' },
                { href: '/password.php', label: 'Random Password Generator', description: 'Creates secure and strong passwords' },
                { href: '/color.php', label: 'Random Color Generator', description: 'The color generator can be used for a variety of uses from web development to painting' },
                { href: '/list.php', label: 'Random List Generator', description: 'Helps pick random results from your own list' },
            ]
        },
        {
            title: "Names & People",
            description: "Generate random names and personal identifiers",
            generators: [
                { href: '/name.php', label: 'Random Name Generator', description: 'Creates random names including girl names, boy names, baby names and last names' },
            ]
        },
        {
            title: "Games & Entertainment",
            description: "Fun generators for games, activities, and entertainment",
            generators: [
                { href: '/charades.php', label: 'Charades', description: 'The Charades word generator can be used to play Charades anywhere' },
                { href: '/pictionary.php', label: 'Pictionary', description: 'Can be used to play Pictionary, charades, and catchphrase' },
                { href: '/hangman.php', label: 'Hangman Words', description: 'The Hangman word generator can be used for inspiration when playing Hangman' },
                { href: '/dice-roll.php', label: 'Dice Roll', description: 'The Dice Roll Generator will roll dice to give you a random die roll. The best online dice roller!' },
                { href: '/coin-flip.php', label: 'Coin Flip', description: 'The Coin Flip Generator is a coin toss coin flipper. Flip a coin and get a heads or tails result' },
                { href: '/fake-word.php', label: 'Fake Words', description: 'Creates fake words, pseudo words, made up words, nonsense words' },
                { href: '/weird-word.php', label: 'Weird Words', description: 'Has 1000+ words and their weird definitions' },
            ]
        },
        {
            title: "Questions & Conversation",
            description: "Random questions for conversations, games, and icebreakers",
            generators: [
                { href: '/question.php', label: 'Random Questions', description: 'Creates random questions to ask' },
                { href: '/would-you-rather-question.php', label: 'Would You Rather Questions', description: 'The Would You Rather question generator contains 500+ good Would You Rather questions' },
                { href: '/truth-or-dare-question.php', label: 'Truth or Dare Questions', description: 'The Truth or Dare Questions generator contains over 1000 truth questions and dare questions' },
                { href: '/never-have-i-ever-question.php', label: 'Never Have I Ever Questions', description: 'The random Never Have I Ever Questions Generator has over 500 good Never Have I Ever questions for kids and more' },
                { href: '/interview-question.php', label: 'Job Interview Questions', description: 'New Learn how to interview better for your next job with these random interview questions' },
            ]
        },
        {
            title: "Ideas & Inspiration",
            description: "Get random ideas for various activities and projects",
            generators: [
                { href: '/gift-ideas.php', label: 'Gift Ideas', description: 'Get random gift ideas for any occasion' },
                { href: '/dinner-ideas.php', label: 'Dinner Ideas', description: 'Helps find both healthy and easy dinner ideas' },
                { href: '/breakfast-ideas.php', label: 'Breakfast Ideas', description: 'Over 500 breakfast ideas' },
                { href: '/drawing-idea.php', label: 'Random Things to Draw', description: 'The drawing idea generator can be a great way to get inspiration for new things to draw' },
                { href: '/wedding-hashtags.php', label: 'Wedding Hashtags', description: 'Helps find the best wedding hashtags' },
            ]
        },
        {
            title: "Decision & Choice Makers",
            description: "Let chance make decisions for you",
            generators: [
                { href: '/decision.php', label: 'Decision Maker', description: 'This Decision Maker generator helps all types of decision making' },
                { href: '/yes-no.php', label: 'Yes or No Oracle', description: 'Gives a yes or no answer to any question' },
            ]
        },
        {
            title: "Educational & Learning",
            description: "Tools for education, learning, and personal growth",
            generators: [
                { href: '/cursive-letter.php', label: 'Cursive Letters', description: 'Creates cursive letters including cursive capital letters' },
                { href: '/motivational-quote.php', label: 'Motivational Quotes', description: 'Generates random motivational quotes' },
                { href: '/bible-verse.php', label: 'Bible Verses', description: 'Produces random Bible verses, quotes, and scriptures' },
                { href: '/fact.php', label: 'Random Facts', description: 'The Random Fact Generator has 1000+ random facts including fun facts, interesting facts and amazing facts' },
                { href: '/act-of-kindness.php', label: 'Acts of Kindness', description: 'Get ideas for kind acts to perform' },
                { href: '/tongue-twisters.php', label: 'Tongue Twisters', description: 'The tongue twister generator is full of fun tongue twisters' },
            ]
        },
        {
            title: "Visual & Creative",
            description: "Visual generators for creative projects",
            generators: [
                { href: '/coloring-pages.php', label: 'Random Coloring Pages', description: 'The coloring page generator is full of unique, custom, coloring pages you can print and color in absolutely free' },
                { href: '/picture.php', label: 'Random Pictures', description: 'Contains 1,000+ random images' },
            ]
        }
    ];

    const allGenerators = generatorCategories.flatMap(category => category.generators);

    return (
        <>
            <SEO
                title="More Random Generators — Random Word Generator"
                description="A list of all the random generators available on the website."
                keywords={['random generators', 'generator directory', 'random tools', 'word generators', 'number generators', 'name generators']}
            />
            <GeneratorLayout>
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <ErrorBoundary>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h1 className="text-3xl font-bold text-gray-800 mb-8">More Random Generators</h1>

                                <div className="space-y-8">
                                    {generatorCategories.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.title}</h2>
                                            <p className="text-gray-600 mb-4 text-sm">{category.description}</p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {category.generators.map((generator, index) => (
                                                    <Link
                                                        key={index}
                                                        href={generator.href}
                                                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                                    >
                                                        <h3 className="font-medium text-gray-800 group-hover:text-blue-700 mb-1">
                                                            {generator.label}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 group-hover:text-gray-700">
                                                            {generator.description}
                                                        </p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ErrorBoundary>
                    </div>
                </div>
            </GeneratorLayout>
        </>
    );
}