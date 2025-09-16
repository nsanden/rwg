import { Heart, X } from 'lucide-react';

interface FavoriteButtonProps {
    item: any;
    isFavorited: boolean;
    onAdd: (item: any) => void;
    onRemove: (item: any) => void;
    showFavorites?: boolean;
    itemLabel?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function FavoriteButton({
    item,
    isFavorited,
    onAdd,
    onRemove,
    showFavorites = false,
    itemLabel,
    size = 'md',
    className = ''
}: FavoriteButtonProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const iconSize = sizeClasses[size];
    const label = itemLabel || String(item);

    if (showFavorites) {
        return (
            <button
                onClick={() => onRemove(item)}
                className={`text-gray-400 hover:text-red-500 transition-colors touch-manipulation flex-shrink-0 ${className}`}
                aria-label={`Remove "${label}" from favorites`}
            >
                <X className={`${iconSize} transition-colors`} aria-hidden="true" />
            </button>
        );
    }

    return (
        <button
            onClick={() => isFavorited ? onRemove(item) : onAdd(item)}
            className={`text-gray-400 hover:text-red-500 transition-colors touch-manipulation flex-shrink-0 ${className}`}
            aria-label={isFavorited ? `Remove "${label}" from favorites` : `Add "${label}" to favorites`}
        >
            <Heart
                className={`${iconSize} transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
                aria-hidden="true"
            />
        </button>
    );
}