import { ChangeEvent, FC, FormEvent, useState } from 'react';

import useTranslations from '#src-app/hooks/useTranslations';
import { axiosInstance as axios } from '#src-app/utils/axios';
import Typography from '#src-landing/components/Typography';

import styles from './ContactForm.module.scss';
import {
    FormState,
    FormStatusType,
    InputProps,
    Status,
} from './ContactForm.types';
import { initialFormState, validate } from './ContactForm.utils';
import FormButtonGroup from './FormButtonGroup';
import { FormCheckbox, FormInput, FormTextarea } from './FormFields';

export const REQUIRED_FIELDS: (keyof FormState)[] = [
    'name',
    'message',
    'email',
    'checkbox',
];
// eslint-disable-next-line max-lines-per-function
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
                type: FormStatusType.ERROR,
            });
            return;
        }
        setStatus((prev) => ({
            ...prev,
            type: FormStatusType.LOADING,
        }));
        await axios
            .post('/api/contact', formState)
            .then(() => {
                setStatus({
                    text: 'Landing.Contact.Form.Success',
                    type: FormStatusType.SUCCESS,
                });
                setFormState((prev) => ({
                    ...prev,
                    status: FormStatusType.SUCCESS,
                }));
            })
            .catch(() => {
                setStatus({
                    text: 'Landing.Contact.Form.Error',
                    type: FormStatusType.ERROR,
                });
            });
    };

    const processingDataText = [...Array(7).keys()].map((el) => (
        <li key={el}>
            <Typography>
                {/* @ts-ignore */}
                {translate(`Landing.Contact.Form.ProcessingData.Point${el + 1}`)}
            </Typography>
        </li>
    ));

    const isFormSubmitted = status?.type === FormStatusType.SUCCESS;

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
                        disabled={isFormSubmitted}
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
                        disabled={isFormSubmitted}
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
                        disabled={isFormSubmitted}
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
                        disabled={isFormSubmitted}
                        placeholder={translate(
                            'Landing.Contact.Form.Message.Placeholder'
                        )}
                    />
                </div>
                <div className={styles.submitRow}>
                    <FormCheckbox
                        name="checkbox"
                        labelValue={translate('Landing.Contact.Form.Checkbox')}
                        type="checkbox"
                        onChange={handleCheckboxChanged}
                        disabled={isFormSubmitted}
                        checked={formState.checkbox}
                    />
                </div>
                <ol className={formState.checkbox ? styles.processingData : styles.hidden}>{processingDataText}</ol>
                <div className={styles.formRow}>
                    <FormButtonGroup status={status} />
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
