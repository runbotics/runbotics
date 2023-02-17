import styled from 'styled-components';

export const PREFIX = 'ActionListPanel';

export const classes = {
    root: `${PREFIX}-root`,
    appBar: `${PREFIX}-appBar`,
    appBarShift: `${PREFIX}-appBarShift`,
    title: `${PREFIX}-title`,
    hide: `${PREFIX}-hide`,
    drawer: `${PREFIX}-drawer`,
    drawerIcon: `${PREFIX}-icon`,
    drawerPaper: `${PREFIX}-drawerPaper`,
    drawerButton: `${PREFIX}-drawerButton`,
    drawerButtonLeft: `${PREFIX}-drawerButtonLeft`,
    drawerHeader: `${PREFIX}-drawerHeader`,
    tabs: `${PREFIX}-tabs`,
    content: `${PREFIX}-content`,
    contentShift: `${PREFIX}-contentShift`,
    nested: `${PREFIX}-nested`,
    hidden: `${PREFIX}-hidden`,
    list: `${PREFIX}-list`,
    highlight: `${PREFIX}-highlight`,
    filterModalAnchor: `${PREFIX}-filterModalAnchor`,
    filterButton: `${PREFIX}-filterButton`,
};

export const drawerWidth = 240;

export const Root = styled.div<{ open: boolean }>(({ theme, open }) => ({
    transition: `margin ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeOut} 0ms`,
    marginRight: open ? '0' : `-${drawerWidth}px`,

    [`& .${classes.appBarShift}`]: {
        width: `calc(100% - ${drawerWidth}px)`,
    },

    [`& .${classes.title}`]: {
        flexGrow: 1,
    },

    [`& .${classes.hide}`]: {
        display: 'none',
    },

    [`& .${classes.drawer}`]: {
        width: drawerWidth,
        flexShrink: 0,
    },

    [`& .${classes.drawerIcon}`]: {
        maxWidth: 'unset',
    },

    [`& .${classes.drawerPaper}`]: {
        top: 'auto',
        width: drawerWidth,
        position: 'relative',
    },

    [`& .${classes.drawerButton}`]: {
        position: 'absolute',
        top: '50%',
        minWidth: 'auto',
        padding: 0,
        zIndex: theme.zIndex.drawer + 1,
        borderRadius: 90,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.grey[300],
        boxShadow: '0 0 1px 0 rgb(0 0 0 / 31%), 0 2px 2px -2px rgb(0 0 0 / 25%)',
    },

    [`& .${classes.drawerButtonLeft}`]: {
        marginLeft: drawerWidth - 20,
    },

    [`& .${classes.drawerHeader}`]: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        justifyContent: 'flex-start',
    },
    [`& .${classes.tabs}`]: {
        marginInline: '8px',
    },
    [`& .${classes.content}`]: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },

    [`& .${classes.nested}`]: {
        paddingLeft: theme.spacing(4),
    },

    [`& .${classes.hidden}`]: {
        display: 'none',
    },

    [`& .${classes.list}`]: {
        overflowY: 'scroll',
        paddingTop: 0,
    },
    [`& .${classes.highlight}`]: {
        background: 'none',
        color: theme.palette.primary.main,
    },
    [`& .${classes.filterModalAnchor}`]: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1),
        gap: theme.spacing(1),
    },
    [`& .${classes.filterButton}`]: {
        width: 'fit-content',
        height: 'fit-content',
    },
}));

export const ActionPanelToggler = styled.div<{ open: boolean }>(({
    theme, open,
}) => `
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    height: 34px;
    width: 34px;
    overflow: hidden;
    z-index: ${theme.zIndex.drawer + 1};
    margin-left: ${open ? drawerWidth : 0}px;
    transform: translateX(-1px);
    transition: ${theme.transitions.create('margin', { duration: theme.transitions.duration.enteringScreen })};

    [class*="MuiIconButton"] {
        position: absolute;
        right: 50%;
        height: ${theme.spacing(2)};
        width: ${theme.spacing(2)};
        
        border-radius: 50%;
        border: 1px solid ${theme.palette.grey[400]};
        padding: ${theme.spacing(2)};
        background: ${theme.palette.background.default};

        &:hover {
            opacity: 1;
            background: ${theme.palette.primary.main};

            [class*="MuiSvgIcon"] {
                fill: ${theme.palette.common.white};
            }
        }

        &::before {
            display: block;
            position: absolute;
            top: 0;
            bottom: 0;
            background: ${theme.palette.background.default};
            content: "";
        }

        [class*="MuiSvgIcon"] {
            margin-right: -12px;
            transform: rotate(${open ? '180deg' : 0});
        }
    }
`);
