import { VFC } from 'react';

import {
    documentToReactComponents,
    Options,
} from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

import Image from 'next/image';

import { ContentfulRichText } from '#contentful/common';

import styles from './RichTextRenderer.module.scss';
import EmbeddedVideo from '../EmbeddedVideo';
import Typography from '../Typography';

interface Props {
    content: ContentfulRichText;
}

const embeddedLinkRegex = new RegExp(
    '\\$https:\\/\\/www\\.youtube\\.com\\/watch\\?v=[^$]*\\$',
    'g'
);

/**
 * Customizable contentful rich text renderer
 */
const RichTextRenderer: VFC<Props> = ({ content }) => {
    const renderOptions: Options = {
        renderNode: {
            [BLOCKS.HEADING_1]: (_, children) => (
                <Typography font="Roboto" className={styles.h2} variant="h2">
                    {children}
                </Typography>
            ),
            [BLOCKS.HEADING_2]: (_, children) => (
                <Typography font="Roboto" className={styles.h2} variant="h2">
                    {children}
                </Typography>
            ),
            [BLOCKS.HEADING_3]: (_, children) => (
                <Typography font="Roboto" className={styles.h4} variant="h4">
                    {children}
                </Typography>
            ),
            [BLOCKS.HEADING_4]: (_, children) => (
                <Typography font="Roboto" className={styles.h4} variant="h4">
                    {children}
                </Typography>
            ),
            [BLOCKS.HEADING_5]: (_, children) => (
                <Typography font="Roboto" className={styles.p} variant="h5">
                    {children}
                </Typography>
            ),
            [BLOCKS.HEADING_6]: (_, children) => (
                <Typography font="Roboto" className={styles.p} variant="h6">
                    {children}
                </Typography>
            ),
            [BLOCKS.PARAGRAPH]: (_, children) => {
                if (children.toString().match(embeddedLinkRegex)) {
                    const videoId = children
                        .toString()
                        .replace(/^\$/, '')
                        .replace(/\$$/, '')
                        .split('v=')[1];
                    const url = `https://www.youtube.com/embed/${videoId}`;
                    return <EmbeddedVideo url={url} />;
                }

                return (
                    <Typography
                        font="Roboto"
                        className={styles.p}
                        variant="body3"
                    >
                        {children}
                    </Typography>
                );
            },
            [BLOCKS.HR]: () => <hr className={styles.hr} />,
            [BLOCKS.TABLE_CELL]: (_, children) => (
                <td className={styles.td}>{children}</td>
            ),
            [BLOCKS.UL_LIST]: (_, children) => (
                <ul className={styles.ul}>{children}</ul>
            ),
            [BLOCKS.OL_LIST]: (_, children) => (
                <ol className={styles.ol}>{children}</ol>
            ),
            [BLOCKS.EMBEDDED_ASSET]: (embeddedAsset) => {
                const asset = content.links.assets.blocks.find(
                    (el) => el.sys.id === embeddedAsset.data.target.sys.id
                );
                const ratio = `${asset?.width} / ${asset?.height}`;
                return (
                    <div
                        className={styles.imageWrapper}
                        style={{ aspectRatio: ratio }}
                    >
                        <Image
                            className={styles.image}
                            title={asset?.title}
                            src={asset?.url}
                            alt={asset?.title}
                            fill
                        />
                    </div>
                );
            },
        },
    };

    return <>{documentToReactComponents(content.json as any, renderOptions)}</>;
};

export default RichTextRenderer;
