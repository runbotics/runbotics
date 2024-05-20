import { BasicCredentialsCollectionDto, CreateCredentialsCollectionDto, CredentialsCollectionUser } from './CredentialsCollection.types';
import { DEFAULT_CREDENTIALS_COLLECTION_COLOR } from './EditCredentialsCollection/CollectionColor/CollectionColor.types';

const INITIAL_CREDENTIAL_COLLECTION_VALUES: CreateCredentialsCollectionDto = {
    name: null,
    description: '',
    color: DEFAULT_CREDENTIALS_COLLECTION_COLOR,
    tenantId: '',
    credentials: [],
    isPrivate: true
};

export const prepareIncompleteCollectionEntity = (
    createdBy: CredentialsCollectionUser,
    currentCollectionId: 'doUzupelnienia',
    collection?: BasicCredentialsCollectionDto
): CreateCredentialsCollectionDto => ({
    name: collection ? collection.name : INITIAL_CREDENTIAL_COLLECTION_VALUES.name,
    description: collection ? collection.description : INITIAL_CREDENTIAL_COLLECTION_VALUES.description,
    isPrivate: collection ? collection.isPrivate : INITIAL_CREDENTIAL_COLLECTION_VALUES.isPrivate,
    users: collection ? collection.users : INITIAL_CREDENTIAL_COLLECTION_VALUES.users,
    color: collection ? collection.color : INITIAL_CREDENTIAL_COLLECTION_VALUES.color,
    tenantId: collection ? collection.tenantId : INITIAL_CREDENTIAL_COLLECTION_VALUES.tenantId,
    credentials: collection ? collection.credentials : INITIAL_CREDENTIAL_COLLECTION_VALUES.credentials
});

const tempCredentialsCollections: BasicCredentialsCollectionDto[] = [
    {
        id: 'kolekcja_asi',
        name: 'Kolekcja Asi',
        description: 'Opis kolekcji pierwszej',
        color: DEFAULT_CREDENTIALS_COLLECTION_COLOR,
        isPrivate: true,
        tenantId: 'tenant_id',
        createdOn: '2024-01-02',
        createdBy: 'asia@email',
        modifiedOn: null,
        modifiedBy: null,
        credentials: []
    },
    {
        id: 'kolekcja_basi',
        name: 'Kolekcja Basi',
        description: 'Opis kolekcji pierwszej',
        color: 'LIGHT_GREEN',
        isPrivate: false,
        tenantId: 'tenant_id',
        createdOn: '2024-03-12',
        createdBy: 'basia@email',
        modifiedOn: '2024-05-02',
        modifiedBy: 'string',
        credentials: []
    },
    {
        id: 'kolekcja_stasia',
        name: 'Kolekcja Stasia',
        description: 'Opis kolekcji pierwszej',
        color: 'DARK_BLUE',
        isPrivate: true,
        tenantId: 'tenant_id',
        createdOn: '2024-04-22',
        createdBy: 'stasiu@email',
        modifiedOn: null,
        modifiedBy: null,
        credentials: []
    },
    {
        id: 'kolekcja_ady',
        name: 'Kolekcja Ady',
        description: 'Opis kolekcji pierwszej',
        color: 'DARK_GREY',
        isPrivate: true,
        tenantId: 'tenant_id',
        createdOn: '2024-04-30',
        createdBy: 'ada@email',
        modifiedOn: null,
        modifiedBy: null,
        credentials: []
    }
];

export const getCredentialsCollections = () => tempCredentialsCollections;
