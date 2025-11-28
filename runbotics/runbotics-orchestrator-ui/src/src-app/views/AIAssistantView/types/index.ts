import { DEFAULT_TENANT_ID, FeatureKey } from 'runbotics-common';
import * as yup from 'yup';

export const AIAssistantSchema = yup.object({
    id: yup.string().required('ID is required').min(1, 'ID cannot be empty'),
    name: yup.string().required('Name is required'),
    description: yup.string().required('Description is required'),
    categories: yup
        .array()
        .of(yup.string().required())
        .min(1, 'At least one category is required')
        .required('Categories are required'),
    featureKey: yup
        .mixed<FeatureKey>()
        .oneOf(Object.values(FeatureKey), 'Invalid feature key')
        .required('Feature key is required'),
    url: yup.string().required('URL is required'),
    enabled: yup.boolean().optional().default(true),
    icon: yup.string().optional(),
});

export const AIAssistantsResponseSchema = yup.object({
    success: yup.boolean().required('Success field is required'),
    data: yup.array().of(AIAssistantSchema).required('Data array is required'),
    count: yup
        .number()
        .integer('Count must be an integer')
        .min(0, 'Count must be non-negative')
        .required('Count is required'),
});

export type AIAssistant = yup.InferType<typeof AIAssistantSchema>;
export type AIAssistantsResponse = yup.InferType<
    typeof AIAssistantsResponseSchema
>;

export const AI_ASSISTANT_CONSTANTS = {
    ALL_CATEGORIES_KEY: 'ALL_CATEGORIES',
    DEFAULT_PAGE_SIZE: 16,
    DEFAULT_TENANT_ID: DEFAULT_TENANT_ID,
} as const;
