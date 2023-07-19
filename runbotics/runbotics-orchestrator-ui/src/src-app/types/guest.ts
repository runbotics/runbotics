import { FeatureKey } from 'runbotics-common';

export interface Guest {
    ip: string;
    executionsCount: number;
    user: {
        id: string;
        login: string;
        firstName?: string | null;
        lastName?: string | null;
        email: string;
        activated: boolean;
        langKey: string;
        imageUrl?: string | null;
        resetDate?: Date | null;
        featureKeys?: FeatureKey[];
        roles?: string[];
    };
}
