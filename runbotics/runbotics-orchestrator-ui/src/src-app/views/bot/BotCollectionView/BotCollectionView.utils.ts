import { OrderDirection, OrderPropertyName } from 'runbotics-common';

import { IBotCollectionWithFilters } from './BotCollectionView.types';
import { PageRequestParams } from '../../../utils/types/page';
import { CollectionsDisplayMode, DefaultPageSize } from '../BotBrowseView/BotBrowseView.utils';

export const ROWS_PER_PAGE_LIST_VIEW = [5, 10, 25];

export const getBotCollectionPageParams = (
    page: number, size: number, searchTerm = '', searchField = '',
    // eslint-disable-next-line max-params
): PageRequestParams<Partial<IBotCollectionWithFilters>> => ({
    page,
    size,
    sort: {
        by: OrderPropertyName.UPDATED,
        order: OrderDirection.DESC,
    },
    filter: {
        contains: {
            ...(searchTerm.trim() && { [searchField === 'createdBy' ? 'createdByName' : 'name']: searchTerm.trim() }),
        },
    },
});

export const getLimitByDisplayMode = (mode: CollectionsDisplayMode) => (mode === CollectionsDisplayMode.LIST
    ? DefaultPageSize.TABLE
    : DefaultPageSize.GRID);
