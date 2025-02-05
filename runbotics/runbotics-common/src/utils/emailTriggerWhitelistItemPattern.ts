const EMAIL_PATTERN =
    /[a-zA-Z0-9.!#$%&*+\/=?^_{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const DOMAIN_PATTERN = /[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export const EMAIL_TRIGGER_WHITELIST_PATTERN = new RegExp(
    `^(?:${EMAIL_PATTERN.source}|${DOMAIN_PATTERN.source})$`
);
