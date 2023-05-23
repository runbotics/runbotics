import { VFC } from 'react';

import styles from './MediaScroller.module.scss';

interface Props {
    className?: string;
    children: JSX.Element[];
}

const MediaScroller: VFC<Props> = ({ className, children }) => (
    <div className={`${styles.mediaScroller} ${styles.snapsInline} ${className}`}>
        {children}
    </div>
);

export default MediaScroller;
