import { useState, useEffect } from 'react';

const STORAGE_PREFIX = 'rwg_';

/**
 * A hook that persists state to localStorage.
 * Works like useState but automatically syncs to/from localStorage.
 */
export function usePersistedState<T>(
    key: string,
    defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const storageKey = `${STORAGE_PREFIX}${key}`;

    const [value, setValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return defaultValue;
        }
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved !== null) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn(`Failed to parse localStorage key "${storageKey}"`, e);
        }
        return defaultValue;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(storageKey, JSON.stringify(value));
        } catch (e) {
            console.warn(`Failed to save to localStorage key "${storageKey}"`, e);
        }
    }, [storageKey, value]);

    return [value, setValue];
}

/**
 * Clears all persisted form state (useful for reset functionality).
 */
export function clearPersistedFormState(keys?: string[]) {
    if (typeof window === 'undefined') return;

    if (keys) {
        keys.forEach(key => {
            localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
        });
    } else {
        // Clear all rwg_ prefixed keys
        Object.keys(localStorage)
            .filter(key => key.startsWith(STORAGE_PREFIX))
            .forEach(key => localStorage.removeItem(key));
    }
}
