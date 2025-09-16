import { Share2, Heart, ThumbsUp, Linkedin, Facebook } from 'lucide-react';
import { useState } from 'react';

// Custom X (Twitter) icon since lucide-react doesn't have the new X logo
const XIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

interface SocialShareBlockProps {
    url?: string;
    title?: string;
    isExpanded?: boolean;
    setIsExpanded?: (value: boolean) => void;
}

export default function SocialShareBlock({
    url = typeof window !== 'undefined' ? window.location.href : '',
    title = 'Random Word Generator - Generate Creative Words',
    isExpanded: externalIsExpanded,
    setIsExpanded: externalSetIsExpanded
}: SocialShareBlockProps) {
    const [internalIsExpanded, setInternalIsExpanded] = useState(false);

    // Use external state if provided, otherwise use internal state
    const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
    const setIsExpanded = externalSetIsExpanded || setInternalIsExpanded;

    const shareOnFacebook = () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const shareOnTwitter = () => {
        const text = `Check out this amazing Random Word Generator! ${title}`;
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const shareOnLinkedIn = () => {
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
    };

    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    url: url,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        }
    };

    return (
        <div className={isExpanded || typeof window === 'undefined' ? "mt-6" : "sm:mt-6"}>
            {/* Mobile: Show expanded content when triggered externally */}
            <div className="sm:hidden">
                {isExpanded && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex flex-row items-center justify-center gap-2 flex-wrap">
                            <p className="text-xs text-blue-800 font-medium text-center whitespace-nowrap">
                                <strong>SHARE</strong> to support us!
                            </p>
                            <div className="flex flex-wrap justify-center items-center gap-2">
                {/* Facebook Share Button */}
                <button
                    onClick={shareOnFacebook}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                    aria-label="Share on Facebook"
                >
                    <Facebook className="w-3 h-3" aria-hidden="true" />
                    <span className="hidden sm:inline">Share</span>
                </button>

                {/* X (Twitter) Share */}
                <button
                    onClick={shareOnTwitter}
                    className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                    aria-label="Share on X (Twitter)"
                >
                    <XIcon className="w-3 h-3" />
                    <span className="hidden sm:inline">Post</span>
                </button>

                {/* LinkedIn Share */}
                <button
                    onClick={shareOnLinkedIn}
                    className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                    aria-label="Share on LinkedIn"
                >
                    <Linkedin className="w-3 h-3" aria-hidden="true" />
                    <span className="hidden sm:inline">Share</span>
                </button>

                            {/* Native Share (if available) */}
                            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                                <button
                                    onClick={shareNative}
                                    className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                                    aria-label="Share using device's sharing options"
                                >
                                    <Share2 className="w-3 h-3" aria-hidden="true" />
                                </button>
                            )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop: Always show full block */}
            <div className="hidden sm:block bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 flex-wrap">
                    {/* Text - always centered */}
                    <p className="text-xs sm:text-sm text-blue-800 font-medium text-center whitespace-nowrap">
                        <strong>SHARE</strong> to support us!
                    </p>

                    {/* Buttons - always centered */}
                    <div className="flex flex-wrap justify-center items-center gap-2">
                    {/* Facebook Share Button */}
                    <button
                        onClick={shareOnFacebook}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                        aria-label="Share on Facebook"
                    >
                        <Facebook className="w-3 h-3" aria-hidden="true" />
                        <span className="hidden sm:inline">Share</span>
                    </button>

                    {/* X (Twitter) Share */}
                    <button
                        onClick={shareOnTwitter}
                        className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                        aria-label="Share on X (Twitter)"
                    >
                        <XIcon className="w-3 h-3" />
                        <span className="hidden sm:inline">Post</span>
                    </button>

                    {/* LinkedIn Share */}
                    <button
                        onClick={shareOnLinkedIn}
                        className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors duration-200"
                        aria-label="Share on LinkedIn"
                    >
                        <Linkedin className="w-3 h-3" aria-hidden="true" />
                        <span className="hidden sm:inline">Share</span>
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}