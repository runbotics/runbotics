import { FC } from 'react';

import styles from './ContentFulLayout.module.scss';
import ContentFulHeadImage from '../ContentFulHeadImage';

import { HeadImage } from '#src-landing/components/ContentFulHeadImage/ContentFulHeadImage';

export interface Props {
    baseImage?: string;
    headImageClass?: HeadImage;
    children: React.ReactNode;
}

const ContentFulLayout: FC<Props> = ({ children, ...props }) => (
    <>
        <ContentFulHeadImage {...props} />
        <div className={styles.root}>{children}</div>
    </>
);

export default ContentFulLayout;
