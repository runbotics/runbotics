import { translate } from '#src-app/hooks/useTranslations';

import Typography from '#src-landing/components/Typography';

import styles from './AboutTeamNumbersItem.module.scss';

import { ABOUT_TEAM_SECTION_TITLE_ID } from '../AboutTeamSection.utils';

const NumberComponent = ({ number, textKey }) => {
    return (
        <div className={styles.number}>
            <Typography
                id={ABOUT_TEAM_SECTION_TITLE_ID}
                variant="h3"
                color="primary"
            >
                {number}
            </Typography>
            <Typography
                variant="p"
                color="primary"
                className={styles.numberText}
            >
                {translate(textKey)}
            </Typography>
        </div>
    );
};

export default NumberComponent;
