import { FC } from 'react';

import Image from 'next/image';

import Background from '#public/images/banners/blog-header.png';

import styles from './BlogHeadImage.module.scss';



const BlogHeadImage: FC = () => (
    <div className={styles.image}>
        <Image className={styles.background} src={Background} alt="banner" fill />
    </div>
);

export default BlogHeadImage;
