import { Typography } from '@mui/material';
import { WidgetProps } from '@rjsf/core';
import React, { FC, useCallback, useEffect } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { translate } from 'src/hooks/useTranslations';
import { calculateSize, StyledLabel, StyledPaper } from '.';

const FileDropzoneWidget: FC<WidgetProps> = (props) => {
    const handleDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        if (acceptedFiles.length <= 0) return;
        const reader = new FileReader();
        reader.onload = () => {
            props.onChange(reader.result);
        };
        reader.readAsDataURL(acceptedFiles[0]);
    }, []);

    const { getInputProps, getRootProps, acceptedFiles } = useDropzone({ onDrop: handleDrop, maxFiles: 1 });

    const files = acceptedFiles.map((file) => (
        <Typography>
            {file.name} - {calculateSize(file.size)}
        </Typography>
    ));

    return (
        <div>
            <StyledLabel>{props.label}</StyledLabel>
            <StyledPaper {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography>{translate('Process.Details.Modeler.Widgets.FileDropzone.InnerText')}</Typography>
            </StyledPaper>
            {files}
        </div>
    );
};

export default FileDropzoneWidget;
