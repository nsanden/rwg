import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface OtherGeneratorsProps {
    currentPage?: string;
}

export default function OtherGenerators({ currentPage = '/' }: OtherGeneratorsProps) {
    const generators = [
        { href: '/', label: 'Random Word Generator' },
        { href: '/noun.php', label: 'Random Noun Generator' },
        { href: '/synonym.php', label: 'Random Synonym Generator' },
        { href: '/verb.php', label: 'Random Verb Generator' },
        { href: '/name.php', label: 'Random Name Generator' },
        { href: '/adjective.php', label: 'Random Adjective Generator' },
        { href: '/sentence.php', label: 'Random Sentence Generator' },
        { href: '/phrase.php', label: 'Random Phrase Generator' },
        { href: '/paragraph.php', label: 'Random Paragraph Generator' },
        { href: '/weird-word.php', label: 'Weird Words' },
        { href: '/fake-word.php', label: 'Fake Words' },
        { href: '/letter.php', label: 'Random Letter Generator' },
        { href: '/number.php', label: 'Random Number Generator' },
        { href: '/cursive-letter.php', label: 'Cursive Letters' },
        { href: '/password.php', label: 'Random Password Generator' },
        { href: '/bible-verse.php', label: 'Random Bible Verses' },
        { href: '/picture.php', label: 'Random Pictures' },
        { href: '/wedding-hashtags.php', label: 'Wedding Hashtags Generator' },
        { href: '/list.php', label: 'Random List' },
        { href: '/dinner-ideas.php', label: 'Dinner Ideas Generator' },
        { href: '/breakfast-ideas.php', label: 'Breakfast Ideas' },
        { href: '/yes-no.php', label: 'Yes or No Oracle' },
        { href: '/pictionary.php', label: 'Pictionary Generator' },
        { href: '/motivational-quote.php', label: 'Motivational Quotes' },
        { href: '/question.php', label: 'Random Questions' },
        { href: '/fact.php', label: 'Random Facts' },
        { href: '/vocabulary.php', label: 'Vocabulary Words' },
        { href: '/writing-prompt.php', label: 'Writing Prompts' },
        { href: '/coin-flip.php', label: 'Coin Flip' },
        { href: '/dice-roll.php', label: 'Dice Roll' },
        { href: '/never-have-i-ever-question.php', label: 'Never Have I Ever Questions' },
        { href: '/would-you-rather-question.php', label: 'Would You Rather Questions' },
        { href: '/truth-or-dare-question.php', label: 'Truth or Dare Questions' },
        { href: '/decision.php', label: 'Decision Maker' },
        { href: '/charades.php', label: 'Charades' },
        { href: '/hangman.php', label: 'Hangman Words' },
        { href: '/color.php', label: 'Random Color Generator' },
        { href: '/drawing-idea.php', label: 'Random Things to Draw' },
        { href: '/coloring-pages.php', label: 'Random Coloring Pages' },
        { href: '/tongue-twisters.php', label: 'Tongue Twisters' },
        { href: '/interview-question.php', label: 'Job Interview Questions' },
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Random Generators</h3>
            <p className="text-gray-700 mb-4">Here you can find all the other Random Generators:</p>

            <ul className="space-y-2">
                {generators.map((generator) => {
                    const isCurrentPage = generator.href === currentPage;

                    return (
                        <li key={generator.href} className="relative">
                            {isCurrentPage ? (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-teal-50 rounded-md border-l-4 border-brand-teal-600">
                                    <MapPin className="w-4 h-4 text-brand-teal-600 flex-shrink-0" />
                                    <span className="font-medium text-brand-teal-800">
                                        {generator.label}
                                    </span>
                                    <span className="text-xs text-brand-teal-600 ml-auto">(You are here)</span>
                                </div>
                            ) : (
                                <Link
                                    href={generator.href}
                                    className="group flex items-center gap-2 px-3 py-1 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-brand-teal-600 transition-colors flex-shrink-0" />
                                    <span className="text-brand-teal-700 hover:text-brand-teal-800 underline underline-offset-2">
                                        {generator.label}
                                    </span>
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}