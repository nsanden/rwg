import { Copy } from 'lucide-react';

interface CopyButtonProps {
    text: string;
    onCopy: (text: string) => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showOnHover?: boolean;
}

export default function CopyButton({
    text,
    onCopy,
    size = 'md',
    className = '',
    showOnHover = false
}: CopyButtonProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const iconSize = sizeClasses[size];
    const hoverClass = showOnHover ? 'opacity-0 group-hover:opacity-100 transition-opacity' : '';

    return (
        <button
            onClick={() => onCopy(text)}
            className={`text-gray-400 hover:text-blue-600 transition-colors touch-manipulation flex-shrink-0 ${hoverClass} ${className}`}
            aria-label={`Copy "${text}" to clipboard`}
        >
            <Copy className={`${iconSize} transition-colors`} aria-hidden="true" />
        </button>
    );
}