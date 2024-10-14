import { Box, Chip, Typography } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';

import {
    DetailsInfoTabProps,
    ProcessDetailsTab,
} from '../ProcessDetailsDialog.types';

export const AccessTab = ({ value, process }: DetailsInfoTabProps) => {
    const { translate } = useTranslations();
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
                {process?.processCollection?.users?.length ? (
                    process.processCollection.users.map(({ id, login }) => (
                        <Chip label={login} key={id} size="small" />
                    ))
                ) : (
                    <Typography>
                        {translate(
                            'Component.Tile.Process.DetailsDialog.TabContent.AccessLabel.SharedWith.Placeholder'
                        )}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
