import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';

@Module({
    controllers: [ChatbotController],
})
export class ChatbotModule {}
