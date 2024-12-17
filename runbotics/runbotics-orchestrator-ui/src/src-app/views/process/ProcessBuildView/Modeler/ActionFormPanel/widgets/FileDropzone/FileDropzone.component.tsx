import { FC, useCallback, useEffect } from 'react';

import { Typography } from '@mui/material';
import { WidgetProps } from '@rjsf/core';
import { useSnackbar } from 'notistack';
import { useDropzone } from 'react-dropzone';

import { translate } from '#src-app/hooks/useTranslations';

import {
    calculateSize,
    isFileSizeAllowed,
    MAX_FILE_SIZE,
    StyledLabel,
    StyledPaper,
} from '.';

const FileDropzoneWidget: FC<WidgetProps> = (props) => {
    const { enqueueSnackbar } = useSnackbar();

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length <= 0) return;
        const reader = new FileReader();
        reader.onload = () => {
            const filename = acceptedFiles[0].name.split('.')[0];
            props.onChange(`filename:${filename};` + reader.result);
        };
        reader.readAsDataURL(acceptedFiles[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { getInputProps, getRootProps, acceptedFiles, fileRejections } =
        useDropzone({
            onDrop: handleDrop,
            maxFiles: 1,
            maxSize: MAX_FILE_SIZE,
        });

    useEffect(() => {
        if (fileRejections.length > 1) {
            enqueueSnackbar(
                translate('Process.Details.Modeler.Widgets.FileDropzone.TooManyFiles'),
                { variant: 'warning' }
            );
        } else if (
            fileRejections.length === 1 &&
            !isFileSizeAllowed(fileRejections[0].file.size)
        ) {
            enqueueSnackbar(
                translate('Process.Details.Modeler.Widgets.FileDropzone.TooLargeFileSize'),
                { variant: 'warning' }
            );
        }
    }, [fileRejections]);

    const files = acceptedFiles.map((file) => (
        <Typography key={file.name}>
            {file.name} - {calculateSize(file.size)}
        </Typography>
    ));

    return (
        <div>
            <StyledLabel>{props.label}</StyledLabel>
            <StyledPaper {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography>
                    {translate('Process.Details.Modeler.Widgets.FileDropzone.InnerText')}
                </Typography>
            </StyledPaper>
            {files}
        </div>
    );
};

export default FileDropzoneWidget;
