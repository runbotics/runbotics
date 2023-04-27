export const formatBlogPostDate = (date: string) => {
    const rawDate = new Date(date);
    const dateFormatter = new Intl.DateTimeFormat('pl', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedDate = dateFormatter.format(rawDate).replace(/\//g, '.');

    return formattedDate;
};
