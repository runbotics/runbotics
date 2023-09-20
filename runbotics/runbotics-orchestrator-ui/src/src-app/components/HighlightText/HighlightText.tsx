import React, { VFC, CSSProperties } from 'react';

import { useTheme } from 'styled-components';

export interface HighlightTextProps {
    text: string;
    matchingText: string;
    matchClassName?: string;
    matchStyle?: CSSProperties;
}

const HighlightText: VFC<HighlightTextProps> = ({ text, matchingText, matchClassName, matchStyle }) => {
    const theme = useTheme();

    const highlightDefaultStyles: CSSProperties =  {
        color: theme.palette.primary.main,
        background: 'none'
    };

    if (!matchingText) matchingText = '\0';

    const matchRegex = RegExp(matchingText, 'ig');
    const matches = React.useMemo(() => [...text.matchAll(matchRegex)], [text, matchRegex]);

    return (
        <>
            {text.split(matchRegex).map((nonBoldText, index, arr) => (
                <React.Fragment key={nonBoldText}>
                    {nonBoldText}
                    {index + 1 !== arr.length &&
                        <mark className={matchClassName} style={matchStyle ?? highlightDefaultStyles} >{matches[index]}</mark>
                    }
                </React.Fragment>
            ))}
        </>
    );
};

export default HighlightText;
