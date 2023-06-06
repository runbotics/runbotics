import {FC} from 'react';

import Image from 'next/image';

import Background from '#public/images/banners/blog-header.png';

import styles from './BlogHeadImage.module.scss';


const BlogHeadImage: FC = () => (
    <div className={styles.image}>
        <Image src={Background} alt='banner' className={styles.background} fill/>
    </div>
);

export default BlogHeadImage;
