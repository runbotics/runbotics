import React, { FC } from 'react';

import OutputOutlinedIcon from '@mui/icons-material/OutputOutlined';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FeatureKey, ProcessOutput, ProcessOutputType } from 'runbotics-common';

import If from '#src-app/components/utils/If';
import useFeatureKey from '#src-app/hooks/useFeatureKey';
import useProcessConfigurator from '#src-app/hooks/useProcessConfigurator';
import { translate } from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';
import { processOutputSelector } from '#src-app/store/slices/ProcessOutput';

import { capitalizeFirstLetter } from '#src-app/utils/text';

import { StyledLabel, Wrapper } from './BotComponent.styles';

interface ProcessOutputComponent {
    selectedProcessOutput: ProcessOutput;
    onSelectProcessOutput: (processOutput: ProcessOutput) => void;
}

const ProcessOutputComponent: FC<ProcessOutputComponent> = ({
    selectedProcessOutput,
    onSelectProcessOutput,
}) => {
    const { processOutputs } = useSelector(processOutputSelector);
    const hasReadProcessOutputAccess = useFeatureKey([FeatureKey.PROCESS_OUTPUT_TYPE_READ]);
    const hasEditProcessOutputAccess = useFeatureKey([FeatureKey.PROCESS_OUTPUT_TYPE_EDIT]);
    const canConfigure = useProcessConfigurator();

    const getProcessOutputOptions = () => Object.values(processOutputs)
        .map((processOutput) => (
            <MenuItem value={processOutput.type} key={JSON.stringify(processOutput.type)}>
                {capitalizeFirstLetter({ text: processOutput.type, lowerCaseRest: true, delimiter: '_', join: ' ' })}
            </MenuItem>
        ));

    const handleProcessOutputChange = (event: SelectChangeEvent<ProcessOutputType>) => {
        onSelectProcessOutput({ type: event.target.value as ProcessOutputType });
    };

    return (
        <If condition={hasReadProcessOutputAccess}>
            <Wrapper>
                <OutputOutlinedIcon />
                <StyledLabel>
                    {`${translate('Process.Edit.Form.Fields.ProcessOutput.Label')}: `}
                </StyledLabel>
                <Select
                    style={{ minWidth: '8rem', height: '1.75rem' }}
                    SelectDisplayProps={{
                        style: {
                            paddingBottom: 3,
                            paddingTop: 3,
                        },
                    }}
                    value={selectedProcessOutput?.type ?? ''}
                    variant="standard"
                    onChange={handleProcessOutputChange}
                    disabled={!hasEditProcessOutputAccess || !canConfigure}
                >
                    {getProcessOutputOptions()}
                </Select>
            </Wrapper>
        </If>
    );
};

export default ProcessOutputComponent;
