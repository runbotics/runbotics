import { Drive } from '../common.types';

//https://graph.microsoft.com/v1.0/$metadata#sites/$entity
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
