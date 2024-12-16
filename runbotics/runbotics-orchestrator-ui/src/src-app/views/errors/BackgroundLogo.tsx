import React, { FC, } from 'react';

import { Box } from '@mui/material';

import Image from 'next/image';

interface BackgroundLogoProps {
    position: 'top' | 'bottom';
}

const BackgroundLogo: FC<BackgroundLogoProps> = ({ position }) => {
    const positionStyles = position === 'top'
        ? { top: '-5vw', maxTop: '-5px' }
        : { bottom: '-5vw', maxBottom: '-5px' };

    return (
        <Box
            position="absolute"
            sx={{
                ...positionStyles,
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'center',
                zIndex: -1,
            }}
        >
            <Image
                src='/images/runBoticsLogo/logo-blur.svg'
                alt='Runbotics logo'
                width={1}
                height={1}
                style={{
                    maxWidth: '1550px',
                    width: '100%',
                    height: 'auto',
                }}
            />
        </Box>
    );
};

export default BackgroundLogo;
