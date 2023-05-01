import { HTMLAttributes, VFC } from 'react';

import styles from './Checkbox.module.scss';

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLInputElement>, 'value'> {
    checked: boolean;
    label: string;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    singleLine?: boolean;
}

const Checkbox: VFC<CheckboxProps> = ({
    placeholder,
    name,
    disabled,
    checked,
    label,
    singleLine,
    title,
    ...props
}) => {
    const labelStyles = singleLine ? [styles.checkboxLabel, styles.singleLine] : [styles.checkboxLabel];
    return (
        <div className={styles.checkboxWrapper}>
            <input
                className={styles.checkbox}
                placeholder={placeholder}
                disabled={disabled}
                type='checkbox'
                {...props}
                name={name}
                id={name}
                checked={checked}
            />
            <label className={labelStyles.join(' ')} title={title} htmlFor={name}>
                {label}
            </label>
        </div>
    );
};

export default Checkbox;
