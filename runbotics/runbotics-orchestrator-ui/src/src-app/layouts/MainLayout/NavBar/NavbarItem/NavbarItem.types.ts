export interface NavbarItemProps {
    children?: React.ReactNode;
    className?: string;
    depth: number;
    href?: string;
    icon?: any;
    info?: any;
    open?: boolean;
    title: string;
    mobile?: boolean;
}
