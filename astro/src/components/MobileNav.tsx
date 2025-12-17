import { useState, useEffect } from 'react';
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

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const getHref = (href: string) => {
        if (href === '/') return basePath || '/';
        const phpHref = href.endsWith('.php') ? href : `${href}.php`;
        return `${basePath}${phpHref}`;
    };

    return (
        <>
            {/* Hamburger button */}
            <button
                onClick={() => setIsOpen(true)}
                className="text-white hover:text-emerald-200 focus:outline-none p-2"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Slide-out drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between p-4 border-b bg-brand-teal-800">
                    <span className="text-white font-semibold">Menu</span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-emerald-200 p-1"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="p-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={getHref(link.href)}
                            className="block py-3 px-2 text-gray-700 hover:bg-gray-100 hover:text-brand-teal-800 rounded-md transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="border-t my-3"></div>
                    <a
                        href={getHref('/more')}
                        className="block py-3 px-2 text-white bg-brand-teal-800 hover:bg-brand-teal-900 rounded-md font-medium text-center transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        All Generators
                    </a>
                </nav>
            </div>
        </>
    );
}
