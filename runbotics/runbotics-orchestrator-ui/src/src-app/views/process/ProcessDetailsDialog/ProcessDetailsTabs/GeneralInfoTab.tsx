import { useEffect } from 'react';

import { Box, Chip, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

import ProcessCollectionPath from '#src-app/components/Tile/ProcessCollectionTile/ProcessCollectionPath';
import If from '#src-app/components/utils/If';
import { getBreadcrumbs } from '#src-app/hooks/useProcessCollection';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import {
    processCollectionActions,
    processCollectionSelector,
} from '#src-app/store/slices/ProcessCollection';

import {
    DetailsInfoTabProps,
    ProcessDetailsTab,
} from '../ProcessDetailsDialog.types';

export const GeneralInfoTab = ({ value, process }: DetailsInfoTabProps) => {
    const { translate } = useTranslations();
    const hasTags = process.tags?.length > 0;
    const dispatch = useDispatch();
    const {
        active: { ancestors: collectionAncestors },
    } = useSelector(processCollectionSelector);
    const collectionId = process.processCollection?.id;
    const breadcrumbs = getBreadcrumbs(collectionAncestors);
    const creator = process.createdBy.email
        ? process.createdBy.email
        : translate('Component.Tile.Process.Content.Creator.Placeholder');
    const created = formatDistanceToNow(new Date(process.created));
    const editor = process.editor?.email
        ? process.editor?.email
        : translate('Component.Tile.Process.Content.Editor.Placeholder');
    const updated = process.updated
        ? formatDistanceToNow(new Date(process.updated))
        : translate('Component.Tile.Process.Content.Updated.Placeholder');

    useEffect(() => {
        const params = { filter: { equals: { parentId: collectionId } } };

        dispatch(processCollectionActions.getAllWithAncestors(params));
    }, []);

    return (
        <Box hidden={value !== ProcessDetailsTab.GENERAL_INFO}>
            <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                <Box display="flex" flexDirection="column" mr={15}>
                    <Box display="flex" alignItems="end" gap={1}>
                        <Typography variant="h5">
                            {translate(
                                'Component.Tile.Process.Content.Creator'
                            )}
                        </Typography>
                        <Typography>{creator}</Typography>
                    </Box>
                    <Box display="flex" alignItems="end" gap={1}>
                        <Typography variant="h5">
                            {translate(
                                'Component.Tile.Process.Content.Created'
                            )}
                        </Typography>
                        <Typography>{created}</Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" mr={15}>
                    <Box display="flex" alignItems="end" gap={1}>
                        <Typography variant="h5">
                            {translate('Component.Tile.Process.Content.Editor')}
                        </Typography>
                        <Typography>{editor}</Typography>
                    </Box>
                    <Box display="flex" alignItems="end" gap={1}>
                        <Typography variant="h5">
                            {translate(
                                'Component.Tile.Process.Content.Updated'
                            )}
                        </Typography>
                        <Typography>{updated}</Typography>
                    </Box>
                </Box>
            </Box>
            <Box display="flex" alignItems="end" gap={1} my={2}>
                <Typography variant="h5">
                    {translate(
                        'Component.Tile.Process.DetailsDialog.TabContent.GeneralInfoLabel.System'
                    )}
                </Typography>
                <Typography>{process.system.name}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                <Typography variant="h5">
                    {translate(
                        'Component.Tile.Process.DetailsDialog.TabContent.GeneralInfoLabel.Tags'
                    )}
                </Typography>
                <If
                    condition={hasTags}
                    else={
                        <Typography>
                            {translate(
                                'Component.Tile.Process.DetailsDialog.TabContent.GeneralInfoLabel.Tags.Placeholder'
                            )}
                        </Typography>
                    }
                >
                    {process.tags.map((tag) => (
                        <Chip label={tag.name} key={tag.name} size="small" />
                    ))}
                </If>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h5">
                    {translate(
                        'Component.Tile.Process.DetailsDialog.TabContent.GeneralInfoLabel.Location'
                    )}
                </Typography>
                <ProcessCollectionPath
                    sx={{ paddingBottom: 0 }}
                    breadcrumbs={breadcrumbs}
                    currentCollectionId={collectionId}
                />
            </Box>
        </Box>
    );
};
