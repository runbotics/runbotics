import { ChangeEvent, FC, useEffect, useState } from 'react';

import { Search } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';

import InputAdornment from '@mui/material/InputAdornment';

import Loader from '#src-app/components/Loader';
import WebhookTable from '#src-app/components/tables/WebhookTable/WebhookTable';
import { useDispatch, useSelector } from '#src-app/store';
import { webhookActions } from '#src-app/store/slices/Webhook';
import { getWebhooks } from '#src-app/store/slices/Webhook/Webhook.thunks';
import {
    WebhookListActionRow,
    WebhookListContainer,
} from '#src-app/views/webhooks/WebhooksView/WebhookList/WebhookList.styles';

const WebhookList: FC = () => {
    const dispatch = useDispatch();
    const { search, loading, webhooks } = useSelector((state) => state.webhook);
    const [localSearch, setLocalSearch] = useState(search);

    useEffect(() => {
        dispatch(getWebhooks());
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(webhookActions.setSearch(localSearch));
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [localSearch]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLocalSearch(event.target.value);
    };

    const handleDialogOpen = () => {
        dispatch(webhookActions.setIsModalOpen(true));
    };

    return (
        <WebhookListContainer>
            <WebhookListActionRow>
                <TextField
                    size={'small'}
                    placeholder={'Search...'}
                    variant={'outlined'}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" sx={{ mr: 0.5 }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: '24rem' }}
                    value={localSearch}
                    onChange={handleSearchChange}
                />
                <Button variant={'contained'} onClick={handleDialogOpen}>
                    {'Register webhook'}
                </Button>
            </WebhookListActionRow>
            {loading ?
                <Loader />
                : 
                <div>
                    <WebhookTable />
                </div>}
        </WebhookListContainer>
    );
};

export default WebhookList;
