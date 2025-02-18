import { FC } from 'react';

import Image from 'next/image';

import styles from './ContentFulHeadImage.module.scss';

export interface Props {
    baseImage?: string;
    baseImageContent?: string;
}

const ContentFulHeadImage: FC<Props> = ({ baseImage = 'blog-header', baseImageContent = 'RunNews' }) => {

    const image = require(`#public/images/banners/${baseImage}.png`);
    // @ts-expect-error passing variable to styles is not well typed in typescript
    return <div className={styles.image} style={{ '--content': `"${baseImageContent}"` }}>
        <Image className={styles.background} src={image} alt="banner" fill/>
    </div>;
};

export default ContentFulHeadImage;
