import Image from 'next/image';

import RefreshImg from '#public/images/icons/refresh.svg';
import LoaderImg from '#public/images/shapes/loader.svg';

import { FormButton } from '../FormFields';
import styles from './FormButtonGroup.module.scss';

const ResetBox = () => (
    <button className={styles.reset} type="reset">
        <Image src={RefreshImg} width={24} height={24} alt=" " />
    </button>
);

const AdditionalInfo = ({ status }) => {
    if (status?.type === 'loading') {
        return <Image src={LoaderImg} width={50} height={50} alt=" " />;
    }
    if (status?.type === 'success') {
        return <ResetBox />;
    }
    return <div></div>;
};

const FormButtonGroup = ({ status }) => (
    <>
        <AdditionalInfo status={status} />
        <FormButton
            labelValue="Submit"
            type="submit"
            disabled={Boolean(status)}
        />
    </>
);

export default FormButtonGroup;
