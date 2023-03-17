import { FC } from 'react';

import { REQUIRED_FIELDS } from '../ContactForm';
import styles from './FormFields.module.scss';
import { CheckboxProps, FormInputProps, SubmitProps } from './FormFields.types';

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
    placeholder,
    name,
    disabled,
    checked,
    labelValue,
    ...props
}) => (
    <div className={styles.checkboxWrapper}>
        <input
            className={styles.checkbox}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
            name={name}
            id={name}
            required={REQUIRED_FIELDS.includes(name)}
            checked={checked}
        />
        <label className={styles.checkboxLabel} htmlFor={name}>
            {labelValue}
        </label>
    </div>
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
