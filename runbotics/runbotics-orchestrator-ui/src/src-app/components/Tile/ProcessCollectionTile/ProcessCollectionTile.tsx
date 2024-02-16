import React, { FC } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';

import { useRouter } from 'next/router';
import { ProcessCollection } from 'runbotics-common';

import PrivateIcon from '#public/images/icons/lock.svg';

import { DeleteCollection } from './MenuItems/DeleteCollection';
import { EditCollection } from './MenuItems/EditCollection';
import { MoveCollection } from './MenuItems/MoveCollection';
import { StyledIconsBox } from './ProcessCollectionList.style';
import { CollectionNameWrapper, ContextWrapper, MenuWrapper, ProcessCollectionTileWrapper, StyledLink } from './ProcessCollectionTile.styles';
import { translate } from '../../../hooks/useTranslations';
import If from '../../utils/If';

const ProcessCollectionTile: FC<ProcessCollection> = ({ id, name, isPublic, parentId }) => {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <ProcessCollectionTileWrapper>
            <StyledLink
                href={{
                    pathname: router.pathname,
                    query: {
                        ...router.query,
                        collectionId: id
                    }
                }}
            >
                <ContextWrapper>
                    <Tooltip title={name}>
                        <Typography fontWeight={'bolder'}>
                            <CollectionNameWrapper>
                                {name}
                            </CollectionNameWrapper>
                        </Typography>
                    </Tooltip>
                    <If condition={!isPublic}>
                        <Tooltip title={translate('Process.Collection.List.IsPrivate.Tooltip')}>
                            <StyledIconsBox bgColor='grey'>
                                <Image src={PrivateIcon} alt={translate('Process.Collection.List.Alt.PrivateIcon')} />
                            </StyledIconsBox>
                        </Tooltip>
                    </If>
                </ContextWrapper>
            </StyledLink>
            <MenuWrapper>
                <IconButton onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu id="process-collection-actions-menu" anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
                    <MoveCollection id={id} />
                    <EditCollection id={id} name={name} isPublic={isPublic} parentId={parentId} />
                    <DeleteCollection id={id} />
                </Menu>
            </MenuWrapper>
        </ProcessCollectionTileWrapper>
    );
};

export default ProcessCollectionTile;
