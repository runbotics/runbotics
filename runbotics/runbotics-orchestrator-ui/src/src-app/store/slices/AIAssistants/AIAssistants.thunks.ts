import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from '#src-app/utils/axios';
import { AIAssistant, AIAssistantsResponse } from '#src-app/views/AIAssistantView/types';

export const fetchAIAssistants = createAsyncThunk(
    'aiAssistants/fetchAll',
    async (): Promise<AIAssistant[]> => {
        const response = await axios.get<AIAssistantsResponse>('/assistant/api/assistants', {timeout: 10000});
        return response.data.data;
    }
);
