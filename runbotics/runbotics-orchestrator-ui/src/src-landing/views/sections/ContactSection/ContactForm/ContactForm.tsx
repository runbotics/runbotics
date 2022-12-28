import { ChangeEvent, FC, FormEvent, useState } from 'react';

import axios from '#src-app/utils/axios';
import Typography from '#src-landing/components/Typography';

import styles from './ContactForm.module.scss';
import { FormState, InputProps } from './ContactForm.types';
import { validate } from './ContactForm.utils';
import { FormCheckbox, FormInput, FormTextarea, FormButton } from './FormInput/FormInput';

export const REQUIRED_FIELDS: (keyof FormState)[] = [
    'name',
    'message',
    'email',
    'checkbox',
];

const ContactForm: FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [formState, setFormState] = useState<FormState>({
        name: '',
        company: '',
        email: '',
        checkbox: false,
        message: '',
    });

    const handleChange = ({ event }: InputProps) => {
        setError(null);
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
            setError('Please fill all required fields');
        }
        axios
            .post('/api/contact', formState)
            .then((res) => {
            })
            .catch((err) => {
                setError(err?.message);
            });
    };

    return (
        <div className={styles.root}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                    <FormInput
                        name="name"
                        labelValue="Name"
                        type="text"
                        onChange={handleInputChanged}
                    />
                </div>
                <div className={styles.formRow}>
                    <FormInput
                        name="company"
                        labelValue="Company"
                        type="text"
                        onChange={handleInputChanged}
                    />
                </div>
                <div className={styles.formRow}>
                    <FormInput
                        name="email"
                        labelValue="Email"
                        type="email"
                        onChange={handleInputChanged}
                    />
                </div>
                <div className={styles.formRow}>
                    <FormTextarea
                        labelValue="Message"
                        name="message"
                        type="text"
                        onChange={handleTextareaChanged}
                    />
                </div>
                <div className={styles.formRow}>
                    {(
                        <Typography variant="body3" color="error" font="Roboto">
                            {error}
                        </Typography>
                    ) ?? null}
                </div>
                <div className={styles.formRow}>
                    <FormCheckbox
                        labelValue="Contrary to popular belief, Lorem Ipsum is not simplyrandom text.
                            It has roots in a piece of classicaln contrary to popular belief, Lorem Ipsum"
                        name="checkbox"
                        type="checkbox"
                        onChange={handleCheckboxChanged}
                    />
                    <FormButton labelValue="Submit" type="submit" />
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
