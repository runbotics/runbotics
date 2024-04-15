import React, { FC } from 'react';

import { Box, Switch, FormControlLabel } from '@mui/material';

import Accordion from '#src-app/components/Accordion';
import useTranslations from '#src-app/hooks/useTranslations';

import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

import { AccessOptionsProps } from './AccessOptions.types';
import LocationOptions from '../../ProcessCollectionView/ProcessCollectionModifyDialog/LocationOptions';


const AccessOptions: FC<AccessOptionsProps> = ({ processData, setProcessData, isOwner, isEditDialogOpen }) => {
    const { translate } = useTranslations();
    const isPublicTranslationKey = processData.isPublic ? 'True' : 'False';

    return (
        <Accordion title={translate('Process.Edit.Form.Fields.Access')}>
            <Box display="flex" justifyContent="space-between" flexDirection="column" gap={3} width="full">
                <Box display="flex" alignItems="center" pl={1}>
                    <FormControlLabel
                        label={translate(`Process.Edit.Form.Fields.IsPublic.${isPublicTranslationKey}.Label`)}
                        control={(
                            <Switch
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setProcessData((prevState) => ({ ...prevState, isPublic: e.target.checked }));
                                }}
                                checked={processData.isPublic}
                                disabled={!isOwner}
                            />
                        )}
                    />
                    <InfoButtonTooltip message={translate(`Process.Edit.Form.Fields.IsPublic.${isPublicTranslationKey}.Tooltip`)} />
                </Box>
                <LocationOptions
                    editedCollectionId={String(processData.id)}
                    isModifyDialogOpen={isEditDialogOpen}
                    handleChange={setProcessData}
                    parentId={processData.processCollection?.id}
                    isOwner={isOwner}
                />
            </Box>
        </Accordion>
    );
};


export default AccessOptions;
