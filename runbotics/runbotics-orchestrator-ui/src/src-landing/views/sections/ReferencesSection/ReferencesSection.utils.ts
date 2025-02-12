import avkLogo from '#public/images/logos/avk-logo.png';
import raiffeisenLogo from '#public/images/logos/raiffeisen-logo.png';
import manager from '#public/images/photos/manager.png';

import { Reference } from './ReferencesContent/ReferencesContent.types';


export const REFERENCES_DATA: Reference[] = [
    {
        id: 'avk',
        quotes: ['Landing.AboutTeam.AVK.Quote.1', 'Landing.AboutTeam.AVK.Quote.2'],
        authorImage: manager,
        logo: avkLogo,
        caseStudyLink: 'blog/post/avk-automation-of-the-verification-process-of-vat-pl-and-nip-ue-case-study',
    },
    {
        id: 'raiffeisen',
        quotes: ['Landing.AboutTeam.Raiffeisen.Quote.1', 'Landing.AboutTeam.Raiffeisen.Quote.2'],
        logo: raiffeisenLogo,
        caseStudyLink: '/blog/post/automate-hr-and-payroll-data-flow',
    }
];

export const calculateTotalPages = (totalItems: number, itemsPerPage: number) => {
    return Math.ceil(totalItems / itemsPerPage);
};
