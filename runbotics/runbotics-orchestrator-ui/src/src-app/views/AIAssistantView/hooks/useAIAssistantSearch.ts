import { useState, useMemo, useEffect } from 'react';

import useAuth from '#src-app/hooks/useAuth';
import { useDispatch, useSelector } from '#src-app/store';
import { aiAssistantsActions, aiAssistantsSelector } from '#src-app/store/slices/AIAssistants';

import { getLocalizedText, AI_ASSISTANT_CONSTANTS } from '../types';

interface UseAIAssistantSearchProps {
    pageSize?: number;
}

export const useAIAssistantSearch = ({ 
    pageSize = 16 
}: UseAIAssistantSearchProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [hasInitiallyFetched, setHasInitiallyFetched] = useState<boolean>(false);

    const dispatch = useDispatch();
    const { user } = useAuth();
    const userLang = user?.langKey || 'pl';
    const { all } = useSelector(aiAssistantsSelector);
    const { assistants, loading, error } = all;

    useEffect(() => {
        if (!hasInitiallyFetched && !loading) {
            dispatch(aiAssistantsActions.fetchAIAssistants());
            setHasInitiallyFetched(true);
        }
    }, [hasInitiallyFetched, loading, dispatch]);

    const categories = useMemo(() => {
        const categoriesSet: Set<string> = new Set(
            assistants.flatMap(a => (a.categories ?? []).map(String))
        );
        const sortedCategories = Array.from(categoriesSet).sort();
        return [AI_ASSISTANT_CONSTANTS.ALL_CATEGORIES_KEY, ...sortedCategories];
    }, [assistants]);

    const filteredAssistants = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        
        if (q.length > 0) {
            return assistants.filter(a => {
                const name = getLocalizedText(a.name || { pl: '', en: '' }, userLang);
                const description = getLocalizedText(a.description || { pl: '', en: '' }, userLang);
                return name.toLowerCase().includes(q) || description.toLowerCase().includes(q);
            });
        }
        
        if (selectedCategories.length === 0) {
            return assistants;
        }
        
        return assistants.filter(a => 
            (a.categories || []).some(cat => selectedCategories.includes(cat))
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
                    return prev.filter(c => c !== category);
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
        setHasInitiallyFetched(false);
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
