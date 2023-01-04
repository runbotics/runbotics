import Image from 'next/image';

import useTranslations from '#src-app/hooks/useTranslations';
import GenericTile from '#src-landing/components/GenericTile';
import Typography from '#src-landing/components/Typography';

import styles from './ProsSection.module.scss';

import { TILES } from './ProsSection.utils';

const ProsSection = () => {
    const { translate } = useTranslations();

    return (
        <section className={styles.root} id="pros-section">
            <div className={styles.grid__head__1}></div>
            <div className={styles.grid__head__2}>
                <Typography variant="h2">
                    {translate('Landing.Pros.Title')}
                </Typography>
            </div>
            <div className={styles.grid__head__3}></div>
            {TILES.map((tile) => (
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
            ))}
        </section>
    );
};

export default ProsSection;
