import { FeatureKey, Role } from 'runbotics-common';
import { hasAdminAuthority } from 'src/components/utils/Secured';
import useAuth from './useAuth';

const useRole = (key: Role) => {
    const { user } = useAuth();

    return hasAdminAuthority(user, key);
};

export default useRole;
