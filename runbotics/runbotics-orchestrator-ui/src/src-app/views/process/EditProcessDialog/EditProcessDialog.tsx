import React, { FC, useState, useEffect } from 'react';

import { FeatureKey, IProcess, Tag } from 'runbotics-common';

import CustomDialog from '#src-app/components/CustomDialog';
import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useProcessCollection from '#src-app/hooks/useProcessCollection';
import useTranslations from '#src-app/hooks/useTranslations';
import { useSelector } from '#src-app/store';

import AccessOptions from './AccessOptions';
import { EditProcessDialogProps, FormValidationState } from './EditProcessDialog.types';
import { initialFormValidationState, MAX_NUMBER_OF_TAGS } from './EditProcessDialog.utils';
import { GeneralOptions } from './GeneralOptions/GeneralOptions';
import TagsInput from './TagsInput';
import { Content, Form } from '../../utils/FormDialog.styles';


const EditProcessDialog: FC<EditProcessDialogProps> = ({
    process, onAdd, onClose, open,
}) => {
    const { currentCollectionId } = useProcessCollection();

    const [formValidationState, setFormValidationState] = useState<FormValidationState>(initialFormValidationState);
    const [processFormState, setProcessFormState] = useState<IProcess>({ ...process, processCollection: { id: currentCollectionId, ...process.processCollection } });
    const [autocompleteTagList, setAutocompleteTagList] = useState<Tag[]>([]);
    const [selectedTagsNames, setSelectedTagsNames] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');

    const { translate } = useTranslations();
    const { user: currentUser } = useSelector((state) => state.auth);

    const isOwner = !process || currentUser.login === process?.createdBy.login || hasFeatureKeyAccess(currentUser, [FeatureKey.PROCESS_COLLECTION_ALL_ACCESS]);

    const checkFormFieldsValidation = () => formValidationState.name;

    const handleSubmit = () => {
        onAdd(processFormState);
    };

    useEffect(() => {
        setProcessFormState(process);
        setSelectedTagsNames(process.tags.map((tag) => tag.name));
    }, [process]);

    return (
        <CustomDialog
            isOpen={open}
            onClose={onClose}
            title={translate('Process.Edit.Title')}
            confirmButtonOptions={{
                label: translate('Common.Save'),
                onClick: handleSubmit,
                isDisabled: !checkFormFieldsValidation(),
            }}
            cancelButtonOptions={{
                label: translate('Common.Cancel'),
                onClick: onClose,
            }}
        >
            <Content sx={{ overflowX: 'hidden' }}>
                <Form>
                    <GeneralOptions
                        processData={processFormState}
                        setProcessData={setProcessFormState}
                        formValidationState={formValidationState}
                        setFormValidationState={setFormValidationState}
                        isEditDialogOpen={open}
                        isOwner={isOwner}
                    />
                    <TagsInput
                        selected={selectedTagsNames}
                        setSelected={setSelectedTagsNames}
                        formState={processFormState}
                        setFormState={setProcessFormState}
                        search={search}
                        setSearch={setSearch}
                        autocompleteList={autocompleteTagList}
                        setAutocompleteList={setAutocompleteTagList}
                        maxAmount={MAX_NUMBER_OF_TAGS}
                        isOwner={isOwner}
                    />
                    <AccessOptions
                        processData={processFormState}
                        setProcessData={setProcessFormState}
                        isEditDialogOpen={open}
                        isOwner={isOwner}
                    />
                </Form>
            </Content>
        </CustomDialog>
    );
};

export default EditProcessDialog;
