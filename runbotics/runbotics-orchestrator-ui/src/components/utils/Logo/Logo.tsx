import type { FC } from 'react';

import Image from 'next/image';

import logoBlackSimp from './logo-black-simp.svg';
import logoRectangleWhite from './logo-rectangle-white.svg';
import logoWhiteSimp from './logo-white-simp.svg';

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
                    <Image src={logoWhiteSimp} height={LOGO_HEIGHT} width={LOGO_WIDTH} alt={ALT_TEXT} />
                ) : (
                    <Image src={logoBlackSimp} height={LOGO_HEIGHT} width={LOGO_WIDTH} alt={ALT_TEXT} />
                )}
            </>
        )}
        {props.simple && (
            <>
                <Image src={logoRectangleWhite} height={LOGO_HEIGHT} width={LOGO_WIDTH} alt={ALT_TEXT} />
            </>
        )}
    </>
);

export default Logo;
