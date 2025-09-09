import { FC } from 'react';

import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent/HeroContent';

const HeroSection: FC = () => (
    <HeroBackground>
        <HeroContent />
    </HeroBackground>
);

export default HeroSection;
