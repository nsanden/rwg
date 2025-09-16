import { useState } from 'react';
import toast from 'react-hot-toast';

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

    // Generate function that builds params based on form state
    const handleGenerate = () => {
        const baseParams: any = {
            type: wordType,
        };

        // Use custom param builder if provided, otherwise use default
        const params = customParamBuilder
            ? customParamBuilder(baseParams, {
                firstLetter,
                lastLetter,
                sizeType,
                comparing,
                count
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
        setShowFavorites(false);

        // Reset custom state
        if (customState) {
            Object.values(customState).forEach(({ setter, defaultValue }) => {
                setter(defaultValue);
            });
        }

        toast.success('Options reset to defaults');
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
        // Actions
        handleGenerate,
        resetOptions,
    };
}