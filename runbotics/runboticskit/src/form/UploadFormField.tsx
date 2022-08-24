import React, { FC } from 'react';
import CSVReader from 'react-csv-reader';
import { UseUploadReturnType } from '../ReactHookFormJsonSchema';
import { Controller, ControllerRenderProps } from 'react-hook-form';

interface UploadFormFieldProps {
    baseObject: UseUploadReturnType;
}

const UploadFormField: FC<UploadFormFieldProps> = ({ baseObject, ...rest }) => {
    return (
        <React.Fragment>
            <Controller
                control={baseObject.formContext.control}
                name={baseObject.pointer}
                render={(props) => {
                    return (
                        <CSVReader
                            parserOptions={{ header: true }}
                            onFileLoaded={(data, fileInfo) => {
                                console.log('fileinfo', fileInfo);
                                props.onChange(data);
                            }}
                        />
                    );
                }}
            />
        </React.Fragment>
    );
};

export default UploadFormField;
