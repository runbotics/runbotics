import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';

import { MenuItem, Select, Typography } from '@mui/material';
import _ from 'lodash';
import { CredentialDto } from 'runbotics-common';

import useTranslations from '#src-app/hooks/useTranslations';

import { Container, Box } from './CredentialSelectSet.styles';
import If from '../utils/If';

interface CredentialSelectSetProps {
    credentials: CredentialDto[];
    handleCredentialChange: (credential: CredentialDto) => void;
}

const CredentialSelectSet: FunctionComponent<CredentialSelectSetProps> = ({
    credentials, handleCredentialChange
}) => {
    const { translate } = useTranslations();

    const [author, setAuthor] = useState<string>(null);
    const credentialsFilteredByAuthor = credentials.filter(
        (credential) => credential.createdBy.email === author
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
        <If
            condition={Boolean(credentials.length)}
            else={
                <Typography>
                    {translate('Component.CredentialSelectSet.NotFound')}
                </Typography>
            }
        >
            <Container>
                <Box>
                    <Typography>
                        {translate(
                            'Component.CredentialSelectSet.CollectionAuthor'
                        )}
                    </Typography>
                    <Select
                        size='small'
                        value={author}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setAuthor(e.target.value);
                        }}
                        disabled={!credentials.length}
                    >
                        {_.uniqBy(
                            credentials,
                            (credential) => credential.createdBy.email
                        ).map(({ createdBy: creator }) => (
                            <MenuItem value={creator.email} key={creator.email}>
                                {creator.email}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box>
                    <Typography>
                        {translate(
                            'Component.CredentialSelectSet.CollectionName'
                        )}
                    </Typography>
                    <Select
                        size='small'
                        value={collectionName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setCollectionName(e.target.value);
                        }}
                        disabled={!credentialsFilteredByAuthor.length}
                    >
                        {_.uniqBy(
                            credentialsFilteredByAuthor,
                            (credential) => credential.collection.name
                        ).map(({ collection }) => (
                            <MenuItem
                                value={collection.name}
                                key={collection.name}
                            >
                                {collection.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box>
                    <Typography>
                        {translate(
                            'Component.CredentialSelectSet.CredentialName'
                        )}
                    </Typography>
                    <Select
                        size='small'
                        value={credentialName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setCredentialName(e.target.value);
                        }}
                        disabled={!credentialsFilteredByCollection.length}
                    >
                        {credentialsFilteredByCollection.map((credential) => (
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
        </If>
    );
};

export default CredentialSelectSet;
