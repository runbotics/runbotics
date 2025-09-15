import * as Yup from 'yup';

import useTranslations from '#src-app/hooks/useTranslations';

const useRegisterValidationSchema = () => {
    const { translate } = useTranslations();

    return Yup.object().shape({
        email: Yup.string()
            .email(translate('Register.Form.Validation.Email.Valid'))
            .max(255)
            .required(translate('Register.Form.Validation.Email.Required')),
        password: Yup.string()
            .min(14)
            .matches(/[0-9]/, translate('Register.Form.Validation.Password.Digit'))
            .matches(/[a-z]/, translate('Register.Form.Validation.Password.LowerCase'))
            .matches(/[A-Z]/, translate('Register.Form.Validation.Password.UpperCase'))
            .matches(/[\!\@\#\$\%\^\&\*]/, translate('Register.Form.Validation.Password.SpecialCharacter'))
            .max(255)
            .required(translate('Register.Form.Validation.Password.Required')),
        passwordConfirmation: Yup.string()
            .oneOf(
                [Yup.ref('password'), null],
                translate('Register.Form.Validation.Password.Match')
            )
            .required(
                translate(
                    'Register.Form.Validation.PasswordConfirmation.Required'
                )
            ),
    });
};

export default useRegisterValidationSchema;
