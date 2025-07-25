import { screen } from '@testing-library/react';
import * as RunboticsCommon from 'runbotics-common';
import '@testing-library/jest-dom';
import { ProcessInstanceStatus } from 'runbotics-common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithTestTheme } from 'src/test-utils/renderWithTestTheme';

import Label from './Label';

describe('Label component – null check functions', () => {
    //@ts-expect-error vi namespace is not recognized
    let isProcessInstanceFinishedSpy: vi.Mock;

    beforeEach(() => {
        vi.restoreAllMocks();
        isProcessInstanceFinishedSpy = vi.spyOn(
            RunboticsCommon,
            'isProcessInstanceFinished'
        );
    });

    it('renders children correctly', () => {
        renderWithTestTheme(<Label>{ProcessInstanceStatus.COMPLETED}</Label>);
        expect(screen.queryByText(ProcessInstanceStatus.COMPLETED)).not.toBeNull();
    });

    it('does not render warning icon if warning is false', () => {
        renderWithTestTheme(<Label warning={false}>{ProcessInstanceStatus.COMPLETED}</Label>);
        expect(screen.queryByTestId('WarningAmberRoundedIcon')).toBeNull();
    });

    it('renders warning icon if warning is true and process is finished', () => {
        isProcessInstanceFinishedSpy.mockReturnValue(true);

        renderWithTestTheme(
            <Label warning={true}>{ProcessInstanceStatus.COMPLETED}</Label>
        );
        expect(screen.queryByTestId('WarningAmberRoundedIcon')).not.toBeNull();
    });

    it('does not render warning icon if warning is true but status is not finished', () => {
        isProcessInstanceFinishedSpy.mockReturnValue(false);

        renderWithTestTheme(<Label warning={true}>{ProcessInstanceStatus.IN_PROGRESS}</Label>);
        expect(screen.queryByTestId('WarningAmberRoundedIcon')).toBeNull();
    });

    it('does not render warning icon if children is not a valid status', () => {
        isProcessInstanceFinishedSpy.mockReturnValue(true);

        renderWithTestTheme(<Label warning={true}>INVALID</Label>);
        expect(screen.queryByTestId('WarningAmberRoundedIcon')).toBeNull();
    });
});

describe('Label component – jest-dom assertions', () => {
    //@ts-expect-error vi namespace is not recognized
    let isProcessInstanceFinishedSpy: vi.Mock;

    beforeEach(() => {
        vi.restoreAllMocks();
        isProcessInstanceFinishedSpy = vi.spyOn(
            RunboticsCommon,
            'isProcessInstanceFinished'
        );
    });

    it('renders children correctly', () => {
        renderWithTestTheme(<Label>{ProcessInstanceStatus.COMPLETED}</Label>);
        expect(screen.getByText(ProcessInstanceStatus.COMPLETED)).toBeInTheDocument();
    });

    it('does not render warning icon if warning is false', () => {
        renderWithTestTheme(<Label warning={false}>{ProcessInstanceStatus.COMPLETED}</Label>);
        expect(
            screen.queryByTestId('WarningAmberRoundedIcon')
        ).not.toBeInTheDocument();
    });

    it('renders warning icon if warning is true and process is finished', () => {
        isProcessInstanceFinishedSpy.mockReturnValue(true);

        renderWithTestTheme(<Label warning={true}>{ProcessInstanceStatus.COMPLETED}</Label>);
        expect(
            screen.getByTestId('WarningAmberRoundedIcon')
        ).toBeInTheDocument();
    });

    it('does not render warning icon if warning is true but status is not finished', () => {
        isProcessInstanceFinishedSpy.mockReturnValue(false);

        renderWithTestTheme(<Label warning={true}>{ProcessInstanceStatus.IN_PROGRESS}</Label>);
        expect(
            screen.queryByTestId('WarningAmberRoundedIcon')
        ).not.toBeInTheDocument();
    });

    it('does not render warning icon if children is not a valid status', () => {
        isProcessInstanceFinishedSpy.mockReturnValue(true);

        renderWithTestTheme(<Label warning={true}>INVALID</Label>);
        expect(
            screen.queryByTestId('WarningAmberRoundedIcon')
        ).not.toBeInTheDocument();
    });
});
