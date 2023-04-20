import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import { Typography } from '@mui/material';

import { ContentfulRichText } from 'src/contentful/models';

interface Props {
    content: ContentfulRichText;
}

/**
 * Customize contentful rich text renderer with MUI typography
 */
const RichTextRenderer = ({ content }: Props) => {
    const renderOptions: Options = {
        renderNode: {
            [BLOCKS.HEADING_1]: (_, children) => <Typography variant="h1">{children}</Typography>,
            [BLOCKS.HEADING_2]: (_, children) => <Typography variant="h2">{children}</Typography>,
            [BLOCKS.HEADING_3]: (_, children) => <Typography variant="h3">{children}</Typography>,
            [BLOCKS.HEADING_4]: (_, children) => <Typography variant="h4">{children}</Typography>,
            [BLOCKS.HEADING_5]: (_, children) => <Typography variant="h5">{children}</Typography>,
            [BLOCKS.HEADING_6]: (_, children) => <Typography variant="h6">{children}</Typography>,
            [BLOCKS.PARAGRAPH]: (_, children) => <Typography variant="body1">{children}</Typography>,
        }
    };

    return (
        <>{documentToReactComponents(content.json as any, renderOptions)}</>
    );
};

export default RichTextRenderer;
