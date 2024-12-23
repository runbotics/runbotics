import { Injectable } from '@nestjs/common';
import { StatelessActionHandler } from '@runbotics/runbotics-sdk';

import fs from 'fs/promises';
import { AIAction } from 'runbotics-common';
import { AIActionRequest, AIChatActionInput } from './ai.types';
import { ChatPromptTemplate, PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { RunboticsLogger } from '#logger';


@Injectable()
export default class AIActionHandler extends StatelessActionHandler {
    private logger = new RunboticsLogger(AIActionHandler.name);

    constructor() {
        super();
    }

    private async chat(input: AIChatActionInput) {
        const model = new ChatOpenAI({
            temperature: 0,
            model: 'gpt-4o',
            apiKey: '',
        });

        const message = input.imagePath
            ? ChatPromptTemplate.fromMessages([
                ['user', '{userMessage}'],
                ['user', [{
                    type: 'image_url',
                    image_url: 'data:image/jpeg;base64,{imageData}'
                }]]
            ])
            : PromptTemplate.fromTemplate('{userMessage}');

        const llmChain = message.pipe(model);

        const imageData = await fs.readFile(input.imagePath, { encoding: 'base64' });

        return (await llmChain.invoke({
            userMessage: input.userMessage,
            ...(input.imagePath && { imageData })
        })).content;
    }

    run(request: AIActionRequest) {
        // credential here

        switch(request.script) {
            case AIAction.CHAT:
                return this.chat(request.input);
            default:
                throw new Error('Action not found');
        }
    }
}
