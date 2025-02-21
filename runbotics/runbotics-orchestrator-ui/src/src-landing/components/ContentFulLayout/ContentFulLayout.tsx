import { FC } from 'react';

import { HeadImage } from '#src-landing/components/ContentFulHeadImage/ContentFulHeadImage';

import styles from './ContentFulLayout.module.scss';
import ContentFulHeadImage from '../ContentFulHeadImage';

export interface Props {
    baseImage?: string;
    headImageClass?: HeadImage;
}

const ContentFulLayout: FC<Props> = ({ children, ...props}) => (
    <>
        <ContentFulHeadImage {...props}/>
        <div className={styles.root}>{children}</div>
    </>
);

export default ContentFulLayout;
