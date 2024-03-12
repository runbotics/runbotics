import { ReactNode } from 'react';

export interface ConditionalTooltipProps {
    children: ReactNode;
    title: string;
    display: boolean;
}
