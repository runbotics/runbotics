import { BasicCredentialDto, CredentialTemplateNames } from '../Credential/Credential.types';
import { collectionColors } from '../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';

export const tempCredentials: BasicCredentialDto[] = [{
    id: 'jakies_id',
    name: 'Jakas Nazwa',
    collectionId: 'kolekcja_asi',
    description: 'Jakies description',
    collectionColor: collectionColors.LIGHT_ORANGE.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: {id: 'custom', name: CredentialTemplateNames.CUSTOM, attributes: []}
}, {
    id: 'tymczasowe_id',
    name: 'Tymczasowa Nazwa',
    collectionId: 'kolekcja_asi',
    description: 'Tymczasowe description',
    collectionColor: collectionColors.DARK_ORANGE.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: {id: 'custom', name: CredentialTemplateNames.CUSTOM, attributes: []}
}, {
    id: 'zmyslone_id',
    name: 'Zmyslona Nazwa',
    collectionId: 'kolekcja_asi',
    description: 'Zmyslone description',
    collectionColor: collectionColors.LIGHT_GREEN.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: {id: 'custom', name: CredentialTemplateNames.CUSTOM, attributes: []}
}, {
    id: 'nowe_id',
    name: 'Nowa Nazwa',
    collectionId: 'kolekcja_stasia',
    description: 'Jakies description',
    collectionColor: collectionColors.DARK_GREEN.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: {id: 'custom', name: CredentialTemplateNames.CUSTOM, attributes: []}
}, {
    id: 'unikalne_id',
    name: 'Unikalna Nazwa',
    collectionId: 'kolekcja_basi',
    description: 'Unikalne description',
    collectionColor: collectionColors.LIGHT_BLUE.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: {id: 'custom', name: CredentialTemplateNames.CUSTOM, attributes: []}
},
{
    id: 'ciemne_niebieskie_id',
    name: 'Ciemna Niebieska Nazwa',
    collectionId: 'kolekcja_basi',
    description: 'Ciemne niebieska description',
    collectionColor: collectionColors.DARK_BLUE.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: {id: 'custom', name: CredentialTemplateNames.CUSTOM, attributes: []}
}, {
    id: 'szare_id',
    name: 'Szara Nazwa',
    collectionId: 'kolekcja_basi',
    description: 'Szare description',
    collectionColor: collectionColors.LIGHT_GREY.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: {id: 'custom', name: CredentialTemplateNames.CUSTOM, attributes: []}
}, {
    id: 'ciemne_szare_id',
    name: 'Ciemna Szara Nazwa',
    collectionId: 'kolekcja_ady',
    description: 'Ciemne szare description',
    collectionColor: collectionColors.DARK_GREY.hex,
    createdBy: 'userId',
    createdOn:'2024-05-05',
    template: {id: 'custom', name: CredentialTemplateNames.CUSTOM, attributes: []}
}];

export const getCredentials = () => tempCredentials;
