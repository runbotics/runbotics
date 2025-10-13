import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MailService } from './mail.service';
import { Logger } from '#/utils/logger';
import { DefaultCollections, ProcessInstanceStatus } from 'runbotics-common';
import { CredentialOperationType } from '#/scheduler-database/credential/credential.utils';
import { User } from '#/scheduler-database/user/user.entity';
import { BotEntity } from '#/scheduler-database/bot/bot.entity';

vi.mock('@nestjs-modules/mailer');
vi.mock('#/scheduler-database/bot/bot.service');
vi.mock('#/scheduler-database/process/process.service');
vi.mock('#/scheduler-database/notification-process/notification-process.service');
vi.mock('#/scheduler-database/notification-bot/notification-bot.service');
vi.mock('#/config/server-config');
vi.mock('./I18n.service');
vi.mock('#/utils/logger');
vi.mock('#/utils/authority.utils', () => ({
    hasRole: vi.fn().mockReturnValue(true),
}));

describe('MailService - Language Tests', () => {
    let service: MailService;
    let mocks: any;

    const createMocks = () => ({
        mailerService: { sendMail: vi.fn().mockResolvedValue(undefined) },
        botService: { findById: vi.fn() },
        processService: { findById: vi.fn() },
        notificationProcessService: { getAllByProcessId: vi.fn() },
        notificationBotService: { getAllByBotId: vi.fn() },
        serverConfigService: { entrypointUrl: 'https://example.com' },
        i18nService: { translate: vi.fn().mockImplementation((key, lang) => `${key}_${lang}`) },
        dataSource: {
            createQueryBuilder: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnThis(),
                from: vi.fn().mockReturnThis(),
                where: vi.fn().mockReturnThis(),
                getOne: vi.fn(),
            }),
        },
    });

    const mockUserLanguage = (langKey: string | null) => {
        mocks.dataSource.createQueryBuilder().getOne.mockResolvedValue(
            langKey ? { langKey } : null
        );
    };

    const createTestBot = () => ({
        id: 1,
        user: { email: 'bot@example.com' },
        collection: { name: DefaultCollections.PUBLIC, users: [] },
    });

    const createTestProcess = () => ({
        id: 1,
        isPublic: true,
        createdBy: { email: 'user@example.com' },
    });

    beforeEach(() => {
        mocks = createMocks();
        process.env.MAIL_USERNAME = 'test@example.com';

        service = new MailService(
            mocks.mailerService,
            mocks.botService,
            mocks.processService,
            mocks.notificationProcessService,
            mocks.notificationBotService,
            mocks.serverConfigService,
            mocks.i18nService,
            mocks.dataSource,
        );
    });

    describe('Language selection in bot disconnection notifications', () => {
        const setupBotDisconnectionTest = async (langKey: string | null) => {
            const bot = { id: 1 } as BotEntity;
            const disconnectedBot = createTestBot();
            
            mocks.botService.findById.mockResolvedValue(disconnectedBot);
            mocks.notificationBotService.getAllByBotId.mockResolvedValue([]);
            mockUserLanguage(langKey);

            await service.sendBotDisconnectionNotificationMail(bot, 'installation123');
            return langKey || 'en';
        };

        it.each([
            ['Polish', 'pl'],
            ['English', 'en'],
            ['English (fallback)', null],
        ])('should use %s language when user has langKey "%s"', async (_, langKey) => {
            const expectedLang = await setupBotDisconnectionTest(langKey);
            
            expect(mocks.i18nService.translate).toHaveBeenCalledWith('mail.botDisconnection.subject', expectedLang);
            expect(mocks.i18nService.translate).toHaveBeenCalledWith('mail.botDisconnection.greeting', expectedLang);
        });
    });

    describe('Language selection in process failure notifications', () => {
        const setupProcessFailureTest = () => {
            const process = { id: 1, name: 'Test Process' };
            const processInstance = { id: '1', status: ProcessInstanceStatus.ERRORED };
            const failedProcess = createTestProcess();

            mocks.processService.findById.mockResolvedValue(failedProcess);
            return { process, processInstance };
        };

        it('should use Polish language for process creator', async () => {
            const { process, processInstance } = setupProcessFailureTest();
            mocks.notificationProcessService.getAllByProcessId.mockResolvedValue([]);
            mockUserLanguage('pl');

            await service.sendProcessFailureNotificationMail(process, processInstance);

            expect(mocks.i18nService.translate).toHaveBeenCalledWith('mail.processFailure.subject', 'pl');
            expect(mocks.i18nService.translate).toHaveBeenCalledWith('mail.processFailure.greeting', 'pl');
            expect(mocks.i18nService.translate).toHaveBeenCalledWith('mail.processFailure.processFailedMessage', 'pl', {
                processName: 'Test Process',
                processId: '1',
                status: ProcessInstanceStatus.ERRORED
            });
        });

        it('should use different languages for different subscribers', async () => {
            const { process, processInstance } = setupProcessFailureTest();
            const subscriptions = [
                { customEmail: 'subscriber1@example.com', user: null },
                { customEmail: 'subscriber2@example.com', user: null },
            ];

            mocks.notificationProcessService.getAllByProcessId.mockResolvedValue(subscriptions);
            mocks.dataSource.createQueryBuilder().getOne
                .mockResolvedValueOnce({ langKey: 'pl' })
                .mockResolvedValueOnce({ langKey: 'en' })
                .mockResolvedValueOnce({ langKey: 'pl' });

            await service.sendProcessFailureNotificationMail(process, processInstance);

            expect(mocks.i18nService.translate).toHaveBeenCalledWith('mail.processFailure.subject', 'pl');
            expect(mocks.i18nService.translate).toHaveBeenCalledWith('mail.processFailure.subject', 'en');
            expect(mocks.mailerService.sendMail).toHaveBeenCalledTimes(3);
        });
    });

    describe('Language selection in credential change notifications', () => {
        it('should use correct language from getUserLanguage', async () => {
            const params = {
                editorEmail: 'editor@example.com',
                collectionCreatorEmail: 'creator@example.com',
                collectionName: 'Test Collection',
                credentialName: 'Test Credential',
                operationType: CredentialOperationType.EDIT as CredentialOperationType.EDIT,
            };

            mockUserLanguage('pl');
            await service.sendCredentialChangeNotificationMail(params);

            expect(mocks.i18nService.translate).toHaveBeenCalledWith('mail.credentialChange.subject', 'pl');
        });
    });

    describe('Language selection in user activation mails', () => {
        it.each([
            ['decline reason', 'pl', (user: User, data: any) => service.sendUserDeclineReasonMail(user, data)],
            ['accept', 'en', (user: User, data: any) => service.sendUserAcceptMail(user, data)],
        ])('should use correct language for %s mail', async (mailType, langKey, mailMethod) => {
            const user = { email: 'user@example.com', langKey } as User;
            const data = mailType === 'decline reason' ? { declineReason: 'Application rejected' } : 'Welcome message';

            await mailMethod(user, data);

            expect(mocks.i18nService.translate).toHaveBeenCalledWith('mail.userActivation.subject', langKey);
        });

        it('should fallback to English when user has no langKey', async () => {
            const user = { email: 'user@example.com' } as User;
            await service.sendUserDeclineReasonMail(user, { declineReason: 'Test' });

            expect(mocks.i18nService.translate).toHaveBeenCalledWith('mail.userActivation.subject', 'en');
        });
    });

    describe('Other notification types', () => {
        it.each([
            ['process summary', () => service.sendProcessSummaryNotification(
                [{ name: 'Process 1', stats: { totalExecutions: 6, successfulExecutions: 5, failedExecutions: 1, averageDuration: 1500, totalDuration: 9000, fromDate: '2025-10-01', toDate: '2025-10-10' } }],
                'https://example.com/unsubscribe',
                ['user1@example.com', 'user2@example.com']
            ), 'mail.processSummary.subject'],
            ['subscription expiration', () => service.sendSubscriptionExpirationNotification(
                { email: 'user@example.com', langKey: 'pl' } as User,
                7,
                'https://example.com'
            ), 'mail.subscriptionExpiration.subject'],
        ])('should use correct language for %s notifications', async (_, method, expectedKey) => {
            mockUserLanguage('pl');
            
            await method();

            expect(mocks.i18nService.translate).toHaveBeenCalledWith(expectedKey, 'pl');
        });
    });
});