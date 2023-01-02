import { FC } from 'react';

import IntegrationBackground from './IntegrationBackground';
import IntegrationContent from './IntegrationContent';

const IntegrationSection: FC = () => (
    <IntegrationBackground id="integration-section">
        <IntegrationContent />
    </IntegrationBackground>
);

export default IntegrationSection;
