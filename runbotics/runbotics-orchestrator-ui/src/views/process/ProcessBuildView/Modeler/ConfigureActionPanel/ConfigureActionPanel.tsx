import React, {
    FC, FunctionComponent, useEffect,
} from 'react';
import styled from 'styled-components';
import clsx from 'clsx';
import { Box, Grid } from '@mui/material';
import _ from 'lodash';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import ResizableDrawer from 'src/components/ResizableDrawer';
import { useSelector } from 'src/store';
import { useBpmnFormContext } from 'src/providers/BpmnForm.provider';
import ActionFormRenderer from './ActionFormRenderer';
import ConnectionFormRenderer from './ConnectionFormRenderer';
import internalBpmnActions from './Actions';
import LoopActionRenderer from './Actions/LoopActionRenderer';

const PREFIX = 'ConfigureActionPanel';

const classes = {
    root: `${PREFIX}-root`,
    appBar: `${PREFIX}-appBar`,
    appBarShift: `${PREFIX}-appBarShift`,
    title: `${PREFIX}-title`,
    hide: `${PREFIX}-hide`,
    drawer: `${PREFIX}-drawer`,
    drawerPaper: `${PREFIX}-drawerPaper`,
    drawerButton: `${PREFIX}-drawerButton`,
    drawerOpen: `${PREFIX}-drawerOpen`,
    drawerClose: `${PREFIX}-drawerClose`,
    paperAnchorDockedRight: `${PREFIX}-paperAnchorDockedRight`,
    drawerHeader: `${PREFIX}-drawerHeader`,
    content: `${PREFIX}-content`,
    contentShift: `${PREFIX}-contentShift`,
};

const drawerWidth = 450;

const StyledResizableDrawer = styled(ResizableDrawer)(({ theme }) => ({
    [`& .${classes.root}`]: {
        display: 'flex',
    },

    [`& .${classes.appBar}`]: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },

    [`& .${classes.appBarShift}`]: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
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
        marginLeft: 3,
    },

    [`& .${classes.drawerOpen}`]: {
        width: drawerWidth,
        transition: theme.transitions.create(
            'width',
            { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.enteringScreen },
        ),
    },

    [`& .${classes.drawerClose}`]: {
        overflowX: 'hidden',
        width: '0 !important',
        transition: theme.transitions.create(
            'width',
            { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen },
        ),
    },

    [`& .${classes.paperAnchorDockedRight}`]: {
        border: 'none',
    },

    [`& .${classes.drawerHeader}`]: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        justifyContent: 'flex-start',
    },

    [`& .${classes.content}`]: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
    },

    [`& .${classes.contentShift}`]: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
}));

const StyledPanelBox = styled(Box)`
    position: absolute;
    bottom: 0;
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
`;

const ConfigureActionPanel: FC = () => {
    const { element, setAction, action } = useBpmnFormContext();

    const CustomActionRenderer = new Map<string, FunctionComponent<any>>([['loop.loop', LoopActionRenderer]]);
    const externalBpmnActions = useSelector((state) => state.action.bpmnActions.byId);

    const actionId = element ? element.businessObject.actionId : undefined;

    useEffect(() => {
        if (actionId) {
            const externalAction = _.cloneDeep(externalBpmnActions[element?.businessObject.actionId]);
            setAction(externalAction || internalBpmnActions[element?.businessObject.actionId]);
        } else {
            setAction(null);
        }
    }, [actionId, externalBpmnActions, element?.businessObject.actionId]);
    const CustomRenderer = React.useMemo(() => CustomActionRenderer.get(action?.id), [action?.id]);

    return (
        <StyledResizableDrawer
            variant="permanent"
            anchor="right"
            open={!!element}
            classes={{
                paper: clsx(classes.drawerPaper, {
                    [classes.drawerOpen]: !!element,
                    [classes.drawerClose]: !element,
                }),
                paperAnchorDockedRight: !element && classes.paperAnchorDockedRight,
            }}
        >
            <StyledPanelBox sx={{ ml: '3px' }}>
                {element && (
                    <Grid container>
                        {action && CustomRenderer && (
                            <CustomRenderer />
                        )}
                        {action && !CustomRenderer && (
                            <ActionFormRenderer />
                        )}
                        {!action && (
                            is(element, 'bpmn:SequenceFlow') && (
                                <ConnectionFormRenderer />
                            )
                        )}
                    </Grid>
                )}
            </StyledPanelBox>
        </StyledResizableDrawer>
    );
};

export default ConfigureActionPanel;
