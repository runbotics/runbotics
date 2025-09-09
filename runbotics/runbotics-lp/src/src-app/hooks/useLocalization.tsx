import useTranslations from './useTranslations';

export const useUserLanguage = (): 'en' | 'pl' => {
    const { currentLanguage } = useTranslations();
    
    return currentLanguage === 'pl' ? 'pl' : 'en';
};

export const useLocalizedUrl = () => {
    const language = useUserLanguage();
    
    const getLocalizedUrl = (path: string): string => 
        language === 'pl' ? `/pl${path}` : path;
    
    return { getLocalizedUrl };
};
