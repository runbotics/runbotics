import { FeatureKey } from 'runbotics-common';

import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';

import useAuth from './useAuth';



const useFeatureKey = (key: FeatureKey[]) => {
    const { user } = useAuth();

    return hasFeatureKeyAccess(user, key);
};

export default useFeatureKey;
