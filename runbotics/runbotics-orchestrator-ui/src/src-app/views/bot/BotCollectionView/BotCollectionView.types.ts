import { MouseEvent } from 'react';

import { BotCollectionDto } from 'runbotics-common';

import { CollectionsDisplayMode } from '../BotBrowseView/BotBrowseView.utils';

export interface BotCollectionViewProps {
    page: number;
    setPage: (page: number) => void;
    limit: number;
    setLimit: (limit: number) => void;
    displayMode: CollectionsDisplayMode;
    setSearch?: (search: string) => void;
    setSearchField?: (searchField: string) => void;
}

export interface BotCollectionHeaderProps {
    search: string;
    displayMode: CollectionsDisplayMode;
    botCollectionLength: number;
    onDisplayModeChange: (event: MouseEvent<HTMLElement>, value: CollectionsDisplayMode) => void;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IBotCollectionWithFilters extends BotCollectionDto{
    createdByName?: string | null;
}
