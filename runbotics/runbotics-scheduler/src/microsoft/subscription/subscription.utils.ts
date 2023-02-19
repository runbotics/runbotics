export const NOTIFICATION_URL = '/scheduler/notifications';

export const EMAIL_NOTIFICATION_URL_PATH = {
    FULL: `${NOTIFICATION_URL}/email`,
    SINGLETON: '/email',
    FULL_LIFECYCLE: `${NOTIFICATION_URL}/email/lifecycle`,
    LIFECYCLE: '/email/lifecycle'
} as const;

export const EMAIL_NOTIFICATION_CLIENT_STATE = 'RunBoticsEmailNotification';
