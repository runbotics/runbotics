import * as Yup from 'yup';

import useTranslations from '#src-app/hooks/useTranslations';

export const useLoginValidationSchema = () => {
    const { translate } = useTranslations();

    return Yup.object().shape({
        email: Yup.string()
            .max(255)
            .required(translate('Login.Form.Email.Required')),
        password: Yup.string()
            .max(255)
            .required(translate('Login.Form.Password.Required')),
    });
};
