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
                        <Typography>
                            {translate(
                                'Component.Tile.Process.DetailsDialog.TabContent.AccessLabel.SharedWith.Placeholder'
                            )}
                        </Typography>
                    }
                >
                    {process.processCollection.users.map(({ id, login }) => (
                        <Chip label={login} key={id} size="small" />
                    ))}
                </If>
            </Box>
        </Box>
    );
};
