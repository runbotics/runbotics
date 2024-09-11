
import { GridColDef } from '@mui/x-data-grid';

import useTranslations from '#src-app/hooks/useTranslations';

enum UserField {
    EMAIL = 'email',
    ACCESS = 'access'
}

const useUserListColumns = (): GridColDef[] => {
    const {translate} = useTranslations();

    return [
        {
            field: UserField.EMAIL,
            headerName: translate('Users.List.Table.Columns.Email'),
            filterable: false,
            flex: 0.6
        },
        {
            field: UserField.ACCESS,
            headerName: translate('Users.List.Table.Columns.Email'),
            filterable: false,
            flex: 0.4
        }
    ];
};

export default useUserListColumns;
