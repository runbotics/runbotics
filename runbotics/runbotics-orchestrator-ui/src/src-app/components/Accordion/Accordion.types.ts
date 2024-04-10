export interface StyledHoverProps {
    $hovered: boolean;
}

export interface StyledExpandProps {
    $expanded: boolean;
}

export type StyledIconProps = StyledHoverProps & StyledExpandProps;

export interface AccordionProps {
    children: React.ReactNode;
    title: string;
}
