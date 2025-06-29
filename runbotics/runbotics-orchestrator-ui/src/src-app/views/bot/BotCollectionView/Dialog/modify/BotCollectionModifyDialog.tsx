import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';

import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, Switch, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { BasicUserDto, BotCollectionDto, FeatureKey } from 'runbotics-common';

import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useTranslations from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';
import { botCollectionActions } from '#src-app/store/slices/BotCollections';
import { usersActions } from '#src-app/store/slices/Users';
import { PageRequestParams } from '#src-app/utils/types/page';

import { Content, Form, Title } from '../../../../utils/FormDialog.styles';

interface ModifyBotCollectionDialogProps {
    open?: boolean;
    onClose: () => void;
    pageParams: PageRequestParams<Partial<BotCollectionDto>>;
    collection: BotCollectionDto;
}

const REJECT_REQUEST_TYPE = 'botCollection/createOne/rejected';
const REJECT_UPDATE_REQUEST_TYPE = 'botCollection/updateCollection/rejected';

// eslint-disable-next-line max-lines-per-function
const BotCollectionModifyDialog: FC<ModifyBotCollectionDialogProps> = ({ collection, onClose, open, pageParams }) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();

    useEffect(() => {
        if (open) dispatch(usersActions.getAllUsersInTenant());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const { user: currentUser } = useSelector((state) => state.auth);
    const { tenantActivated } = useSelector((state) => state.users);
    const [name, setName] = useState(collection ? collection.name : '');
    const [description, setDescription] = useState(collection ? collection.description : '');
    const [selectedUsers, setSelectedUsers] = useState<BasicUserDto[]>(collection ? collection.users : []);
    const [publicBotsIncluded, setPublicBotsIncluded] = useState(collection ? collection.publicBotsIncluded : true);
    const [error, setError] = useState(null);

    const shareableUsers = useMemo(() => ({
        loading: tenantActivated.loading,
        all: tenantActivated.all.filter(user => user.email !== currentUser.email && hasFeatureKeyAccess(user, [FeatureKey.BOT_COLLECTION_READ]))
    }), [tenantActivated, currentUser.email]);

    const isOwner = !collection || currentUser.email === collection?.createdByUser?.email || hasFeatureKeyAccess(currentUser, [FeatureKey.BOT_COLLECTION_ALL_ACCESS]);

    const createCollectionEntityToSend = () => ({
        name,
        description,
        publicBotsIncluded,
        users: selectedUsers,
        createdBy: tenantActivated.all.find((user) => user.email === currentUser.email),
        created: collection ? collection.created : moment().toISOString(),
        updated: moment().toISOString(),
        ...(collection?.id && { id: collection.id }),
    });

    const resetFormStates = () => {
        setName(collection ? collection.name : '');
        setDescription(collection ? collection.description : '');
        setSelectedUsers(collection ? collection.users : []);
        setPublicBotsIncluded(collection ? collection.publicBotsIncluded : true);
        setError(null);
    };

    const updateCollection = (botCollection) => {
        if (collection) return dispatch(botCollectionActions.updateOne({ resourceId: collection.id, payload: botCollection }));

        return dispatch(botCollectionActions.createOne({ payload: botCollection }));
    };

    const handleSubmit = async () => {
        const body = createCollectionEntityToSend();
        const { type, payload } = await updateCollection(body);

        if ([REJECT_REQUEST_TYPE, REJECT_UPDATE_REQUEST_TYPE].includes(type)) {
            setError(payload);
        } else {
            setError(null);
            await dispatch(botCollectionActions.getByPage({ pageParams }));
            onClose();
            resetFormStates();
        }
    };

    const handleNameChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setName(ev.target.value);
    };

    const handleDescChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setDescription(ev.target.value);
    };

    const handlePublicBotsIncluded = () => {
        setPublicBotsIncluded(!publicBotsIncluded);
    };

    const handleSelectUsers = (event, value) => {
        setSelectedUsers(value);
    };

    useEffect(() => {
        setName(collection ? collection.name : '');
        setDescription(collection ? collection.description : '');
        setSelectedUsers(collection ? collection.users : []);
        setPublicBotsIncluded(collection ? collection.publicBotsIncluded : true);
    }, [collection]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    minHeight: '70vh',
                    maxHeight: '70vh',
                },
            }}
        >
            <Title>{translate('Bot.Collection.Dialog.Modify.Title')}</Title>
            <Content>
                <Form>
                    <TextField
                        label={translate('Bot.Collection.Dialog.Modify.Form.Name.Label')}
                        required
                        value={name}
                        disabled={!isOwner}
                        onChange={handleNameChange}
                        size="small"
                        fullWidth
                    />
                    <TextField
                        label={translate('Bot.Collection.Dialog.Modify.Form.Description.Label')}
                        value={description}
                        disabled={!isOwner}
                        onChange={handleDescChange}
                        size="small"
                        fullWidth
                    />
                    <Typography color="textSecondary" variant="body2">
                        {translate('Bot.Collection.Dialog.Modify.Form.PublicBots.Label')}
                        <Switch checked={publicBotsIncluded} onChange={handlePublicBotsIncluded} disabled={!isOwner} />
                    </Typography>
                    <Autocomplete
                        onChange={handleSelectUsers}
                        multiple
                        disabled={!isOwner}
                        id="bot-collection-users-select"
                        options={shareableUsers.loading ? [] : shareableUsers.all}
                        isOptionEqualToValue={(optionUser, valueUser) => optionUser.email === valueUser.email}
                        loading={shareableUsers.loading}
                        getOptionLabel={(user) => user.email}
                        defaultValue={selectedUsers}
                        value={selectedUsers}
                        filterSelectedOptions
                        disableCloseOnSelect
                        readOnly={!isOwner}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={translate('Bot.Collection.Dialog.Modify.Form.Users.Label')}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {shareableUsers.loading ? <CircularProgress size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />

                    <Typography sx={{ visibility: `${error ? 'visibily' : 'hidden'}` }} color="red" variant="body2">
                        {/* @ts-ignore */}
                        {error?.message}
                    </Typography>
                </Form>
            </Content>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={() => {
                        onClose();
                        resetFormStates();
                    }}
                >
                    {translate('Common.Cancel')}
                </Button>
                <Button type="submit" variant="contained" color="primary" autoFocus onClick={() => handleSubmit()}>
                    {translate('Common.Save')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BotCollectionModifyDialog;
