// https://stackoverflow.com/a/73416240/13234727
import React from 'react';

export type HighlightTextProps = {
    text: string;
    matchingText: string;
    matchClassName?: string;
};

const HighlightText = ({ text, matchingText, matchClassName }: HighlightTextProps) => {
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
