import { FeatureKey } from 'runbotics-common';
import { hasAccessByFeatureKey } from 'src/components/utils/Secured';
import useAuth from './useAuth';

const useFeatureKey = (key: FeatureKey[]) => {
    const { user } = useAuth();

    return hasAccessByFeatureKey(user, key);
};

export default useFeatureKey;
