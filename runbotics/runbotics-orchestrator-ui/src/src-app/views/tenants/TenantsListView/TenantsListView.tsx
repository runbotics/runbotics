import { VFC, useState } from 'react';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import useTranslations from '#src-app/hooks/useTranslations';

import TenantsListTable from './TenantsListTable/TenantsListTable';
import { StyledActionsContainer, StyledTextField } from './TenantsListView.styles';

import { ROWS_PER_PAGE, DefaultPageValue } from '../TenantsBrowseView/TenantsBrowseView.utils';

const TenantsListView: VFC = () => {
    const { translate } = useTranslations();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentPage = parseInt(searchParams.get('page'));
    const pageSizeFromUrl = parseInt(searchParams.get('pageSize'));
    const [page, setPage] = useState(currentPage ? currentPage : DefaultPageValue.PAGE);
    const [limit, setLimit] = useState(
        pageSizeFromUrl && ROWS_PER_PAGE.includes(pageSizeFromUrl)
            ? pageSizeFromUrl
            : DefaultPageValue.PAGE_SIZE
    );

    const [search, setSearch] = useState(); // change to hook
    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    return (
        <>
            <StyledActionsContainer>
                <StyledTextField
                    margin='dense'
                    placeholder={translate('Tenants.List.View.SearchBarPlaceholder')}
                    size='small'
                    value={search}
                    onChange={handleSearch}
                />
            </StyledActionsContainer>
            <TenantsListTable/>
        </>
    );
};

export default TenantsListView;
