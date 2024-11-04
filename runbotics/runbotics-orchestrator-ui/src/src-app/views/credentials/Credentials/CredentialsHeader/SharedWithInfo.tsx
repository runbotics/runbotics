import { FC } from 'react';

import { Typography } from '@mui/material';


import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

interface SharedWithInfoProps {
    sharedWithNumber: number;
}

export const SharedWithInfo: FC<SharedWithInfoProps> = ({ sharedWithNumber }) => {
    const { translate } = useTranslations();

    return (
        <Typography variant="h5" pl={3}>
            <If condition={sharedWithNumber === 0}>
                {translate('Credentials.Collection.Edit.SharedWithNumber.None')}
            </If>
            <If condition={sharedWithNumber > 0}>
                {sharedWithNumber === 1
                    ? translate('Credentials.Collection.Edit.SharedWithNumber.Singular', { sharedWithNumber })
                    : translate('Credentials.Collection.Edit.SharedWithNumber.Plural', { sharedWithNumber })}
            </If>
        </Typography>
    );
};

export default SharedWithInfo;
