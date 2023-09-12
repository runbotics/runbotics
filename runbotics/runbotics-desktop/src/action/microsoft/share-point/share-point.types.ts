import { Drive } from '../common.types';

/**
 * @see https://learn.microsoft.com/en-us/graph/api/resources/site?view=graph-rest-1.0
 */
export interface Site {
    id: string;
    displayName: string;
    description: string;
    name: string;
    createdDateTime: string;
    lastModifiedDateTime: string;
    webUrl: string;
    parentReference: {
        siteId: string;
    }
}

export interface SiteWithDrives extends Site {
    'drives@odata.context': string;
    drives: Drive[];
}
