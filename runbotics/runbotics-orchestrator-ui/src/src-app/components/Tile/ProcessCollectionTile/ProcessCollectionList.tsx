import { FC, MouseEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Grid } from '@mui/material';

import { useSelector } from '#src-app/store';

import { processCollectionSelector } from '#src-app/store/slices/ProcessCollection';

import { ExpandButtonWrapper } from './ProcessCollectionList.style';
import ProcessCollectionTile from './ProcessCollectionTile';
import { CollectionListWrapper, DividerLine, ExpandButton, StyledExpandIcon, StyledTypography } from './ProcessCollectionTile.styles';
import { translate } from '../../../hooks/useTranslations';
import If from '../../utils/If';

const PROCESS_COLLECTIONS_GAP = 16;

const ProcessCollectionList: FC = () => {
    const processCollections = useSelector(processCollectionSelector).active.childrenCollections;

    const refCollectionBox = useRef<HTMLDivElement>();
    const [isCollectionListMultiLine, setIsCollectionListMultiLine] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const handleWindowResize = (refTiles: HTMLDivElement[]): number => refTiles.reduce((prevValue, tile) => prevValue + tile.offsetWidth, 0);

    const checkCollectionsWidth = (tilesWidthSum: number): void => {
        if (!refCollectionBox.current) {
            return;
        }

        const collectionsContainerWidth: number = refCollectionBox.current.offsetWidth;
        const collectionsWithGapsWidth: number = tilesWidthSum + (processCollections.length * PROCESS_COLLECTIONS_GAP);
        setIsCollectionListMultiLine(collectionsWithGapsWidth > collectionsContainerWidth);
    };

    useLayoutEffect(() => {
        const refTiles: HTMLDivElement[] = Array.from(refCollectionBox.current.childNodes) as HTMLDivElement[];
        const collectionsWidthSum: number = handleWindowResize(refTiles);
        checkCollectionsWidth(collectionsWidthSum);

        window.addEventListener('resize', () => {
            checkCollectionsWidth(collectionsWidthSum);
        });

        return () => {
            window.removeEventListener('resize', () => checkCollectionsWidth(collectionsWidthSum));
        };
    }, [processCollections]);


    const handleCollectionResize = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const sortedCollections = useMemo(() => {
        const collectionsClone = structuredClone(processCollections);
        return collectionsClone.length < 1 ?
            collectionsClone :
            collectionsClone.sort((collection1, collection2) => collection1.name.localeCompare(collection2.name));
    }, [processCollections]);

    return (
        <div>
            <CollectionListWrapper isExpanded={isExpanded}>
                <Grid ref={refCollectionBox} container xs={12} columnGap={2} rowGap={2} p={1}>
                    {sortedCollections
                        .map(collection => (
                            <ProcessCollectionTile
                                {...collection}
                                key={collection.id}
                            />
                        ))}
                </Grid>
            </CollectionListWrapper>
            <If condition={isCollectionListMultiLine}>
                <ExpandButtonWrapper>
                    <DividerLine />
                    <ExpandButton $expanded={isExpanded} onClick={handleCollectionResize}>
                        <StyledTypography fontSize={14} >
                            <If
                                condition={isExpanded}
                                else={<>{translate('Process.Collection.List.Expand.Label')}</>}
                            >
                                {translate('Process.Collection.List.Collapse.Label')}
                            </If>
                        </StyledTypography>
                        <StyledExpandIcon $expanded={isExpanded}/>
                    </ExpandButton>
                    <DividerLine />
                </ExpandButtonWrapper>
            </If>
        </div>
    );
};

export default ProcessCollectionList;
