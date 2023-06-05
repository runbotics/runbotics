import {FC} from 'react';

import Image from 'next/image';

import styles from './BlogHeadImage.module.scss';

const BlogHeadImage: FC = () => (
    <div className={styles.image}>
        <Image src='/images/banners/blog-header.png' alt='' style={{objectFit: 'cover'}} fill={true}/>
    </div>


);

export default BlogHeadImage;
