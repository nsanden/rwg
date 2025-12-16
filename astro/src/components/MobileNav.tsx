import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavLink {
    name: string;
    href: string;
}

interface MobileNavProps {
    navLinks: NavLink[];
    basePath?: string;
}

export default function MobileNav({ navLinks, basePath = '' }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    const getHref = (href: string) => {
        if (href === '/') return basePath || '/';
        // Add .php extension if not already present
        const phpHref = href.endsWith('.php') ? href : `${href}.php`;
        return `${basePath}${phpHref}`;
    };

    return (
        <>
            {/* Hamburger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-emerald-200 focus:outline-none"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile menu overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-25 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 top-16 bg-white border shadow-lg z-50">
                        <div className="px-8 pt-2 pb-3">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={getHref(link.href)}
                                    className="block py-2 text-sm text-gray-700 hover:text-indigo-600 text-left whitespace-nowrap"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <a
                                href={getHref('/more')}
                                className="block py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 text-left whitespace-nowrap"
                                onClick={() => setIsOpen(false)}
                            >
                                All Generators
                            </a>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
