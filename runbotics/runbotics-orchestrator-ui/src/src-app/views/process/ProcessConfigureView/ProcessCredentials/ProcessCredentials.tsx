import { useState, useEffect } from 'react';

import { Typography } from '@mui/material';
import _ from 'lodash';
import Image from 'next/image';


import LockIcon from '#public/images/icons/lock.svg';
import useWindowSize from '#src-app/hooks/useWindowSize';

import ActionCredential from './ActionCredential';
import ActionCredentialAdd from './ActionCredentialAdd';
import {
    ActionBox, ActionBoxContent,
    ActionBoxHeader, ActionsColumns,
    ActionsContainer, Container, Header
} from './ProcessCredentials.styles';
import { ProcessCredentialsAddDialog } from './ProcessCredentialsAddDialog';

// TEMPORRARY DATA
const data = [
    {
        actionName: 'ATLAS AND ASIAN',
        credentials: [
            {
                collectionName: 'djhawlkdhawilhd',
                name: 'dawdawdawdaw'
            }
        ]
    },
    {
        actionName: 'RAEON ARC',
        credentials: [
            {
                collectionName: 'Credential Collection 435',
                name: 'Clientx'
            },
            {
                collectionName: 'Credential Collection 3357',
                name: 'Clienadt'
            },
            {
                collectionName: 'Credential Collection 256',
                name: 'Cliendwaygt'
            },
            {
                collectionName: 'Credential Collection 8556',
                name: 'Clisdfsefent'
            }
        ]
    },
    {
        actionName: 'RADEON ARC 2',
        credentials: [
            {
                collectionName: 'CrdAWdawd',
                name: 'awdawdwad'
            },
            {
                collectionName: 'Credential Collectafajtrufion 3',
                name: 'Clieawdawdwadnt'
            },
            {
                collectionName: 'Credentsetdrial seCollection 3',
                name: 'Client'
            },
            {
                collectionName: 'Credentwady44dgsial Collection 3',
                name: 'Cl46dffdient'
            }
        ]
    },
    {
        actionName: 'MICXRO NE SOFT',
        credentials: []
    },
    {
        actionName: 'RADXEON ARC ppp',
        credentials: [
            {
                collectionName: 'Cre2365dential Collection 3',
                name: 'Client'
            },
            {
                collectionName: 'Credential 454Collection 3',
                name: 'Cli45ent'
            },
            {
                collectionName: 'Crede232ntial Collection 3',
                name: 'Client'
            },
            {
                collectionName: 'Credential Collec688tion 3',
                name: 'Cli56ent'
            }
        ]
    },
    {
        actionName: 'MICXRO NE SOFT XXX',
        credentials: [
            {
                collectionName: 'Credentdawdial Collection 2',
                name: 'Devedwalopment'
            }
        ]
    },
    {
        actionName: 'MIFCRO NE SOFT bbb',
        credentials: [
            {
                collectionName: 'Credential Colldawection 2',
                name: 'Devedddddddlopment'
            }
        ]
    },
];

const ACTION_MIN_WIDTH = 400;
const MARGIN_LIMIT = 800;

const ProcessCredentials = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { width: windowWidth } = useWindowSize();
    const rowCount = Math.ceil((Math.abs(windowWidth - MARGIN_LIMIT)) / ACTION_MIN_WIDTH);

    const sortColumns = (actions) =>
        actions.reduce((acc, item) => {
            const minSize = Math.min(...acc.map(el => el.count));
            const minIndex = acc.findIndex(el => el.count === minSize);
            acc[minIndex].data.push(item);
            acc[minIndex].count += item.credentials.length + 1;
            return acc;
        }, _.range(rowCount).map(() => ({ count: 0, data: [] })));

    const test = sortColumns(data);

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <Container>
            <ProcessCredentialsAddDialog
                isOpen={isDialogOpen}
                handleClose={handleDialogClose}
            />
            <Header>
                <Image src={LockIcon} alt='lock icon' style={{ filter: 'brightness(0) saturate(100%)' }}/>
                <Typography>Credentials</Typography>
            </Header>
            <ActionsContainer $rowCount={rowCount}>
                {test.map(column => (
                    <ActionsColumns key={column.idx}>
                        {column.data.map(el => (
                            <ActionBox key={el.actionName}>
                                <ActionBoxHeader>
                                    <Typography variant='h5'>{el.actionName}</Typography>
                                </ActionBoxHeader>
                                <ActionBoxContent>
                                    <ActionCredential
                                        isPrimary={true}
                                        isLast={false}
                                        credentialName='test2'
                                        collectionName='test2'
                                    />
                                    {el.credentials.map((cred, idx) => (
                                        <ActionCredential
                                            key={cred.name}
                                            isPrimary={false}
                                            isLast={idx + 1 === el.credentials.length}
                                            credentialName='test'
                                            collectionName='test'
                                        />

                                    ))}
                                    <ActionCredentialAdd  handleClick={handleDialogOpen}/>
                                </ActionBoxContent>
                            </ActionBox>
                        ))}
                    </ActionsColumns>
                ))}
            </ActionsContainer>
        </Container>
    );
};

export default ProcessCredentials;
