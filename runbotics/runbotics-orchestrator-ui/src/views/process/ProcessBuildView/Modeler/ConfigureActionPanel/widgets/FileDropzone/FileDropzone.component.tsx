import { FC, useCallback } from 'react';

import { Typography } from '@mui/material';
import { WidgetProps } from '@rjsf/core';
import { useDropzone } from 'react-dropzone';

import { translate } from 'src/hooks/useTranslations';

import { calculateSize, StyledLabel, StyledPaper } from '.';

const FileDropzoneWidget: FC<WidgetProps> = (props) => {
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

    const { getInputProps, getRootProps, acceptedFiles } = useDropzone({ onDrop: handleDrop, maxFiles: 1 });

    const files = acceptedFiles.map((file, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Typography key={index}>
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
