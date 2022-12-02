import React, { FC } from 'react';

import styles from './SectionContent.module.scss';


const SectionContent: FC = ({ children }) => (
    <div className={styles.root}>
        {children}
    </div>
);

export default SectionContent;
