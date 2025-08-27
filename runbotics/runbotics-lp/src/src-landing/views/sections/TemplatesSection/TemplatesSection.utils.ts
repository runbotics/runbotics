import { integrationNames } from '#public/images/logos';
import templatesTranslations from '#src-landing/translations/en/landing/templates.json';

import { TemplatesProps } from './TemplatesSection.types';

export const checkTranslationKey = (key: string): key is keyof typeof templatesTranslations => templatesTranslations.hasOwnProperty(key);

export const TEMPLATES_TITLE_ID = 'templates-title';

export enum categoriesNames {
    CATEGORY_ALL = 'All',
    CATEGORY_ONE= 'One',
    CATEGORY_TWO = 'Two',
    CATEGORY_THREE = 'Three',
    CATEGORY_FOUR = 'Four',
    CATEGORY_FIVE = 'Five',
}

export const categoriesTranslationKeys: Array<categoriesNames> = [
    categoriesNames.CATEGORY_ALL,
    categoriesNames.CATEGORY_ONE,
    categoriesNames.CATEGORY_TWO,
    categoriesNames.CATEGORY_THREE,
    categoriesNames.CATEGORY_FOUR,
    categoriesNames.CATEGORY_FIVE,
];

export const templates: Array<TemplatesProps> = [
    {
        title: 'ONE title title1 ilomet',
        description: 'example descrippor incididunptate veli.',
        categories: [categoriesNames.CATEGORY_FIVE, categoriesNames.CATEGORY_THREE],
        integrations: [integrationNames.ASANA, integrationNames.JIRA],
    },
    {
        title: 'TWO title title2 ilomet',
        description: 'example yolo incididunt ut labore et doloreation ullamco laboris nisi utmmodo consequat.ut labore et doloreation ullamco laboris nisi utmmodo c Ddo consequat. Duis aute irure dolor in reprehenderit in voluptate veli.',
        categories: [categoriesNames.CATEGORY_TWO],
        integrations: [integrationNames.SAP, integrationNames.BEEOFFICE],
    },
    {
        title: 'THREE title title3 ilomet',
        description: 'example descrippor incididunt ut labore et hi ullamco laboris nisi utmmodo consequat.ut labore et doloreation ullamco laboris nisi utmmodo c Duis aute irure dolor in reprehenderit in voluptate veli.',
        categories: [categoriesNames.CATEGORY_FIVE, categoriesNames.CATEGORY_THREE],
        integrations: [integrationNames.SHAREPOINT, integrationNames.GOOGLE_SHEETS],
    },
    {
        title: 'FOUR title title4 kaboom',
        description: 'example descrippor incididunt ut labore et dolout labore et doloreation ullamco laboris nisi utmmodo cut labore et dullamco laboris nisi utmmodo creation ullamco laboris nisi utmmodo consequat. Duis aute irure dolor in reprehenderit in voluptate veli.',
        categories: [categoriesNames.CATEGORY_FIVE, categoriesNames.CATEGORY_THREE],
        integrations: [integrationNames.EXCEL, integrationNames.POWERPOINT],
    },
    {
        title: 'FIVE title title5 ilomet',
        description: 'example descrippor incididunt uonsequat. Duis hello irure dolor in reprehenderit in voluptate veli.',
        categories: [categoriesNames.CATEGORY_ONE],
        integrations: [integrationNames.ASANA],
    },
    {
        title: 'SIX title boom ilomet',
        description: 'example descrippor incididunt ut labore et doloreation ullamco laboris nisi utmmodo consequat. Duis aute irure dolor in reprehenderit in voluptate veli.',
        categories: [categoriesNames.CATEGORY_FIVE, categoriesNames.CATEGORY_ONE, categoriesNames.CATEGORY_FOUR, categoriesNames.CATEGORY_THREE],
        integrations: [integrationNames.ASANA, integrationNames.JIRA],
    },
    {
        title: 'SEVEN title title7 ilomet',
        description: 'example dtate veli.',
        categories: [],
        integrations: [integrationNames.ASANA, integrationNames.JIRA],
    },
    {
        title: 'EIGHT boom8 ilomet',
        description: 'example descrippor incididunt ut labore et doloreation ullamco laboris nisi utmmodo consequat. Duis aute irure dolor in reprehenderit in voluptate veli.',
        categories: [categoriesNames.CATEGORY_ONE, categoriesNames.CATEGORY_THREE],
        integrations: [integrationNames.ASANA, integrationNames.JIRA],
    },
    {
        title: 'NINE te title9 ilomet',
        description: 'example dllamco laboris nisi utmmodo consequat. yolo aute irure dolor in reprehenderit in voluptate veli.',
        categories: [categoriesNames.CATEGORY_FIVE, categoriesNames.CATEGORY_THREE],
        integrations: [integrationNames.ASANA, integrationNames.JIRA],
    },
    {
        title: 'TEN title boom ilomet',
        description: 'example descrippor incididunt ut labore et doloreation ullamco laboris nisi utmmodo consequat. Duis aute irure dolor in reprehenderit in voluptate veli.',
        categories: [categoriesNames.CATEGORY_FIVE, categoriesNames.CATEGORY_TWO, categoriesNames.CATEGORY_THREE],
        integrations: [integrationNames.ASANA, integrationNames.JIRA],
    },
];
