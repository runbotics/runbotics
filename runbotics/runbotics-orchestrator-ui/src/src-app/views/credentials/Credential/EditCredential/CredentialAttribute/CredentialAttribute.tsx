import React from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import { Typography, TextField, Divider, Grid, Card, Checkbox, FormGroup, FormControlLabel, Button } from '@mui/material';


import { grey } from '@mui/material/colors';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';

const StyledGridContainer = styled(Grid)(({theme}) => `
    padding: ${theme.spacing(2)};
    margin-bottom: 1rem
`);

const CredentialAttribute = ({attribute: Attribute}) => {
    const { translate } = useTranslations();

    return (
        <Grid item spacing={3}>
            <Card sx={{backgroundColor: grey[100], border: `1px solid ${grey[400]}`}}>
                <StyledGridContainer container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" >{translate('Credential.Attribute.Label')}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label={translate('Credential.Attribute.Name.Label')}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label={translate('Credential.Attribute.Description.Label')}></TextField>
                    </Grid>
                    <Grid item xs={12}>
                    </Grid>
                </StyledGridContainer>
                <Divider variant="middle"/>
                <StyledGridContainer container>
                    <Grid item xs={12} sx={{marginBottom: '8px'}}>
                        <Typography variant="h5">{translate('Credential.Attribute.Details.Label')}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" fontWeight={400} marginBottom={2}>{translate('Credential.Attribute.Details.Info')}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label={translate('Credential.Attribute.Value.Label')}></TextField>
                    </Grid>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox defaultChecked />} label={translate('Credential.Attribute.Security.MaskValue')} />
                    </FormGroup>
                </StyledGridContainer>
                <StyledGridContainer container justifyContent="space-between" sx={{marginBottom: 0}}>
                    <Grid item >
                        <Button size="small">
                            <ClearIcon sx={{marginRight: '8px', color: grey[600]}}/>
                            <Typography variant="h5" sx={{color: grey[600]}}>{translate('Credential.Attribute.Edit.Cancel').toUpperCase()}</Typography>
                        </Button>
                    </Grid>
                    <Grid item >
                        <Button size="small">
                            <DoneIcon sx={{marginRight: '8px'}}/>
                            <Typography variant="h5">{translate('Credential.Attribute.Edit.Confirm').toUpperCase()}</Typography>
                        </Button>
                    </Grid>
                </StyledGridContainer>
            </Card>
        </Grid>
    );
};

export default CredentialAttribute;
