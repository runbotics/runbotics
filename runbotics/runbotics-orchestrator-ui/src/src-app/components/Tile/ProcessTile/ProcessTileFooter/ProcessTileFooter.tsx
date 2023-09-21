import React, { FunctionComponent } from 'react';

import { Typography } from '@mui/material';
import Image from 'next/image';

import PrivateIcon from '#public/images/icons/lock.svg';
import PublicIcon from '#public/images/icons/public.svg';
import ScheduleIcon from '#public/images/icons/scheduled.svg';
import Label from '#src-app/components/Label';
import If from '#src-app/components/utils/If';

import { Footer, IconsWrapper, StyledBox, StyledIconsBox } from './ProcessTileFooter.styles';
import { ProcessTileFooterProps } from './ProcessTileFooter.types';
import ProcessTileActions from '../ProcessTileActions';


const ProcessTileFooter: FunctionComponent<ProcessTileFooterProps> = ({ process }) => (
    <Footer>
        <IconsWrapper>
            {/* <StyledSvg fontSize="small" color="action">
                <QueueIcon />
            </StyledSvg>
            <Typography variant="subtitle2" color="textSecondary">
                {process.executionsCount}
            </Typography>
            <StyledSvg fontSize="small" color="action">
                <CheckIcon />
            </StyledSvg>
            <Typography variant="subtitle2" color="textSecondary">
                {process.successExecutionsCount}
            </Typography>
            <StyledSvg fontSize="small" color="action">
                <ErrorIcon />
            </StyledSvg>
            <Typography variant="subtitle2" color="textSecondary">
                {process.failureExecutionsCount}
            </Typography> */}
            <If
                condition={process.isPublic}
                else={
                    <StyledIconsBox color='grey'>
                        <Image src={PrivateIcon} alt='Private icon'/>
                    </StyledIconsBox>
                }
            >
                <StyledIconsBox color='primary'>
                    <Image src={PublicIcon} alt='Public icon'/>
                </StyledIconsBox>
            </If>
            <If
                condition={process.schedules && process.schedules.length > 0}
            >
                <StyledIconsBox color='success'>
                    <Image src={ScheduleIcon} alt='Calendar icon'/>
                </StyledIconsBox>
            </If>
        </IconsWrapper>
        <StyledBox>
            <Label color='success'>
                Placeholder {/* TODO */}
            </Label>
            <ProcessTileActions process={process} />
        </StyledBox>
    </Footer>
);

export default ProcessTileFooter;
