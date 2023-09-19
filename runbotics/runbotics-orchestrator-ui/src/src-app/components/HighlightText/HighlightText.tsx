import React, { VFC } from 'react';

export interface HighlightTextProps {
    text: string;
    matchingText: string;
    matchClassName?: string;
    matchStyle?: React.CSSProperties;
}

const HighlightText: VFC<HighlightTextProps> = ({ text, matchingText, matchClassName, matchStyle }) => {
    if (!matchingText) matchingText = '\0';

    const matchRegex = RegExp(matchingText, 'ig');
    const matches = React.useMemo(() => [...text.matchAll(matchRegex)], [text, matchRegex]);

    return (
        <>
            {text.split(matchRegex).map((nonBoldText, index, arr) => (
                <React.Fragment key={nonBoldText}>
                    {nonBoldText}
                    {index + 1 !== arr.length && <mark className={matchClassName} style={matchStyle} >{matches[index]}</mark>}
                </React.Fragment>
            ))}
        </>
    );
};

export default HighlightText;
