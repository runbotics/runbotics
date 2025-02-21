import { FC } from 'react';

import styles from './informationalTag.module.scss';

export interface InformationalTagProps {
    text: string;
    size?: 'small' | 'medium' | 'large';
    outlined?: boolean;
}

const InformationalTag: FC<InformationalTagProps> = ({text, size = 'medium', outlined}) => {
    return (
        <div className={`${styles.tag} ${size}`}>
            {text}
        </div>
    )
}

export default InformationalTag;
