import React, { ChangeEvent, FC } from 'react';

import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import { AccordionDetails, Autocomplete, Box, Switch, TextField, Typography, FormControlLabel } from '@mui/material';
import { IUser } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';
import InfoButtonTooltip from '#src-app/views/process/ProcessBuildView/Modeler/ActionFormPanel/widgets/InfoTooltip/InfoButtonTooltip';

import { StyledAccordion, StyledAccordionSummary } from './VisibilityOptions.styles';
import { VisibilityOptionsProps } from './VisibilityOptions.types';

const VisibilityOptions: FC<VisibilityOptionsProps> = ({ collectionData, handleChange, isOwner, usersWithoutAdmin }) => {
    const { translate } = useTranslations();

    const translationVisibilityKey = collectionData.isPublic ? 'True' : 'False';

    return (
        <StyledAccordion>
            <StyledAccordionSummary expandIcon={<ExpandCircleDownOutlinedIcon />}>
                <Typography >Visibility options</Typography>
            </StyledAccordionSummary>
            <AccordionDetails>
                <Box display="flex" alignItems="center">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={collectionData.isPublic}
                                onChange={() => handleChange('isPublic', !collectionData.isPublic)}
                                disabled={!isOwner}
                            />
                        }
                        label={translate(`Proces.Collection.Dialog.Modify.Form.IsPublic.${translationVisibilityKey}`)}
                    />
                    <InfoButtonTooltip message={translate(`Proces.Collection.Dialog.Modify.Form.IsPublic.${translationVisibilityKey}.Tooltip`)} />
                </Box>
                <Box sx={{ width: '100%', paddingTop: '25px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <Autocomplete
                        sx={{ width: '100%' }}
                        onChange={(e: ChangeEvent<HTMLInputElement>, value: IUser[]) => handleChange('users', value)}
                        multiple
                        id="process-collection-users-select"
                        options={usersWithoutAdmin}
                        getOptionLabel={(user) => user.login}
                        defaultValue={collectionData?.users}
                        isOptionEqualToValue={(optionUser, valueUser) => optionUser.login === valueUser.login}
                        filterSelectedOptions
                        disableCloseOnSelect
                        readOnly={!isOwner}
                        renderInput={(params) => (
                            <TextField {...params} label={translate('Proces.Collection.Dialog.Modify.Form.Users.Placeholder')} />
                        )}
                    />
                    <InfoButtonTooltip message={translate('Proces.Collection.Dialog.Modify.Form.Users.Tooltip')} />
                </Box>
            </AccordionDetails>
        </StyledAccordion>
    );
};


export default VisibilityOptions;
