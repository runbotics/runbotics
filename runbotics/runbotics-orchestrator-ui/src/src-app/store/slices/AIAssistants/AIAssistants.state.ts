import { AIAssistant } from '#src-app/views/AIAssistantView/types';

export interface AIAssistantsState {
    loading: boolean;
    assistants: AIAssistant[];
    error: string | null;
}

export const initialState: AIAssistantsState = {
    loading: false,
    assistants: [],
    error: null,
};
