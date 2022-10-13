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
const Logo: FC<LogoProps> = (props) => (
    <>
        {!props.simple && (
            <>
                {!props.white ? (
                    <Image src={logoWhiteSimp} layout="fixed" height={LOGO_HEIGHT} width={LOGO_WIDTH} />
                ) : (
                    <Image src={logoBlackSimp} layout="fixed" height={LOGO_HEIGHT} width={LOGO_WIDTH} />
                )}
            </>
        )}
        {props.simple && (
            <>
                <Image src={logoRectangleWhite} layout="fixed" height={LOGO_HEIGHT} width={LOGO_WIDTH} />
            </>
        )}
    </>
);

export default Logo;
