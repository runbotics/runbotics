import Image from 'next/image';

import useTranslations from '#src-app/hooks/useTranslations';
import GenericTile from '#src-landing/components/GenericTile';
import Typography from '#src-landing/components/Typography';

import styles from './ProsSection.module.scss';

import { ProsTile } from './ProsSection.types';

const TILES: ProsTile[] = [
	{
		title: 'Landing.Pros.Diagram.Title',
		description: 'Landing.Pros.Diagram.Description',
		icon: '/images/shapes/highlight.svg',
		iconAlt: 'Landing.Pros.Diagram.Icon.Alt',
	},
	{
		title: 'Landing.Pros.Plan.Title',
		description: 'Landing.Pros.Plan.Description',
		icon: '/images/shapes/event.svg',
		iconAlt: 'Landing.Pros.Plan.Icon.Alt',
	},
	{
		title: 'Landing.Pros.Track.Title',
		description: 'Landing.Pros.Track.Description',
		icon: '/images/shapes/visibility.svg',
		iconAlt: 'Landing.Pros.Track.Icon.Alt',
	},
	{
		title: 'Landing.Pros.Attended.Title',
		description: 'Landing.Pros.Attended.Description',
		icon: '/images/shapes/precision.svg',
		iconAlt: 'Landing.Pros.Attended.Icon.Alt',
	},
	{
		title: 'Landing.Pros.History.Title',
		description: 'Landing.Pros.History.Description',
		icon: '/images/shapes/auto_stories.svg',
		iconAlt: 'Landing.Pros.History.Icon.Alt',
	},
	{
		title: 'Landing.Pros.Execution.Title',
		description: 'Landing.Pros.Execution.Description',
		icon: '/images/shapes/account_tree.svg',
		iconAlt: 'Landing.Pros.Execution.Icon.Alt',
	},
	{
		title: 'Landing.Pros.Template.Title',
		description: 'Landing.Pros.Template.Description',
		icon: '/images/shapes/smart_toy.svg',
		iconAlt: 'Landing.Pros.Template.Icon.Alt',
	},
	{
		title: 'Landing.Pros.Customize.Title',
		description: 'Landing.Pros.Customize.Description',
		icon: '/images/shapes/tune.svg',
		iconAlt: 'Landing.Pros.Customize.Icon.Alt',
	},
	{
		title: 'Landing.Pros.Actions.Title',
		description: 'Landing.Pros.Actions.Description',
		icon: '/images/shapes/brush.svg',
		iconAlt: 'Landing.Pros.Actions.Icon.Alt',
	},
];

const ProsSection = () => {
	const { translate } = useTranslations();

	return (
		<section className={styles.root} id="pros">
			<div className={styles.grid__head__1}></div>
			<div className={styles.grid__head__2}>
				<Typography variant="h2">{translate('Landing.Pros.Title')}</Typography>
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
					<Typography variant="h4">{translate(tile.title)}</Typography>
					<Typography variant="body3" font="Roboto">
						{translate(tile.description)}
					</Typography>
				</GenericTile>
			))}
		</section>
	);
};

export default ProsSection;
