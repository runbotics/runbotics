import React, { FC } from 'react';

import { Card, Grid } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

import useTranslations from '#src-app/hooks/useTranslations';

import useUserListColumns from './useUserAccessColumns';

interface UsersListTableProps {
  
}

export const SharedWithUsersTable: FC<UsersListTableProps> = ({  }) => {
    const { translate } = useTranslations();
    const sharedWithUsersColumns = useUserListColumns();
    
    return (
        <Card>
            <Grid container>
                <Grid item xs={12}>
                    <DataGrid columns={sharedWithUsersColumns} rows={[]}/>
                </Grid>
            </Grid>
        </Card>
    );
};
