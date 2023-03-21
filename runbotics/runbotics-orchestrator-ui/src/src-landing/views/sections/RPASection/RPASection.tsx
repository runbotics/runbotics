import { FC } from 'react';

import RPABackground from './RPABackground';
import RPAContent from './RPAContent';

const RPASection: FC = () => (
    <RPABackground>
        <RPAContent />
    </RPABackground>
);

export default RPASection;
