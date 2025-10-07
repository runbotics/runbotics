import * as Yup from 'yup';

import useTranslations from '#src-app/hooks/useTranslations';

const useLoginValidationSchema = () => {
    const { translate } = useTranslations();

    return Yup.object().shape({
        email: Yup.string()
            .email(translate('Register.Form.Validation.Email.Valid'))
            .max(255, translate('Register.Form.Validation.Email.MaxLength', { max: 255 }))
            .required(translate('Login.Form.Email.Required')),
        password: Yup.string()
            .min(14, translate('Register.Form.Validation.Password.MinLength', { min: 14 }))
            .matches(/[0-9]/, translate('Register.Form.Validation.Password.Digit'))
            .matches(/[a-z]/, translate('Register.Form.Validation.Password.LowerCase'))
            .matches(/[A-Z]/, translate('Register.Form.Validation.Password.UpperCase'))
            .matches(/[\!\@\#\$\%\^\&\*]/, translate('Register.Form.Validation.Password.SpecialCharacter'))
            .max(255, translate('Register.Form.Validation.Password.MaxLength', { max: 255 }))
            .required(translate('Login.Form.Password.Required')),
    });
};

export type UseLoginValidationSchema = ReturnType<typeof useLoginValidationSchema>

export default useLoginValidationSchema;
