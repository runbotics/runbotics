import { SetMetadata } from '@nestjs/common';
import { FeatureKey } from 'runbotics-common';

export const FEATURE_KEY = 'featureKeys';
export const FeatureKeys = (...keys: FeatureKey[]) => SetMetadata(FEATURE_KEY, keys);
