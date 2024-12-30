import { DesktopRunRequest } from '@runbotics/runbotics-sdk';
import { AIAction } from 'runbotics-common';
import { z } from 'zod';

export const chatInputSchema = z.object({
    userMessage: z.string(),
    imagePath: z.string().optional(),
});

export type AIChatActionInput = z.infer<typeof chatInputSchema>;

export type AIActionRequest = DesktopRunRequest<AIAction.CHAT, AIChatActionInput>;

export interface AiCredentials {
    apiKey: string;
}
