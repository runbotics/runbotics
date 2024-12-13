import { Test } from '@nestjs/testing';
import GeneralActionHandler from './general.action-handler';
import { RuntimeService } from '../../core/bpm/runtime';
import { StorageService } from '#config';

describe ('GeneralActionHandler', () => {
    let generalActionHandler: GeneralActionHandler;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                GeneralActionHandler,
                {
                    provide: RuntimeService,
                    useValue: {}
                },
                {
                    provide: StorageService,
                    useValue: {}
                },
            ],
        }).compile();
        generalActionHandler = module.get(GeneralActionHandler);
    });

    describe('Throw error', () => {
        it('Throw error without message', async () => {
            await expect(generalActionHandler.throwError({})).rejects.toThrowError();
        });

        it('Throw error with given message', async () => {
            const message = 'Custom error message provided by user!';
            await expect(generalActionHandler.throwError({
                message
            })).rejects.toThrowError(message);
        });
    });
});
