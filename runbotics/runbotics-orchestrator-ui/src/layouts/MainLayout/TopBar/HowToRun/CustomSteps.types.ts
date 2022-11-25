import { SvgIcon } from '@mui/material';

export interface CustomStep {
    label: string;
    icon: typeof SvgIcon;
}

export interface CustomStepIconProps {
    active?: boolean;
    completed?: boolean;
    icon: number;
    steps: CustomStep[];
}
