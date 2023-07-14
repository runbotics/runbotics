import { VFC } from 'react';

import styles from './EmbeddedVideo.module.scss';

interface Props {
    url: string;
}

const EmbeddedVideo: VFC<Props> = ({ url }) => (
    <div className={styles.video}>
        <iframe loading="lazy" className={styles.embed} src={url} />
    </div>
);

export default EmbeddedVideo;
