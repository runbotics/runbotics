export const redirectToWebsiteRoot = (language?: string): void => {
    if (typeof window !== 'undefined') {
        const path = language === 'pl' ? '/pl/' : '/';
        window.location.href = path;
    }
};
