import React, { FC } from 'react';

import Image from 'next/image';

import openSourceBackground from '#public/images/banners/open-source-background.png';
import { OPEN_SOURCE_SECTION_ID } from '#src-landing/utils/utils';

import styles from './OpenSourceBackground.module.scss';
import { OPEN_SOURCE_TITLE_ID } from '../OpenSourceSection.utils';

const OpenSourceBackground: FC = ({ children }) => (
    <section className={styles.root} id={OPEN_SOURCE_SECTION_ID} aria-labelledby={OPEN_SOURCE_TITLE_ID}>
        <Image className={styles.backgroundBanner} src={openSourceBackground} alt="" fill quality={15}/>
        {children}
    </section>
);

export default OpenSourceBackground;
