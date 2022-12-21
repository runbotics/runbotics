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
const Logo: FC<LogoProps> = (props) => (
    <>
        {!props.simple && (
            <>
                {!props.white ? (
                    <Image priority src='/images/runBoticsLogo/logo-white-simp.svg' height={LOGO_HEIGHT} width={LOGO_WIDTH} alt={ALT_TEXT} />

                ) : (
                    <Image priority src='/images/runBoticsLogo/logo-black-simp.svg' height={LOGO_HEIGHT} width={LOGO_WIDTH} alt={ALT_TEXT} />
                )}
            </>
        )}
        {props.simple && (
            <>
                <Image priority src='/images/runBoticsLogo/logo-rectangle-white.svg' height={LOGO_HEIGHT} width={LOGO_WIDTH} alt={ALT_TEXT} />
            </>
        )}
    </>
);

export default Logo;
