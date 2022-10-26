import Clear from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { ChangeEvent, Dispatch, FunctionComponent, SetStateAction, useMemo, useRef, useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import If from 'src/components/utils/If';
import useTranslations from 'src/hooks/useTranslations';
import { VariableType } from '../../Variable.types';
import { ListVariableState, VariableState, VariableValue } from '../VariableDetails.types';
import { AddButton, AddListItem, SearchListItem, SearchInput, SearchWrapper, StyledList } from './ValueList.styles';
import ValueListItem from './ValueListItem';

interface ValueListProps {
    variable: ListVariableState;
    setVariable: Dispatch<SetStateAction<VariableState>>;
    readOnly?: boolean;
}

const ValueList: FunctionComponent<ValueListProps> = ({ variable, setVariable, readOnly }) => {
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const { translate } = useTranslations();

    const [search, setSearch] = useState('');

    const createNewListItem = () => {
        const value: VariableValue[] = [...variable.value, { id: uuidv4(), value: '' }];
        setVariable((prevState) => ({ ...prevState, type: VariableType.LIST, value }));
        setTimeout(() => {
            addButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const deleteListItem = (id: string) => {
        const variableValue = variable.value.filter((value) => value.id !== id);
        setVariable((prevState) => ({ ...prevState, type: VariableType.LIST, value: variableValue }));
    };

    const changeListItem = (newValue: VariableValue) => {
        const variableValue = variable.value.map((value) => (value.id !== newValue.id ? value : newValue));
        setVariable((prevState) => ({ ...prevState, type: VariableType.LIST, value: variableValue }));
    };

    const changeSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const clearSearch = () => {
        setSearch('');
    };

    const displayedRows = useMemo(
        () => variable.value.filter((listItem) => listItem.value.includes(search)).length,
        [search, variable.value],
    );

    const renderList = () =>
        variable.value
            .filter((listItem) => listItem.value.includes(search))
            .map((listItem) => (
                <ValueListItem
                    listItem={listItem}
                    onDelete={deleteListItem}
                    onChange={changeListItem}
                    readOnly={readOnly}
                    key={listItem.id}
                />
            ));

    return (
        <StyledList>
            <SearchListItem key="search-input">
                <SearchWrapper as="div">
                    <SearchIcon />
                    <SearchInput
                        placeholder={translate('Variables.Details.ValueList.Search')}
                        inputProps={{ 'aria-label': translate('Variables.Details.ValueList.Search.AriaLabel') }}
                        onChange={changeSearch}
                        value={search}
                    />
                    <Typography variant="body2">
                        {displayedRows}
                        &nbsp;/&nbsp;
                        {variable.value.length}
                    </Typography>
                    <IconButton
                        type="reset"
                        aria-label={translate('Variables.Details.ValueList.Clear.AriaLabel')}
                        size="small"
                        onClick={clearSearch}
                    >
                        <Clear />
                    </IconButton>
                </SearchWrapper>
            </SearchListItem>
            {renderList()}
            <If condition={!readOnly}>
                <AddListItem key="new-item-button">
                    <AddButton
                        ref={addButtonRef}
                        aria-label={translate('Variables.Details.ValueList.NewVariable.AriaLabel')}
                        onClick={createNewListItem}
                    >
                        <AddIcon />
                    </AddButton>
                </AddListItem>
            </If>
        </StyledList>
    );
};

export default ValueList;
