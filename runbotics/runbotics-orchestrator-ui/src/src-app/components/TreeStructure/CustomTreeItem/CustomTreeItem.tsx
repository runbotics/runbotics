import { forwardRef } from 'react';

import { Box, Tooltip } from '@mui/material';

import { tooltipOptionsWithoutOffset } from '#src-app/components/TooltipIcon/TooltipIcon';

import { StyledCollectionName, StyledTreeItemRoot } from './CustomTreeItem.styles';
import { CustomTreeItemProps } from './CustomTreeItem.types';

const CustomTreeItem = forwardRef(function StyledTreeItem(
    props: CustomTreeItemProps,
    ref: React.Ref<HTMLLIElement>
) {
    const { labelIcon: LabelIcon, labelText, ...other } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 0.5,
                        pr: 0
                    }}
                >
                    <Tooltip title={labelText} slotProps={tooltipOptionsWithoutOffset}>
                        <StyledCollectionName
                            variant="body2"
                        >
                            {labelText}
                        </StyledCollectionName>
                    </Tooltip>
                    <Box
                        sx={{
                            flexShrink: 0,
                            color: 'inherit',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {LabelIcon}
                    </Box>
                </Box>
            }
            {...other}
            ref={ref}
        />
    );
});

export default CustomTreeItem;
