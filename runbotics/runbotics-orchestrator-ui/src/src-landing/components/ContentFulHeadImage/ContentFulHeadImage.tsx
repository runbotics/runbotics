import { FC } from 'react';

import Image from 'next/image';

import styles from './ContentFulHeadImage.module.scss';

export enum HeadImage {
    blog = 'blogImage',
    marketplace = 'marketplaceImage',
}

export interface Props {
    baseImage?: string;
    headImageClass?: HeadImage;
}

const ContentFulHeadImage: FC<Props> = ({ baseImage = 'blog-header', headImageClass = HeadImage.blog }) => {
    const image = require(`#public/images/banners/${baseImage}.png`);
    const imageTypeClassName = () => {
        switch (headImageClass) {
            case HeadImage.marketplace:
                return styles.marketplaceImage;
            case HeadImage.blog:
                return styles.blogImage;
            default:
                return '';
        }
    };
    return <div className={`${styles.image} ${imageTypeClassName()}`}>
        <Image className={styles.background} src={image} alt="banner" fill/>
    </div>;
};

export default ContentFulHeadImage;
