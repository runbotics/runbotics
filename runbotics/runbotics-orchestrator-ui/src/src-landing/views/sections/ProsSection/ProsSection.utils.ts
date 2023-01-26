import AccountTreeIcon from '#public/images/shapes/account_tree.svg';
import AutoStoriesIcon from '#public/images/shapes/auto_stories.svg';
import BrushIcon from '#public/images/shapes/brush.svg';
import EventIcon from '#public/images/shapes/event.svg';
import HighlightIcon from '#public/images/shapes/highlight.svg';
import PrecisionIcon from '#public/images/shapes/precision.svg';
import SmartToyIcon from '#public/images/shapes/smart_toy.svg';
import TuneIcon from '#public/images/shapes/tune.svg';
import VisibilityIcon from '#public/images/shapes/visibility.svg';

import { ProsTile } from './ProsSection.types';

export const TILES: ProsTile[] = [
    {
        title: 'Landing.Pros.Diagram.Title',
        description: 'Landing.Pros.Diagram.Description',
        icon: HighlightIcon,
        iconAlt: 'Landing.Pros.Diagram.Icon.Alt',
    },
    {
        title: 'Landing.Pros.Plan.Title',
        description: 'Landing.Pros.Plan.Description',
        icon: EventIcon,
        iconAlt: 'Landing.Pros.Plan.Icon.Alt',
    },
    {
        title: 'Landing.Pros.Track.Title',
        description: 'Landing.Pros.Track.Description',
        icon: VisibilityIcon,
        iconAlt: 'Landing.Pros.Track.Icon.Alt',
    },
    {
        title: 'Landing.Pros.Attended.Title',
        description: 'Landing.Pros.Attended.Description',
        icon: PrecisionIcon,
        iconAlt: 'Landing.Pros.Attended.Icon.Alt',
    },
    {
        title: 'Landing.Pros.History.Title',
        description: 'Landing.Pros.History.Description',
        icon: AutoStoriesIcon,
        iconAlt: 'Landing.Pros.History.Icon.Alt',
    },
    {
        title: 'Landing.Pros.Execution.Title',
        description: 'Landing.Pros.Execution.Description',
        icon: AccountTreeIcon,
        iconAlt: 'Landing.Pros.Execution.Icon.Alt',
    },
    {
        title: 'Landing.Pros.Template.Title',
        description: 'Landing.Pros.Template.Description',
        icon: SmartToyIcon,
        iconAlt: 'Landing.Pros.Template.Icon.Alt',
    },
    {
        title: 'Landing.Pros.Customize.Title',
        description: 'Landing.Pros.Customize.Description',
        icon: TuneIcon,
        iconAlt: 'Landing.Pros.Customize.Icon.Alt',
    },
    {
        title: 'Landing.Pros.Actions.Title',
        description: 'Landing.Pros.Actions.Description',
        icon: BrushIcon,
        iconAlt: 'Landing.Pros.Actions.Icon.Alt',
    },
];

export const PROS_TITLE_ID = 'pros-title';
