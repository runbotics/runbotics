import { useRef, useEffect } from 'react';
import { Classes, OnError, Locale } from './types';
import DEFAULT_LOCALE_EN from './locale';
/**
 * Creates an array of integers from start to end, inclusive
 */
export function range(start: number, end: number) {
    const array: number[] = [];

    for (let i = start; i <= end; i += 1) {
        array.push(i);
    }

    return array;
}

/**
 * Sorts an array of numbers
 */
export function sort(array: number[]) {
    array.sort((a, b) => a - b);

    return array;
}

/**
 * Removes duplicate entries from an array
 */
export function dedup(array: number[]) {
    const result: number[] = [];

    array.forEach((i) => {
        if (result.indexOf(i) < 0) {
            result.push(i);
        }
    });

    return result;
}

/**
 * Simple classNames util function to prevent adding external library 'classnames'
 */
export function classNames(classes: Classes) {
    return Object.entries(classes)
        .filter(([key, value]) => key && value)
        .map(([key]) => key)
        .join(' ');
}

/**
 * Handle onError prop to set the error
 */
export function setError(onError: OnError, locale: Locale) {
    return onError && onError({
        type: 'invalid_cron',
        description: locale.errorInvalidCron || DEFAULT_LOCALE_EN.errorInvalidCron,
    });
}

/**
 * React useEffect hook to return the previous value
 */
export function usePrevious(value) {
    const ref = useRef(value);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}
