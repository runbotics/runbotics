import { useEffect } from 'react';

import { Box, Chip, Typography } from '@mui/material';

import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { processActions, processSelector } from '#src-app/store/slices/Process';

import {
    DetailsInfoTabProps,
    ProcessDetailsTab,
} from '../ProcessDetailsDialog.types';

export const CredentialsTab = ({ value, process }: DetailsInfoTabProps) => {
    const { translate } = useTranslations();
    const dispatch = useDispatch();
    const {
        draft: { credentials: processCredentials },
    } = useSelector(processSelector);
    const processId = process?.id;

    useEffect(() => {
        if (!processId) return;

        dispatch(
            processActions.getProcessCredentials({
                resourceId: String(processId),
            })
        );
    }, []);

    return (
        <Box hidden={value !== ProcessDetailsTab.CREDENTIALS}>
            <Box
                display="flex"
                flexWrap="wrap"
                mt={2}
                gap={1}
                alignItems="center"
            >
                <Typography variant="h5">
                    {translate(
                        'Component.Tile.Process.DetailsDialog.TabContent.CredentialsLabel.Credentials'
                    )}
                </Typography>
                {processCredentials?.length ? (
                    processCredentials.map(({ credential: { id, name } }) => (
                        <Chip label={name} key={id} size="small" />
                    ))
                ) : (
                    <Typography>
                        {translate(
                            'Component.Tile.Process.DetailsDialog.TabContent.CredentialsLabel.Credentials.Placeholder'
                        )}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
