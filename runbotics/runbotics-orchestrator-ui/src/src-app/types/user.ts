import { Dictionary } from '@reduxjs/toolkit';
import { FeatureKey, IAuthority, Tenant } from 'runbotics-common';

import { Language } from '#src-app/translations/translations';

export interface User { // to remove probably
    avatar: string;
    email: string;
    name: string;
    login?: string;
    firstName?: string;
    lastName?: string;
    activated?: boolean;
    langKey?: Language;
    authorities?: IAuthority[];
    roles?: string[];
    featureKeys?: FeatureKey[];
    authoritiesById?: Dictionary<any>;
    createdBy?: string;
    lastModifiedBy?: string;
    tenant: Tenant;
    [key: string]: any;
}
