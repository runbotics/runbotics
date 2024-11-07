import React, { ChangeEvent, FC } from 'react';

import { Autocomplete, Box, Switch, TextField, FormControlLabel, CircularProgress } from '@mui/material';
import { UserDto } from 'runbotics-common';

import Accordion from '#src-app/components/Accordion';
import useTranslations from '#src-app/hooks/useTranslations';

import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

import { AccessOptionsProps } from './AccessOptions.types';
import LocationOptions from '../LocationOptions/';

const AccessOptions: FC<AccessOptionsProps> = ({ collectionData, handleChange, isOwner, shareableUsers, isModifyDialogOpen }) => {
    const { translate } = useTranslations();
    const isPublicTranslationKey = collectionData.isPublic ? 'True' : 'False';

    return (
        <Accordion
            title={translate('Proces.Collection.Dialog.Modify.Form.Access.Label')}
        >
            <Box display="flex" justifyContent="space-between" flexDirection="column" gap={3} width="full">
                <Box display="flex" alignItems="center" pl={1}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={collectionData.isPublic}
                                onChange={() => handleChange('isPublic', !collectionData.isPublic)}
                                disabled={!isOwner}
                            />
                        }
                        label={translate(`Proces.Collection.Dialog.Modify.Form.IsPublic.${isPublicTranslationKey}`)}
                    />
                    <InfoButtonTooltip message={translate(`Proces.Collection.Dialog.Modify.Form.IsPublic.${isPublicTranslationKey}.Tooltip`)} />
                </Box>
                <Box display="flex" alignItems="center" gap={1} width="full">
                    <Autocomplete
                        fullWidth
                        onChange={(e: ChangeEvent<HTMLInputElement>, value: UserDto[]) => handleChange('users', value)}
                        multiple
                        id="process-collection-users-select"
                        disabled={!isOwner}
                        defaultValue={collectionData?.users}
                        getOptionLabel={(user) => user.email}
                        isOptionEqualToValue={(optionUser, valueUser) => optionUser.email === valueUser.email}
                        options={shareableUsers.loading ? [] : shareableUsers.all}
                        filterSelectedOptions
                        disableCloseOnSelect
                        value={collectionData?.users}
                        loading={shareableUsers.loading}
                        readOnly={!isOwner}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={translate('Proces.Collection.Dialog.Modify.Form.Users.Placeholder')}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {shareableUsers.loading ? <CircularProgress size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Box sx={{ flexShrink: 0 }}>
                        <InfoButtonTooltip message={translate('Proces.Collection.Dialog.Modify.Form.Users.Tooltip')} />
                    </Box>
                </Box>
                <LocationOptions
                    editedCollectionId={collectionData.id}
                    isModifyDialogOpen={isModifyDialogOpen}
                    handleChange={handleChange}
                    parentId={collectionData.parentId}
                    isOwner={isOwner}
                />
            </Box>
        </Accordion>
    );
};


export default AccessOptions;
