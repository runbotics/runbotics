import avkLogo from '#public/images/logos/avk-logo.png';
import raiffeisenLogo from '#public/images/logos/raiffeisen-logo.png';
import menager from '#public/images/photos/menager.png';

import { Reference } from './ReferencesContent/ReferencesContent.types';


export const REFERENCES_DATA: Reference[] = [
    {
        id: 'avk',
        quote1: 'Landing.AboutTeam.AVK.Quote.1',
        authorName: 'Landing.References.AVK.Author.Name',
        authorTitle: 'Landing.References.AVK.Author.Title',
        authorImage: menager,
        logo: avkLogo,
        caseStudyLink: 'blog/post/avk-automation-of-the-verification-process-of-vat-pl-and-nip-ue-case-study',
    },
    {
        id: 'raiffeisen',
        quote1: 'Landing.AboutTeam.Raiffeisen.Quote.1',
        quote2: 'Landing.AboutTeam.Raiffeisen.Quote.2',
        logo: raiffeisenLogo,
        caseStudyLink: '/blog/post/automate-hr-and-payroll-data-flow',
    }
];
