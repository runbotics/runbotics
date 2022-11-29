import { VFC } from 'react';

import { Avatar, Link } from '@mui/material';
import RouterLink from 'next/link';
import styled from 'styled-components';

import useTranslations from '#src-app/hooks/useTranslations';


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

    const AvatarWrapper = ({ children }) => {
        if (href) 
        { return (
            <RouterLink href={href} passHref legacyBehavior>
                <Link>{children}</Link>
            </RouterLink>
        ); }
        

        return children;
    };

    return (
        <AvatarWrapper>
            <StyledAvatar aria-label={translate('Component.Tile.Avatar.AriaLabel')}>
                {getAvatarText(title)}
            </StyledAvatar>
        </AvatarWrapper>
    );
};

export default TileAvatar;
