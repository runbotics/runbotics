import { useState } from 'react';

export type Range = {
    min?: number;
    max?: number;
};

/**
 * Wrap state in given range
 */
const useWrappedState = (initialValue: number, { min, max }: Range = undefined) => {
    const [wrappedValue, setWrappedValue] = useState(initialValue);

    const updateValue = (value: number) => {
        let newValue = value;

        if (min) newValue = Math.max(min, newValue);
        if (max) newValue = Math.min(max, newValue);

        setWrappedValue(newValue);
    };

    return [wrappedValue, updateValue] as const;
};

export default useWrappedState;
