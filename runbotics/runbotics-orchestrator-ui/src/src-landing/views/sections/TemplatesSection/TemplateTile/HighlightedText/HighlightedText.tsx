import React, { FC, useMemo} from 'react';

import { replaceRegExpUnallowedChars, createPattern } from './HighlightedText.utils';

interface HighlightTextProps {
    textSource: string;
    styleClass: string;
    highlight: string;
};

const HighlightedText:FC<HighlightTextProps> = ({
    textSource,
    styleClass,
    highlight,
}) => {
    const textToHighlight = replaceRegExpUnallowedChars(highlight);
    const highlightPattern = createPattern(textToHighlight);
    const highlightOccurences = useMemo(() => [...textSource.matchAll(highlightPattern)], [textSource, highlightPattern]);
    
    return (
        <>
            {
                textSource.split(highlightPattern).map((normalText, index, currArr) => (
                    <>
                        <span key={normalText}>
                            {currArr[index]}
                        </span>
                        <span className={styleClass} key={`${normalText}-highlighted`}>
                            {highlightOccurences[index]}
                        </span>
                    </> 
                ))
            }
        </>
    );
    
};

export default HighlightedText;
