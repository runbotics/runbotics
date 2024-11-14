import React, { useEffect, useState } from 'react';

import { Chip, CircularProgress, Typography } from '@mui/material';
import getConfig from 'next/config';
import Image from 'next/image';
import Link from 'next/link';

import LogoIcon from '#public/images/logos/all-for-one-logo.png';
import useTranslations from '#src-app/hooks/useTranslations';

import styles from './FeedbackView.module.scss';

const FeedbackView = () => {
    const { publicRuntimeConfig } = getConfig();
    const [loading, setLoading] = useState(true);
    const { translate, switchLanguage } = useTranslations();
    const currentYear = new Date().getFullYear();
    const companyName = translate('Feedback.Nav.CompanyName');
    const companyDepartmentName = translate(
        'Feedback.Footer.CompanyDepartmentName'
    );

    //todo: add language switch
    useEffect(() => {
        switchLanguage('pl');
    }, []);

    return (
        <div className={styles.feedbackWrapper}>
            <nav>
                <div className={styles.container}>
                    <Image
                        src={LogoIcon}
                        className={styles.logo}
                        alt="logo icon"
                    />
                </div>
            </nav>
            <main>
                <div className={styles.container}>
                    <div>
                        <div className={styles.headSection}>
                            <Typography>
                                <span>
                                    {translate(
                                        'Feedback.Main.HeadSection.WeValueYourOpinion'
                                    )}
                                </span>
                                {translate(
                                    'Feedback.Main.HeadSection.WeWouldBeGrateful'
                                )}
                            </Typography>
                        </div>
                        <div className={styles.subsection}>
                            <Typography>
                                {translate(
                                    'Feedback.Main.Subsection.TakePartInSurvey'
                                )}
                            </Typography>
                        </div>
                    </div>
                    <div>
                        <div className={styles.hashtags}>
                            <Chip
                                className={`${styles.hashtag} ${styles.planning}`}
                                label={translate(
                                    'Feedback.Main.Hashtags.Planning'
                                )}
                            />
                            <Chip
                                className={`${styles.hashtag} ${styles.digitalization}`}
                                label={translate(
                                    'Feedback.Main.Hashtags.Digitalization'
                                )}
                            />
                            <Chip
                                className={`${styles.hashtag} ${styles.automation}`}
                                label={translate(
                                    'Feedback.Main.Hashtags.Automation'
                                )}
                            />
                        </div>
                        <div className={styles.chatWrapper}>
                            {loading && (
                                <CircularProgress className={styles.progress} />
                            )}
                            <iframe
                                loading="lazy"
                                src={publicRuntimeConfig.copilotChatUrl}
                                onLoad={() => setLoading(false)}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                <div className={styles.container}>
                    <Typography className={styles.copyright}>
                        &copy; {currentYear} {companyName}
                    </Typography>
                    <div className={styles.findUs}>
                        <Typography>
                            {translate('Feedback.Footer.FindUs')}
                        </Typography>
                        <div className={styles.links}>
                            <Typography className={styles.link}>
                                <Link
                                    href="https://www.all-for-one.pl"
                                    target="_blank"
                                >
                                    {companyName}
                                </Link>
                            </Typography>
                            <Typography className={styles.link}>
                                <Link
                                    href="https://softwarehouse.all-for-one.pl"
                                    target="_blank"
                                >
                                    {companyDepartmentName}
                                </Link>
                            </Typography>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default FeedbackView;
