import { useMemo } from 'react';

import { hasRoles } from '#src-app/components/utils/Secured';

import useAuth from './useAuth';

const useAccountRoles = () => {
    const { user } = useAuth();

    return useMemo(() => hasRoles(user), [user]);
};

export default useAccountRoles;
