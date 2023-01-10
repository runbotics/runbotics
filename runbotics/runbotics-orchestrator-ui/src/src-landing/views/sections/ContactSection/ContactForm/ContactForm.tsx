import { ChangeEvent, FC, FormEvent, useState } from 'react';

import Image from 'next/image';

import LoaderImg from '#public/images/shapes/loader.svg';
import useTranslations from '#src-app/hooks/useTranslations';
import axios from '#src-app/utils/axios';
import Typography from '#src-landing/components/Typography';

import styles from './ContactForm.module.scss';
import { FormState, InputProps, Status } from './ContactForm.types';
import { initialFormState, validate } from './ContactForm.utils';
import {
    FormButton,
    FormCheckbox,
    FormInput,
    FormTextarea,
} from './FormFields';


export const REQUIRED_FIELDS: (keyof FormState)[] = [
    'name',
    'message',
    'email',
    'checkbox',
];

const ContactForm: FC = () => {
    const { translate } = useTranslations();
    const [status, setStatus] = useState<Status>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [formState, setFormState] = useState<FormState>(initialFormState);

    const handleChange = ({ event }: InputProps) => {
        setStatus(null);
        setFormState((prevState) => ({
            ...prevState,
            [event.target.id]: event.target.value,
        }));
    };

    const handleInputChanged = (event: ChangeEvent<HTMLInputElement>) =>
        handleChange({ type: 'input', event });

    const handleCheckboxChanged = (event: ChangeEvent<HTMLInputElement>) =>
        setFormState((prevState) => ({
            ...prevState,
            checkbox: event.target.checked,
        }));

    const handleTextareaChanged = (event: ChangeEvent<HTMLTextAreaElement>) =>
        handleChange({
            type: 'textarea',
            event,
        });

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!validate(formState, REQUIRED_FIELDS)) {
            setStatus({
                text: 'Landing.Contact.Form.Fill.Fields',
                type: 'error',
            });
            return;
        }
        setLoading(true);
        await axios
            .post('/api/contact', formState)
            .then(() => {
                setStatus({
                    text: 'Landing.Contact.Form.Success',
                    type: 'success',
                });
                setFormState(initialFormState);
            })
            .catch(() => {
                setStatus({
                    text: 'Landing.Contact.Form.Error',
                    type: 'error',
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className={styles.root}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <FormInput
                        name="name"
                        labelValue={translate('Landing.Contact.Form.Name')}
                        type="text"
                        onChange={handleInputChanged}
                        value={formState.name}
                    />
                </div>
                <div className={styles.formRow}>
                    <FormInput
                        name="company"
                        labelValue={translate('Landing.Contact.Form.Company')}
                        type="text"
                        onChange={handleInputChanged}
                        value={formState.company}
                    />
                </div>
                <div className={styles.formRow}>
                    <FormInput
                        name="email"
                        labelValue={translate('Landing.Contact.Form.Email')}
                        type="email"
                        onChange={handleInputChanged}
                        value={formState.email}
                    />
                </div>
                <div className={styles.formRow}>
                    <FormTextarea
                        name="message"
                        labelValue={translate('Landing.Contact.Form.Message')}
                        type="text"
                        onChange={handleTextareaChanged}
                        value={formState.message}
                    />
                </div>
                <div className={styles.formRow}>
                    {status ? (
                        <Typography
                            variant="body3"
                            color={status.type}
                            font="Roboto"
                        >
                            {translate(status.text)}
                        </Typography>
                    ) : null}
                </div>
                <div className={styles.submitRow}>
                    <FormCheckbox
                        name="checkbox"
                        labelValue={translate('Landing.Contact.Form.Checkbox')}
                        type="checkbox"
                        onChange={handleCheckboxChanged}
                        checked={formState.checkbox}
                    />
                    {loading ? (
                        <Image src={LoaderImg} width={50} height={50} alt=" " />
                    ) : (
                        <div></div>
                    )}
                    <FormButton labelValue="Submit" type="submit" />
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
