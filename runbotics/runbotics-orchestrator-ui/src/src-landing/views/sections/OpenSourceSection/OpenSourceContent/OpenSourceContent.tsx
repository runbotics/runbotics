import React from 'react';

import Image from 'next/image';

import securityKey from '#public/images/shapes/key.svg';
import pencil from '#public/images/shapes/pencil.svg';
import piggyBank from '#public/images/shapes/piggy-bank.svg';
import { translate } from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './OpenSourceContent.module.scss';
import { OPEN_SOURCE_TITLE_ID } from '../OpenSourceSection.utils';

const OpenSourceContent = () => (
    <div className={styles.content}>
        <div className={styles.layout}>
            <div className={styles.heading}>
                <Typography id={OPEN_SOURCE_TITLE_ID} variant="h3" color="secondary">
                    {translate('Landing.OpenSource.Heading.Title')}
                </Typography>
                <div className={styles.separator} />
                <Typography variant="p" color="secondary">
                    {translate('Landing.OpenSource.Heading.Description.Part.1')}
                    &nbsp;
                    <span>
                        {translate('Landing.OpenSource.Heading.Description.Part.2')}
                    </span>
                    &nbsp;
                    {translate('Landing.OpenSource.Heading.Description.Part.3')}
                </Typography>
            </div>
            <div className={styles.card}>
                <div className={styles.iconBackground}>
                    <Image src={securityKey} alt="" />
                </div>
                <Typography variant="h4" color="secondary" className={styles.title}>
                    {translate('Landing.OpenSource.Card.1.Title')}
                </Typography>
                <Typography variant="body3" color="secondary" font="Roboto" className={styles.text}>
                    {translate('Landing.OpenSource.Card.1.Text')}
                </Typography>
            </div>
            <div className={styles.card}>
                <div className={styles.iconBackground}>
                    <Image src={piggyBank} alt="" />
                </div>
                <Typography variant="h4" color="secondary" className={styles.title}>
                    {translate('Landing.OpenSource.Card.2.Title')}
                </Typography>
                <Typography variant="body3" color="secondary" font="Roboto" className={styles.text}>
                    {translate('Landing.OpenSource.Card.2.Text')}
                </Typography>
            </div>
            <div className={styles.card}>
                <div className={styles.iconBackground}>
                    <Image src={pencil} alt="" />
                </div>
                <Typography variant="h4" color="secondary" className={styles.title}>
                    {translate('Landing.OpenSource.Card.3.Title.Part.1')}
                    <br />
                    {translate('Landing.OpenSource.Card.3.Title.Part.2')}
                </Typography>
                <Typography variant="body3" color="secondary" font="Roboto" className={styles.text}>
                    {translate('Landing.OpenSource.Card.3.Text')}
                </Typography>
            </div>
        </div>
    </div>
);

export default OpenSourceContent;
