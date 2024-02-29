import React, { FC, useState } from 'react';

import { Drawer, DrawerProps } from '@mui/material';

import { createPortal } from 'react-dom';


import useWrappedState from '#src-app/hooks/useWrappedState';

import { Dragger, EventCatcher } from './ResizableDrawer.styled';
import { DRAWER_WIDTH, MAX_DRAWER_WIDTH, MIN_DRAWER_WIDTH } from '../InfoPanel';

const ResizableDrawer: FC<DrawerProps> = ({ children, open, ...other }) => {
    const [width, setWidth] = useWrappedState(DRAWER_WIDTH, { min: MIN_DRAWER_WIDTH, max: MAX_DRAWER_WIDTH });
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
                    height: 'unset',
                    minHeight: '100%',
                },
            }}
            sx={[
                {
                    width,
                    transition: ({ transitions: { easing, duration } }) => `margin ${duration.standard}ms ${easing.easeOut} 0ms`,
                    overflowX: 'hidden',
                },
                !open && {
                    marginLeft: `-${width}px`,
                },
            ]}
        >
            <>
                <Dragger active={dragmode} onMouseDown={handleDragStart} />
                {createPortal(
                    <EventCatcher
                        active={dragmode}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleDragEnd}
                    />,
                    document.body,
                )}
                {children}
            </>
        </Drawer>
    );
};

export default ResizableDrawer;
