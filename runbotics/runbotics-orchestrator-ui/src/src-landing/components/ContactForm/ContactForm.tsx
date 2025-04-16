import { FC, useState } from 'react';

import { TextField } from '@mui/material';

import { useCart } from '#src-app/contexts/CartContext';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './ContactForm.module.scss';

interface FormError {
    fullName?: string;
    email?: string;
    phone?: string;
}

const ContactForm: FC = () => {
    const { contactFormValue, changeFormValue} = useCart();
    const { translate } = useTranslations();
    const [errors, setErrors] = useState<FormError>({});

    const validate = () => {
        const newErrors: FormError = {};

        if (!contactFormValue.name.trim()) {
            newErrors.fullName = translate('Marketplace.Cart.FormError.RequiredField');
        }

        if (!contactFormValue.email.trim()) {
            newErrors.email = translate('Marketplace.Cart.FormError.RequiredField');
        } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(contactFormValue.email)) {
            newErrors.email = translate('Marketplace.Cart.FormError.Email');
        }

        if (contactFormValue.phone && !/^\d{3}\s?\d{3}\s?\d{3}$/.test(contactFormValue.phone)) {
            newErrors.phone = translate('Marketplace.Cart.FormError.Phone');
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className={styles.root}>
            <div className={styles.formContainer}>
                <div className={styles.formSection}>
                    <Typography variant={'h4'}>
                        {translate('Marketplace.Cart.YourContactInfo')}:
                    </Typography>
                    <div className={styles.inputSection}>
                        <Typography variant={'h6'}>
                            {translate('Marketplace.Cart.NameAndSurname')}:
                        </Typography>
                        <TextField
                            className={styles.formInput}
                            variant={'outlined'}
                            placeholder={'Example: Jan Kowalski'}
                            value={contactFormValue.name}
                            onChange={(e) => changeFormValue('name', e.target.value)}
                            fullWidth
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                            onBlur={() => validate()}
                        />
                    </div>
                    <div className={styles.inputSection}>
                        <Typography variant={'h6'}>
                            {translate('Marketplace.Cart.EmailAddress')}:
                        </Typography>
                        <TextField
                            className={styles.formInput}
                            variant={'outlined'}
                            placeholder={'E-mail'}
                            value={contactFormValue.email}
                            onChange={(e) => changeFormValue('email', e.target.value)}
                            type={'email'}
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email}
                            onBlur={() => validate()}
                        />
                    </div>
                    <div className={styles.inputSection}>
                        <Typography variant={'h6'}>
                            {translate('Marketplace.Cart.PhoneNumber')}:
                        </Typography>
                        <TextField
                            className={styles.formInput}
                            variant={'outlined'}
                            placeholder={'phone'}
                            value={contactFormValue.phone}
                            onChange={(e) => changeFormValue('phone', e.target.value)}
                            type={'tel'}
                            fullWidth
                            error={!!errors.phone}
                            helperText={errors.phone}
                            onBlur={() => validate()}
                        />
                    </div>
                </div>
                <div className={styles.formSection}>
                    <Typography variant={'h4'}>
                        {translate('Marketplace.Cart.AdditionalInfo')}:
                    </Typography>
                    <div className={styles.inputSection}>
                        <Typography variant={'h6'}>
                            {translate('Marketplace.Cart.AddMessageWithInfo')}:
                        </Typography>
                        <TextField
                            className={styles.formInput}
                            variant={'outlined'}
                            placeholder={'info...'}
                            value={contactFormValue.additionalInfo}
                            multiline
                            rows={6}
                            onChange={(e) => changeFormValue('additionalInfo', e.target.value)}
                            fullWidth
                            sx={{
                                minWidth: '100%',
                                width: '100%',
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.noticeWrapper}>
                <Typography variant={'h5'} color={'primary'}>
                    {translate('Marketplace.Offer.Notice')}:
                </Typography>
                <Typography color={'primary'}>
                    {translate('Marketplace.Offer.NoticeText')}
                </Typography>
            </div>
        </div>
    );
};

export default ContactForm;
