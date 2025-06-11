import { HTMLAttributes, VFC } from 'react';

import styles from './Checkbox.module.scss';

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLInputElement>, 'value'> {
    checked: boolean;
    label: string | JSX.Element;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    singleLine?: boolean;
    size?: 'large' | 'regular';
}

const Checkbox: VFC<CheckboxProps> = ({
    className,
    placeholder,
    name,
    disabled,
    checked,
    label,
    singleLine,
    title,
    size = 'large',
    ...props
}) => {
    const labelStyles = singleLine
        ? [styles.checkboxLabel, styles.singleLine]
        : [styles.checkboxLabel];

    return (
        <div className={[styles.checkboxWrapper, className].join(' ')}>
            <input
                className={styles.checkbox}
                placeholder={placeholder}
                disabled={disabled}
                type='checkbox'
                {...props}
                name={name}
                id={name}
                checked={checked}
                data-size={size}
            />
            <label className={labelStyles.join(' ')} title={title} htmlFor={name}>
                {label}
            </label>
        </div>
    );
};

export default Checkbox;
