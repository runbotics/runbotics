import { useMemo } from 'react';

import { GridColDef } from '@mui/x-data-grid';

import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';

enum UserField {
    EMAIL = 'email',
    ACCESS = 'access'
}

const useUserListColumns = (): GridColDef[] => {
    const {translate} = useTranslations();
    const { activated: { nonAdmins } } = useSelector((state) => state.users);
    const { user: currentUser } = useSelector((state) => state.auth);

    const shareableUsers = useMemo(() => ({
        loading: nonAdmins.loading,
        all: nonAdmins.all.filter(user => user.email !== currentUser.email)
    }), [nonAdmins, currentUser.email]);

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
