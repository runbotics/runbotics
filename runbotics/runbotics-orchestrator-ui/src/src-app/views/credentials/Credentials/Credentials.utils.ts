import { BasicCredentialDto, CredentialTemplate } from '../Credential/Credential.types';
import { collectionColors } from '../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';

const tempCredentials: BasicCredentialDto[] = [{
    id: 'jakies_id',
    name: 'Jakas Nazwa',
    collectionId: 'Jakas kolekcja',
    description: 'Jakies description',
    collectionColor: collectionColors.LIGHT_ORANGE.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: CredentialTemplate.CUSTOM
}, {
    id: 'tymczasowe_id',
    name: 'Tymczasowa Nazwa',
    collectionId: 'Tymczasowa kolekcja',
    description: 'Tymczasowe description',
    collectionColor: collectionColors.DARK_ORANGE.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: CredentialTemplate.CUSTOM
}, {
    id: 'zmyslone_id',
    name: 'Zmyslona Nazwa',
    collectionId: 'Zmyslona kolekcja',
    description: 'Zmyslone description',
    collectionColor: collectionColors.LIGHT_GREEN.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: CredentialTemplate.CUSTOM
}, {
    id: 'nowe_id',
    name: 'Nowa Nazwa',
    collectionId: 'Nowa kolekcja',
    description: 'Jakies description',
    collectionColor: collectionColors.DARK_GREEN.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: CredentialTemplate.CUSTOM
}, {
    id: 'unikalne_id',
    name: 'Unikalna Nazwa',
    collectionId: 'Unikalna kolekcja',
    description: 'Unikalne description',
    collectionColor: collectionColors.LIGHT_BLUE.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: CredentialTemplate.CUSTOM
},
{
    id: 'ciemne_niebieskie_id',
    name: 'Ciemna Niebieska Nazwa',
    collectionId: 'Ciemna niebieska kolekcja',
    description: 'Ciemne niebieska description',
    collectionColor: collectionColors.DARK_BLUE.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: CredentialTemplate.CUSTOM
}, {
    id: 'szare_id',
    name: 'Szara Nazwa',
    collectionId: 'Szara kolekcja',
    description: 'Szare description',
    collectionColor: collectionColors.LIGHT_GREY.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: CredentialTemplate.CUSTOM
}, {
    id: 'ciemne_szare_id',
    name: 'Ciemna Szara Nazwa',
    collectionId: 'Ciemna szara kolekcja',
    description: 'Ciemne szare description',
    collectionColor: collectionColors.DARK_GREY.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: CredentialTemplate.CUSTOM
}];

export const getCredentials = () => tempCredentials;
