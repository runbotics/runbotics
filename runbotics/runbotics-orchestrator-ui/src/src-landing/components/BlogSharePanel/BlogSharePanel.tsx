
import { useRef } from 'react';

import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';

import ClipboardIcon from '../ClipboardIcon';
import Typography from '../Typography';
import styles from './BlogSharePanel.module.scss';


const BlogSharePanel = () => {
    const { translate, translateHTML } = useTranslations();
    const copyTooltipRef = useRef<HTMLSpanElement>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        copyTooltipRef.current.classList.add(styles.copyTooltipVisible);
        setTimeout(() => {
            copyTooltipRef.current.classList.remove(styles.copyTooltipVisible);
        }, 1000);
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.panelTitle}>
                <Typography variant='h5'>
                    {translateHTML('Landing.Blog.Post.Share.LikeShare')}
                </Typography>
            </div>
            <ul className={styles.linkList}>
                <li>
                    <Link
                        className={styles.link}
                        href={'#'}
                        scroll={false}
                    >
                        Facebook
                    </Link>
                </li>
                <li className={styles.divider} />
                <li>
                    <Link
                        className={styles.link}
                        href={'#'}
                        scroll={false}
                    >
                        Twitter
                    </Link>
                </li>
                <li className={styles.divider} />
                <li>
                    <Link
                        className={styles.link}
                        href={'#'}
                        scroll={false}
                    >
                        LinkedIn
                    </Link>
                </li>
                <li className={styles.divider} />
                <li className={styles.copyTooltipContainer}>
                    <span className={styles.copyTooltip} ref={copyTooltipRef}>
                        {translate('Landing.Blog.Post.Share.Copied')}
                    </span>
                    <button className={styles.copyButton} onClick={handleCopy} type='button'>
                        <ClipboardIcon />
                        {translate('Landing.Blog.Post.Share.CopyLink')}
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default BlogSharePanel;
