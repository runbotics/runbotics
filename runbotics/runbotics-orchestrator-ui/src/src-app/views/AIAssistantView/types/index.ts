export interface LocalizedText {
    pl: string;
    en: string;
}

export interface AIAssistant {
    id: string;
    name: LocalizedText;
    description: LocalizedText;
    categories: string[];
    featureKey: string;
    url: string;
    enabled?: boolean;
    icon?: string;
}

export interface AIAssistantsResponse {
    success: boolean;
    data: AIAssistant[];
    count: number;
}

export const AI_ASSISTANT_CONSTANTS = {
    ALL_CATEGORIES_KEY: 'ALL_CATEGORIES',
    DEFAULT_PAGE_SIZE: 16,
    DEFAULT_TENANT_ID: 'b7f9092f-5973-c781-08db-4d6e48f78e98',
} as const;

export const getLocalizedText = (text: LocalizedText, lang: string = 'pl'): string => {
    const baseLang = lang.split('-')[0];
    return text[baseLang as keyof LocalizedText] || text.pl || text.en || '';
};
