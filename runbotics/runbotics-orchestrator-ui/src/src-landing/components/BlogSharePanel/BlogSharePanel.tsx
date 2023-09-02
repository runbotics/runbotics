
import { useRef } from 'react';

import Link from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';

import styles from './BlogSharePanel.module.scss';
import ClipboardIcon from '../ClipboardIcon';
import Typography from '../Typography';


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
                    {translateHTML('Blog.Post.Share.LikeShare')}
                </Typography>
            </div>
            <ul className={styles.linkList}>
                <li>
                    <Link
                        className={styles.link}
                        href={'https://www.facebook.com/RunBotics'}
                        scroll={false}
                    >
                        Facebook
                    </Link>
                </li>
                <li className={styles.divider} />
                <li>
                    <Link
                        className={styles.link}
                        href={'https://www.linkedin.com/company/runbotics'}
                        scroll={false}
                    >
                        LinkedIn
                    </Link>
                </li>
                <li className={styles.divider} />
                <li className={styles.copyTooltipContainer}>
                    <span className={styles.copyTooltip} ref={copyTooltipRef}>
                        {translate('Blog.Post.Share.Copied')}
                    </span>
                    <button className={styles.copyButton} onClick={handleCopy} type='button'>
                        <ClipboardIcon />
                        {translate('Blog.Post.Share.CopyLink')}
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default BlogSharePanel;
