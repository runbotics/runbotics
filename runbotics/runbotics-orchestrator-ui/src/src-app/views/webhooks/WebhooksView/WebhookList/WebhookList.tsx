import { ChangeEvent, FC, useEffect, useState } from 'react';

import { Search } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';

import InputAdornment from '@mui/material/InputAdornment';

import { useDispatch, useSelector } from '#src-app/store';
import { webhookActions } from '#src-app/store/slices/Webhook';
import {
    WebhookListActionRow,
    WebhookListContainer,
} from '#src-app/views/webhooks/WebhooksView/WebhookList/WebhookList.styles';

const WebhookList: FC = () => {
    const dispatch = useDispatch();
    const search = useSelector((state) => state.webhook.search);
    const [localSearch, setLocalSearch] = useState(search);
    
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
    }
    
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
                <Button 
                    variant={'contained'} 
                    onClick={handleDialogOpen}>
                    {'Register webhook'}
                </Button>
            </WebhookListActionRow>
            Work in progress
        </WebhookListContainer>
    );
};

export default WebhookList;
