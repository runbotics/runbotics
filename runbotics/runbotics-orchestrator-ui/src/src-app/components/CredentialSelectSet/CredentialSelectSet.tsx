import { ChangeEvent, FunctionComponent, useEffect, useMemo, useState } from 'react';

import { MenuItem, Select, Typography } from '@mui/material';
import _ from 'lodash';
import { Credential } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';

import { Container, Box } from './CredentialSelectSet.styles';

interface CredentialSelectSetProps {
    credentials: Credential[];
    handleCredentialChange: (credential: Credential) => void;
}

const CredentialSelectSet: FunctionComponent<CredentialSelectSetProps> = ({
    credentials, handleCredentialChange
}) => {
    const { translate } = useTranslations();

    const [author, setAuthor] = useState<string>(null);
    const credentialsFilteredByAuthor = credentials.filter(
        (credential) => credential.createdBy.login === author
    );

    const [collectionName, setCollectionName] = useState<string>(null);
    const credentialsFilteredByCollection = credentialsFilteredByAuthor.filter(
        (credential) => credential.collection.name === collectionName
    );

    const [credentialName, setCredentialName] = useState<string>(null);
    const credentialFilteredByName = credentialsFilteredByCollection.find(
        (credential) => credential.name === credentialName
    );

    useEffect(() => {
        credentialFilteredByName && handleCredentialChange(credentialFilteredByName);
    }, [credentialFilteredByName]);

    return (
        <Container>
            <Box>
                <Typography>
                    {translate('Component.CredentialSelectSet.CollectionAuthor')}
                </Typography>
                <Select
                    size='small'
                    value={author}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setAuthor(e.target.value); }}
                    disabled={!credentials.length}
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
                </Select>
            </Box>
            <Box>
                <Typography>
                    {translate('Component.CredentialSelectSet.CollectionName')}
                </Typography>
                <Select
                    size='small'
                    value={collectionName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setCollectionName(e.target.value); }}
                    disabled={!credentialsFilteredByAuthor.length}
                >
                    {_.uniqBy(credentialsFilteredByAuthor, credential => credential.collection.name)
                        .map(credential => (
                            <MenuItem
                                value={credential.collection.name}
                                key={credential.collection.name}
                            >
                                {credential.collection.name}
                            </MenuItem>
                        ))}
                </Select>
            </Box>
            <Box>
                <Typography>
                    {translate('Component.CredentialSelectSet.CredentialName')}
                </Typography>
                <Select
                    size='small'
                    value={credentialName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setCredentialName(e.target.value); }}
                    disabled={!credentialsFilteredByCollection.length}
                >
                    {credentialsFilteredByCollection.map(credential => (
                        <MenuItem
                            value={credential.name}
                            key={credential.name}
                        >
                            {credential.name}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </Container>
    );
};

export default CredentialSelectSet;
