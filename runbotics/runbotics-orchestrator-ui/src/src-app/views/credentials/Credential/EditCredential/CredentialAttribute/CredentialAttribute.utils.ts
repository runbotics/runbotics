import { Attribute, CreateAttributeDto } from './CredentialAttribute.types';

export const initialAttributeValues: CreateAttributeDto = {
    name: '',
    value: '',
    description: '',
    masked: true,
    credentialId: ''
};

export const initialAttributes: Attribute[] = [
    {
        id: 'a_1',
        name: 'Atrybucik testowy',
        description: 'Do testowanka',
        value: '',
        masked: true,
        credentialId: '',
        createdBy: 'createdBy@email',
        createdOn: '2024-04-05'
    },
    {
        id: 'a_2',
        name: 'SharePoint login',
        description: 'Na potrzebny testowania',
        value: '',
        masked: true,
        credentialId: '',
        createdBy: 'createdBy@email',
        createdOn: '2024-04-05'
    }
];
