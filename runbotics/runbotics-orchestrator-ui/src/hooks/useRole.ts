import { Role } from 'runbotics-common';

import { hasRoleAccess } from 'src/components/utils/Secured';

import useAuth from './useAuth';

const useRole = (keys: Role[]) => {
    const { user } = useAuth();

    return hasRoleAccess(user, keys);
};

export default useRole;
