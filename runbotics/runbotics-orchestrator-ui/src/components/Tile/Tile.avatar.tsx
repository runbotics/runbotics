import { Avatar, Link } from '@mui/material';
import styled from 'styled-components';
import React, { VFC } from 'react';
import useTranslations from 'src/hooks/useTranslations';
import RouterLink from 'next/link';
import { getAvatarText } from './Tile.utils';

const StyledAvatar = styled(Avatar)(
    ({ theme }) => `
    && {
        background-color: ${theme.palette.primary.main};
    }
`,
);

interface TileAvatarProps {
    title: string;
    href?: string;
}

const TileAvatar: VFC<TileAvatarProps> = ({ href, title }) => {
    const { translate } = useTranslations();

    return (
        <RouterLink href={href} passHref>
            <Link variant="h5">
                <StyledAvatar aria-label={translate('Component.Tile.Avatar.AriaLabel')}>
                    {getAvatarText(title)}
                </StyledAvatar>
            </Link>
        </RouterLink>
    );
};

export default TileAvatar;
