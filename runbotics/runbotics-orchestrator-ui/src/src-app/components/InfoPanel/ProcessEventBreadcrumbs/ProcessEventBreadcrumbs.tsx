import React from 'react';

import { Breadcrumbs, Chip } from '@mui/material';

import useTranslations, {
    checkIfKeyExists,
} from '#src-app/hooks/useTranslations';
import { useDispatch, useSelector } from '#src-app/store';

import {
    Breadcrumb,
    EventMapTypes,
    processInstanceEventActions,
} from '#src-app/store/slices/ProcessInstanceEvent';

const ProcessEventBreadcrumbs = () => {
    const dispatch = useDispatch();
    const { translate } = useTranslations();
    const { eventsBreadcrumbTrail } = useSelector(
        (state) => state.processInstanceEvent.all
    );

    const getBreadcrumbLabel = (breadcrumb: Breadcrumb) => {
        if (!checkIfKeyExists(breadcrumb.labelKey)) return breadcrumb.labelKey;
        if (breadcrumb.type === EventMapTypes.Iteration) {
            return `${translate(breadcrumb.labelKey)} ${
                breadcrumb.iterationNumber
            }`;
        }
        return translate(breadcrumb.labelKey);
    };

    const hasNestedEvents = eventsBreadcrumbTrail.length > 1;

    return (
        <Breadcrumbs aria-label="breadcrumb" maxItems={3}>
            {hasNestedEvents && eventsBreadcrumbTrail.map((breadcrumb) => (
                <Chip
                    key={breadcrumb.id}
                    onClick={() => {
                        dispatch(
                            processInstanceEventActions.reduceCrumbs(
                                breadcrumb.id
                            )
                        );
                    }}
                    label={getBreadcrumbLabel(breadcrumb)}
                    size="small"
                    sx={{ marginY: (theme) => theme.spacing(0.5) }}
                />
            ))}
        </Breadcrumbs>
    );
};

export default ProcessEventBreadcrumbs;
