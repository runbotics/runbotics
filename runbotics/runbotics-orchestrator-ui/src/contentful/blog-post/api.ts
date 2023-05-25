

import { extractBlogPost } from './extractors';
import { buildPostQuery } from './queries';
import { GetPostOptions, GetPostResponse } from './types';

import { IS_PREVIEW_MODE, fetchGraphQL } from '#contentful/common';

import { Language } from '#src-app/translations/translations';



export async function getPost(locale: Language,options: GetPostOptions) {
    const entry = await fetchGraphQL<GetPostResponse>(
        buildPostQuery({
            preview: IS_PREVIEW_MODE,
            locale: locale,
            ...options,
        })
    );

    return extractBlogPost(entry);
}
