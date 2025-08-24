
import { IS_PREVIEW_MODE, fetchGraphQL } from '#contentful/common';

import { Language } from '#src-app/translations/translations';

import { extractBlogPost } from './extractors';
import { buildPostQuery } from './queries';
import { GetPostOptions, GetPostResponse } from './types';





export async function getPost(locale: Language, options: GetPostOptions) {
    const entry = await fetchGraphQL<GetPostResponse>(
        buildPostQuery({
            preview: IS_PREVIEW_MODE,
            language: locale,
            ...options,
        })
    );

    return extractBlogPost(entry);
}
