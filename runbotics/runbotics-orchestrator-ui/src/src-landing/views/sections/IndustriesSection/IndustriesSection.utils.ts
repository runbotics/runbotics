import businessImage from '#public/images/photos/business-industry.jpg';
import itImage from '#public/images/photos/it-industry.png';
import serviceImage from '#public/images/photos/service-industry.png';
import transportImage from '#public/images/photos/transport-industry.png';

import { IndustrySlide } from '#src-landing/views/sections/IndustriesSection/IndustriesSection.types';

export const INDUSTRIES_TITLE_ID = 'industries-title';

export const SLIDES: IndustrySlide[] = [
    {
        titleKey: 'Landing.Industries.Slides.IT.Title',
        imgAltKey: 'Landing.Industries.Slides.IT.ImgAlt',
        img: itImage,
        links: [
            { nameKey: 'Landing.Industries.Slides.IT.Link.1.Name', href: 'Landing.Industries.Slides.IT.Link.1.Href' },
            { nameKey: 'Landing.Industries.Slides.IT.Link.2.Name', href: 'Landing.Industries.Slides.IT.Link.2.Href' },
            { nameKey: 'Landing.Industries.Slides.IT.Link.3.Name', href: 'Landing.Industries.Slides.IT.Link.3.Href' },
            { nameKey: 'Landing.Industries.Slides.IT.Link.4.Name', href: 'Landing.Industries.Slides.IT.Link.4.Href' },
            { nameKey: 'Landing.Industries.Slides.IT.Link.5.Name', href: 'Landing.Industries.Slides.IT.Link.5.Href' },
        ]
    },
    {
        titleKey: 'Landing.Industries.Slides.Transport.Title',
        imgAltKey: 'Landing.Industries.Slides.Transport.ImgAlt',
        img: transportImage,
        links: [
            {
                nameKey: 'Landing.Industries.Slides.Transport.Link.1.Name',
                href: 'Landing.Industries.Slides.Transport.Link.1.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Transport.Link.2.Name',
                href: 'Landing.Industries.Slides.Transport.Link.2.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Transport.Link.3.Name',
                href: 'Landing.Industries.Slides.Transport.Link.3.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Transport.Link.4.Name',
                href: 'Landing.Industries.Slides.Transport.Link.4.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Transport.Link.5.Name',
                href: 'Landing.Industries.Slides.Transport.Link.5.Href'
            },
        ]
    },
    {
        titleKey: 'Landing.Industries.Slides.Service.Title',
        imgAltKey: 'Landing.Industries.Slides.Service.ImgAlt',
        img: serviceImage,
        links: [
            {
                nameKey: 'Landing.Industries.Slides.Service.Link.1.Name',
                href: 'Landing.Industries.Slides.Service.Link.1.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Service.Link.2.Name',
                href: 'Landing.Industries.Slides.Service.Link.2.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Service.Link.3.Name',
                href: 'Landing.Industries.Slides.Service.Link.3.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Service.Link.4.Name',
                href: 'Landing.Industries.Slides.Service.Link.4.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Service.Link.5.Name',
                href: 'Landing.Industries.Slides.Service.Link.5.Href'
            },


        ]
    },
    {
        titleKey: 'Landing.Industries.Slides.Business.Title',
        imgAltKey: 'Landing.Industries.Slides.Business.ImgAlt',
        img: businessImage,
        links: [
            {
                nameKey: 'Landing.Industries.Slides.Business.Link.1.Name',
                href: 'Landing.Industries.Slides.Business.Link.1.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Business.Link.2.Name',
                href: 'Landing.Industries.Slides.Business.Link.2.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Business.Link.3.Name',
                href: 'Landing.Industries.Slides.Business.Link.3.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Business.Link.4.Name',
                href: 'Landing.Industries.Slides.Business.Link.4.Href'
            },
            {
                nameKey: 'Landing.Industries.Slides.Business.Link.5.Name',
                href: 'Landing.Industries.Slides.Business.Link.5.Href'
            },
        ]
    },
];
