import type { FC } from 'react';
import Image from 'next/image';

interface LogoProps {
    white?: boolean;
    simple?: boolean;
    className?: string;
}
const LOGO_WIDTH = 177;
const LOGO_HEIGHT = 48;
const ALT_TEXT = 'Runbotics logo';

const Logo: FC<LogoProps> = (props) => {
    const customLogoSource = props.white
        ? '/images/runBoticsLogo/logo-white-simp.svg'
        : '/images/runBoticsLogo/logo-black-simp.svg';

    const logoSource = props.simple
        ? '/images/runBoticsLogo/logo-rectangle-white.svg'
        : customLogoSource;

    return (
        <Image className={props.className}
               priority
               src={logoSource}
               height={LOGO_HEIGHT}
               width={LOGO_WIDTH}
               alt={ALT_TEXT}
        />
    );
}

export default Logo;
