import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from '#src-app/utils/axios';
import {
    AIAssistant,
    AIAssistantSchema,
    AIAssistantsResponse,
} from '#src-app/views/AIAssistantView/types';

export const fetchAIAssistants = createAsyncThunk(
    'aiAssistants/fetchAll',
    async (): Promise<AIAssistant[]> => {
        const response = await axios.get<AIAssistantsResponse>(
            '/assistant/api/assistants',
            { timeout: 10000 }
        );
        const unvalidatedData = response.data.data;
        
        const validatedAssistants = unvalidatedData
            .map((aiAssistant: any) => {
                try {
                    return AIAssistantSchema.validateSync(aiAssistant, {
                        abortEarly: false,
                    });
                } catch {
                    return null;
                }
            })
            .filter(Boolean) as AIAssistant[];

        return validatedAssistants;
    }
);
