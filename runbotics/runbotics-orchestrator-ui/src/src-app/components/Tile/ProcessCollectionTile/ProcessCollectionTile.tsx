import React, { FC } from 'react';
import Image from 'next/image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, Tooltip, Typography } from '@mui/material';
import PrivateIcon from '#public/images/icons/lock.svg';
import If from '../../utils/If';
import { CollectionNameWrapper, MenuWrapper, ProcessCollectionTileWrapper } from './ProcessCollectionTile.styles';
import { ProcessCollectionTileProps } from './ProcessCollectionTile.types';
import { MoveCollection } from './MenuItems/MoveCollection';
import { EditCollection } from './MenuItems/EditCollection';
import { DeleteCollection } from './MenuItems/DeleteCollection';
import { StyledIconsBox } from './ProcessCollectionList.style';
import { translate } from '../../../hooks/useTranslations';

const ProcessCollectionTile: FC<ProcessCollectionTileProps> = (props) => {
    const { id, name, isPublic } = {...props};

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
                        <Image src={PrivateIcon} alt='Private icon' />
                    </StyledIconsBox>
                </Tooltip>
            </If>
            <MenuWrapper>
                <IconButton onClick={handleClick}>
                    <MoreVertIcon />
                </IconButton>
                <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
                    <MoveCollection id={id} />
                    <EditCollection {...props} />
                    <DeleteCollection id={id} />
                </Menu>
            </MenuWrapper>
        </ProcessCollectionTileWrapper>
    );
};

export default ProcessCollectionTile;
