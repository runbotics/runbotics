/* eslint-disable max-lines-per-function */
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';

import { afterAll, beforeEach, describe, expect, test } from 'vitest';

import { createMockAIAssistant } from '#src-app/store/slices/AIAssistants/test.utils';
import axios from '#src-app/utils/axios';

import { AIAssistantsResponse } from '#src-app/views/AIAssistantView/types';

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
        test('should fetch and validate assistants', async () => {
            const mockAssistants = [
                createMockAIAssistant({
                    id: '1',
                    name: 'Assistant 1',
                }),
                createMockAIAssistant({
                    id: '2',
                    name: 'Assistant 2',
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

        test('should filter out invalid assistants during validation', async () => {
            const validAssistant = createMockAIAssistant({ id: '1' });
            const invalidAssistant1 = {
                id: '2',
            };
            const invalidAssistant2 = createMockAIAssistant({
                id: '3',
                featureKey: 'INVALID_KEY' as any,
            });

            const mockResponse: AIAssistantsResponse = {
                success: true,
                data: [
                    invalidAssistant1,
                    validAssistant,
                    invalidAssistant2,
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

        test('should handle empty response gracefully', async () => {
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

        test('should filter out all invalid assistants', async () => {
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
        test('should handle assistants with partial valid data', async () => {
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

        test('should filter out assistants with invalid featureKey values', async () => {
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
