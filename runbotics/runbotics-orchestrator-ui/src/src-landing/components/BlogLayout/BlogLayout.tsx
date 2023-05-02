import { FC } from 'react';

import styles from './BlogLayout.module.scss';

const BlogLayout: FC = ({ children }) => (
    <div className={styles.root}>{children}</div>
);

export default BlogLayout;
