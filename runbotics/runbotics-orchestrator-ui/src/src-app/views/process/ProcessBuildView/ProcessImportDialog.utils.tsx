import { List, ListItem, Typography } from '@mui/material';
import { Credential } from 'runbotics-common';

import { translate } from '#src-app/hooks/useTranslations';
import { credentialsActions } from '#src-app/store/slices/Credentials';

import { AdditionalInfo } from './Modeler/BpmnModeler';

interface ClearImportedCredentialsParams {
    definition: string;
    additionalInfo: AdditionalInfo;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    importDraft: (definition: string, additionalInfo: AdditionalInfo) => void;
}

export const mapCredentialsToList = (credentials: Credential[]) => (
    <List>
        {credentials?.length && [...new Map(credentials.map(c => [c.id, c])).values()]
            .map(credential => {
                const colName = credential?.collection?.name;
                const name = credential?.name;

                if (!colName || !name) {
                    return <ListItem key={credential.id}><Typography>{translate('Process.BuildView.Import.Dialog.Credential.Unknown', { credentialId: credential.id })}</Typography></ListItem>;
                }

                return (
                    <ListItem key={credential.id}><Typography>{`${credential.collection.name} > ${credential.name}`}</Typography></ListItem>
                );
            })}
    </List>
);

export const resolveCredentials = async (
    definition: string,
    dispatch: (action: any) => Promise<{ payload: Credential; meta: { requestStatus: string; arg: { resourceId: string } } }>,
): Promise<Credential[]> => {
    const customIdRegex = /<camunda:inputParameter name="customCredentialId">(.+?)<\/camunda:inputParameter>/g;
    const matches = Array.from(definition.matchAll(customIdRegex), match => match[1]);

    if (matches.length === 0) return [];

    const credentials = matches.map((credId) =>
        dispatch(credentialsActions.fetchOneCredential({ resourceId: credId }))
    );

    return (await Promise.all(credentials))
        .flatMap(cred =>
            cred.meta.requestStatus === 'fulfilled'
                ? cred.payload
                : { id: cred.meta.arg.resourceId }
        ) as Credential[];
};

export const handleClearImportedCredentials = ({
    definition,
    additionalInfo,
    setOpen,
    importDraft,
}: ClearImportedCredentialsParams) => {
    setOpen(false);
    const definitionWithoutCustomCredentials = clearCustomCredentials(definition);
    importDraft(definitionWithoutCustomCredentials, additionalInfo);
};

const clearCustomCredentials = (definition: string) => {
    const regex = /<camunda:inputParameter name="customCredentialId">.*?<\/camunda:inputParameter>\n?/g;
    const definitionWithoutCustomCredentials = definition.replace(regex, '');
    return definitionWithoutCustomCredentials;
};
