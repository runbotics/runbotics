import { User } from '#src-app/types/user';

export interface CredentialsMetadataDTO {
    createdOn: Date;
    createdBy: User;
    modifiedOn?: Date;
    modifiedBy?: User;
}

export interface GridViewProps {
    isCollectionsTab: boolean;
}
