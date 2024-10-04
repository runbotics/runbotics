import { DropzoneRootProps } from '.';

export const MAX_FILE_SIZE = 4194304; // 4MB -> 4194304 bytes

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
    if (size < 1024) {
        return size + ' bytes';
    }

    if (size >= 1024 && size < 1048576) {
        return (size / 1024).toFixed(2) + ' KB';
    }

    if (size >= 1048576) {
        return (size / 1048576).toFixed(2) + ' MB';
    }

    return size;
};

export const isFileSizeAllowed = (sizeInBytes: number) =>
    sizeInBytes <= MAX_FILE_SIZE;
