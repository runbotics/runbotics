import { useState, useMemo, useEffect } from 'react';

import useAuth from '#src-app/hooks/useAuth';
import { useDispatch, useSelector } from '#src-app/store';
import { aiAssistantsActions, aiAssistantsSelector } from '#src-app/store/slices/AIAssistants';

import { getLocalizedText, AI_ASSISTANT_CONSTANTS } from '../types';

interface UseAIAssistantSearchProps {
    pageSize?: number;
}

export const useAIAssistantSearch = ({ 
    pageSize = AI_ASSISTANT_CONSTANTS.DEFAULT_PAGE_SIZE 
}: UseAIAssistantSearchProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const dispatch = useDispatch();
    const { user } = useAuth();
    const userLang = user?.langKey || 'pl';
    const { assistants, loading, error } = useSelector(aiAssistantsSelector);

    useEffect(() => {
        dispatch(aiAssistantsActions.fetchAIAssistants());
    }, []);

    const categories = useMemo(() => {
        const categoriesSet: Set<string> = new Set(
            assistants.flatMap(assistant => (assistant.categories ?? []).map(String))
        );
        const sortedCategories = Array.from(categoriesSet).sort();
        return [AI_ASSISTANT_CONSTANTS.ALL_CATEGORIES_KEY, ...sortedCategories];
    }, [assistants]);

    const filteredAssistants = useMemo(() => {
        const searchTerm = searchQuery.trim().toLowerCase();
        
        if (searchTerm.length > 0) {
            return assistants.filter(assistant => {
                const name = getLocalizedText(assistant.name || { pl: '', en: '' }, userLang);
                const description = getLocalizedText(assistant.description || { pl: '', en: '' }, userLang);
                return name.toLowerCase().includes(searchTerm) || description.toLowerCase().includes(searchTerm);
            });
        }
        
        if (selectedCategories.length === 0) {
            return assistants;
        }
        
        return assistants.filter(assistant => 
            (assistant.categories || []).some(category => selectedCategories.includes(category))
        );
    }, [assistants, selectedCategories, searchQuery, userLang]);

    const pageCount = Math.max(1, Math.ceil(filteredAssistants.length / pageSize));
    const paginatedAssistants = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredAssistants.slice(start, start + pageSize);
    }, [filteredAssistants, page, pageSize]);

    const handleCategoryClick = (category: string) => {
        setSearchQuery('');
        
        if (category === AI_ASSISTANT_CONSTANTS.ALL_CATEGORIES_KEY) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(prev => {
                if (prev.includes(category)) {
                    return prev.filter(currentCategory => currentCategory !== category);
                }
                return [...prev, category];
            });
        }
        setPage(1);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        if (selectedCategories.length > 0) {
            setSelectedCategories([]);
        }
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleRetry = () => {
        dispatch(aiAssistantsActions.fetchAIAssistants());
    };

    return {
        selectedCategories,
        searchQuery,
        page,
        categories,
        loading,
        error,
        
        filteredAssistants,
        paginatedAssistants,
        pageCount,
        totalCount: assistants.length,
        filteredCount: filteredAssistants.length,
        
        handleCategoryClick,
        handleSearchChange,
        handlePageChange,
        handleRetry,
    };
};
