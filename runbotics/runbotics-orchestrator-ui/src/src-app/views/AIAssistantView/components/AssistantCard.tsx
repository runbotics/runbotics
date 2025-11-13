import React from 'react';

import { Box, Grid, Typography, Stack } from '@mui/material';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { useSnackbar } from 'notistack';

import chatBotIcon from '#public/images/icons/chat_bot.svg';
import { hasFeatureKeyAccess } from '#src-app/components/utils/Secured';
import useAuth from '#src-app/hooks/useAuth';
import { translate } from '#src-app/hooks/useTranslations';

import { StyledCard, StyledAvatar, CategoryChip } from './AssistantCard.styles';
import { AIAssistant } from '../types';

interface AssistantCardProps {
    assistant: AIAssistant;
}

export const AssistantCard: React.FC<AssistantCardProps> = ({ assistant }) => {
    const router = useRouter();
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = () => {
        if (!hasFeatureKeyAccess(user, [assistant.featureKey])) {
            enqueueSnackbar(translate('AIAssistant.Error.NoAccess'), {
                variant: 'error',
                autoHideDuration: 5000,
            });
            return;
        }
        router.push(`/app/ai-assistants${assistant.url}`);
    };

    return (
        <Grid item sm={6} lg={3}>
            <StyledCard raised onClick={handleClick}>
                <StyledAvatar>
                    <Image src={chatBotIcon} alt="Chatbot icon" />
                </StyledAvatar>
                <Box>
                    <Box>
                        <Typography variant="h5" mb={0.5}>
                            {assistant.name}
                        </Typography>
                        <Typography
                            variant="h6"
                            color="textSecondary"
                            fontWeight={400}
                        >
                            {assistant.description}
                        </Typography>
                    </Box>

                    <Box pt={1}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {assistant.categories.map((category) => (
                                <CategoryChip
                                    key={category}
                                    label={category}
                                    size="small"
                                />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </StyledCard>
        </Grid>
    );
};
