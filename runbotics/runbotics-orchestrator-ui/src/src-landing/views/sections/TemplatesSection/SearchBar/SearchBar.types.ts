export interface SearchBarProps {
    searchValue: string,
    handleSearch: (event: React.ChangeEvent<HTMLDivElement>) => void,
}
