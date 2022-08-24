import React from 'react';
import type { FC } from 'react';
import LogoBlackSimp from './logo-black-simp.svg';
import LogoRectangleWhite from './logo-rectangle-white.svg';
import LogoWhiteSimp from './logo-white-simp.svg';

interface LogoProps {
    white?: boolean;
    simple?: boolean;
    className?: string;
}

const Logo: FC<LogoProps> = (props) => (
    <>
        {!props.simple && (
            <>
                {!props.white ? (
                    <LogoWhiteSimp className={props.className} />
                ) : (
                    <LogoBlackSimp className={props.className} />
                )}
            </>
        )}
        {props.simple && (
            <>
                <LogoRectangleWhite className={props.className} />
            </>
        )}
    </>
);

export default Logo;
