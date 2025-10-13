vi.mock('next/router', () => ({
    useRouter: vi.fn(),
}));

vi.mock('next/image', () => ({
    default: ({ alt, ...props }: any) => <img alt={alt} {...props} />,
}));

vi.mock('#src-app/hooks/useAuth');
vi.mock('#src-app/hooks/useTranslations');
vi.mock('#src-app/components/utils/Secured');
vi.mock('notistack', () => ({
    useSnackbar: vi.fn(),
}));

import { screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { FeatureKey } from 'runbotics-common';
import { beforeEach, describe, expect, Mock, test, vi } from 'vitest';

import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useAuth from '#src-app/hooks/useAuth';
import useTranslations, { translate } from '#src-app/hooks/useTranslations';

import { renderWithTestTheme } from 'src/test-utils/renderWithTestTheme';

import { AssistantCard } from './AssistantCard';
import { createMockAIAssistant } from '../test.utils';

const mockTranslate = translate as Mock;
const mockUseAuth = useAuth as Mock;
const mockUseTranslations = useTranslations as Mock;
const mockHasFeatureKeyAccess = hasFeatureKeyAccess as Mock;
const mockUseSnackbar = useSnackbar as Mock;
const mockPush = vi.fn();
const mockEnqueueSnackbar = vi.fn();

describe('AssistantCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (useRouter as Mock).mockReturnValue({
            push: mockPush,
        });

        mockUseTranslations.mockReturnValue({
            currentLanguage: 'en',
        });

        mockUseAuth.mockReturnValue({
            user: { featureKeys: [FeatureKey.AI_ASSISTANT_ACCESS] },
        });

        mockHasFeatureKeyAccess.mockReturnValue(true);

        mockUseSnackbar.mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar,
        });
    });
    describe('Rendering', () => {
        test('renders assistant information correctly in English', () => {
            const mockAssistant = createMockAIAssistant({
                name: { pl: 'Asystent Testowy', en: 'Test Assistant' },
                description: { pl: 'Opis testowy', en: 'Test description' },
                categories: ['AI', 'Testing'],
            });

            renderWithTestTheme(<AssistantCard assistant={mockAssistant} />);

            expect(screen.getByText('Test Assistant')).toBeInTheDocument();
            expect(screen.getByText('Test description')).toBeInTheDocument();
            expect(screen.getByText('AI')).toBeInTheDocument();
            expect(screen.getByText('Testing')).toBeInTheDocument();
        });

        test('renders assistant information correctly in Polish', () => {
            mockUseTranslations.mockReturnValue({
                currentLanguage: 'pl',
            });

            const mockAssistant = createMockAIAssistant({
                name: { pl: 'Asystent Testowy', en: 'Test Assistant' },
                description: { pl: 'Opis testowy', en: 'Test description' },
                categories: ['AI', 'Testowanie'],
            });

            renderWithTestTheme(<AssistantCard assistant={mockAssistant} />);

            expect(screen.getByText('Asystent Testowy')).toBeInTheDocument();
            expect(screen.getByText('Opis testowy')).toBeInTheDocument();
            expect(screen.getByText('AI')).toBeInTheDocument();
            expect(screen.getByText('Testowanie')).toBeInTheDocument();
        });
    });
    describe('Click behavior', () => {
        test('navigates to assistant URL when user has access', () => {
            const mockAssistant = createMockAIAssistant({
                url: '/test-assistant',
                featureKey: FeatureKey.AI_ASSISTANT_ACCESS,
            });

            mockHasFeatureKeyAccess.mockReturnValue(true);

            renderWithTestTheme(<AssistantCard assistant={mockAssistant} />);
            fireEvent.click(screen.getByText('Test AI Assistant'));

            expect(mockPush).toHaveBeenCalledWith(
                '/app/ai-assistants/test-assistant'
            );
            expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
        });

        test('shows error snackbar when user does not have access', () => {
            const mockAssistant = createMockAIAssistant({
                featureKey: FeatureKey.AI_ASSISTANT_ACCESS,
            });

            mockHasFeatureKeyAccess.mockReturnValue(false);

            renderWithTestTheme(<AssistantCard assistant={mockAssistant} />);
            fireEvent.click(screen.getByText('Test AI Assistant'));
            expect(mockTranslate).toHaveBeenCalledWith(
                'AIAssistant.Error.NoAccess'
            );
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
                mockTranslate('AIAssistant.Error.NoAccess'),
                {
                    variant: 'error',
                    autoHideDuration: 5000,
                }
            );
            expect(mockPush).not.toHaveBeenCalled();
        });
    });
});
