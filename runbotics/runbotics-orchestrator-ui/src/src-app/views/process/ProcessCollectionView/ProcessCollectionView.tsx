import { useState, useEffect } from 'react';

import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

import ProcessCollectionPath from '#src-app/components/Tile/ProcessCollectionTile/ProcessCollectionPath';
import LoadingBox from '#src-app/components/utils/LoadingBox';
import useProcessCollection from '#src-app/hooks/useProcessCollection';

import InternalPage from '../../../components/pages/InternalPage';
import ProcessCollectionList from '../../../components/Tile/ProcessCollectionTile/ProcessCollectionList';
import If from '../../../components/utils/If';
import useTranslations from '../../../hooks/useTranslations';
import { processCollectionSelector } from '../../../store/slices/ProcessCollection';
import Header from '../ProcessBrowseView/Header';
import ProcessList from '../ProcessBrowseView/ProcessList';

export const ProcessCollectionView = () => {
    const { translate } = useTranslations();
    const { active: { isLoading, childrenCollections } } = useSelector(processCollectionSelector);

    const { currentCollectionId, breadcrumbs } = useProcessCollection();
    const [sectionHeight, setSectionHeight] = useState({ minHeight: '120px' });

    useEffect(() => {
        setTimeout(() => {
            if (!childrenCollections.length) {
                setSectionHeight({ minHeight: '1px' });
            } else {
                setSectionHeight({ minHeight: '120px' });
            }
        }, 100);
    }, [childrenCollections]);

    const boxStyle = {
        ...sectionHeight,
        display: 'flex',
        flexDirection: 'column',
        transition: '1s',
        alignItems: isLoading ? 'center' : 'left',
    };

    return (
        <InternalPage title={translate('Process.Collection.Navigation.Collections.Label')}>
            <Header />
            <Box pt={2} sx={boxStyle}>
                <If condition={!isLoading} else={<LoadingBox />} >
                    <ProcessCollectionPath
                        breadcrumbs={breadcrumbs}
                        currentCollectionId={currentCollectionId}
                    />
                    <ProcessCollectionList />
                </If>
            </Box>
            <ProcessList/>
        </InternalPage>
    );
};

export default ProcessCollectionView;
