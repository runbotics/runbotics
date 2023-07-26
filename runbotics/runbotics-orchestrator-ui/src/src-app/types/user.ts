import { Dictionary } from '@reduxjs/toolkit';
import { FeatureKey, IAuthority } from 'runbotics-common';

export interface User {
    id: string;
    avatar: string;
    email: string;
    name: string;
    login?: string;
    firstName?: string;
    lastName?: string;
    activated?: boolean;
    langKey?: 'en' | 'pl';
    authorities?: IAuthority[];
    roles?: string[];
    featureKeys?: FeatureKey[];
    authoritiesById?: Dictionary<any>;
    createdBy?: string;
    createdDate?: Date | null;
    lastModifiedBy?: string;
    lastModifiedDate?: Date | null;
    [key: string]: any;
}
