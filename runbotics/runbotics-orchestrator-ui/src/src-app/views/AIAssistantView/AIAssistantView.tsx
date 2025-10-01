import React, { VFC } from 'react';

import { Typography, Grid, Pagination, Box } from '@mui/material';
import { Container } from '@mui/system';

import InternalPage from '#src-app/components/pages/InternalPage';
import useAuth from '#src-app/hooks/useAuth';
import useTranslations from '#src-app/hooks/useTranslations';

import { redirectToWebsiteRoot } from '#src-app/utils/navigation';

import { AssistantCard } from './components/AssistantCard';
import { CategoryFilter } from './components/CategoryFilter';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { SearchAndStats } from './components/SearchAndStats';
import { useAIAssistantSearch } from './hooks/useAIAssistantSearch';

const AIAssistantView: VFC = () => {
    const { translate } = useTranslations();
    const { user } = useAuth();

    const pageTitle = translate('AIAssistant.Title');
    const isTenantDefault = user.tenant.id === 'b7f9092f-5973-c781-08db-4d6e48f78e98';

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
        pageSize: 16,
    });

    return (
        <InternalPage title={pageTitle}>
            <Typography variant="h3" color="textPrimary">
                {translate('AIAssistant.Title')}
            </Typography>
            
            <SearchAndStats
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                totalCount={totalCount}
                searchLabel={translate('Bot.Collection.Header.Search.Label')}
            />
            
            <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryClick={handleCategoryClick}
            />
            
            {error && (
                <ErrorState
                    title={translate('AIAssistant.Error.Title')}
                    description={translate('AIAssistant.Error.Description')}
                    onRetry={handleRetry}
                />
            )}
            
            {!error && paginatedAssistants.length > 0 && (
                <>
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
                            color="primary"
                        />
                    </Container>
                </>
            )}
            
            {!error && loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <Typography variant="body1">{translate('AIAssistant.Loading')}</Typography>
                </Box>
            )}
            
            {!error && !loading && paginatedAssistants.length === 0 && (
                <EmptyState
                    title={translate('AIAssistant.Empty.Title')}
                    description={translate('AIAssistant.Empty.Description')}
                />
            )}
        </InternalPage>
    );
};

export default AIAssistantView;
