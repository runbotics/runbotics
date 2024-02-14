import { FC } from 'react';

import { Box, Breadcrumbs, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';

import homeIcon from '#public/images/icons/home.svg';
import { CollectionBreadcrumb } from '#src-app/hooks/useProcessCollection';
import useTranslations from '#src-app/hooks/useTranslations';

import { HomeBox, StyledLink } from './ProcessCollectionPath.styles';

const ACTIVE_ICON_COLOR_FILTER = 'invert(72%) sepia(41%) saturate(3394%) hue-rotate(356deg) brightness(101%) contrast(94%)';

interface ProcessCollectionPathProps {
    breadcrumbs: CollectionBreadcrumb[];
    currentCollectionId: string;
}

const ProcessCollectionPath: FC<ProcessCollectionPathProps> = ({
    breadcrumbs, currentCollectionId
}) => {
    const router = useRouter();
    const { translate } = useTranslations();

    const isRootFolder = breadcrumbs.length === 0;

    return (
        <Box pb={2}>
            <Breadcrumbs>
                <StyledLink
                    href={{
                        pathname: router.pathname,
                        query: {
                            ...router.query,
                            collectionId: null
                        }
                    }}
                >
                    <HomeBox>
                        <Image
                            src={homeIcon}
                            alt='home icon'
                            width='20'
                            height='20'
                            style={isRootFolder ? { filter: ACTIVE_ICON_COLOR_FILTER } : {}}
                        />
                        <Typography
                            variant='body2'
                            color={isRootFolder ? 'secondary' : 'black'}
                        >
                            {translate('Process.Collection.Path.Home')}
                        </Typography>
                    </HomeBox>
                </StyledLink>
                {breadcrumbs.map((breadcrumb) => (
                    <StyledLink
                        key={breadcrumb.name}
                        href={{
                            pathname: router.pathname,
                            query: {
                                ...router.query,
                                collectionId: breadcrumb.collectionId
                            }
                        }}
                    >
                        <Typography
                            variant='body2'
                            color={breadcrumb.collectionId === currentCollectionId ? 'secondary' : 'black'}
                        >
                            {breadcrumb.name}
                        </Typography>
                    </StyledLink>
                ))}
            </Breadcrumbs>
        </Box>
    );
};

export default ProcessCollectionPath;
