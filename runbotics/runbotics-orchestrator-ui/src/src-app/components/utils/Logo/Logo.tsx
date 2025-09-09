import type { FC } from 'react';

import Image from 'next/image';

import logoBlackSrc from '#public/images/runBoticsLogo/logo-black-simp.svg';
import logoWhiteSrc from '#public/images/runBoticsLogo/logo-white-simp.svg';

interface LogoProps {
    height?: number;
    white?: boolean;
    simple?: boolean;
}

const LOGO_HEIGHT = 48;
const LOGO_WIDTH_RATIO = 3.5;
const ALT_TEXT = 'Runbotics logo';

const Logo: FC<LogoProps> = (props) => {
    const customLogoSource = props.white
        ? logoWhiteSrc
        : logoBlackSrc;

    const logoSource = props.simple
        ? logoWhiteSrc
        : customLogoSource;
    
    const height = props.height ?? LOGO_HEIGHT;

    return (
        <Image
            priority
            src={logoSource}
            width={height * LOGO_WIDTH_RATIO}
            height={height}
            alt={ALT_TEXT}
        />
    );
};

export default Logo;
