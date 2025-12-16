import { useState } from 'react';

// Simple toast function for Astro
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

interface CustomStateItem {
    value: any;
    setter: (value: any) => void;
    defaultValue: any;
}

interface UseGeneratorFormOptions {
    wordType: string;
    onGenerate: (params: any) => void;
    setShowFavorites: (show: boolean) => void;
    setQuantity: (quantity: number) => void;
    customParamBuilder?: (params: any, formState: any) => any; // For custom param building
    customState?: {
        [key: string]: CustomStateItem;
    };
}

export function useGeneratorForm({ wordType, onGenerate, setShowFavorites, setQuantity, customParamBuilder, customState }: UseGeneratorFormOptions) {
    // Common form states
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [showMobileShare, setShowMobileShare] = useState(false);
    const [firstLetter, setFirstLetter] = useState('');
    const [lastLetter, setLastLetter] = useState('');
    const [sizeType, setSizeType] = useState('');
    const [comparing, setComparing] = useState('equals');
    const [count, setCount] = useState(5);
    const [noDuplicates, setNoDuplicates] = useState(false);

    // Generate function that builds params based on form state
    const handleGenerate = () => {
        const baseParams: any = {
            type: wordType,
            allowDuplicates: !noDuplicates,
        };

        // Use custom param builder if provided, otherwise use default
        const params = customParamBuilder
            ? customParamBuilder(baseParams, {
                firstLetter,
                lastLetter,
                sizeType,
                comparing,
                count,
                noDuplicates
            })
            : (() => {
                if (firstLetter) baseParams.firstLetter = firstLetter;
                if (lastLetter) baseParams.lastLetter = lastLetter;
                if (sizeType) {
                    baseParams.sizeType = sizeType;
                    baseParams.comparing = comparing;
                    baseParams.count = count;
                }
                return baseParams;
            })();

        onGenerate(params);
    };

    // Reset all form options to defaults
    const resetOptions = () => {
        setQuantity(1);
        setFirstLetter('');
        setLastLetter('');
        setSizeType('');
        setComparing('equals');
        setCount(5);
        setNoDuplicates(false);
        setShowFavorites(false);

        // Reset custom state
        if (customState) {
            Object.values(customState).forEach(({ setter, defaultValue }) => {
                setter(defaultValue);
            });
        }

        showToast('Options reset to defaults');
    };

    // Reset and regenerate with default values (bypasses stale state issue)
    const resetAndGenerate = () => {
        // Reset all state
        setQuantity(1);
        setFirstLetter('');
        setLastLetter('');
        setSizeType('');
        setComparing('equals');
        setCount(5);
        setNoDuplicates(false);
        setShowFavorites(false);

        // Reset custom state
        if (customState) {
            Object.values(customState).forEach(({ setter, defaultValue }) => {
                setter(defaultValue);
            });
        }

        // Generate with default params directly (not reading from state)
        const defaultParams = { type: wordType, allowDuplicates: true };
        onGenerate(defaultParams);

        showToast('Options reset to defaults');
    };

    return {
        // Form state
        showMoreOptions,
        setShowMoreOptions,
        showMobileShare,
        setShowMobileShare,
        firstLetter,
        setFirstLetter,
        lastLetter,
        setLastLetter,
        sizeType,
        setSizeType,
        comparing,
        setComparing,
        count,
        setCount,
        noDuplicates,
        setNoDuplicates,
        // Actions
        handleGenerate,
        resetOptions,
        resetAndGenerate,
    };
}
