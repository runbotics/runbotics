import { Box, Chip, Typography } from '@mui/material';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import {
    DetailsInfoTabProps,
    ProcessDetailsTab,
} from '../ProcessDetailsDialog.types';

export const AccessTab = ({ value, process }: DetailsInfoTabProps) => {
    const { translate } = useTranslations();
    const isSharedWith = process.processCollection?.users?.length > 0;
    const isSharedWithOrganization =
        !process.processCollection && process.isPublic;
    const sharedWithPlaceholder = isSharedWithOrganization
        ? translate('Component.Tile.Process.DetailsDialog.TabContent.AccessLabel.SharedWithOrganization.Placeholder')
        : translate('Component.Tile.Process.DetailsDialog.TabContent.AccessLabel.SharedWith.Placeholder');
    return (
        <Box hidden={value !== ProcessDetailsTab.ACCESS}>
            <Box
                display="flex"
                flexWrap="wrap"
                mt={2}
                gap={1}
                alignItems="center"
            >
                <Typography variant="h5">
                    {translate(
                        'Component.Tile.Process.DetailsDialog.TabContent.AccessLabel.SharedWith'
                    )}
                </Typography>
                <If
                    condition={isSharedWith}
                    else={
                        <Typography>{sharedWithPlaceholder}</Typography>
                    }
                >
                    {process.processCollection?.users.map(({ id, email }) => (
                        <Chip label={email} key={id} size="small" />
                    ))}
                </If>
            </Box>
        </Box>
    );
};
