import { Avatar, Link } from '@mui/material';
import styled from 'styled-components';
import React, { VFC } from 'react';
import useTranslations from 'src/hooks/useTranslations';
import { Link as RouterLink } from 'react-router-dom';
import { getAvatarText } from './Tile.utils';

const StyledAvatar = styled(Avatar)(({ theme }) => `
    && {
        background-color: ${theme.palette.primary.main};
    }
`);

interface TileAvatarProps {
    title: string;
    href?: string;
}

const TileAvatar: VFC<TileAvatarProps> = ({ href, title }) => {
    const { translate } = useTranslations();

    return (
        <Link
            component={RouterLink}
            variant="h5"
            to={href}
        >
            <StyledAvatar aria-label={translate('Component.Tile.Avatar.AriaLabel')}>
                {getAvatarText(title)}
            </StyledAvatar>
        </Link>
    );
};

export default TileAvatar;
