import { FC, useState } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';

import { Content, Form } from '#src-app/views/utils/FormDialog.styles';

import { EditCredentialsCollectionProps } from './EditCredentialCollection.types';
import { InputErrorType, getInitialCredentialsCollectionData, initialFormValidationState } from './EditCredentialsCollection.utils';
import { GeneralOptions } from './GeneralOptions/GeneralOptions';
import { SharedWithUsers } from './SharedWithUsers/SharedWithUsers';
import { CreateCredentialsCollectionDto, EditCredentialsCollectionDto } from '../CredentialsCollection.types';

const EditCredentialsCollection: FC<EditCredentialsCollectionProps> = ({ collection,  onSubmit }) => {
    const { translate } = useTranslations();
    const [credentialsCollectionFormState, setCredentialsCollectionFormState] = useState<CreateCredentialsCollectionDto | EditCredentialsCollectionDto>(getInitialCredentialsCollectionData(collection));
    const [formValidationState, setFormValidationState] = useState(initialFormValidationState);
    const [inputErrorType, setInputErrorType] = useState<InputErrorType>(null);
    // const { enqueueSnackbar } = useSnackbar();
    // const dispatch = useDispatch();

    // const { activated: { nonAdmins } } = useSelector((state) => state.users);
    // const { user: currentUser } = useSelector((state) => state.auth);

    // // modify to check if access type is admin or user
    // const canEdit = true; 
   
    // const [initialCollectionData, setInitialCollectionData] = useState<CreateCredentialsCollectionDto>(prepareIncompleteCollectionEntity(currentUser, collection));
    // const [collectionData, setCollectionData] = useState<CreateCredentialsCollectionDto>(initialCollectionData);

    // const shareableUsers = useMemo(() => ({
    //     loading: nonAdmins.loading,
    //     all: nonAdmins.all.filter(user => user.email !== currentUser.email)
    // }), [nonAdmins, currentUser.email]);

    // const closeDialog = () => {
    //     onClose();
    //     setTimeout(() => clearForm(), 1000);
    // };

    // const clearForm = () => { console.log('clearForm'); };
    // const handleSubmit = () => { console.log('submit'); };
    // const handleClose = () => { console.log('close'); };

    return (
        <Content sx={{ overflowX: 'hidden', padding: 0 }}>
            <Form $gap={0}>
                <GeneralOptions
                    credentialsCollectionData={credentialsCollectionFormState}
                    // setCredentialsCollectionData={setCredentialsCollectionFormState}
                    formValidationState={formValidationState}
                    // setFormValidationState={setFormValidationState}
                    inputErrorType={inputErrorType}
                    // formState={credentialsCollectionFormState}
                    // setFormState={setCredentialsCollectionFormState}
                    // isOwner={isOwner}
                />
                {/* <SharedWithOptions
                        collectionData={credentialsCollectionFormState}
                        handleChange={handleFormPropertyChange}
                        shareableUsers={shareableUsers}
                        canEdit={canEdit}
                        isEditDialogOpen={open}
                    /> */}
                <SharedWithUsers/>
            </Form>
        </Content>
    );
};

export default EditCredentialsCollection;
