import { FC } from 'react';

import Image from 'next/image';
import NextLink from 'next/link';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import { CONTACT_TITLE_ID } from '../ContactSection.utils';
import styles from './ContactInformation.module.scss';
import { CONTACT_INFO } from './ContactInformation.utils';

const ContactInformation: FC = () => {
    const { translate } = useTranslations();

    return (
        <div className={styles.root}>
            <div className={styles.summary}>
                <Typography id={CONTACT_TITLE_ID} variant="h2">
                    {translate('Landing.Contact.Info.Title')}
                </Typography>
                <Typography variant="body2">
                    {translate('Landing.Contact.Info.Subtitle')}
                </Typography>
            </div>
            <div className={styles.infoGrid}>
                {CONTACT_INFO.map(({ icon, text, iconAlt }) => (
                    <>
                        <Image src={icon} alt={translate(iconAlt)} />
                        {translate(text).startsWith('http') ? (
                            <NextLink
                                href={translate(text)}
                                className={styles.gridItemText}
                            >
                                <Typography
                                    variant="body2"
                                    className={styles.gridItemText}
                                >
                                    {translate(text)}
                                </Typography>
                            </NextLink>
                        ) : (
                            <Typography
                                variant="body2"
                                className={styles.gridItemText}
                            >
                                {translate(text)}
                            </Typography>
                        )}
                    </>
                ))}
            </div>
        </div>
    );
};

export default ContactInformation;
