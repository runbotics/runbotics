import { CSSProperties } from 'react';

import { useTheme } from 'styled-components';

const useHighlightTextStyle = (): CSSProperties => {
    const theme = useTheme();

    return {
        color: theme.palette.primary.main,
        background: 'none'
    };
};

export default useHighlightTextStyle;
