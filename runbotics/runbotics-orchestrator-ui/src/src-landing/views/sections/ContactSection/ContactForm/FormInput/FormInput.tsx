import { FC } from 'react';

import { REQUIRED_FIELDS } from '../ContactForm';
import styles from './FormInput.module.scss';
import { SubmitProps, FormInputProps } from './FormInput.types';


export const FormInput: FC<FormInputProps<HTMLInputElement>> = (props) => (
    <>
        {/* empty placeholder to take advantage of :placeholder-shown */}
        <input
            className={styles.input}
            placeholder=" "
            {...props}
            name={props.name}
            id={props.name}
            required={REQUIRED_FIELDS.includes(props.name)}
        />
        <label className={styles.label} htmlFor={props.name}>
            {props.labelValue}
        </label>
    </>
);

export const FormTextarea: FC<FormInputProps<HTMLTextAreaElement>> = (props) => (
    <>
        <textarea
            className={styles.textarea}
            placeholder=" "
            {...props}
            name={props.name}
            id={props.name}
            required={REQUIRED_FIELDS.includes(props.name)}
        />
        <label className={styles.label} htmlFor={props.name}>
            {props.labelValue}
        </label>
    </>
);

export const FormCheckbox: FC<FormInputProps<HTMLInputElement>> = (props) => (
    <div className={styles.checkboxWrapper}>
        <input
            className={styles.checkbox}
            placeholder=" "
            {...props}
            name={props.name}
            id={props.name}
            required={REQUIRED_FIELDS.includes(props.name)}
        />
        <label className={styles.checkboxLabel} htmlFor={props.name}>
            {props.labelValue}
        </label>
    </div>
);


export const FormButton: FC<SubmitProps> = (props) => (
    <input
        className={styles.submit}
        placeholder=" "
        {...props}
        name="submit"
        id="submit"
        value={props.labelValue}
    />
);
