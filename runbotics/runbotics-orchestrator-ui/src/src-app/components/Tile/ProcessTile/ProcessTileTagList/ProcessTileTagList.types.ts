import { Tag } from 'runbotics-common';

export interface ProcessTileTagListProps {
    tags: Tag[];
    searchValue: string;
    refProcessTileContent: React.MutableRefObject<HTMLDivElement>;
}
