import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { WidgetProps } from '@rjsf/core';
import React, { FC, useCallback, useEffect } from 'react';
import { useDropzone, Accept, FileRejection, DropEvent } from 'react-dropzone';
import { translate } from 'src/hooks/useTranslations';
import styled from 'styled-components';
interface FileDropzoneWidgetProps {
    label: string;
    vaule: string[];
}
interface DropzoneRootProps {
    isDragAccept?: boolean;
    isDragReject?: boolean;
    isFocused?: boolean;
}
const getColor = (props: DropzoneRootProps) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isFocused) {
        return '#2196f3';
    }
    return '#eeeeee';
};

const StyledPaper = styled(Paper)`
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    margin: 10px 0;
    border-color: ${(props: DropzoneRootProps) => getColor(props)};
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border 0.2s;
    cursor: pointer;
`;
const StyledLabel = styled(Typography)(
    ({ theme }) => `    
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(10px) scale(0.75);
    font-size: 1rem;
    transform-origin: top left;
    background-color: ${theme.palette.background.paper};
    padding: 0 4px;
`,
);

const FileDropzoneWidget: FC<WidgetProps> = (props) => {
    const [file, setFile] = React.useState(null);
    const handleDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        if (acceptedFiles.length <= 0) return;
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setFile(reader.result as string);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const { getInputProps, getRootProps, acceptedFiles } = useDropzone({ onDrop: handleDrop, maxFiles: 1 });

    const files = acceptedFiles.map((file) => (
        <Typography>
            {file.name} -{' '}
            {file.size / 1024 > 1024
                ? (file.size / 1024 / 1024).toFixed(2) + ' mb'
                : (file.size / 1024).toFixed(2) + ' kb'}
        </Typography>
    ));
    useEffect(() => {
        props.onChange(file);
    }, [file]);

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
