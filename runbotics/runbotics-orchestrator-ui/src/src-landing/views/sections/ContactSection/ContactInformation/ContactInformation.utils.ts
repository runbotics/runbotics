import PhoneIcon from '#public/images/shapes/call_orange.svg';
import EmailIcon from '#public/images/shapes/email_orange.svg';
import PlaceIcon from '#public/images/shapes/place_orange.svg';

import { ContactInfo } from './ContactInformation.types';


export const CONTACT_INFO: ContactInfo[] = [
    { icon: PhoneIcon, text: 'Landing.Contact.Info.Phone.Text', iconAlt: 'Landing.Contact.Info.Phone.IconAlt' },
    { icon: EmailIcon, text: 'Landing.Contact.Info.Email.Text', iconAlt: 'Landing.Contact.Info.Address.IconAlt' },
    { icon: PlaceIcon, text: 'Landing.Contact.Info.Address.Text', iconAlt: 'Landing.Contact.Info.Address.IconAlt' },
];
