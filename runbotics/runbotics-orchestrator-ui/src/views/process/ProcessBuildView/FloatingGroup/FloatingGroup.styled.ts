import { zIndex } from 'src/theme/zIndex';
import styled from 'styled-components';
import { FloatingGroupProps } from '.';

export const StyledFloatingGroup = styled('div')<FloatingGroupProps>(({
    theme,
    horizontalPosition,
    verticalPosition,
    withSeparator,
}) => `
    position: absolute;
    ${horizontalPosition}: ${theme.spacing(1)};
    ${verticalPosition}: ${theme.spacing(1)};
    z-index: ${zIndex.drawer + 2};
    
    padding: ${theme.spacing(1)};
    
    background: ${theme.palette.common.white};
    border: 1px solid ${theme.palette.grey[300]};
    border-radius: 10px;

    ${withSeparator && `
        overflow: hidden;

        > :not(:last-child)::after {
            display: block;
            position: absolute;
            right: 0;
            top: -50px;
            
            width: 1px;
            height: calc(100% + ${theme.spacing(2)});
            min-height: 200px;
            
            background: ${theme.palette.grey[300]};
            content: "";
        }

        > :not(:first-child):not(:last-child) {
            padding-left: ${theme.spacing(2)};
            padding-right: ${theme.spacing(2)};
        }

        > :first-child {
            padding-right: ${theme.spacing(2)};
        }

        > :last-child {
            padding-left: ${theme.spacing(2)};
        }
    `}
`);
