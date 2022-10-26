import { IBotCollection } from 'runbotics-common';
import { Page } from '../../../utils/types/page';

export interface BotCollectionsState {
    loading: boolean;
    botCollections: IBotCollection[];
    byPage: Page<IBotCollection>
}
