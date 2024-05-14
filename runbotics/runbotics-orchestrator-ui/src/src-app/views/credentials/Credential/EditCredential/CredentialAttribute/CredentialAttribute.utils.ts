import { Attribute } from './CredentialAttribute.types';

export const initialAttributeValues: Attribute = {
    id: '',
    name:'',
    value: '',
    description: '',
    masked: false,
    credentialId: '',
    collectionId: '',
};

export const initialAttributes: Attribute[] = [
    {
        id: 'test_1',
        name: 'Atrybucik testowy',
        value: 'test',
        description: 'Do testowanka',
        masked: true,
        credentialId: '',
        collectionId: ''
    },
    {
        id: 'test_2',
        name: 'SharePoint login',
        value: 'loginek',
        description: 'Na potrzebny testowania',
        masked: false,
        credentialId: '',
        collectionId: ''
    }
];
