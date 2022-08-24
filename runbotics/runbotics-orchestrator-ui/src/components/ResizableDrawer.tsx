import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Drawer } from '@mui/material';
import { DrawerProps } from '@mui/material/Drawer/Drawer';

const PREFIX = 'ResizableDrawer';

const classes = {
    dragger: `${PREFIX}-dragger`,
};

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    [`& .${classes.dragger}`]: {
        width: '2px',
        cursor: 'ew-resize',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
    },
    [`.${classes.dragger}:hover`]: {
        backgroundColor: `${theme.palette.primary.light}`,
    },
}));

const ResizableDrawer = (props: DrawerProps) => {
    const [resize, setResize] = useState({
        lastDownX: 0,
        newWidth: {},
    });
    const [isResizing, setIsResizing] = useState(false);

    const handleMousedown = (event) => {
        setResize({
            ...resize,
            lastDownX: event.clientX,
        });
        setIsResizing(true);
    };

    const handleMousemove = React.useCallback((e) => {
        // we don't want to do anything if we aren't resizing.
        if (!isResizing) {
            return;
        }
        const offsetRight = document.body.offsetWidth - (e.clientX - document.body.offsetLeft) - 21;
        const minWidth = 10;
        const maxWidth = 1000;
        if (offsetRight > minWidth && offsetRight < maxWidth) {
            setResize({ ...resize, newWidth: { width: offsetRight } });
        }
    }, [isResizing, resize]);

    const handleMouseup = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMousemove);
        document.addEventListener('mouseup', handleMouseup);
        return () => {
            document.removeEventListener('mousemove', handleMousemove);
            document.removeEventListener('mouseup', handleMouseup);
        };
    }, [handleMousemove, resize]);

    return (
        <StyledDrawer
            {...props}
            PaperProps={{
                style: resize.newWidth,
            }}
        >
            <div onMouseDown={handleMousedown} className={classes.dragger} />
            {props.children}
        </StyledDrawer>
    );
};

export default ResizableDrawer;
