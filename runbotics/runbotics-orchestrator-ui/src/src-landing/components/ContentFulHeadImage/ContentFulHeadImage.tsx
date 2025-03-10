import { FC } from 'react';

import Image from 'next/image';

import styles from './ContentFulHeadImage.module.scss';
import Link from 'next/link';

export enum HeadImage {
    BLOG = 'blogImage',
    MARKETPLACE = 'marketplaceImage',
}

export interface Props {
    baseImage?: string;
    headImageClass?: HeadImage;
}

const ContentFulHeadImage: FC<Props> = ({ baseImage = 'blog-header', headImageClass = HeadImage.BLOG}) => {
    const image = require(`#public/images/banners/${baseImage}.png`);
    const imageTypeClassName = () => {
        switch (headImageClass) {
            case HeadImage.MARKETPLACE:
                return styles.marketplaceImage;
            case HeadImage.BLOG:
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
