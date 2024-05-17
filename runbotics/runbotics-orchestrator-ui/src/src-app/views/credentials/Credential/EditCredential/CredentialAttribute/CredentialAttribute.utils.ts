import { CreateAttributeDto } from './CredentialAttribute.types';

export const initialAttributeValues: CreateAttributeDto = {
    name:'',
    value: '',
    tenantId: 'jakisTenantID',
    description: '',
    masked: true,
    credentialId: '',
};

export const initialAttributes: CreateAttributeDto[] = [
    {
        name: 'Atrybucik testowy',
        description: 'Do testowanka',
        value: '',
        masked: true,
        credentialId: '',
        tenantId: 'jakisTenantID',
    },
    {
        name: 'SharePoint login',
        description: 'Na potrzebny testowania',
        value: '',
        masked: true,
        credentialId: '',
        tenantId: 'jakisTenantID',
    }
];
