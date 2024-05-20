
import { Tag } from 'runbotics-common';

export interface TagsInputProps {
    selected: TagName[]; // selectedTagsNames
    setSelected: (tags: TagName[]) => void; // setSelectedTagsNames
    formState: any; // formState (e.g. processFormState)
    setFormState: (newState: any) => void; // setFormState
    search: TagName; // searchedPhrase
    autocompleteList: Tag[]; // autocompleteTagList
    setAutocompleteList: (tags: Tag[]) => void; // setAutocompleteTagList
    setSearch: (search: TagName) => void;
    isOwner: boolean;
    maxAmount: number;
}

type TagName = string;
