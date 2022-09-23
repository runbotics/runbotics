import React, { useState } from 'react';
import styled from 'styled-components';
import { Drawer } from '@mui/material';
import { DrawerProps } from '@mui/material/Drawer/Drawer';
import useWrappedState from 'src/hooks/useWrappedState';

const INITIAL_WIDTH = 300;
const MIN_WIDTH = 250;
const MAX_WIDTH = 600;

const Dragger = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '3px',
    cursor: 'ew-resize',
    pointerEvents: 'all',

    ':hover, [data-dragmode] &': {
        backgroundColor: `${theme.palette.primary.light}`,
    },
}));

const ResizableDrawer = ({ children, open, ...other }: DrawerProps) => {
    const [width, setWidth] = useWrappedState(INITIAL_WIDTH, { min: MIN_WIDTH, max: MAX_WIDTH });

    const handleMouseMove = (event: MouseEvent) => {
        setWidth(window.innerWidth - event.clientX);
    };

    const handleDragEnd = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        delete document.body.dataset.dragmode;
    };

    const handleDragStart = () => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleDragEnd, { once: true });
        document.body.dataset.dragmode = '';
    };

    return (
        <Drawer
            variant="persistent"
            anchor="right"
            open={open}
            {...other}
            PaperProps={{
                sx: {
                    transition: 'none',
                    position: 'relative',
                },
            }}
            sx={[
                {
                    width,
                    transition: ({ transitions: { easing, duration } }) =>
                        `margin ${duration.enteringScreen}ms ${easing.easeOut} 0ms`,
                    overflowX: 'hidden',
                },
                !open && {
                    marginLeft: `-${width}px`,
                },
            ]}
        >
            <Dragger onMouseDown={handleDragStart} />
            {children}
        </Drawer>
    );
};

export default ResizableDrawer;
