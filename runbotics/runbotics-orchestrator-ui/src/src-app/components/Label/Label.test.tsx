import { screen } from '@testing-library/react';
import * as RunboticsCommon from 'runbotics-common';
import '@testing-library/jest-dom';
import { describe, expect, it, vi } from 'vitest';

import { renderWithTestTheme } from 'src/test-utils/renderWithTestTheme';

import Label from './Label';

vi.mock('runbotics-common', async () => {
    const actual = await vi.importActual<typeof import('runbotics-common')>(
        'runbotics-common'
    );
    return {
        ...actual,
        isProcessInstanceFinished: vi.fn(),
        ProcessInstanceStatus: {
            FINISHED: 'FINISHED',
            ERROR: 'ERROR',
            RUNNING: 'RUNNING',
        },
    };
});

describe('<Label />', () => {
    const { isProcessInstanceFinished } = RunboticsCommon;

    it('renders children correctly', () => {
        renderWithTestTheme(<Label>FINISHED</Label>);
        expect(screen.queryByText('FINISHED')).not;
    });

    it('does not render warning icon if warning is false', () => {
        renderWithTestTheme(<Label warning={false}>FINISHED</Label>);
        expect(screen.queryByTestId('WarningAmberRoundedIcon')).toBeNull();
    });

    it('renders warning icon if warning is true and process is finished', () => {
        // @ts-expect-error: isProcessInstanceFinished is statically typed as a regular function, but we're mocking it in tests
        isProcessInstanceFinished.mockReturnValue(true);

        renderWithTestTheme(<Label warning={true}>FINISHED</Label>);
        expect(screen.queryByTestId('WarningAmberRoundedIcon')).not.toBeNull();
    });

    it('does not render warning icon if warning is true but status is not finished', () => {
        // @ts-expect-error: isProcessInstanceFinished is statically typed as a regular function, but we're mocking it in tests
        isProcessInstanceFinished.mockReturnValue(false);

        renderWithTestTheme(<Label warning={true}>RUNNING</Label>);
        expect(screen.queryByTestId('WarningAmberRoundedIcon')).toBeNull();
    });

    it('does not render warning icon if children is not a valid status', () => {
        // @ts-expect-error: isProcessInstanceFinished is statically typed as a regular function, but we're mocking it in tests
        isProcessInstanceFinished.mockReturnValue(true);

        renderWithTestTheme(<Label warning={true}>INVALID</Label>);
        expect(screen.queryByTestId('WarningAmberRoundedIcon')).toBeNull();
    });
});

describe('<Label />', () => {
    const { isProcessInstanceFinished } = RunboticsCommon;

    it('renders children correctly', () => {
        renderWithTestTheme(<Label>FINISHED</Label>);
        expect(screen.getByText('FINISHED')).toBeInTheDocument();
    });

    it('does not render warning icon if warning is false', () => {
        renderWithTestTheme(<Label warning={false}>FINISHED</Label>);
        expect(
            screen.queryByTestId('WarningAmberRoundedIcon')
        ).not.toBeInTheDocument();
    });

    it('renders warning icon if warning is true and process is finished', () => {
        // @ts-expect-error: isProcessInstanceFinished is statically typed as a regular function, but we're mocking it in tests
        isProcessInstanceFinished.mockReturnValue(true);

        renderWithTestTheme(<Label warning={true}>FINISHED</Label>);
        expect(
            screen.getByTestId('WarningAmberRoundedIcon')
        ).toBeInTheDocument();
    });

    it('does not render warning icon if warning is true but status is not finished', () => {
        // @ts-expect-error: isProcessInstanceFinished is statically typed as a regular function, but we're mocking it in tests
        isProcessInstanceFinished.mockReturnValue(false);

        renderWithTestTheme(<Label warning={true}>RUNNING</Label>);
        expect(
            screen.queryByTestId('WarningAmberRoundedIcon')
        ).not.toBeInTheDocument();
    });

    it('does not render warning icon if children is not a valid status', () => {
        // @ts-expect-error: isProcessInstanceFinished is statically typed as a regular function, but we're mocking it in tests
        isProcessInstanceFinished.mockReturnValue(true);

        renderWithTestTheme(<Label warning={true}>INVALID</Label>);
        expect(
            screen.queryByTestId('WarningAmberRoundedIcon')
        ).not.toBeInTheDocument();
    });
});
