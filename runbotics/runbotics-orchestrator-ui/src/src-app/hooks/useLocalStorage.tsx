// credits to https://usehooks.com/useLocalStorage/

import { useCallback, useState } from 'react';

export default function useLocalStorage(key: string, initialValue: any) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            // eslint-disable-next-line no-console
            console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = useCallback(
        (value: any) => {
            try {
                // Save state
                setStoredValue(value);
                // Save to local storage
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                // A more advanced implementation would handle the error case
                // eslint-disable-next-line no-console
                console.log(error);
            }
        },
        [key],
    );

    return [storedValue, setValue];
}
