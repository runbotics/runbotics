import React, { FC, useState, useRef, useLayoutEffect } from 'react';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import {
    StyledTypography,
    StyledChip,
    StyledMoreIcon,
    StyledLessIcon,
    TagBox,
    ExpandBox,
    ExpandAction,
    ExpandLine,
    StaticLine,
    Container
} from './ProcessTile.tags.styles';
import { ProcessTileTagsProps } from './ProcessTile.types';

const ProcessTileTags: FC<ProcessTileTagsProps> = ({ tags }) => {
    const { translate } = useTranslations();

    const [areTagsExpanded, setAreTagsExpanded] = useState<boolean>(false);
    const [areTagsFitLine, setAreTagsFitLine] = useState<boolean>(false);
    const [tagsWidth, setTagsWidth] = useState<number>(0);

    const refTags = useRef(Array.from({ length: tags.length }, _ => React.createRef<HTMLDivElement>()));
    const refTagBox = useRef<HTMLDivElement>();

    const willTagsFit = (tagsWidthSum: number): void => {
        if (!refTagBox.current) return;
        const tagDivWidth: number = refTagBox.current.offsetWidth - 85;
        const tagsWithMarginWidth: number = tagsWidthSum + (Object.keys(refTags.current).length - 1) * 8;

        tagsWithMarginWidth > tagDivWidth ? setAreTagsFitLine(false) : setAreTagsFitLine(true);
    };

    const handleResize = (): number => {
        const tagsWidthSum: number = refTags.current.reduce(
            (prevValue, tag) => prevValue + tag.current.offsetWidth, 0);

        setTagsWidth(tagsWidthSum);
        return tagsWidthSum;
    };

    useLayoutEffect(() => {
        const tagsWidthSum: number = handleResize();
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
            <TagBox ref={refTagBox} hidden={!areTagsExpanded} >
                {
                    tags.map((tag, id) =>
                        <StyledChip
                            ref={refTags.current[id]}
                            className='tag'
                            label={tag.name}
                            key={tag.name}
                            size='small'
                        />)
                }
            </TagBox>
            <ExpandBox>
                <If
                    condition={tags.length && !areTagsFitLine}
                    else={<StaticLine/>}
                >
                    <ExpandLine/>
                    <ExpandAction
                        onClick={() => setAreTagsExpanded(!areTagsExpanded)}
                    >
                        <StyledTypography
                            variant='body2'
                            fontSize={11}
                        >
                            {
                                areTagsExpanded
                                    ? translate('Component.Tile.Process.Tags.CollapseLabel')
                                    : translate('Component.Tile.Process.Tags.ExpandLabel')
                            }
                        </StyledTypography>
                        <If
                            condition={areTagsExpanded}
                            else={<StyledMoreIcon/>}
                        >
                            <StyledLessIcon/>
                        </If>
                    </ExpandAction>
                </If>
            </ExpandBox>
        </Container>
    );
};

export default ProcessTileTags;
