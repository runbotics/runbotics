import { collectionColors } from '../CredentialsCollection/EditCredentialsCollection/CollectionColor/CollectionColor.types';

const tempCredentials = [{
    id: 'jakies_id',
    name: 'Jakas Nazwa',
    collectionName: 'Jakas kolekcja',
    description: 'Jakies description',
    collectionColor: collectionColors.LIGHT_ORANGE.hex
}, {
    id: 'tymczasowe_id',
    name: 'Tymczasowa Nazwa',
    collectionName: 'Tymczasowa kolekcja',
    description: 'Tymczasowe description',
    collectionColor: collectionColors.DARK_ORANGE.hex
}, {
    id: 'zmyslone_id',
    name: 'Zmyslona Nazwa',
    collectionName: 'Zmyslona kolekcja',
    description: 'Zmyslone description',
    collectionColor: collectionColors.LIGHT_GREEN.hex
}, {
    id: 'nowe_id',
    name: 'Nowa Nazwa',
    collectionName: 'Nowa kolekcja',
    description: 'Jakies description',
    collectionColor: collectionColors.DARK_GREEN.hex
}, {
    id: 'unikalne_id',
    name: 'Unikalna Nazwa',
    collectionName: 'Unikalna kolekcja',
    description: 'Unikalne description',
    collectionColor: collectionColors.LIGHT_BLUE.hex
},
{
    id: 'ciemne_niebieskie_id',
    name: 'Ciemna Niebieska Nazwa',
    collectionName: 'Ciemna niebieska kolekcja',
    description: 'Ciemne niebieska description',
    collectionColor: collectionColors.DARK_BLUE.hex
}, {
    id: 'szare_id',
    name: 'Szara Nazwa',
    collectionName: 'Szara kolekcja',
    description: 'Szare description',
    collectionColor: collectionColors.LIGHT_GREY.hex
}, {
    id: 'ciemne_szare_id',
    name: 'Ciemna Szara Nazwa',
    collectionName: 'Ciemna szara kolekcja',
    description: 'Ciemne szare description',
    collectionColor: collectionColors.DARK_GREY.hex
}];

export const getCredentials = () => tempCredentials;
