import styled, { css } from 'styled-components';

export const Dragger = styled.div<{ active: boolean }>(({ theme, active }) => (`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 3px;
    ${active && css`background-color: ${theme.palette.primary.light}`};
    cursor: ew-resize;
    user-select: ${active ? 'none' : 'all'}; // needed for Firefox to correctly start catching events when EventCatcher activates

    &:hover {
        background-color: ${theme.palette.primary.light};
    }
`));

export const EventCatcher = styled('div')<{ active: boolean }>(({ active }) => ({
    display: active ? 'block' : 'none',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 9999,
    cursor: 'ew-resize',
}));
