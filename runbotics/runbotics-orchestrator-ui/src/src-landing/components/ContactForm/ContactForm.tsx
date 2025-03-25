import { FC } from 'react';

import { useCart } from '#src-app/contexts/CartContext';

import styles from './ContactForm.module.scss';
import Typography from '#src-landing/components/Typography';
import useTranslations from '#src-app/hooks/useTranslations';
import { Input, TextField } from '@mui/material';

const ContactForm: FC = () => {
    const { contactFormValue, changeFormValue } = useCart();
    const {translate} = useTranslations();
    
    return (
        <div className={styles.root}>
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
                        placeholder={'test'}
                        fullWidth
                    />
                </div>
            </div>
            <div className={styles.formSection}>

            </div>

        </div>
    );
};

export default ContactForm;
