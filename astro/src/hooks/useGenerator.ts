import { useState, useRef, useEffect } from 'react';

export type WordItem = string | { word: string; synonyms?: string; definition?: string } | { value: string; definition?: string };

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

// Client-side word cache for instant regeneration
const wordCache: { [key: string]: string[] } = {};
const CACHEABLE_TYPES = ['all', 'noun', 'verb', 'adjective', 'basic'];
const CACHE_SIZE = 500; // Fetch 500 words to cache

// Helper to check if filters are applied
const hasFilters = (params: GenerateParams): boolean => {
    const filterKeys = ['firstLetter', 'lastLetter', 'sizeType', 'comparing', 'count'];
    return filterKeys.some(key => params[key] && params[key] !== '');
};

// Helper to get random items from array
const getRandomFromCache = (cache: string[], qty: number): string[] => {
    const shuffled = [...cache].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, qty);
};

// Simple toast function for Astro (no react-hot-toast dependency in component)
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `px-4 py-2 rounded-md shadow-lg text-white ${type === 'success' ? 'bg-brand-teal' : 'bg-red-500'} animate-fade-in`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};

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
    const [loading, setLoading] = useState(autoGenerate); // Start loading if auto-generating
    const [showLoading, setShowLoading] = useState(autoGenerate); // Show spinner immediately on initial load
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
        const wordType = params.type || defaultType;
        const cacheKey = wordType;

        // Check if we can use cached words (cacheable type + no filters)
        const canUseCache = CACHEABLE_TYPES.includes(wordType) && !hasFilters(params);

        // If we have cached words and can use cache, return instantly from cache
        if (canUseCache && wordCache[cacheKey] && wordCache[cacheKey].length >= quantity) {
            const cachedResults = getRandomFromCache(wordCache[cacheKey], quantity);
            setItems(cachedResults);
            setShowFavorites(false);
            return;
        }

        // Cancel any pending request (only if still active)
        if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setLoading(true);

        // Only reset showLoading if we already have items (not initial load)
        // This prevents the "No matches" message from flashing on first load
        const isInitialLoad = items.length === 0;
        if (!isInitialLoad) {
            setShowLoading(false);
        }

        // Show loading after 300ms (for regenerating with existing items)
        const loadingTimer = setTimeout(() => {
            setShowLoading(true);
        }, 300);

        try {
            const searchParams = new URLSearchParams();
            // If cacheable and no cache yet, request more words to cache
            const requestQuantity = (canUseCache && !wordCache[cacheKey]) ? CACHE_SIZE : quantity;
            searchParams.append('quantity', requestQuantity.toString());

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

            // Use the apiEndpoint from options
            const fullApiUrl = `${apiEndpoint}?${searchParams.toString()}`;

            const response = await fetch(fullApiUrl, {
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
                let resultItems: any[];
                if (transformResponse) {
                    resultItems = transformResponse(data);
                } else {
                    // Handle different response formats - prioritize new 'data' field, fallback to legacy fields
                    resultItems = data.data || data.words || data.numbers || data.passwords || data.sentences || data.paragraphs || data.prompts || data.phrases || data.names || data.questions || data.facts || data.gifts || data.dinners || data.ideas || data.books || [];
                    // Convert numbers to strings if needed
                    resultItems = resultItems.map((item: any) =>
                        typeof item === 'number' ? item.toString() : item
                    );
                }

                // Cache the results if cacheable
                if (canUseCache && !wordCache[cacheKey]) {
                    wordCache[cacheKey] = resultItems as string[];
                    // Return only the requested quantity
                    const displayItems = getRandomFromCache(resultItems as string[], quantity);
                    setItems(displayItems);
                } else {
                    setItems(resultItems);
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
                showToast(friendlyMessage, 'error');
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
    const truncateForToast = (text: string, maxLength = 30) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const addToFavorites = (item: string) => {
        const updated = [...favorites, item];
        setFavorites(updated);
        localStorage.setItem(favoritesKey, JSON.stringify(updated));
        showToast(`Added "${truncateForToast(item)}" to favorites`);
    };

    const removeFromFavorites = (item: string) => {
        const updated = favorites.filter(f => f !== item);
        setFavorites(updated);
        localStorage.setItem(favoritesKey, JSON.stringify(updated));
        showToast(`Removed "${truncateForToast(item)}" from favorites`);
    };

    const clearAllFavorites = () => {
        setFavorites([]);
        localStorage.removeItem(favoritesKey);
        showToast('Cleared all favorites');
        setShowFavorites(false);
    };

    // Strip HTML tags from a string
    const stripHtml = (html: string): string => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    // Copy to clipboard
    const copyToClipboard = () => {
        const itemsToCopy = showFavorites ? favorites : items;
        // Extract strings from WordItems
        const itemsAsStrings = itemsToCopy.map(item => {
            let text: string;
            if (typeof item === 'string') text = item;
            else if ('word' in item) text = item.word;
            else if ('value' in item) text = item.value;
            else text = String(item);
            // Strip HTML tags for clean clipboard content
            text = stripHtml(text);
            // Remove trailing "Source" link text (for facts)
            text = text.replace(/\n\nSource\s*$/, '');
            return text;
        });
        const text = itemsAsStrings.join('\n\n');
        navigator.clipboard.writeText(text).then(() => {
            const itemType = itemName.slice(0, -1); // Remove 's' from end
            showToast(`Copied ${itemsToCopy.length} ${itemType}${itemsToCopy.length !== 1 ? 's' : ''} to clipboard`);
        }).catch(() => {
            showToast('Failed to copy to clipboard', 'error');
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
