import z from 'zod';
import { ClickTarget, ImageResourceFormat, Language, MouseButton } from './types';

const coordinateSchema = z.union([z.string(), z.number()]);

export const pointDataSchema = z.object({
    x: coordinateSchema,
    y: coordinateSchema,
});

export const regionDataSchema = z.object({
    left: coordinateSchema,
    top: coordinateSchema,
    width: coordinateSchema,
    height: coordinateSchema
});

export const clickInputSchema = z.object({
    clickTarget: z.nativeEnum(ClickTarget),
    point: z.any().optional(),
    region: z.any().optional(),
    mouseButton: z.nativeEnum(MouseButton),
    doubleClick: z.boolean()
});

export const typeInputSchema = z.object({
    text: z.string()
});

export const typeCredentialsInputSchema = z.object({
    credentialAttribute: z.enum(['username', 'password'])
});

export const performKeyboardShortcutInputSchema = z.object({
    shortcut: z.string()
});

export const copyInputSchema = z.object({
    text: z.string().optional()
});

export const cursorSelectInputSchema = z.object({
    startPoint: z.any(),
    endPoint: z.any()
});

export const takeScreenshotInputSchema = z.object({
    imageName: z.string().optional(),
    imagePath: z.string().optional(),
    imageFormat: z.nativeEnum(ImageResourceFormat),
    region: z.any()
});

export const readTextFromImageInputSchema = z.object({
    imageFullPath: z.string(),
    language: z.nativeEnum(Language)
});
