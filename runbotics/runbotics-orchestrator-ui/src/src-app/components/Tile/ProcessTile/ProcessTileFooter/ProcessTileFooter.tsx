import React, { FunctionComponent } from 'react';

import { Tooltip } from '@mui/material';
import Image from 'next/image';

import PrivateIcon from '#public/images/icons/lock.svg';
import PublicIcon from '#public/images/icons/public.svg';
import ScheduleIcon from '#public/images/icons/scheduled.svg';

import Label from '#src-app/components/Label';
import If from '#src-app/components/utils/If';
import useTranslations from '#src-app/hooks/useTranslations';
import { getProcessInstanceStatusColor } from '#src-app/utils/getProcessInstanceStatusColor';
import { capitalizeFirstLetter } from '#src-app/utils/text';

import { Footer, IconsWrapper, StyledBox, StyledIconsBox } from './ProcessTileFooter.styles';
import { ProcessTileFooterProps } from './ProcessTileFooter.types';
import ProcessTileActions from '../ProcessTileActions';

const ProcessTileFooter: FunctionComponent<ProcessTileFooterProps> = ({ process, processInstance, isJobWaiting, isJobCreating }) => {
    const { translate } = useTranslations();
    const formattedStatus = processInstance && capitalizeFirstLetter({
        text: processInstance.status,
        lowerCaseRest: true,
        delimiter: /_| /
    });

    return (
        <Footer>
            <IconsWrapper>
                <If
                    condition={process.isPublic}
                    else={
                        <Tooltip title={translate('Component.Tile.Process.Footer.Icon.Tooltip.Private')}>
                            <StyledIconsBox $bgcolor='grey'>
                                <Image src={PrivateIcon} alt='Private icon'/>
                            </StyledIconsBox>
                        </Tooltip>
                    }
                >
                    <Tooltip title={translate('Component.Tile.Process.Footer.Icon.Tooltip.Public')}>
                        <StyledIconsBox $bgcolor='primary'>
                            <Image src={PublicIcon} alt='Public icon'/>
                        </StyledIconsBox>
                    </Tooltip>
                </If>
                <If
                    condition={process.schedules && process.schedules.length > 0}
                >
                    <Tooltip title={translate('Component.Tile.Process.Footer.Icon.Tooltip.Scheduled')}>
                        <StyledIconsBox $bgcolor='success'>
                            <Image src={ScheduleIcon} alt='Calendar icon'/>
                        </StyledIconsBox>
                    </Tooltip>
                </If>
            </IconsWrapper>
            <StyledBox>
                <If
                    condition={isJobWaiting || isJobCreating}
                    else={
                        processInstance &&
                            <Label
                                color={getProcessInstanceStatusColor(processInstance.status)}
                            >
                                {/*@ts-ignore*/}
                                {translate(`Process.Instance.Status.${formattedStatus}`)}
                            </Label>
                    }
                >
                    <If condition={isJobWaiting}>
                        <Label color='warning'>
                            {translate('Process.Instance.Status.Queued')}
                        </Label>
                    </If>
                    <If condition={isJobCreating}>
                        <Label color='warning'>
                            {translate('Process.Instance.Status.Creating')}
                        </Label>
                    </If>
                </If>
                <ProcessTileActions process={process} />
            </StyledBox>
        </Footer>
    );
};

export default ProcessTileFooter;
