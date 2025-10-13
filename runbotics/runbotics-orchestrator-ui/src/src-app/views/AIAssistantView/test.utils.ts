import { FeatureKey } from 'runbotics-common';

import { AIAssistant, AIAssistantsResponse, LocalizedText } from './types';

export const createMockAIAssistant = (overrides?: Partial<AIAssistant>): AIAssistant => ({
    id: 'mock-assistant-id',
    name: { 
        pl: 'Testowy Asystent AI', 
        en: 'Test AI Assistant' 
    },
    description: { 
        pl: 'Opis testowego asystenta do celów testowych', 
        en: 'Description of test assistant for testing purposes' 
    },
    categories: ['test', 'ai'],
    featureKey: FeatureKey.AI_ASSISTANT_ACCESS,
    url: '/test-assistant',
    enabled: true,
    icon: undefined,
    ...overrides,
});

export const createMockLocalizedText = (overrides?: Partial<LocalizedText>): LocalizedText => ({
    pl: 'Tekst po polsku',
    en: 'Text in English',
    ...overrides,
});

export const createMockAIAssistantsResponse = (assistants?: AIAssistant[]): AIAssistantsResponse => ({
    success: true,
    data: assistants || [createMockAIAssistant()],
    count: assistants?.length || 1,
});
