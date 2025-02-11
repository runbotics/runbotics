import { useEffect, useState, useCallback, useRef, type VFC } from 'react';

import Image from 'next/image';

import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';

import Typography from '#src-landing/components/Typography';

import { REFERENCES_SECTION_ID } from '#src-landing/utils/utils';

import ReferencesContent from './ReferencesContent/ReferencesContent';
import styles from './ReferencesSection.module.scss';

import { REFERENCES_DATA } from './ReferencesSection.utils';

const LOGO_WIDTH = 280;

const ReferencesSection: VFC = () => {
    const { translate } = useTranslations();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isScrollView, setIsScrollView] = useState(false);
    const [visibleLogosIndex, setVisibleLogosIndex] = useState(0);
    const [logosPerView, setLogosPerView] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);

    const calculateLogosPerView = useCallback(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            setIsScrollView(containerWidth / (REFERENCES_DATA.length * LOGO_WIDTH) < 1)
            setLogosPerView(containerWidth / LOGO_WIDTH);
        }
    }, []);

    useEffect(() => {
        calculateLogosPerView();
        window.addEventListener('resize', calculateLogosPerView);
        return () => window.removeEventListener('resize', calculateLogosPerView);
    }, [calculateLogosPerView]);

    const totalDots = Math.max(1, Math.ceil((REFERENCES_DATA.length / logosPerView)));

    const handleDotClick = useCallback((index: number) => {
        const maxVisibleIndex = Math.ceil(REFERENCES_DATA.length / logosPerView)-1;
        setActiveIndex(index);
        setVisibleLogosIndex(index === maxVisibleIndex ? REFERENCES_DATA.length - logosPerView : index * Math.floor(logosPerView));
    }, [logosPerView]);    


    return (
        <section className={styles.root} id={REFERENCES_SECTION_ID}>
            <div className={styles.title}>
                <Typography className={styles.mainTitle} variant="h2" >
                    {translate('Landing.References.Title')}
                </Typography>
            </div>

            <If condition={REFERENCES_DATA.length > 0 }>
                <div className={styles.rectangleContainer}>
                    <div className={styles.rectangle} ref={containerRef}>
                        <div className={styles.contentWrapper}>
                            <ReferencesContent {...REFERENCES_DATA[selectedIndex]} />
                        </div>
                    </div>
                    <div className={styles.smallRectangle}></div>
                </div>

                {isScrollView ? (
                    <>
                        <div className={styles.logosContainer}>
                            <div
                                className={styles.logos}
                                style={{ transform: `translateX(-${(visibleLogosIndex * (LOGO_WIDTH))}px)` }}
                            >
                                {REFERENCES_DATA.map((ref, index) => (
                                    <div
                                        key={ref.id}
                                        className={`${styles.logo} ${selectedIndex === index ? styles.selected : ''}`}
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        <Image 
                                            src={ref.logo} 
                                            alt={`${ref.id} logo`} 
                                            width={200} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.dotsContainer}>
                            {Array.from({ length: totalDots }).map((_, index) => {
                                const dotKey = `dot-${index}`
                                return(
                                    <div
                                        key={dotKey}
                                        className={`${styles.dot} ${activeIndex === index  ? styles.activeDot : ''}`}
                                        onClick={() => handleDotClick(index)}
                                    ></div>
                                )
                            })}
                        </div>
                    </>
                ) : (
                    <div className={styles.logos}>
                        {REFERENCES_DATA.map((ref, index) => (
                            <div
                                key={ref.id}
                                className={`${styles.logo} ${selectedIndex === index ? styles.selected : ''}`}
                                onClick={() => setSelectedIndex(index)}
                            >
                                <Image 
                                    src={ref.logo}
                                    alt={`${ref.id} logo`}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </If>
        </section>
    );
};

export default ReferencesSection;
