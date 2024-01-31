import { FC, MouseEvent, useLayoutEffect, useRef, useState } from 'react';

import { Grid } from '@mui/material';

import { mockupProcessCollection } from './mockupData';
import { ExpandButtonWrapper } from './ProcessCollectionList.style';
import ProcessCollectionTile from './ProcessCollectionTile';
import { CollectionListWrapper, DividerLine, ExpandButton, StyledExpandIcon, StyledTypography } from './ProcessCollectionTile.styles';
import { translate } from '../../../hooks/useTranslations';
import If from '../../utils/If';

const ProcessCollectionList: FC = () => {
    const processCollections = mockupProcessCollection; // TODO: get from store after merge

    const refCollectionBox = useRef<HTMLDivElement>();
    const [isCollectionListMultiLine, setIsCollectionListMultiLine] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const handleWindowResize = (refTags: HTMLDivElement[]): number => refTags.reduce((prevValue, tag) => prevValue + tag.offsetWidth, 0);

    const checkCollectionsWidth = (tagsWidthSum: number): void => {
        if (!refCollectionBox.current) {
            return;
        }

        const collectionsContainerWidth: number = refCollectionBox.current.offsetWidth;
        const collectionsWithGapsWidth: number = tagsWidthSum + (processCollections.length * 16);
        setIsCollectionListMultiLine(collectionsWithGapsWidth > collectionsContainerWidth);
    };

    useLayoutEffect(() => {
        const refTags: HTMLDivElement[] = Array.from(refCollectionBox.current.childNodes) as HTMLDivElement[];
        const collectionsWidthSum: number = handleWindowResize(refTags);
        checkCollectionsWidth(collectionsWidthSum);
        
        window.addEventListener('resize', () => {
            checkCollectionsWidth(collectionsWidthSum);
        });

        return () => {
            window.removeEventListener('resize', () => checkCollectionsWidth(collectionsWidthSum));
        };
    }, []);

    const handleCollectionResize = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <CollectionListWrapper isExpanded={isExpanded}>
                <Grid ref={refCollectionBox} container xs={12} columnGap={2} rowGap={1}>
                    {processCollections.map(collection => (
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
                    <ExpandButton $isExpanded={isExpanded} onClick={handleCollectionResize}>
                        <StyledTypography fontSize={14} >
                            <If 
                                condition={isExpanded} 
                                else={<>{translate('Process.Collection.List.ExpandLabel')}</>}
                            >
                                {translate('Process.Collection.List.CollapseLabel')}
                            </If>
                        </StyledTypography>
                        <StyledExpandIcon $isExpanded={isExpanded}/>
                    </ExpandButton>
                    <DividerLine />
                </ExpandButtonWrapper>

            </If>
        </div>
    );
};

export default ProcessCollectionList;
