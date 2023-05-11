import { PostStatus } from '#contentful/common';

export const DRAFT_BADGE_BACKGROUND_COLOR = '#FFC107';

export const checkIsDraft = (status: PostStatus): boolean => !status.publishedAt;
