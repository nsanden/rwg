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
        { name: 'More...', href: '/more', icon: Menu },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-brand-teal shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link href="/" className="flex items-center">
                                <Shuffle className="w-8 h-8 text-white mr-2" />
                                <span className="font-bold text-xl text-white">RandomWordGenerator</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {generators.map((generator) => (
                                <Link
                                    key={generator.href}
                                    href={generator.href}
                                    className="text-white hover:text-emerald-200 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    {generator.name}
                                </Link>
                            ))}
                            {user ? (
                                <Link href="/dashboard" className="bg-brand-teal-600 hover:bg-brand-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium ml-4">
                                    Dashboard
                                </Link>
                            ) : (
                                <Link href="/login" className="bg-brand-teal-600 hover:bg-brand-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium ml-4">
                                    Sign In
                                </Link>
                            )}
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

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                                Home
                            </Link>
                            <div className="px-3 py-2">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Generators
                                </div>
                                {generators.map((generator) => (
                                    <Link
                                        key={generator.href}
                                        href={generator.href}
                                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-md"
                                    >
                                        <generator.icon className="w-4 h-4 mr-2" />
                                        {generator.name}
                                    </Link>
                                ))}
                            </div>
                            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                                About
                            </Link>
                            <Link href="/api-docs" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
                                API
                            </Link>
                            {user ? (
                                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium bg-brand-teal hover:bg-brand-teal-600 text-white">
                                    Dashboard
                                </Link>
                            ) : (
                                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-brand-teal hover:bg-brand-teal-600 text-white">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                            <p className="text-gray-400">Email: <a href="mailto:info@1s0s.com" className="text-gray-400 hover:text-white underline underline-offset-2">info@1s0s.com</a></p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">OTHER PROJECTS</h3>
                            <ul className="space-y-2">
                                <li><Link href="/cursive-letter" className="text-gray-400 hover:text-white underline underline-offset-2">Cursive Letters</Link></li>
                                <li><Link href="/bible-verse" className="text-gray-400 hover:text-white underline underline-offset-2">Bible Verse Generator</Link></li>
                                <li><Link href="/list" className="text-gray-400 hover:text-white underline underline-offset-2">Random List Generator</Link></li>
                                <li><Link href="/picture" className="text-gray-400 hover:text-white underline underline-offset-2">Random Picture Generator</Link></li>
                                <li><a href="#" className="text-gray-400 hover:text-white underline underline-offset-2">Alphabetize Any List</a></li>
                            </ul>
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