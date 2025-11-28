import React, { VFC } from 'react';

import { Typography, Grid, Pagination, Box } from '@mui/material';
import { Container } from '@mui/system';

import InternalPage from '#src-app/components/pages/InternalPage';
import If from '#src-app/components/utils/If';
import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';

import { redirectToWebsiteRoot } from '#src-app/utils/navigation';

import { AssistantCard } from './components/AssistantCard';
import { CategoryFilter } from './components/CategoryFilter';
import { EmptyList } from './components/EmptyList';
import { SearchAndCount } from './components/SearchAndCount';
import { SearchError } from './components/SearchError';
import { useAIAssistantSearch } from './hooks/useAIAssistantSearch';
import { AI_ASSISTANT_CONSTANTS } from './types';

const AIAssistantView: VFC = () => {
    const { translate } = useTranslations();
    const { user } = useAuth();

    const pageTitle = translate('AIAssistant.Title');
    const isTenantDefault = user.tenant.id === AI_ASSISTANT_CONSTANTS.DEFAULT_TENANT_ID;

    if (!isTenantDefault) {
        redirectToWebsiteRoot(user.langKey);
    }

    const {
        selectedCategories,
        searchQuery,
        page,
        categories,
        paginatedAssistants,
        pageCount,
        totalCount,
        loading,
        error,
        handleCategoryClick,
        handleSearchChange,
        handlePageChange,
        handleRetry,
    } = useAIAssistantSearch({
        pageSize: AI_ASSISTANT_CONSTANTS.DEFAULT_PAGE_SIZE,
    });

    const hasResults = !error && paginatedAssistants.length > 0;
    const isLoading = !error && loading;
    const isEmpty = !error && !loading && paginatedAssistants.length === 0;
    const hasError = Boolean(error);

    return (
        <InternalPage title={pageTitle}>
            <Typography variant="h3" color="textPrimary">
                {translate('AIAssistant.Title')}
            </Typography>
            
            <SearchAndCount
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                totalCount={totalCount}
                searchLabel={translate('AIAssistant.Search.Label')}
            />
            
            <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryClick={handleCategoryClick}
            />
            
            <If condition={hasError}>
                <SearchError
                    title={translate('AIAssistant.Error.Title')}
                    description={translate('AIAssistant.Error.Description')}
                    onRetry={handleRetry}
                />
            </If>
            
            <If condition={hasResults}>
                <Grid container spacing={3} mt={2}>
                    {paginatedAssistants.map(assistant => (
                        <AssistantCard
                            key={assistant.id}
                            assistant={assistant}
                        />
                    ))}
                </Grid>
                
                <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, value) => handlePageChange(value)}
                        color="secondary"
                    />
                </Container>
            </If>
            
            <If condition={isLoading}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <Typography variant="body1">{translate('AIAssistant.Loading')}</Typography>
                </Box>
            </If>
            
            <If condition={isEmpty}>
                <EmptyList
                    title={translate('AIAssistant.Empty.Title')}
                    description={translate('AIAssistant.Empty.Description')}
                />
            </If>
        </InternalPage>
    );
};

export default AIAssistantView;
