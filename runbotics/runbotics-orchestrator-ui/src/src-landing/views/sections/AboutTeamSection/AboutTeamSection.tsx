import Image from 'next/image';

import manager from '#public/images/photos/menager.png';
import team from '#public/images/photos/team.jpg';
import quotationMark from '#public/images/shapes/quotation_ mark.png';
import { translate } from '#src-app/hooks/useTranslations';

import Typography from '#src-landing/components/Typography';

import { TEAM_SECTION_ID } from '#src-landing/utils/utils';

import NumberComponent from './AboutTeamNumbers/AboutTeamNumbersItem';
import styles from './AboutTeamSection.module.scss';
import { ABOUT_TEAM_SECTION_TITLE_ID } from './AboutTeamSection.utils';

const AboutTeamSection = () => (
    <div className={styles.background}>
        <section
            id={TEAM_SECTION_ID}
            aria-labelledby={ABOUT_TEAM_SECTION_TITLE_ID}
            className={styles.section}
        >
            <div className={styles.team}>
                <Image
                    src={quotationMark}
                    alt={''}
                    className={styles.iconBackground}
                />
                <Typography
                    id={ABOUT_TEAM_SECTION_TITLE_ID}
                    variant={'h3'}
                    color={'primary'}
                >
                    {translate('Landing.AboutTeam.Heading.Title')}
                </Typography>
                <div className={styles.content}>
                    <Typography
                        variant={'p'}
                        color={'primary'}
                        className={styles.description}
                    >
                        {translate('Landing.AboutTeam.Description.1')}
                    </Typography>
                    <br/>
                    <Typography
                        variant={'p'}
                        color={'primary'}
                        className={styles.description}
                    >
                        {translate('Landing.AboutTeam.Description.2')}
                    </Typography>
                </div>
                <div className={styles.manager}>
                    <Image src={manager} alt={''}/>
                    <div>
                        <Typography variant={'h6'} color={'primary'}>
                            {translate('Landing.AboutTeam.Manager.Name')}
                        </Typography>
                        <Typography
                            variant={'p'}
                            color={'primary'}
                            font={'Roboto'}
                        >
                            {translate(
                                'Landing.AboutTeam.Manager.Description',
                            )}
                        </Typography>
                    </div>
                </div>
            </div>
            <Image src={team} className={styles.photo} width={811} alt={''}/>
            <div className={styles.numbers}>
                <NumberComponent
                    number={20}
                    textKey={'Landing.OpenSource.Number.1.Text'}
                />
                <NumberComponent
                    number={105}
                    textKey={'Landing.OpenSource.Number.2.Text'}
                />
                <NumberComponent
                    number={987}
                    textKey={'Landing.OpenSource.Number.3.Text'}
                />
            </div>
        </section>
    </div>
);

export default AboutTeamSection;
