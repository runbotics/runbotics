import React, { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';

import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, Switch, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { FeatureKey, IBotCollection, IUser } from 'runbotics-common';

import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useTranslations from '#src-app/hooks/useTranslations';
import { usersActions } from '#src-app/store/slices/Users';

import { useDispatch, useSelector } from '../../../../../store';
import { botCollectionActions } from '../../../../../store/slices/BotCollections';
import { PageRequestParams } from '../../../../../utils/types/page';
import { Content, Form, Title } from '../../../../utils/FormDialog.styles';



interface ModifyBotCollectionDialogProps {
    open?: boolean;
    onClose: () => void;
    pageParams: PageRequestParams<Partial<IBotCollection>>;
    collection: IBotCollection;
}

const REJECT_REQUEST_TYPE = 'botCollection/createCollection/rejected';

const BotCollectionModifyDialog: FC<ModifyBotCollectionDialogProps> = ({ collection, onClose, open, pageParams }) => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();

    useEffect(() => {
        if (open) dispatch(usersActions.getAllLimited());
        if (open) dispatch(usersActions.getActiveNonAdmins());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const { user: currentUser } = useSelector((state) => state.auth);
    const { all: allUsers, activated: { nonAdmins } } = useSelector((state) => state.users);
    const [name, setName] = useState(collection ? collection.name : '');
    const [description, setDescription] = useState(collection ? collection.description : '');
    const [selectedUsers, setSelectedUsers] = useState<IUser[]>(collection ? collection.users : []);
    const [publicBotsIncluded, setPublicBotsIncluded] = useState(collection ? collection.publicBotsIncluded : true);
    const [error, setError] = useState(null);

    const shareableUsers = useMemo(() => ({
        loading: nonAdmins.loading,
        all: nonAdmins.all.filter(user => user.email !== currentUser.email)
    }), [nonAdmins, currentUser.email, open]);

    const isOwner = !collection || currentUser.login === collection?.createdBy.login || hasFeatureKeyAccess(currentUser, [FeatureKey.BOT_COLLECTION_ALL_ACCESS]);

    const createCollectionEntityToSend = (): IBotCollection => ({
        name,
        description,
        publicBotsIncluded,
        users: selectedUsers,
        createdBy: allUsers.find((user) => user.login === currentUser.login),
        created: collection ? collection.created : moment().toISOString(),
        updated: moment().toISOString(),
        id: collection ? collection.id : null,
    });

    const resetFormStates = () => {
        setName(collection ? collection.name : '');
        setDescription(collection ? collection.description : '');
        setSelectedUsers(collection ? collection.users : []);
        setPublicBotsIncluded(collection ? collection.publicBotsIncluded : true);
        setError(null);
    };

    const updateCollection = (body) => {
        if (collection) return dispatch(botCollectionActions.updateOne({ id: collection.id, body }));

        return dispatch(botCollectionActions.createOne({ body }));
    };

    const handleSubmit = async () => {
        const body = createCollectionEntityToSend();
        const { type, payload} = await updateCollection(body);

        if (type === REJECT_REQUEST_TYPE) {
            setError(payload.response.data.errorKey);
        } else {
            setError(null);
            await dispatch(botCollectionActions.getByPage(pageParams));
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
                        defaultValue={name}
                        disabled={!isOwner}
                        onChange={handleNameChange}
                        size="small"
                        fullWidth
                    />
                    <TextField
                        label={translate('Bot.Collection.Dialog.Modify.Form.Description.Label')}
                        defaultValue={description}
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
                        isOptionEqualToValue={(optionUser, valueUser) => optionUser.login === valueUser.login}
                        loading={shareableUsers.loading}
                        getOptionLabel={(user) => user.login}
                        defaultValue={selectedUsers}
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
                        {translate(`Bot.Collection.Dialog.Modify.Form.ErrorMessage.${error}`)}
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
