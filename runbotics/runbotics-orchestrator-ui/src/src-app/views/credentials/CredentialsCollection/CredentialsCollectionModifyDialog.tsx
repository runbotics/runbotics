
import CustomDialog from '#src-app/components/CustomDialog';
import useTranslations from '#src-app/hooks/useTranslations';

import EditCredentialsCollection from './EditCredentialsCollection/EditCredentialsCollection';

const CredentialsCollectionModifyDialog = ({open: isOpen, onClose, collection}) => {
    const {translate} = useTranslations();

    const closeDialog = () => {
        onClose();
        setTimeout(() => clearForm(), 1000);
    };

    const handleSubmit = () => {
        // update credentials collection
    };

    const clearForm = () => {
        // clear dialog
    };

    return (
        <CustomDialog
            isOpen={isOpen}
            onClose={closeDialog}
            title={translate(`Process.Collection.Dialog.Modify.${collection ? 'Edit' : 'Create'}.Title`)}
            confirmButtonOptions={{
                label: translate('Common.Save'),
                onClick: handleSubmit,
                // isDisabled: !isOwner,
            }}
            cancelButtonOptions={{
                onClick: closeDialog,
            }}>
            <EditCredentialsCollection collection={collection} onSubmit={handleSubmit}/>
        </CustomDialog>
    );
};

    



export default CredentialsCollectionModifyDialog;
