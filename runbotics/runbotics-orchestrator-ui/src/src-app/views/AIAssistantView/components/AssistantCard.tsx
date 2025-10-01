import React from 'react';

import { Box, Grid, Typography, Stack } from '@mui/material';

import Image from 'next/image';
import { useRouter } from 'next/router';

import chatBotIcon from '#public/images/icons/chat_bot.svg';
import useTranslations from '#src-app/hooks/useTranslations';

import { 
    StyledCard, 
    StyledAvatar, 
    CategoryChip
} from './AssistantCard.styles';
import { AIAssistant, getLocalizedText } from '../types';

interface AssistantCardProps {
    assistant: AIAssistant;
}

export const AssistantCard: React.FC<AssistantCardProps> = ({ 
    assistant
}) => {
    const { currentLanguage } = useTranslations();
    const router = useRouter();
    
    const handleClick = () => {
        router.push(`/app/ai-assistant${assistant.url}`);
    };

    return (
        <Grid item sm={6} lg={3}>
            <StyledCard raised onClick={handleClick}>
                <StyledAvatar>
                    <Image src={chatBotIcon} alt='Chatbot icon' />
                </StyledAvatar>
                <Box>
                    <Box>
                        <Typography variant="h5" mb={0.5}>
                            {getLocalizedText(assistant.name, currentLanguage)}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" fontWeight={400}>
                            {getLocalizedText(assistant.description, currentLanguage)}
                        </Typography>
                    </Box>

                    <Box pt={1}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {assistant.categories.map((cat) => (
                                <CategoryChip key={cat} label={cat} size="small" />
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </StyledCard>
        </Grid>
    );
};
