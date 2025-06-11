import { FC } from 'react';

import Image from 'next/image';

import RefreshImg from '#public/images/icons/refresh.svg';
import LoaderImg from '#public/images/shapes/loader.svg';

import useTranslations from '#src-app/hooks/useTranslations';

import styles from './FormButtonGroup.module.scss';
import { FormStatusType, Status } from '../ContactForm.types';
import { FormButton } from '../FormFields';

const ResetBox: FC = () => (
    <button className={styles.reset} type="reset">
        <Image src={RefreshImg} width={24} height={24} alt=" " />
    </button>
);

const AdditionalInfo: FC<{ status: Status }> = ({ status }) => {
    if (status?.type === FormStatusType.LOADING) {
        return <Image src={LoaderImg} width={50} height={50} alt=" " />;
    }
    if (status?.type === FormStatusType.SUCCESS) {
        return <ResetBox />;
    }
    return null;
};

const FormButtonGroup: FC<{ status: Status }> = ({ status }) => {
    const { translate } = useTranslations();

    const getSubmitLabel = (statusType: FormStatusType) => {
        if (statusType === FormStatusType.SUCCESS) {
            return 'Landing.Contact.Form.Submit.Sent';
        }
        if (statusType === FormStatusType.ERROR) {
            return 'Landing.Contact.Form.Submit.Error';
        }
        if (statusType === FormStatusType.LOADING) {
            return 'Landing.Contact.Form.Submit.Loading';
        }
        return 'Landing.Contact.Form.Submit.Default';
    };
    return (
        <>
            <AdditionalInfo status={status} />
            <FormButton
                labelValue={translate(getSubmitLabel(status?.type))}
                type="submit"
                disabled={Boolean(status)}
            />
        </>
    );
};

export default FormButtonGroup;
