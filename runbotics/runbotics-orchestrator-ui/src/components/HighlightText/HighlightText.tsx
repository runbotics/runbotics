import React, { VFC } from 'react';

export interface HighlightTextProps {
    text: string;
    matchingText: string;
    matchClassName?: string;
}

const HighlightText: VFC<HighlightTextProps> = ({ text, matchingText, matchClassName }) => {
    const matchRegex = RegExp(matchingText, 'ig');
    const matches = React.useMemo(() => [...text.matchAll(matchRegex)], [text, matchRegex]);

    return (
        <>
            {text.split(matchRegex).map((nonBoldText, index, arr) => (
                <React.Fragment key={index}>
                    {nonBoldText}
                    {index + 1 !== arr.length && <mark className={matchClassName}>{matches[index]}</mark>}
                </React.Fragment>
            ))}
        </>
    );
};

export default HighlightText;
