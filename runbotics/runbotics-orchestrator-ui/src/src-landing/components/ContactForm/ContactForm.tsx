import { FC } from 'react';

import { TextField } from '@mui/material';

import { useCart } from '#src-app/contexts/CartContext';

import useTranslations from '#src-app/hooks/useTranslations';
import Typography from '#src-landing/components/Typography';

import styles from './ContactForm.module.scss';

const ContactForm: FC = () => {
    const { contactFormValue, changeFormValue } = useCart();
    const { translate } = useTranslations();

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
                        />
                    </div>
                    <div className={styles.inputSection}>
                        <Typography variant={'h6'}>
                            {translate('Marketplace.Cart.EmailAddress')}:
                        </Typography>
                        <TextField
                            className={styles.formInput}
                            variant={'outlined'}
                            placeholder={'test'}
                            value={contactFormValue.email}
                            onChange={(e) => changeFormValue('email', e.target.value)}
                            fullWidth
                        />
                    </div>
                    <div className={styles.inputSection}>
                        <Typography variant={'h6'}>
                            {translate('Marketplace.Cart.PhoneNumber')}:
                        </Typography>
                        <TextField
                            className={styles.formInput}
                            variant={'outlined'}
                            placeholder={'test'}
                            value={contactFormValue.phone}
                            onChange={(e) => changeFormValue('phone', e.target.value)}
                            type={'tel'}
                            fullWidth
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
                            placeholder={'test'}
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
