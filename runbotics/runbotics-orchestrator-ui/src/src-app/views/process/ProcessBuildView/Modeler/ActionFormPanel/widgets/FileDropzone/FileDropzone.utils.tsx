import { MemoryUnit } from 'runbotics-common';

import { DropzoneRootProps } from '.';

export const MAX_FILE_SIZE = MemoryUnit.MB * 4;

export const getColor = (props: DropzoneRootProps) => {
    if (props.isDragAccepted) {
        return '#00e676';
    }

    if (props.isDragRejected) {
        return '#ff1744';
    }

    if (props.isFocused) {
        return '#2196f3';
    }

    return '#eeeeee';
};

export const calculateSize = (size: number) => {
    if (size < MemoryUnit.KB) {
        return size + ' bytes';
    }

    if (size >= MemoryUnit.KB && size < MemoryUnit.MB) {
        return (size / MemoryUnit.KB).toFixed(2) + ' KB';
    }

    if (size >= MemoryUnit.MB) {
        return (size / MemoryUnit.MB).toFixed(2) + ' MB';
    }

    return size;
};

export const isFileSizeAllowed = (sizeInBytes: number) =>
    sizeInBytes <= MAX_FILE_SIZE;
