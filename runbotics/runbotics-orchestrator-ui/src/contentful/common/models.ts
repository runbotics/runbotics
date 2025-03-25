interface AssetBlock {
    sys: {
        id: string;
    };
    url: string;
    title: string;
    description: string;
    width: number;
    height: number;
}
interface Asset {
    blocks: AssetBlock[];
}

export interface ContentfulRichText {
    json: JSON;
    links: {
        assets: Asset;
    };
}

export type ContentfulCollection<T> = {
    items: T[];
}

export interface BlogPost {
    status: ContentfulContentPublishStatus;
    title: string;
    slug: string;
    date: string;
    readingTime: number;
    featuredImage: {
        url: string;
    };
    imageAlt?: string;
    tags: ContentfulCollection<Tag>;
    summary: string;
    body: ContentfulRichText;
    authors: ContentfulCollection<Author>;
    category: Category;
}

export interface Category {
    title: string;
    slug: string;
}

export interface Author {
    name: string;
    slug: string;
    jobTitle?: string;
    bio: ContentfulRichText;
}

export interface Tag {
    name: string;
    slug: string;
}

export interface Industry {
    title: string;
    slug: string;
}

export interface ContentfulContentPublishStatus {
    publishedAt: string | null;
    publishedVersion: number | null;
};

export interface OfferAdditionalParameterOption {
    name: string;
    additionalPrice: number;
    isDefault?: boolean;
}

export interface OfferAdditionalParameter {
    name: string;
    options: OfferAdditionalParameterOption[];
}

export interface MarketplaceOfferParameters {
    basePrice: number;
    additionalParameters: OfferAdditionalParameter[];
}

export interface MarketplaceOffer {
    status: ContentfulContentPublishStatus;
    title: string;
    slug: string;
    description: string;
    image?: {
        url: string;
    };
    imageAltText?: string;
    tags: ContentfulCollection<Tag>;
    body: ContentfulRichText;
    industries: ContentfulCollection<Industry>;
    parameters?: MarketplaceOfferParameters;
}
