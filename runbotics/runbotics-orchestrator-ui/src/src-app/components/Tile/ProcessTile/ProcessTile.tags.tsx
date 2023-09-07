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
} from './ProcessTile.tags.styles';
import { ProcessTileTagsProps } from './ProcessTile.types';

const TAGS_CONTAINER_MARGIN_VALUE = 85;
const TAG_RIGHT_MARGIN_VALUE = 8;

const ProcessTileTags: FC<ProcessTileTagsProps> = ({ tags }) => {
    const { translate } = useTranslations();

    const [areTagsExpanded, setAreTagsExpanded] = useState<boolean>(false);
    const [areTagsFittingLine, setAreTagsFittingLine] = useState<boolean>(false);
    const [tagsWidth, setTagsWidth] = useState<number>(0);

    const refTags = useRef(Array.from({ length: tags.length }, _ => React.createRef<HTMLDivElement>()));
    const refTagBox = useRef<HTMLDivElement>();

    const willTagsFit = (tagsWidthSum: number): void => {
        if (!refTagBox.current) return;
        const tagDivWidth: number = refTagBox.current.offsetWidth - TAGS_CONTAINER_MARGIN_VALUE;
        const tagsWithMarginWidth: number = tagsWidthSum + (Object.keys(refTags.current).length - 1) * TAG_RIGHT_MARGIN_VALUE;

        setAreTagsFittingLine(tagsWithMarginWidth < tagDivWidth);
    };

    const handleWindowResize = (): number => {
        const tagsWidthSum: number = refTags.current.reduce((prevValue, tag) => prevValue + tag.current.offsetWidth, 0);
        setTagsWidth(tagsWidthSum);
        return tagsWidthSum;
    };

    useLayoutEffect(() => {
        const tagsWidthSum: number = handleWindowResize();
        window.addEventListener('resize', () => willTagsFit(tagsWidthSum));

        return () => {
            window.removeEventListener('resize', () => willTagsFit(tagsWidthSum));
        };
    }, []);

    useLayoutEffect(() => {
        willTagsFit(tagsWidth);
    }, [tagsWidth]);

    return (
        <Container>
            <TagBox ref={refTagBox} isHidden={!areTagsExpanded} >
                {
                    tags.map((tag, id) =>
                        <StyledChipName
                            ref={refTags.current[id]}
                            label={tag.name}
                            key={tag.name}
                            size='small'
                        />)
                }
            </TagBox>
            <DividerBox>
                <If
                    condition={tags.length && !areTagsFittingLine}
                    else={<StaticLine/>}
                >
                    <DividerLine/>
                    <DividerAction
                        onClick={() => setAreTagsExpanded(!areTagsExpanded)}
                    >
                        <StyledTypography
                            variant='body2'
                            fontSize={11}
                        >
                            {areTagsExpanded
                                ? translate('Component.Tile.Process.Tags.CollapseLabel')
                                : translate('Component.Tile.Process.Tags.ExpandLabel')
                            }
                        </StyledTypography>
                        <StyledExpandIcon isExpanded={areTagsExpanded}/>
                    </DividerAction>
                </If>
            </DividerBox>
        </Container>
    );
};

export default ProcessTileTags;
