import { FeatureKey } from 'runbotics-common';

import { AccessUtility, hasFeatureKeyAccess } from '#src-app/components/utils/Secured';

import useAuth from './useAuth';

const useFeatureKey = (key: FeatureKey[], options?: AccessUtility) => {
    const { user } = useAuth();

    return hasFeatureKeyAccess(user, key, options);
};

export default useFeatureKey;
