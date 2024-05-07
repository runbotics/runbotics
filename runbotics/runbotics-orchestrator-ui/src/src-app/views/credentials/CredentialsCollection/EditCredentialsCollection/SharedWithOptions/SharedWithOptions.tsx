import React, { FC } from 'react';

import { Box, Typography } from '@mui/material';

import Accordion from '#src-app/components/Accordion';
import useTranslations from '#src-app/hooks/useTranslations';

import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

import UsersBrowseView from '#src-app/views/users/UsersBrowseView';

import { SharedWithOptionsProps } from './SharedWithOptions.types';

const SharedWithOptions: FC<SharedWithOptionsProps> = ({ collectionData, canEdit, shareableUsers, isEditDialogOpen, handleChange }) => {
    const { translate } = useTranslations();

    return (
        <Accordion title={translate('Credentials.Collection.Add.Form.Access.Label')}>
            <Box display="flex" justifyContent="space-between" flexDirection="column" gap={3} width="full">
                <Box>
                    <Typography variant="h5" marginBottom="8px">
                        {translate('Credentials.Collection.Add.Form.EditAccess.Label')}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} width="full">
                        {/* <Autocomplete
                            fullWidth
                            // onChange={(e: ChangeEvent<HTMLInputElement>, value: CredentialsCollectionUser[]) =>
                            //     handleChange('users', value)
                            // }
                            multiple
                            id="collection-collection-users-select"
                            disabled={!canEdit}
                            defaultValue={collectionData?.users}
                            getOptionLabel={user => user.userId}
                            isOptionEqualToValue={(optionUser, valueUser) => optionUser.userId === valueUser.userId}
                            // options={shareableUsers.loading ? [] : shareableUsers.all}
                            filterSelectedOptions
                            disableCloseOnSelect
                            value={collectionData?.users}
                            // loading={shareableUsers.loading}
                            readOnly={!canEdit}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={translate('Credentials.Collection.Add.Form.EditAccess.Label')}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {shareableUsers.loading ? <CircularProgress size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        )
                                    }}
                                />
                            )}
                        /> */}
                        <Box sx={{ flexShrink: 0 }}>
                            <InfoButtonTooltip message={translate('Credentials.Collection.Add.Form.EditAccess.Tooltip')} />
                        </Box>
                    </Box>
                </Box>
            </Box>{' '}
            <Box display="flex" justifyContent="space-between" flexDirection="column" gap={3} width="full">
                <Box>
                    <Typography variant="h5" marginBottom="8px">
                        {translate('Credentials.Collection.Add.Form.ReadAccess.Label')}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} width="full">
                        {/* <Autocomplete
                            fullWidth
                            // onChange={(e: ChangeEvent<HTMLInputElement>, value: CredentialsCollectionUser[]) =>
                            //     handleChange('users', value)
                            // }
                            multiple
                            id="collection-collection-users-select"
                            disabled={!canEdit}
                            defaultValue={collectionData?.users}
                            getOptionLabel={user => user.userId}
                            isOptionEqualToValue={(optionUser, valueUser) => optionUser.userId === valueUser.userId}
                            // options={shareableUsers.loading ? [] : shareableUsers.all}
                            filterSelectedOptions
                            disableCloseOnSelect
                            value={collectionData?.users}
                            // loading={shareableUsers.loading}
                            readOnly={!canEdit}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    label={translate('Credentials.Collection.Add.Form.Access.Placeholder')}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {shareableUsers.loading ? <CircularProgress size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        )
                                    }}
                                />
                            )}
                        /> */}
                        <UsersBrowseView/>
                        <Box sx={{ flexShrink: 0 }}>
                            <InfoButtonTooltip message={translate('Credentials.Collection.Add.Form.ReadAccess.Tooltip')} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Accordion>
    );
};

export default SharedWithOptions;
