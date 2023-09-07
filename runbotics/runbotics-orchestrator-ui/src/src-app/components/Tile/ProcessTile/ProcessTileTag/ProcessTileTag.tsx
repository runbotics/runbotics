import React, { FC, useState, useRef, useLayoutEffect } from 'react';

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
    StyledChipName
} from './ProcessTileTag.styles';
import { ProcessTileTagProps } from './ProcessTileTag.types';

const TAGS_CONTAINER_MARGIN_VALUE = 85;
const TAG_RIGHT_MARGIN_VALUE = 8;

const ProcessTileTag: FC<ProcessTileTagProps> = ({ tags }) => {
    const { translate } = useTranslations();

    const [isTagBoxExpanded, setIsTagBoxExpanded] = useState<boolean>(false);
    const [isTagListMultiLine, setIsTagListMultiLine] = useState<boolean>(true);
    const [tagsWidth, setTagsWidth] = useState<number>(0);

    const refTagBox = useRef<HTMLDivElement>();

    const checkTagsWidth = (tagsWidthSum: number, refTags: HTMLDivElement[]): void => {
        if (!refTagBox.current) return;

        const tagDivWidth: number = refTagBox.current.offsetWidth - TAGS_CONTAINER_MARGIN_VALUE;
        const tagsWithMarginWidth: number = tagsWidthSum + (refTags.length - 1) * TAG_RIGHT_MARGIN_VALUE;

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
        window.addEventListener('resize', () => checkTagsWidth(tagsWidthSum, refTags));

        return () => {
            window.removeEventListener('resize', () => checkTagsWidth(tagsWidthSum, refTags));
        };
    }, []);

    useLayoutEffect(() => {
        checkTagsWidth(tagsWidth, []);
    }, [tagsWidth]);

    return (
        <Container>
            <TagBox ref={refTagBox} isExpanded={isTagBoxExpanded} >
                {tags.map((tag) =>
                    <StyledChipName
                        label={tag.name}
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
                    <DividerLine/>
                    <DividerAction
                        onClick={() => setIsTagBoxExpanded(!isTagBoxExpanded)}
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
                        <StyledExpandIcon isExpanded={isTagBoxExpanded}/>
                    </DividerAction>
                </If>
            </DividerBox>
        </Container>
    );
};

export default ProcessTileTag;
