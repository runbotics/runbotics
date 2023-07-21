import Image from 'next/image';

import useTranslations from '#src-app/hooks/useTranslations';
import GenericTile from '#src-landing/components/GenericTile';
import MediaScroller from '#src-landing/components/MediaScroller';
import Typography from '#src-landing/components/Typography';
import { PROS_SECTION_ID } from '#src-landing/utils/utils';

import styles from './ProsSection.module.scss';
import { PROS_TITLE_ID, TILES } from './ProsSection.utils';

const ProsSection = () => {
    const { translate } = useTranslations();

    const tiles = TILES.map((tile) => (
        <GenericTile className={styles.grid__item} key={tile.title}>
            <Image
                src={tile.icon}
                alt={translate(tile.iconAlt)}
                width={36}
                height={36}
            />
            <Typography variant="h4">
                {translate(tile.title)}
            </Typography>
            <Typography variant="body3" font="Roboto">
                {translate(tile.description)}
            </Typography>
        </GenericTile>
    ));

    return (
        <section
            className={styles.root}
            id={PROS_SECTION_ID}
            aria-labelledby={PROS_TITLE_ID}
        >
            <div className={styles.grid__head__1}></div>
            <div className={styles.grid__head__2}>
                <Typography id={PROS_TITLE_ID} variant="h2">
                    {translate('Landing.Pros.Title')}
                </Typography>
            </div>
            <div className={styles.grid__head__3}></div>

            {tiles}
            <MediaScroller className={styles.mediaScroller}>
                {tiles}
            </MediaScroller>
        </section>
    );
};

export default ProsSection;
