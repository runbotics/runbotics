import React, { FC } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FeatureKey, ProcessCollection } from 'runbotics-common';

import PrivateIcon from '#public/images/icons/lock.svg';
import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import { useSelector } from '#src-app/store';

import { DeleteCollection } from './MenuItems/DeleteCollection';
import { EditCollection } from './MenuItems/EditCollection';
import { StyledIconsBox } from './ProcessCollectionList.style';
import { CollectionNameWrapper, ContextWrapper, MenuWrapper, ProcessCollectionTileWrapper, StyledLink } from './ProcessCollectionTile.styles';
import { translate } from '../../../hooks/useTranslations';
import If from '../../utils/If';

const ProcessCollectionTile: FC<ProcessCollection> = (collection) => {
    const router = useRouter();
    const { id, name, isPublic } = collection;
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);

    const { user: currentUser } = useSelector((state) => state.auth);
    const isOwner = currentUser.login === collection?.createdBy.login || hasFeatureKeyAccess(currentUser, [FeatureKey.PROCESS_COLLECTION_ALL_ACCESS]);

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
                            <StyledIconsBox $bgcolor='grey'>
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
                    <EditCollection collection={collection} onClose={handleClose} />
                    <DeleteCollection id={id} name={name} isOwner={isOwner} />
                </Menu>
            </MenuWrapper>
        </ProcessCollectionTileWrapper>
    );
};

export default ProcessCollectionTile;
