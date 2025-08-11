import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import { describe, expect, test } from 'vitest';

import { Counter } from './Counter';

describe('Counter Component', () => {
    test('renders with initial count of 0', () => {
        render(<Counter />);
        const countElement = screen.getByTestId('count-value');
        expect(countElement.textContent).toBe('0');
    });

    test('increments the counter when increment button is clicked', () => {
        render(<Counter />);
        const incrementButton = screen.getByText('Increment');
        fireEvent.click(incrementButton);
        const countElement = screen.getByTestId('count-value');
        expect(countElement.textContent).toBe('1');
    });
});
