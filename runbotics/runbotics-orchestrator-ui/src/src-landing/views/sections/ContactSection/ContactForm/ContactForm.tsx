import { ChangeEvent, FC, FormEvent, useState } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';
import axios from '#src-app/utils/axios';

import styles from './ContactForm.module.scss';
import { FormState, InputProps, Status } from './ContactForm.types';
import { initialFormState, validate } from './ContactForm.utils';
import FormButtonGroup from './FormButtonGroup';
import { FormCheckbox, FormInput, FormTextarea } from './FormFields';

export const REQUIRED_FIELDS: (keyof FormState)[] = [
    'name',
    'message',
    'email',
    'checkbox',
];

const ContactForm: FC = () => {
    const { translate } = useTranslations();
    const [status, setStatus] = useState<Status>();
    const [formState, setFormState] = useState<FormState>(initialFormState);

    const handleReset = () => {
        setFormState(initialFormState);
        setStatus(null);
    };

    const handleChange = ({ event }: InputProps) => {
        if (status?.type) {
            setStatus(null);
        }
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
        setStatus((prev) => ({
            ...prev,
            type: 'loading',
        }));
        await axios
            .post('/api/contact', formState)
            .then(() => {
                setStatus({
                    text: 'Landing.Contact.Form.Success',
                    type: 'success',
                });
                setFormState((prev) => ({ ...prev, status: 'sent' }));
            })
            .catch(() => {
                setStatus({
                    text: 'Landing.Contact.Form.Error',
                    type: 'error',
                });
            });
    };

    return (
        <div className={styles.root}>
            <form
                className={styles.form}
                onSubmit={handleSubmit}
                onReset={handleReset}
            >
                <div className={styles.formRow}>
                    <FormInput
                        name="name"
                        labelValue={translate('Landing.Contact.Form.Name')}
                        type="text"
                        onChange={handleInputChanged}
                        value={formState.name}
                        disabled={status?.type === 'success'}
                        placeholder={translate(
                            'Landing.Contact.Form.Name.Placeholder'
                        )}
                    />
                </div>
                <div className={styles.formRow}>
                    <FormInput
                        name="company"
                        labelValue={translate('Landing.Contact.Form.Company')}
                        type="text"
                        onChange={handleInputChanged}
                        value={formState.company}
                        disabled={status?.type === 'success'}
                        placeholder={translate(
                            'Landing.Contact.Form.Company.Placeholder'
                        )}
                    />
                </div>
                <div className={styles.formRow}>
                    <FormInput
                        name="email"
                        labelValue={translate('Landing.Contact.Form.Email')}
                        type="email"
                        onChange={handleInputChanged}
                        value={formState.email}
                        disabled={status?.type === 'success'}
                        placeholder={translate(
                            'Landing.Contact.Form.Email.Placeholder'
                        )}
                    />
                </div>
                <div className={styles.formRow}>
                    <FormTextarea
                        name="message"
                        labelValue={translate('Landing.Contact.Form.Message')}
                        type="text"
                        onChange={handleTextareaChanged}
                        value={formState.message}
                        disabled={status?.type === 'success'}
                        placeholder={translate(
                            'Landing.Contact.Form.Message.Placeholder'
                        )}
                    />
                </div>
                <div className={styles.formRow}></div>
                <div className={styles.submitRow}>
                    <FormCheckbox
                        name="checkbox"
                        labelValue={translate('Landing.Contact.Form.Checkbox')}
                        type="checkbox"
                        onChange={handleCheckboxChanged}
                        disabled={status?.type === 'success'}
                        checked={formState.checkbox}
                    />
                    <FormButtonGroup status={status} />
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
