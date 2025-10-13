/* eslint-disable max-lines-per-function */
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';

import { afterAll, beforeEach, describe, expect, test } from 'vitest';

import axios from '#src-app/utils/axios';

import { createMockAIAssistant } from '#src-app/views/AIAssistantView/test.utils';
import {
    
    AIAssistantsResponse,
} from '#src-app/views/AIAssistantView/types';

import { fetchAIAssistants } from './AIAssistants.thunks';

const mockAxios = new MockAdapter(axios);

const createTestStore = () =>
    configureStore({
        reducer: {
            aiAssistants: (state) => {
                state = state === undefined ? {} : state;
                return state;
            },
        },
    });

describe('fetchAIAssistants thunk', () => {
    let store: ReturnType<typeof createTestStore>;

    beforeEach(() => {
        store = createTestStore();
        mockAxios.reset();
    });

    afterAll(() => {
        mockAxios.restore();
    });

    describe('Success cases', () => {
        test('fetches and validates assistants successfully', async () => {
            const mockAssistants = [
                createMockAIAssistant({
                    id: '1',
                    name: { pl: 'Asystent 1', en: 'Assistant 1' },
                }),
                createMockAIAssistant({
                    id: '2',
                    name: { pl: 'Asystent 2', en: 'Assistant 2' },
                }),
            ];

            const mockResponse: AIAssistantsResponse = {
                success: true,
                data: mockAssistants,
                count: 2,
            };

            mockAxios
                .onGet('/assistant/api/assistants')
                .reply(200, mockResponse);

            const result = await store.dispatch(fetchAIAssistants());

            expect(result.type).toBe('aiAssistants/fetchAll/fulfilled');
            expect(result.payload).toEqual(mockAssistants);
            expect(result.payload).toHaveLength(2);
        });

        test('filters out invalid assistants during validation', async () => {
            const validAssistant = createMockAIAssistant({ id: '1' });
            const invalidAssistant1 = {
                id: '2',
            };
            const validAssistant2 = createMockAIAssistant({
                id: '3',
                featureKey: 'INVALID_KEY' as any,
            });

            const mockResponse: AIAssistantsResponse = {
                success: true,
                data: [
                    validAssistant,
                    invalidAssistant1,
                    validAssistant2,
                ] as any,
                count: 3,
            };

            mockAxios
                .onGet('/assistant/api/assistants')
                .reply(200, mockResponse);

            const result = await store.dispatch(fetchAIAssistants());

            expect(result.type).toBe('aiAssistants/fetchAll/fulfilled');
            expect(result.payload).toHaveLength(1);
            expect(result.payload[0].id).toBe('1');
        });

        test('handles empty response gracefully', async () => {
            const mockResponse: AIAssistantsResponse = {
                success: true,
                data: [],
                count: 0,
            };

            mockAxios
                .onGet('/assistant/api/assistants')
                .reply(200, mockResponse);

            const result = await store.dispatch(fetchAIAssistants());

            expect(result.type).toBe('aiAssistants/fetchAll/fulfilled');
            expect(result.payload).toEqual([]);
        });

        test('handles all invalid assistants', async () => {
            const mockResponse = {
                success: true,
                data: [{ id: '1' }, { name: 'Invalid' }, {}],
                count: 3,
            };

            mockAxios
                .onGet('/assistant/api/assistants')
                .reply(200, mockResponse);

            const result = await store.dispatch(fetchAIAssistants());

            expect(result.type).toBe('aiAssistants/fetchAll/fulfilled');
            expect(result.payload).toEqual([]);
        });
    });

    describe('Validation edge cases', () => {
        test('handles assistants with partial valid data', async () => {
            const partiallyValidAssistant = {
                ...createMockAIAssistant({ id: '1' }),
                unknownField: 'should be stripped',
                categories: [],
            };

            const mockResponse: AIAssistantsResponse = {
                success: true,
                data: [partiallyValidAssistant] as any,
                count: 1,
            };

            mockAxios
                .onGet('/assistant/api/assistants')
                .reply(200, mockResponse);

            const result = await store.dispatch(fetchAIAssistants());

            expect(result.type).toBe('aiAssistants/fetchAll/fulfilled');
            expect(result.payload).toHaveLength(0);
        });

        test('validates featureKey enum values', async () => {
            const invalidFeatureKeyAssistant = {
                ...createMockAIAssistant({ id: '1' }),
                featureKey: 'INVALID_FEATURE_KEY',
            };

            const mockResponse: AIAssistantsResponse = {
                success: true,
                data: [invalidFeatureKeyAssistant] as any,
                count: 1,
            };

            mockAxios
                .onGet('/assistant/api/assistants')
                .reply(200, mockResponse);

            const result = await store.dispatch(fetchAIAssistants());

            expect(result.type).toBe('aiAssistants/fetchAll/fulfilled');
            expect(result.payload).toHaveLength(0);
        });
    });
});
