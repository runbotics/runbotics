import { FC } from 'react';

import { CONTACT_US_SECTION_ID } from '#src-landing/utils/utils';

import ContactForm from './ContactForm';
import ContactInformation from './ContactInformation';

import styles from './ContactSection.module.scss';
import { CONTACT_TITLE_ID } from './ContactSection.utils';

const ContactSection: FC = () => (
    <section
        className={styles.root}
        id={CONTACT_US_SECTION_ID}
        aria-labelledby={CONTACT_TITLE_ID}
    >
        <ContactInformation />
        <ContactForm />
    </section>
);

export default ContactSection;
