import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { WidgetProps } from '@rjsf/core';
import React, { FC, useCallback, useEffect } from 'react';
import { useDropzone, Accept, FileRejection, DropEvent } from 'react-dropzone';
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

const FileDropzoneWidget: FC<WidgetProps> = (props) => {
    const [file, setFile] = React.useState(null);

    const handleDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setFile(reader.result as string);
            };
            reader.readAsDataURL(file);
        });
    }, []);
    const { getInputProps, getRootProps } = useDropzone({ onDrop: handleDrop, maxFiles: 1 });

    useEffect(() => {
        props.onChange(file);
    }, [file]);

    return (
        <div>
            <StyledPaper {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography>Text</Typography>
            </StyledPaper>
        </div>
    );
};

export default FileDropzoneWidget;
