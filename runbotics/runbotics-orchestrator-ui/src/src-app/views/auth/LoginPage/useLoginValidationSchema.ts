import * as Yup from 'yup';


const digitMessage = 'Password must contain at least 1 digit';
const lowerCaseMessage = 'Password must contain at least 1 lowercase letter';
const upperCaseMessage = 'Password must contain at least 1 uppercase letter';
const specialCharacterMessage = 'Password must contain at least 1 special character';
const passwordRequiredMessage = 'Password is required';

const emailValidMessage = 'Must be valid email';
const emailRequiredMessage = 'Email is required';

const useLoginValidationSchema = () => Yup.object().shape({
    email: Yup.string()
        .email(emailValidMessage)
        .max(255)
        .required(emailRequiredMessage),
    password: Yup.string()
        .min(14)
        .matches(/[0-9]/, digitMessage)
        .matches(/[a-z]/, lowerCaseMessage)
        .matches(/[A-Z]/, upperCaseMessage)
        .matches(/[\!\@\#\$\%\^\&\*]/, specialCharacterMessage)
        .max(255)
        .required(passwordRequiredMessage),
});

export type UseLoginValidationSchema = ReturnType<typeof useLoginValidationSchema>

export default useLoginValidationSchema;
