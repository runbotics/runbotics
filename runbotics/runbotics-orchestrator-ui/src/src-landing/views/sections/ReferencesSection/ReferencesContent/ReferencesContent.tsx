import { FC } from 'react';

import Image from 'next/image';

import quotation_mark from '#public/images/shapes/quotation_ mark.png';

import useTranslations from '#src-app/hooks/useTranslations';

import LinkButton from '#src-landing/components/LinkButton';
import Typography from '#src-landing/components/Typography';

import styles from './ReferencesContent.module.scss';
import { Reference } from './ReferencesContent.types';

const ReferencesContent: FC<Reference> = ({ quote1, quote2, quote3, authorName, authorTitle, authorImage, logo, caseStudyLink }) => {
    const { translate } = useTranslations();
    return (
        <article className={styles.root}>
            <div className={styles.leftColumn}> 
                <Image
                    src={quotation_mark}
                    alt=""
                    className={styles.quoteMark}
                />
                <Typography variant="body1" className={styles.caseStudyText}>
                    {translate(quote1)}
                </Typography>
                { quote2 && (
                    <Typography variant="body1" className={styles.caseStudyText}>
                        {translate(quote2)}
                    </Typography>
                )}
                { quote3 && (
                    <Typography variant="body1" className={styles.caseStudyText}>
                        {translate(quote3)}
                    </Typography>
                )}
                {authorName && (
                    <div className={`${styles.author} ${!authorImage ? styles.noImage : ''}`}>
                        {authorImage && (
                            <Image src={authorImage} alt="" className={styles.authorImage} />
                        )}
                        <div className={styles.authorInfo}>
                            <Typography variant="h6" color="primary">
                                {translate(authorName)}
                            </Typography>
                            <Typography
                                variant="p"
                                color="primary"
                                font="Roboto"
                            >
                                {translate(authorTitle)}
                            </Typography>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.rightColumn}>
                <div className={styles.logoContainer}>
                    <Image
                        src={logo}
                        alt="Client logo"
                        className={styles.clientLogo}
                    />
                </div>
                <LinkButton
                    href={caseStudyLink}
                    title={translate('Landing.References.Button')}
                />
            </div>
            
        </article>
    ) 
};

export default ReferencesContent;
