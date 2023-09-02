import { FC } from 'react';

import Checkbox from '#src-landing/components/Checkbox';

import styles from './FormFields.module.scss';
import { CheckboxProps, FormInputProps, SubmitProps } from './FormFields.types';
import { REQUIRED_FIELDS } from '../ContactForm';

export const FormInput: FC<FormInputProps<HTMLInputElement>> = ({
    placeholder,
    name,
    disabled,
    value,
    labelValue,
    ...props
}) => (
    <>
        <input
            className={styles.input}
            placeholder={placeholder}
            {...props}
            name={name}
            id={name}
            required={REQUIRED_FIELDS.includes(name)}
            disabled={disabled}
            value={value}
        />
        <label className={styles.label} htmlFor={name}>
            {labelValue}
        </label>
    </>
);

export const FormTextarea: FC<FormInputProps<HTMLTextAreaElement>> = ({
    placeholder,
    name,
    disabled,
    value,
    labelValue,
    ...props
}) => (
    <>
        <textarea
            className={styles.textarea}
            placeholder={placeholder}
            {...props}
            name={name}
            id={name}
            required={REQUIRED_FIELDS.includes(name)}
            disabled={disabled}
            value={value}
        />
        <label className={styles.label} htmlFor={name}>
            {labelValue}
        </label>
    </>
);

export const FormCheckbox: FC<CheckboxProps> = ({
    name,
    labelValue,
    ...props
}) => (
    <Checkbox
        required={REQUIRED_FIELDS.includes(name)}
        id={name}
        label={labelValue}
        {...props}
    />
);

export const FormButton: FC<SubmitProps> = ({ labelValue, ...props }) => (
    <input
        className={styles.submit}
        {...props}
        name="submit"
        id="submit"
        value={labelValue}
    />
);
