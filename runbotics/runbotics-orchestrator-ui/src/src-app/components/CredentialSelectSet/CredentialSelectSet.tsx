import { ChangeEvent, FunctionComponent, useEffect, useMemo, useState } from 'react';

import { MenuItem, Typography } from '@mui/material';
import _ from 'lodash';

import useTranslations from '#src-app/hooks/useTranslations';
import { Credential } from '#src-app/store/slices/Credentials';

import { Box, StyledSelect } from './CredentialSelectSet.styles';

interface CredentialSelectSetProps {
    credentials: Credential[];
    handleCredentialChange: (credential: Credential | undefined) => void;
}

const CredentialSelectSet: FunctionComponent<CredentialSelectSetProps> = ({
    credentials, handleCredentialChange
}) => {
    const { translate } = useTranslations();

    const [author, setAuthor] = useState<string>(null);
    const credentialsSortedByAuthor = useMemo(
        () => credentials.filter(credential => credential.createdBy.login === author),
        [author, credentials]);
    const [collectionName, setCollectionName] = useState<string>(null);
    const credentialsSortedByCollection = useMemo(
        () => credentialsSortedByAuthor.filter(credential => credential.collection.name === collectionName),
        [collectionName, credentialsSortedByAuthor]);
    const [credentialName, setCredentialName] = useState<string>(null);
    const credentialSortedByName = useMemo(
        () => credentialsSortedByCollection.find(credential => credential.name === credentialName),
        [credentialName, credentialsSortedByCollection]);

    useEffect(() => {
        handleCredentialChange(credentialSortedByName);
    }, [credentialSortedByName]);

    return (
        <Box>
            <Typography>
                {translate('Component.CredentialSelectSet.CollectionAuthor')}
            </Typography>
            <StyledSelect
                size='small'
                value={author}
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setAuthor(e.target.value); }}
            >
                {_.uniqBy(credentials, credential => credential.createdBy.login)
                    .map(credential => (
                        <MenuItem
                            value={credential.createdBy.login}
                            key={credential.createdBy.login}
                        >
                            {credential.createdBy.login}
                        </MenuItem>
                    ))}
            </StyledSelect>
            <Typography>
                {translate('Component.CredentialSelectSet.CollectionName')}
            </Typography>
            <StyledSelect
                size='small'
                value={collectionName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setCollectionName(e.target.value); }}
                disabled={!credentialsSortedByAuthor.length}
            >
                {_.uniqBy(credentialsSortedByAuthor, credential => credential.collection.name)
                    .map(credential => (
                        <MenuItem
                            value={credential.collection.name}
                            key={credential.collection.name}
                        >
                            {credential.collection.name}
                        </MenuItem>
                    ))}
            </StyledSelect>
            <Typography>
                {translate('Component.CredentialSelectSet.CredentialName')}
            </Typography>
            <StyledSelect
                size='small'
                value={credentialName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => { setCredentialName(e.target.value); }}
                disabled={!credentialsSortedByCollection.length}
            >
                {credentialsSortedByCollection.map(credential => (
                    <MenuItem
                        value={credential.name}
                        key={credential.name}
                    >
                        {credential.name}
                    </MenuItem>
                ))}
            </StyledSelect>
        </Box>
    );
};

export default CredentialSelectSet;
