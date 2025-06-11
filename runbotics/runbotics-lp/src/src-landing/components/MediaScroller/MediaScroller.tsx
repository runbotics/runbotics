import { VFC } from 'react';

import styles from './MediaScroller.module.scss';

interface Props {
    className?: string;
    children: JSX.Element[];
}

const MediaScroller: VFC<Props> = ({ className, children }) => (
    <div className={`${className} ${styles.mediaScroller}`}>
        {children}
    </div>
);

export default MediaScroller;
