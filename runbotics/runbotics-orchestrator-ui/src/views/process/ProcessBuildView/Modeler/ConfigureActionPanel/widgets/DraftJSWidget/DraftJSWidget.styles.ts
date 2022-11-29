import { useTheme } from '@mui/material';


export const useWrapperStyleObject = () => {
    const theme = useTheme();

    return ({
        margin: 1,
        color: theme.palette.text.primary,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.action.disabled,
    });
};

export const useToolbarStyleObject = () => {
    const theme = useTheme();

    return {
        padding: '0.6rem',
        borderRadius: 5,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.palette.action.disabled,
    };
};

export const useHoverWrapperStyleObject = () => {
    const theme = useTheme();

    return {
        margin: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.action.active,
    };
};

export const useActiveWrapperStyleObject = () => {
    const theme = useTheme();

    return {
        borderWidth: 2,
        borderRadius: 5,
        borderStyle: 'solid',
        borderColor: theme.palette.primary.main,
    };
};

export const useEditorStyleObject = () => ({
    paddingTop: 0,
    paddingRight: '1rem',
    paddingBottom: '1rem',
    paddingLeft: '1rem',
    minHeight: 200,
    borderRadius: 5,
});
