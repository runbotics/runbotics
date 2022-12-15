import { FC } from 'react';

import IntegrationBackground from './IntegrationBackground';
import IntegrationContent from './IntegrationContent';

const IntegrationSection: FC = () => (
    <IntegrationBackground>
        <IntegrationContent />
    </IntegrationBackground>
);

export default IntegrationSection;
