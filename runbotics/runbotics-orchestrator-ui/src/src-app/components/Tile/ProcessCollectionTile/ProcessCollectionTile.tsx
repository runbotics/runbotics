import React, { FC } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, Tooltip, Typography } from '@mui/material';
import Image from 'next/image';

import { ProcessCollection } from 'runbotics-common';

import PrivateIcon from '#public/images/icons/lock.svg';

import { DeleteCollection } from './MenuItems/DeleteCollection';
import { EditCollection } from './MenuItems/EditCollection';
import { StyledIconsBox } from './ProcessCollectionList.style';
import { CollectionNameWrapper, MenuWrapper, ProcessCollectionTileWrapper } from './ProcessCollectionTile.styles';
import { translate } from '../../../hooks/useTranslations';
import If from '../../utils/If';

const ProcessCollectionTile: FC<ProcessCollection> = (collection) => {
    const { id, name, isPublic, parentId } = collection;

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <ProcessCollectionTileWrapper>
            <Tooltip title={name}>
                <Typography fontWeight={'bolder'}>
                    <CollectionNameWrapper>
                        {name}
                    </CollectionNameWrapper>
                </Typography>
            </Tooltip>
            <If condition={!isPublic}>
                <Tooltip title={translate('Process.Collection.List.IsPrivate.Tooltip')}>
                    <StyledIconsBox color={'grey'}>
                        <Image src={PrivateIcon} alt={translate('Process.Collection.List.Alt.PrivateIcon')} />
                    </StyledIconsBox>
                </Tooltip>
            </If>
            <MenuWrapper>
                <IconButton onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu id="process-collection-actions-menu" anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
                    <EditCollection collection={collection} onClose={handleClose} />
                    <DeleteCollection id={id} />
                </Menu>
            </MenuWrapper>
        </ProcessCollectionTileWrapper>
    );
};

export default ProcessCollectionTile;
