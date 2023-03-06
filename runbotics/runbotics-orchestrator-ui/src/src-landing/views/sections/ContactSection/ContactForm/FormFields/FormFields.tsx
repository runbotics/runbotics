import { FC } from 'react';

import { REQUIRED_FIELDS } from '../ContactForm';
import styles from './FormFields.module.scss';
import { CheckboxProps, FormInputProps, SubmitProps } from './FormFields.types';

export const FormInput: FC<FormInputProps<HTMLInputElement>> = (props) => (
    <>
        <input
            className={styles.input}
            placeholder={props.placeholder}
            {...props}
            name={props.name}
            id={props.name}
            required={REQUIRED_FIELDS.includes(props.name)}
            disabled={props.disabled}
            value={props.value}
        />
        <label className={styles.label} htmlFor={props.name}>
            {props.labelValue}
        </label>
    </>
);

export const FormTextarea: FC<FormInputProps<HTMLTextAreaElement>> = (
    props
) => (
    <>
        <textarea
            className={styles.textarea}
            placeholder={props.placeholder}
            {...props}
            name={props.name}
            id={props.name}
            required={REQUIRED_FIELDS.includes(props.name)}
            disabled={props.disabled}
            value={props.value}
        />
        <label className={styles.label} htmlFor={props.name}>
            {props.labelValue}
        </label>
    </>
);

export const FormCheckbox: FC<CheckboxProps> = (props) => (
    <div className={styles.checkboxWrapper}>
        <input
            className={styles.checkbox}
            placeholder={props.placeholder}
            disabled={props.disabled}
            {...props}
            name={props.name}
            id={props.name}
            required={REQUIRED_FIELDS.includes(props.name)}
            checked={props.checked}
        />
        <label className={styles.checkboxLabel} htmlFor={props.name}>
            {props.labelValue}
        </label>
    </div>
);

export const FormButton: FC<SubmitProps> = (props) => (
    <input
        className={styles.submit}
        {...props}
        name="submit"
        id="submit"
        value={props.labelValue}
    />
);
