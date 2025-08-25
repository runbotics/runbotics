import { ReactNode, ComponentType } from 'react';

import { FeatureKey, Role } from 'runbotics-common';

export interface Item {
    href?: string;
    icon?: ComponentType<any> | ReactNode;
    info?: ReactNode;
    items?: Item[];
    title: string;
    authorities?: Role[];
    featureKeys?: FeatureKey[];
}

export interface Section {
    items: Item[];
    subheader: string;
    id?: string;
}
