export const getFilterItemsForPage = <T>(items: T[], page: number, pageSize: number): T[] => {
    const startingPageItemIndex = page * pageSize;
    const endingPageItemIndex = startingPageItemIndex + pageSize;

    return  items.slice(startingPageItemIndex, endingPageItemIndex);
};
