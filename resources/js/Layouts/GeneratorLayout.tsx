import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
    Menu,
    X,
    Home,
    Shuffle,
    Hash,
    Type,
    MessageSquare,
    PenTool,
    User,
    Dice1,
    Palette,
    Gift,
    HelpCircle,
    BookOpen,
    Zap
} from 'lucide-react';

interface GeneratorLayoutProps extends PropsWithChildren {
    user?: any;
}

export default function GeneratorLayout({ user, children }: GeneratorLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const generators = [
        { name: 'Word', href: '/', icon: Shuffle },
        { name: 'Noun', href: '/noun', icon: Type },
        { name: 'Verb', href: '/verb', icon: Zap },
        { name: 'Name', href: '/name', icon: User },
        { name: 'Sentence', href: '/sentence', icon: MessageSquare },
        { name: 'Phrase', href: '/phrase', icon: BookOpen },
        { name: 'Number', href: '/number', icon: Hash },
        { name: 'Letter', href: '/letter', icon: Type },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-brand-teal shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <Shuffle className="w-8 h-8 text-white mr-2" />
                                <span className="font-bold text-lg lg:text-xl text-white whitespace-nowrap">Random Word Generator</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {/* Always visible items */}
                            <Link href="/" className="text-white hover:text-emerald-200 px-2 xl:px-3 py-2 rounded-md text-sm font-medium">
                                Word
                            </Link>
                            <Link href="/noun.php" className="text-white hover:text-emerald-200 px-2 xl:px-3 py-2 rounded-md text-sm font-medium">
                                Noun
                            </Link>
                            <Link href="/verb.php" className="text-white hover:text-emerald-200 px-2 xl:px-3 py-2 rounded-md text-sm font-medium">
                                Verb
                            </Link>
                            <Link href="/name.php" className="text-white hover:text-emerald-200 px-2 xl:px-3 py-2 rounded-md text-sm font-medium">
                                Name
                            </Link>
                            <Link href="/sentence.php" className="text-white hover:text-emerald-200 px-2 xl:px-3 py-2 rounded-md text-sm font-medium">
                                Sentence
                            </Link>

                            {/* Hide at xl (1280px) */}
                            <Link href="/phrase.php" className="hidden xl:block text-white hover:text-emerald-200 px-2 xl:px-3 py-2 rounded-md text-sm font-medium">
                                Phrase
                            </Link>

                            {/* Hide at lg (1024px) */}
                            <Link href="/number.php" className="hidden lg:block text-white hover:text-emerald-200 px-2 xl:px-3 py-2 rounded-md text-sm font-medium">
                                Number
                            </Link>
                            <Link href="/letter.php" className="hidden lg:block text-white hover:text-emerald-200 px-2 xl:px-3 py-2 rounded-md text-sm font-medium">
                                Letter
                            </Link>

                            {/* All Generators button always visible */}
                            <Link href="/more.php" className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-md text-sm font-medium ml-2">
                                All Generators
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-white hover:text-emerald-200 focus:outline-none"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation - Overlay */}
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="md:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        ></div>

                        {/* Menu */}
                        <div className="md:hidden absolute right-0 top-16 bg-white border shadow-lg z-50">
                            <div className="px-8 pt-2 pb-3">
                                {generators.map((generator) => (
                                    <Link
                                        key={generator.href}
                                        href={generator.href}
                                        className="block py-2 text-sm text-gray-700 hover:text-indigo-600 text-left whitespace-nowrap"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {generator.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/more.php"
                                    className="block py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 text-left whitespace-nowrap"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    All Generators
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                            <p className="text-gray-400">Email: <a href="mailto:info@1s0s.com" className="text-gray-400 hover:text-white underline underline-offset-2">info@1s0s.com</a></p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About Us</h3>
                            <p className="text-gray-400 mb-4">We created this website to generate random words and more.</p>
                            <Link href="/privacy-policy" className="text-gray-400 hover:text-white underline underline-offset-2">Privacy Policy</Link>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                        <p className="text-gray-400">
                            © {new Date().getFullYear()} RandomWordGenerator.com. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1abc9c',
                        color: '#fff',
                    },
                }}
            />
        </div>
    );
}
