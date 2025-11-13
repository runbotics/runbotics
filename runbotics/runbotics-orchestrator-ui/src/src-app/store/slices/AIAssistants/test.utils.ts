import { FeatureKey } from 'runbotics-common';

import { AIAssistant } from '#src-app/views/AIAssistantView/types';

export const createMockAIAssistant = (
    overrides?: Partial<AIAssistant>
): AIAssistant => ({
    id: 'mock-assistant-id',
    name: 'Test AI Assistant',
    description: 'Description of test assistant for testing purposes',
    categories: ['test', 'ai'],
    featureKey: FeatureKey.AI_ASSISTANTS_ACCESS,
    url: '/test-assistant',
    enabled: true,
    icon: undefined,
    ...overrides,
});
