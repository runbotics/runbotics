import { Card, Grid } from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';

import useUserListColumns from './useUserAccessColumns';


export const SharedWithUsersTable = () => {
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
