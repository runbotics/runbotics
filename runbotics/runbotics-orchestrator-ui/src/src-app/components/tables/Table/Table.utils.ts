
import { SpecialRow, DataRow, EndedBranch } from './Table.types';

export const TABLE_PAGE_SIZES = [10, 20, 30] as const;

export const TABLE_ROW_HEIGHT = 54;

export const INTERACTIVE_COLUMNS = ['expander', 'button', 'rerun-menu'];

export const SUBPROCESSES_PAGE_SIZE = 2;

export const LOAD_MORE_SUBPROCESSES_PAGE_SIZE = 100;

export const SUBROW_INDENT_MULTIPLIER = 30;

export const calcPage = (subprocessesNum: number, pageSize: number) => Math.floor(subprocessesNum / pageSize);

export const getSpecialRows = (dataRows: DataRow[]): SpecialRow[] => {
    const specialRows = dataRows.reduce((acc, { createdRow, loaderOrLoadMore }) => {
        const key = createdRow.props.children.key;
        if (loaderOrLoadMore) return [...acc, { key, loaderOrLoadMore }];
        return [...acc];
    }, []);

    return specialRows;
};

export const getRowId = (row) => row?.props?.children?.key;

export const getNthId = (accumulator: JSX.Element[], nthIdx: number) => {
    const nthId = accumulator.at(nthIdx)?.props?.children?.key;
    return nthId ? nthId : getNthId(accumulator, nthIdx - 1);
};

export const getEndedBranches = (prevRowId: string, currRowId: string): EndedBranch[] => {
    const currIds = currRowId.split('.');
    const prevIds = prevRowId.split('.');

    const endedBranches = prevIds.reduce((acc, prevId, index) => {
        const currId = currIds[index];
        if (prevId !== currId)
        { return [...acc, { index, changedId: prevId, id: prevRowId.split('.').slice(0, index + 1).join('.') }]; }
        return acc;
    }, []);

    return endedBranches;
};

export const getRowsToInsert = (endedBranches: EndedBranch[], specialRows: SpecialRow[]) => {
    const specialRowsIds = endedBranches.map(branch => branch.id);

    const reduced = specialRows.reduce((acc, { key, loaderOrLoadMore }) => {
        if (specialRowsIds.includes(key)) {
            return [...acc, loaderOrLoadMore];
        }
        return acc;
    }, []);

    const reversedReduced = reduced.reverse();

    return reversedReduced;
};
