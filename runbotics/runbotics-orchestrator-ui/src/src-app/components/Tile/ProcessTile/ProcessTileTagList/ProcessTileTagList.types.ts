import { CSSProperties } from 'react';

import { Tag } from 'runbotics-common';

export interface ProcessTileTagListProps {
    tags: Tag[];
    highlightTextStyle: CSSProperties
    searchValue: string;
}
