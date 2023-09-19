
import { CSSProperties } from 'react';

import { IProcess } from 'runbotics-common';

export interface ProcessTileContentProps {
    process: IProcess;
    highlightTextStyle: CSSProperties;
    searchValue: string;
}
