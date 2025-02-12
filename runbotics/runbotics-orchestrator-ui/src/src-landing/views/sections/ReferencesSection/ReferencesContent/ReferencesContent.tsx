import { FC } from 'react';

import Image from 'next/image';

import quotation_mark from '#public/images/shapes/quotation_ mark.png';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import LinkButton from '#src-landing/components/LinkButton';
import Typography from '#src-landing/components/Typography';

import styles from './ReferencesContent.module.scss';
import { Reference } from './ReferencesContent.types';

const ReferencesContent: FC<Reference> = ({ quotes, authorName, authorTitle, authorImage, logo, caseStudyLink }) => {
    const { translate } = useTranslations();
    return (
        <article className={styles.root}>
            <div className={styles.leftColumn}> 
                <Image
                    src={quotation_mark}
                    alt={translate('Landing.References.Quote.Mark')}
                    className={styles.quoteMark}
                />
                {quotes.map((quote, index) => {
                    const quoteKey = `quote-${index}`
                    return(
                        <Typography key={quoteKey} variant="body1" font='Montserrat' className={styles.caseStudyText}>
                            {translate(quote)}
                        </Typography>
                    )
                })}
                <If condition={!!authorName}>
                    <div className={`${styles.author} ${!authorImage ? styles.noImage : ''}`}>
                        <If condition={!!authorImage}>
                            <Image 
                                src={authorImage}
                                alt={`${translate('Landing.References.Photo')} ${translate(authorName)}, ${translate(authorTitle)}`}
                                className={styles.authorImage}
                            />
                        </If>
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
                </If>
            </div>

            <div className={styles.rightColumn}>
                <div className={styles.logoContainer}>
                    <Image
                        src={logo}
                        alt={translate('Landing.References.Logo')}
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
