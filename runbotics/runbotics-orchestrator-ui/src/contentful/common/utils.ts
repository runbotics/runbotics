import { GetServerSidePropsContext } from 'next';

import { BlogPost, ContentfulContentPublishStatus, MarketplaceOffer } from './models';
import { FilterQueryParams, FilterQueryParamsEnum } from './types';

export const DEFAULT_PAGE_SIZE = 9;
export const DRAFT_BADGE_BACKGROUND_COLOR = '#FFC107';

export const QUERY_LANGAUGE = {
    en: 'en-US',
    pl: 'pl',
};

export const FILTER_QUERY_PARAMS = [
    FilterQueryParamsEnum.Category,
    FilterQueryParamsEnum.Tag,
    FilterQueryParamsEnum.Search,
    FilterQueryParamsEnum.StartDate,
    FilterQueryParamsEnum.EndDate,
    FilterQueryParamsEnum.Page,
    FilterQueryParamsEnum.Industry,
];

export const extractFilterQueryParams = (
    query: GetServerSidePropsContext['query'],
) => {
    const result: FilterQueryParams = {};
    const { category, industry, tag, search, startDate, endDate, page } = query;
    if (category) {
        result.categories = paramToArray(category);
    }
    if (tag) {
        result.tags = paramToArray(tag);
    }
    if (search) {
        result.search = paramToString(search);
    }
    if (startDate) {
        result.startDate = paramToString(startDate);
    }
    if (endDate) {
        result.endDate = paramToString(endDate);
    }
    if (page) {
        result.page = paramToNumber(page);
    }
    if (industry) {
        result.industries = paramToArray(industry);
    }

    return result;
};

export const filterPosts = (posts: BlogPost[], queryParams: FilterQueryParams) => posts
    .filter(post => {
        if (!checkBlogPostMandatoryFields(post)) return false;

        const { industries, tags, startDate, endDate, search } = queryParams;

        const hasCategory = (
            !industries || industries
                ?.includes(post.category.slug)
        );
        const hasTag = (
            !tags || tags
                ?.some(
                    tag => post.tags.items
                        .map(
                            postTag => postTag.slug,
                        )
                        .includes(tag),
                )
        );
        const isInTimePeriod = (
            !startDate ||
            new Date(post.date) >= new Date(startDate)
        ) && (
            !endDate ||
            new Date(post.date) <= new Date(endDate)
        );
        const containsSearchPhrase = (
            !search ||
            post.title
                .toLowerCase()
                .includes(
                    search.toLowerCase(),
                ) ||
            post.summary
                .toLowerCase()
                .includes((
                    search.toLowerCase()
                ))
        );
        return hasCategory && hasTag && isInTimePeriod && containsSearchPhrase;
    });

export const filterOffers = (offers: MarketplaceOffer[], queryParams: FilterQueryParams) => offers
    .filter(offer => {
        if (!checkMarketplaceOfferMandatoryFields(offer)) return false;

        const { industries, search } = queryParams;

        const hasIndustry = (
            !industries || industries
                ?.some(
                    industry => offer.industries.items
                        .map(
                            offerIndustry => offerIndustry.slug,
                        )
                        .includes(industry),
                )
        );

        const containsSearchPhrase = (
            !search ||
            offer.title
                .toLowerCase()
                .includes(
                    search.toLowerCase(),
                ) ||
            offer.description
                .toLowerCase()
                .includes((
                    search.toLowerCase()
                )) ||
            offer.tags.items
                .some(tag =>
                    tag.name.toLowerCase()
                        .includes(search.toLowerCase())
                )
        );
        return hasIndustry && containsSearchPhrase;
    });

const paramToNumber = (param: string | string[]): number | undefined => {
    if (Array.isArray(param)) {
        const numberParam = Number(param[0]);
        return Number.isNaN(numberParam) ? undefined : numberParam;
    }

    const numberParam = Number(param);
    return Number.isNaN(numberParam) ? undefined : numberParam;
};

const paramToString = (param: string | string[]): string => {
    if (Array.isArray(param) && param.length > 0) {
        return param[0];
    }
    return param as string;
};

const paramToArray = <T>(param: string | string[]): T[] => {
    if (Array.isArray(param)) {
        return param as T[];
    }
    return [param] as T[];
};

export const hasQueryParams = (
    query: GetServerSidePropsContext['query'],
    paramsToInclude: string[],
) => paramsToInclude.some((param) => query[param]);

export const getPageUrl = (baseUrl: string, params: URLSearchParams): string => `/${baseUrl}${
    params.toString() ?
        '?' + params.toString() :
        ''
}`;

export const getPaginatedUrl = (page: number, baseUrl: string, initialParams?: string): string => {
    const searchParams = new URLSearchParams(initialParams);
    searchParams.set(FilterQueryParamsEnum.Page, String(page));
    const newUrl = getPageUrl(baseUrl, searchParams);

    return newUrl;
};

export const checkIsDraft = (status: ContentfulContentPublishStatus): boolean => !status.publishedAt;

const checkBlogPostMandatoryFields = (post: BlogPost) =>
    post.category &&
    post.tags &&
    post.date &&
    post.title &&
    post.summary;

const checkMarketplaceOfferMandatoryFields = (post: MarketplaceOffer) =>
    post.industries &&
    post.tags &&
    post.title &&
    post.description;
