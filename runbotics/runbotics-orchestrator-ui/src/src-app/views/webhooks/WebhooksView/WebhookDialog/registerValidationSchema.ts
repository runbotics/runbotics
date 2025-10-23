import * as Yup from 'yup';



export const registerValidationSchema = Yup.object({
    name: Yup.string().trim().required('Name is required'),


    applicationUrl: Yup.string()
        .required('Application URL is required'),
    type: Yup.string().optional(),
    
    // These fields are not conditionally checked, because of Yup validation errors 
    token: Yup.string().trim().required('JWT token is required'),
    username: Yup.string().trim().required('Username is required'),
    password: Yup.string().trim().required('Password is required'),

    webhookIdPath: Yup.string().trim().required('Webhook ID path is required'),
    payloadDataPath: Yup.string()
        .trim()
        .required('Payload data path is required'),

    registrationPayload: Yup.string().nullable(),
});
