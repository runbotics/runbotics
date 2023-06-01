import { FC } from 'react';

import BlogHeadImage from '../BlogHeadImage';

import styles from './BlogLayout.module.scss';

const BlogLayout: FC = ({ children }) => (
    <>
        <BlogHeadImage/>
        <div className={styles.root}>{children}</div>
    </>
);

export default BlogLayout;
