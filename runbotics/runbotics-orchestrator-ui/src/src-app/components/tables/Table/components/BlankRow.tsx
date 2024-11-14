
import { TableRow } from '@mui/material';

import { TABLE_ROW_HEIGHT } from '../Table.utils';

interface BlankRowProps {
    key: number;
}

const BlankRow = ({ key }: BlankRowProps) => (
    <TableRow
        key={`blank-row-${key}`}
        sx={{
            minHeight: `${TABLE_ROW_HEIGHT}px`,
            height: `${TABLE_ROW_HEIGHT}px`,
        }}
    />);

export default BlankRow;
