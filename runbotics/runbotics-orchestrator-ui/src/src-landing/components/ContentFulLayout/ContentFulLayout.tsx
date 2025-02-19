import { FC } from 'react';

import styles from './ContentFulLayout.module.scss';
import ContentFulHeadImage from '../ContentFulHeadImage';

export interface Props {
    baseImage?: string;
    baseImageContent?: string;
}

const ContentFulLayout: FC<Props> = ({ children, ...props}) => (
    <>
        <ContentFulHeadImage {...props}/>
        <div className={styles.root}>{children}</div>
    </>
);

export default ContentFulLayout;
