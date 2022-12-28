import { FC } from 'react';


import ContactForm from './ContactForm/ContactForm';
import styles from './ContactSection.module.scss';

const ContactSection: FC = () => (
    <section className={styles.root}>
        <div></div>
        <ContactForm/>
    </section>
);

export default ContactSection;

