import { AIAssistant } from '#src-app/views/AIAssistantView/types';

export interface AIAssistantsState {
    all: {
        loading: boolean;
        assistants: AIAssistant[];
        error: string | null;
    };
}

export const initialState: AIAssistantsState = {
    all: {
        loading: false,
        assistants: [],
        error: null,
    },
};
