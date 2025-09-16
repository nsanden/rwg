import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { WordItem } from '@/Components/Shared/ItemsDisplay';

interface UseGeneratorOptions {
    defaultQuantity?: number;
    defaultType?: string;
    autoGenerate?: boolean;
    initialItems?: WordItem[];
    favoritesKey?: string;
    apiEndpoint?: string;
    itemName?: string; // 'words', 'numbers', etc.
    transformResponse?: (data: any) => WordItem[];
}

interface GenerateParams {
    [key: string]: any;
}

export function useGenerator(options: UseGeneratorOptions = {}) {
    const {
        defaultQuantity = 1,
        defaultType = 'all',
        autoGenerate = true,
        initialItems = [],
        favoritesKey = 'favorites',
        apiEndpoint = '/api/generate/words',
        itemName = 'words',
        transformResponse
    } = options;

    // Core state
    const [items, setItems] = useState<WordItem[]>(initialItems);
    const [loading, setLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [quantity, setQuantity] = useState(defaultQuantity);

    // Favorites state - page-specific
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

    // Generate items function
    const generateItems = async (params: GenerateParams = {}) => {
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

            // Add type if not already in params and defaultType exists
            if (!params.type && defaultType && defaultType !== 'all') {
                searchParams.append('type', defaultType);
            }

            // Add all other params
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    // Special handling for booleans
                    if (typeof value === 'boolean') {
                        searchParams.append(key, value ? '1' : '0');
                    } else if (Array.isArray(value)) {
                        // Handle arrays by appending each element with array syntax
                        value.forEach((item, index) => {
                            searchParams.append(`${key}[${index}]`, item.toString());
                        });
                    } else {
                        searchParams.append(key, value.toString());
                    }
                }
            });

            const response = await fetch(`${apiEndpoint}?${searchParams.toString()}`, {
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
                // Use custom transform if provided
                if (transformResponse) {
                    const transformedItems = transformResponse(data);
                    setItems(transformedItems);
                } else {
                    // Handle different response formats - prioritize new 'data' field, fallback to legacy fields
                    const resultItems = data.data || data.words || data.numbers || data.passwords || data.sentences || data.paragraphs || data.prompts || data.phrases || data.names || data.questions || data.gifts || data.dinners || data.ideas || data.books || [];
                    // Convert numbers to strings if needed
                    const processedItems = resultItems.map((item: any) =>
                        typeof item === 'number' ? item.toString() : item
                    );
                    setItems(processedItems);
                }
                setShowFavorites(false);
            } else {
                throw new Error(data.error || `Failed to generate ${itemName}`);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Request aborted');
                return;
            }

            console.error(`Error generating ${itemName}:`, error);
            let message = error.message || `Failed to generate ${itemName}. Please try again.`;
            let friendlyMessage = message;

            // Convert error messages to friendly ones
            if (message === 'RATE_LIMIT_ERROR') {
                friendlyMessage = `Please wait a moment before generating more ${itemName}.`;
            } else if (message.includes('satisfy the conditions') || message.includes('range is too small')) {
                friendlyMessage = itemName === 'numbers'
                    ? 'The range is too small for the requested quantity without duplicates. Try adjusting the settings.'
                    : 'No words found matching your criteria. Try adjusting the filters.';
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
    const addToFavorites = (item: string) => {
        const updated = [...favorites, item];
        setFavorites(updated);
        localStorage.setItem(favoritesKey, JSON.stringify(updated));
        toast.success(`Added "${item}" to favorites`);
    };

    const removeFromFavorites = (item: string) => {
        const updated = favorites.filter(f => f !== item);
        setFavorites(updated);
        localStorage.setItem(favoritesKey, JSON.stringify(updated));
        toast.success(`Removed "${item}" from favorites`);
    };

    const clearAllFavorites = () => {
        setFavorites([]);
        localStorage.removeItem(favoritesKey);
        toast.success('Cleared all favorites');
        setShowFavorites(false);
    };

    // Copy to clipboard
    const copyToClipboard = () => {
        const itemsToCopy = showFavorites ? favorites : items;
        // Extract strings from WordItems
        const itemsAsStrings = itemsToCopy.map(item => {
            if (typeof item === 'string') return item;
            if ('word' in item) return item.word;
            if ('value' in item) return item.value;
            return String(item);
        });
        const text = itemsAsStrings.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            const itemType = itemName.slice(0, -1); // Remove 's' from end
            toast.success(`Copied ${itemsToCopy.length} ${itemType}${itemsToCopy.length !== 1 ? 's' : ''} to clipboard`);
        }).catch(() => {
            toast.error('Failed to copy to clipboard');
        });
    };

    // Auto-generate on mount if requested
    useEffect(() => {
        if (autoGenerate) {
            // Default params for auto-generation
            const defaultParams = itemName === 'numbers'
                ? { min: 1, max: 100, allowDuplicates: true, sortOrder: 'random' }
                : {};
            generateItems(defaultParams);
        }
    }, []);

    return {
        // State
        items,
        words: items, // Alias for backward compatibility
        numbers: items, // Alias for backward compatibility
        loading,
        showLoading,
        quantity,
        favorites,
        showFavorites,

        // Setters
        setItems,
        setWords: setItems, // Alias for backward compatibility
        setNumbers: setItems, // Alias for backward compatibility
        setQuantity,
        setShowFavorites,

        // Actions
        generateItems,
        generateWords: generateItems, // Alias for backward compatibility
        generateNumbers: generateItems, // Alias for backward compatibility
        addToFavorites,
        removeFromFavorites,
        clearAllFavorites,
        copyToClipboard,
    };
}