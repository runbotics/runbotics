import { FC } from 'react';

import styles from './BlogLayout.module.scss';
import BlogHeadImage from '../BlogHeadImage';


const BlogLayout: FC = ({ children }) => (
    <>
        <BlogHeadImage/>
        <div className={styles.root}>{children}</div>
    </>
);

export default BlogLayout;
