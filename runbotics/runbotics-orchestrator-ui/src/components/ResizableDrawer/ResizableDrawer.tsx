import React, { useState } from 'react';
import { Drawer } from '@mui/material';
import { DrawerProps } from '@mui/material/Drawer/Drawer';
import useWrappedState from 'src/hooks/useWrappedState';
import { Dragger, EventCatcher } from './ResizableDrawer.styled';
import { createPortal } from 'react-dom';

const INITIAL_WIDTH = 300;
const MIN_WIDTH = 250;
const MAX_WIDTH = 600;

const ResizableDrawer = ({ children, open, ...other }: DrawerProps) => {
    const [width, setWidth] = useWrappedState(INITIAL_WIDTH, { min: MIN_WIDTH, max: MAX_WIDTH });
    const [dragmode, setDragmode] = useState(false);

    const handleDragStart = () => {
        setDragmode(true);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setWidth(window.innerWidth - event.clientX);
    };

    const handleDragEnd = () => {
        setDragmode(false);
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
            <Dragger active={dragmode} onMouseDown={handleDragStart} />
            {createPortal(
                <EventCatcher active={dragmode} onMouseMove={handleMouseMove} onMouseUp={handleDragEnd} />,
                document.body,
            )}

            {children}
        </Drawer>
    );
};

export default ResizableDrawer;
