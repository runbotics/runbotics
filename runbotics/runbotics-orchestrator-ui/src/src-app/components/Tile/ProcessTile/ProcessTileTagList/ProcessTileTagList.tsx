import React, { FC, useState, useRef, useLayoutEffect, MouseEvent, useEffect } from 'react';

import { Chip } from '@mui/material';

import HighlightText from '#src-app/components/HighlightText';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import {
    StyledTypography,
    TagBox,
    DividerBox,
    DividerAction,
    DividerLine,
    StaticLine,
    Container,
    StyledExpandIcon,
} from './ProcessTileTagList.styles';
import { ProcessTileTagListProps } from './ProcessTileTagList.types';

const TAGS_CONTAINER_MARGIN_VALUE = 67;
const TAG_RIGHT_MARGIN_VALUE = 8;
const COMBINED_TILE_CONTENT_PADDING_VALUE = 32;

const ProcessTileTagList: FC<ProcessTileTagListProps> = ({
    tags, searchValue, refProcessTileContent
}) => {
    const { translate } = useTranslations();

    const [isTagBoxExpanded, setIsTagBoxExpanded] = useState<boolean>(false);
    const [isTagListMultiLine, setIsTagListMultiLine] = useState<boolean>(true);
    const [tagsWidth, setTagsWidth] = useState<number>(0);
    const [expandedHeight, setExpandedHeight] = useState<number>(0);

    const refTagBox = useRef<HTMLDivElement>();

    const checkTagsWidth = (tagsWidthSum: number): void => {
        if (!refTagBox.current) return;

        const tagDivWidth: number = refTagBox.current.offsetWidth - TAGS_CONTAINER_MARGIN_VALUE;
        const tagsWithMarginWidth: number = tagsWidthSum + (tags.length) * TAG_RIGHT_MARGIN_VALUE;

        setIsTagListMultiLine(tagsWithMarginWidth > tagDivWidth);
    };

    const handleWindowResize = (refTags: HTMLDivElement[]): number => {
        const tagsWidthSum: number = refTags.reduce((prevValue, tag) => prevValue + tag.offsetWidth, 0);
        setTagsWidth(tagsWidthSum);
        return tagsWidthSum;
    };

    useLayoutEffect(() => {
        const refTags: HTMLDivElement[] = Array.from(refTagBox.current.childNodes) as HTMLDivElement[];
        const tagsWidthSum: number = handleWindowResize(refTags);
        window.addEventListener('resize', () => checkTagsWidth(tagsWidthSum));

        return () => {
            window.removeEventListener('resize', () => checkTagsWidth(tagsWidthSum));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => { checkTagsWidth(tagsWidth); }, [tagsWidth]);

    const handleTagBoxResize = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsTagBoxExpanded(!isTagBoxExpanded);
    };

    const tagNameFitSearch = (tagName: string) => Boolean(tagName.match(RegExp(searchValue, 'ig')));

    useEffect(() => {
        if (!refProcessTileContent.current || Number.isNaN(refProcessTileContent.current.offsetHeight)) return;
        setExpandedHeight(refProcessTileContent.current.offsetHeight + COMBINED_TILE_CONTENT_PADDING_VALUE);
    }, [refProcessTileContent]);

    return (
        <Container>
            <TagBox
                ref={refTagBox}
                $isExpanded={isTagBoxExpanded}
                $expandedHeight={expandedHeight}
            >
                {tags.reduce((acc, tag) =>
                    tagNameFitSearch(tag.name)
                        ? [tag, ...acc]
                        : [...acc, tag]
                , []).map(tag =>
                    <Chip
                        label={
                            <HighlightText
                                text={tag.name}
                                matchingText={searchValue}
                            />
                        }
                        key={tag.name}
                        size='small'
                    />)
                }
            </TagBox>
            <DividerBox>
                <If
                    condition={tags.length && isTagListMultiLine}
                    else={<StaticLine/>}
                >
                    <DividerLine $isExpanded={isTagBoxExpanded}/>
                    <DividerAction
                        onClick={handleTagBoxResize}
                        $isExpanded={isTagBoxExpanded}
                    >
                        <StyledTypography
                            variant='body2'
                            fontSize={11}
                        >
                            {isTagBoxExpanded
                                ? translate('Component.Tile.Process.Tags.CollapseLabel')
                                : translate('Component.Tile.Process.Tags.ExpandLabel')
                            }
                        </StyledTypography>
                        <StyledExpandIcon $isExpanded={isTagBoxExpanded}/>
                    </DividerAction>
                </If>
            </DividerBox>
        </Container>
    );
};

export default ProcessTileTagList;
