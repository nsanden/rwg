import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

interface UsePhraseGeneratorOptions {
    defaultQuantity?: number;
    autoGenerate?: boolean;
    initialPhrases?: string[];
}

export function usePhraseGenerator(options: UsePhraseGeneratorOptions = {}) {
    const {
        defaultQuantity = 1,
        autoGenerate = true,
        initialPhrases = []
    } = options;

    // Core state
    const [phrases, setPhrases] = useState<string[]>(initialPhrases);
    const [loading, setLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [quantity, setQuantity] = useState(defaultQuantity);

    // Favorites state
    const favoritesKey = 'randomPhraseGenerator_favorites';
    const [favorites, setFavorites] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(favoritesKey);
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [showFavorites, setShowFavorites] = useState(false);

    // Request management refs
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastErrorToastRef = useRef<string | null>(null);

    // Generate phrases function
    const generatePhrases = async () => {
        // Cancel any existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setShowLoading(false);

        // Show loading after 300ms
        const loadingTimer = setTimeout(() => {
            setShowLoading(true);
        }, 300);

        try {
            const searchParams = new URLSearchParams();
            searchParams.append('quantity', quantity.toString());

            const response = await fetch(`/api/generate/phrases?${searchParams.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                if (response.status === 422) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Validation failed');
                } else if (response.status === 429) {
                    throw new Error('RATE_LIMIT_ERROR');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setPhrases(data.phrases);
                setShowFavorites(false);
            } else {
                throw new Error(data.error || 'Failed to generate phrases');
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Request aborted');
                return;
            }

            console.error('Error generating phrases:', error);
            let message = error.message || 'Failed to generate phrases. Please try again.';
            let friendlyMessage = message;

            // Convert error messages to friendly ones
            if (message === 'RATE_LIMIT_ERROR') {
                friendlyMessage = 'Please wait a moment before generating more phrases.';
            } else if (message.includes('Validation failed')) {
                friendlyMessage = 'Invalid parameters. Please check your settings.';
            } else if (message.includes('HTTP error!')) {
                friendlyMessage = 'Server error. Please try again in a moment.';
            }

            // Only show toast if it's different from the last error to prevent spam
            if (lastErrorToastRef.current !== friendlyMessage) {
                toast.error(friendlyMessage);
                lastErrorToastRef.current = friendlyMessage;

                // Clear the last error after 5 seconds to allow showing it again
                setTimeout(() => {
                    lastErrorToastRef.current = null;
                }, 5000);
            }
        } finally {
            clearTimeout(loadingTimer);
            setLoading(false);
            setShowLoading(false);
        }
    };

    // Favorites management
    const addToFavorites = (phrase: string) => {
        const updated = [...favorites, phrase];
        setFavorites(updated);
        localStorage.setItem(favoritesKey, JSON.stringify(updated));
        toast.success('Added phrase to favorites');
    };

    const removeFromFavorites = (phrase: string) => {
        const updated = favorites.filter(f => f !== phrase);
        setFavorites(updated);
        localStorage.setItem(favoritesKey, JSON.stringify(updated));
        toast.success('Removed phrase from favorites');
    };

    const clearAllFavorites = () => {
        setFavorites([]);
        localStorage.removeItem(favoritesKey);
        toast.success('Cleared all favorites');
        setShowFavorites(false);
    };

    // Copy to clipboard
    const copyToClipboard = () => {
        const phrasesToCopy = showFavorites ? favorites : phrases;
        const text = phrasesToCopy.join('\n\n');
        navigator.clipboard.writeText(text).then(() => {
            toast.success(`Copied ${phrasesToCopy.length} phrase${phrasesToCopy.length !== 1 ? 's' : ''} to clipboard`);
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    };

    // Auto-generate on mount if requested
    useEffect(() => {
        if (autoGenerate) {
            generatePhrases();
        }
    }, []);

    return {
        // State
        phrases,
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,

        // Setters
        setPhrases,
        setQuantity,
        setShowFavorites,

        // Actions
        generatePhrases,
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    };
}