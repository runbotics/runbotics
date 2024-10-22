import { FC } from 'react';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Box, Breadcrumbs, SxProps, Theme, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useTheme } from 'styled-components';

import { CollectionBreadcrumb } from '#src-app/hooks/useProcessCollection';

import { HomeBox, StyledLink } from './ProcessCollectionPath.styles';

interface ProcessCollectionPathProps {
    breadcrumbs: CollectionBreadcrumb[];
    currentCollectionId: string;
    sx?: SxProps<Theme>;
}

const ProcessCollectionPath: FC<ProcessCollectionPathProps> = ({
    breadcrumbs,
    currentCollectionId,
    sx,
}) => {
    const router = useRouter();
    const theme = useTheme();
    const pathname = !router.pathname.includes('/collections')
        ? `${router.pathname}/collections`
        : router.pathname;

    const isRootFolder = breadcrumbs.length === 0;

    return (
        <Box pb={2} sx={sx}>
            <Breadcrumbs>
                <StyledLink
                    href={{
                        pathname,
                    }}
                >
                    <HomeBox>
                        <HomeOutlinedIcon
                            sx={{
                                color: isRootFolder
                                    ? theme.palette.secondary.main
                                    : theme.palette.common.black,
                            }}
                        />
                    </HomeBox>
                </StyledLink>
                {breadcrumbs.map((breadcrumb) => (
                    <StyledLink
                        key={breadcrumb.name}
                        href={{
                            pathname,
                            query: {
                                ...router.query,
                                ...(breadcrumb.collectionId && {
                                    collectionId: breadcrumb.collectionId,
                                }),
                            },
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color:
                                    breadcrumb.collectionId ===
                                    currentCollectionId
                                        ? theme.palette.secondary.main
                                        : theme.palette.common.black,
                            }}
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
