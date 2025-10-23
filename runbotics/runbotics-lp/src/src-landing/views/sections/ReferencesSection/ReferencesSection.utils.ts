import avkLogo from '#public/images/logos/avk-logo.png';
import raiffeisenLogo from '#public/images/logos/raiffeisen-logo.png';
import lideaLogo from '#public/images/logos/logo_lidea.png';

import { Reference } from './ReferencesContent/ReferencesContent.types';


export const REFERENCES_DATA: Reference[] = [
    {
        id: 'avk',
        quotes: ['Landing.References.AVK.Quote.1', 'Landing.References.AVK.Quote.2'],
        logo: avkLogo,
        caseStudyLink: 'blog/post/avk-automation-of-the-verification-process-of-vat-pl-and-nip-ue-case-study',
    },
    {
        id: 'raiffeisen',
        quotes: ['Landing.References.Raiffeisen.Quote.1', 'Landing.References.Raiffeisen.Quote.2'],
        logo: raiffeisenLogo,
        caseStudyLink: '/blog/post/automate-hr-and-payroll-data-flow',
    },
    {
        id: 'lidea',
        quotes: ['Landing.References.Lidea.Quote.1', 'Landing.References.Lidea.Quote.2'],
        logo: lideaLogo,
        caseStudyLink: '/blog/post/automation-of-the-process-of-acquiring-potential-customers',
    }
];

export const calculateTotalPages = (totalItems: number, itemsPerPage: number) => Math.ceil(totalItems / itemsPerPage);

export const calculateTotalDots = (totalItems: number, logosPerView: number) => {
    if (logosPerView < 1) return totalItems;
    return Math.max(1, calculateTotalPages(totalItems, logosPerView));
}; 
