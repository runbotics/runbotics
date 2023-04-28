import { VFC } from 'react';

import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

import { ContentfulRichText } from '#contentful/models';

import Typography from '../Typography';
import styles from './RichTextRenderer.module.scss';


interface Props {
    content: ContentfulRichText;
}

/**
 * Customize contentful rich text renderer with MUI typography
 */
const RichTextRenderer: VFC<Props> = ({ content }) => {
    const renderOptions: Options = {
        renderNode: {
            [BLOCKS.HEADING_1]: (_, children) => <Typography font="Roboto" className={styles.h2} variant="h2">{children}</Typography>,
            [BLOCKS.HEADING_2]: (_, children) => <Typography font="Roboto" className={styles.h2} variant="h2">{children}</Typography>,
            [BLOCKS.HEADING_3]: (_, children) => <Typography font="Roboto" className={styles.h4} variant="h4">{children}</Typography>,
            [BLOCKS.HEADING_4]: (_, children) => <Typography font="Roboto" className={styles.h4} variant="h4">{children}</Typography>,
            [BLOCKS.HEADING_5]: (_, children) => <Typography font="Roboto" className={styles.p} variant="h5">{children}</Typography>,
            [BLOCKS.HEADING_6]: (_, children) => <Typography font="Roboto" className={styles.p} variant="h6">{children}</Typography>,
            [BLOCKS.PARAGRAPH]: (_, children) => <Typography font="Roboto" className={styles.p} variant="body3">{children}</Typography>,
        }
    };

    return (
        <>{documentToReactComponents(content.json as any, renderOptions)}</>
    );
};

export default RichTextRenderer;
