import React, { useState } from 'react';
import styled from 'styled-components';
import { Drawer } from '@mui/material';
import { DrawerProps } from '@mui/material/Drawer/Drawer';

const INITIAL_WIDTH = 300;

const Dragger = styled('div')(({ theme }) => ({
    width: '3px',
    cursor: 'ew-resize',
    pointerEvents: 'all',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,

    ':hover, [data-dragmode] &': {
        backgroundColor: `${theme.palette.primary.light}`,
    },
}));

const ResizableDrawer = ({ children, open, ...other }: DrawerProps) => {
    const [width, setWidth] = useState(INITIAL_WIDTH);

    const handleMousemove = (event: MouseEvent) => {
        setWidth(window.innerWidth - event.clientX);
    };

    const handleDragEnd = () => {
        document.removeEventListener('mousemove', handleMousemove);
        delete document.body.dataset.dragmode;
    };

    const handleDragStart = () => {
        document.addEventListener('mousemove', handleMousemove);
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
                    maxWidth: '600px',
                    minWidth: '250px',
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
