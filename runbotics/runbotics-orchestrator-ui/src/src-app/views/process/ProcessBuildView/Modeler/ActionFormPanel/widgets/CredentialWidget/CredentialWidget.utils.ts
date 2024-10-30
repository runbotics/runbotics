import { translate } from '#src-app/hooks/useTranslations';

export const getCredentialBreadcrumb = (selectedCredential, primaryCredential) => {
    const collectionName = selectedCredential?.collection?.name;
    const credentialName = selectedCredential?.name;

    if (!collectionName || !credentialName) {
        const primaryCollectionName = primaryCredential?.credential?.collection?.name;
        const primaryCredentialName = primaryCredential?.credential?.name;

        if (!primaryCollectionName || !primaryCredentialName) {
            return translate('Credential.ActionFormSelect.Dialog.NoPrimaryCredential');

        }

        return buildBreadcrumb(primaryCollectionName, primaryCredentialName);
    }

    return buildBreadcrumb(collectionName, credentialName);
};

const buildBreadcrumb = (collectionName, credentialName) => `${collectionName} > ${credentialName}`;

