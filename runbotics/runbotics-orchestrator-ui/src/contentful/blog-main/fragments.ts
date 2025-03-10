import { FilterQueryParams } from '#contentful/common';

export const buildFilterFragment = (options: FilterQueryParams) => {
    const { industries, search, startDate, endDate } = options;
    const query = [];

    if (industries?.length) {
        query.push(
            `category: { slug_in: ${JSON.stringify(industries)} }`
        );
    }
    if (search) {
        query.push(`
            OR: [
                { title_contains: "${search}" },
                { summary_contains: "${search}" }
            ]
        `);
    }
    if (startDate) query.push(`date_gte: "${startDate}"`);
    if (endDate) query.push(`date_lte: "${endDate}"`);

    return query.join(', ');
};
