import { IS_PREVIEW_MODE, fetchGraphQL } from '#contentful/common';

import { extractBlogPost } from './extractors';
import { buildPostQuery } from './queries';
import { GetPostOptions, GetPostResponse } from './types';

export async function getPost(options: GetPostOptions) {
    const entry = await fetchGraphQL<GetPostResponse>(
        buildPostQuery({
            preview: IS_PREVIEW_MODE,
            ...options,
        })
    );

    return extractBlogPost(entry);
}
