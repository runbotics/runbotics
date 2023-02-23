import { SubscriptionValidation } from './subscription.types';

export const NOTIFICATION_URL = '/scheduler/notifications';

export const EMAIL_NOTIFICATION_URL_PATH = {
    FULL: `${NOTIFICATION_URL}/email`,
    MAIN: '/email',
    FULL_LIFECYCLE: `${NOTIFICATION_URL}/email/lifecycle`,
    LIFECYCLE: '/email/lifecycle'
} as const;

export const EMAIL_NOTIFICATION_CLIENT_STATE = 'RunBoticsEmailNotification';

export const initialSubscriptionsValidation: SubscriptionValidation = {
    validEmailSubscriptions: [],
    invalidSubscriptions: [],
};
