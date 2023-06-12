import { FC } from 'react';

import Image from 'next/image';
import { CSSProperties } from 'styled-components';

import Background from '#public/images/banners/blog-header.png';

import styles from './BlogHeadImage.module.scss';

const imageStyle: CSSProperties = {
    objectFit: 'cover',
    margin: 'auto',
};

const BlogHeadImage: FC = () => (
    <div className={styles.image}>
        <Image src={Background} alt="banner" style={imageStyle} fill />
    </div>
);

export default BlogHeadImage;
