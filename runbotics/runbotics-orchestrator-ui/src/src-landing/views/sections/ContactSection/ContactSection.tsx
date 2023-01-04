import { FC } from 'react';


import ContactForm from './ContactForm';
import ContactInformation from './ContactInformation';

import styles from './ContactSection.module.scss';

const ContactSection: FC = () => (
    <section className={styles.root} id="contact-section">
        <ContactInformation />
        <ContactForm />
    </section>
);

export default ContactSection;

