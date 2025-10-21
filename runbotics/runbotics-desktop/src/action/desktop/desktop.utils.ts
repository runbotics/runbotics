import z from 'zod';
import { ClickTarget, CredentialAttribute, ImageResourceFormat, Language, MouseButton } from './types';
import path from 'path';
import { tmpdir } from 'os';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { RunboticsLogger } from '#logger';


const coordinateSchema = z.union([z.string(), z.number()]);

export const pointDataSchema = z.object({
    x: coordinateSchema,
    y: coordinateSchema
});

export const regionDataSchema = z.object({
    left: coordinateSchema,
    top: coordinateSchema,
    width: coordinateSchema,
    height: coordinateSchema
});

export const clickInputSchema = z.object({
    clickTarget: z.nativeEnum(ClickTarget),
    point: z.union([
        pointDataSchema,
        z.string()
    ]).optional(),
    region: z.union([
        regionDataSchema,
        z.string()
    ]).optional(),
    mouseButton: z.nativeEnum(MouseButton),
    doubleClick: z.boolean()
});

export const typeInputSchema = z.object({
    text: z.string()
});

export const typeCredentialsInputSchema = z.object({
    credentialAttribute: z.nativeEnum(CredentialAttribute)
});

export const performKeyboardShortcutInputSchema = z.object({
    shortcut: z.string()
});

export const copyInputSchema = z.object({
    text: z.string().optional()
});

export const cursorSelectInputSchema = z.object({
    startPoint: z.union([
        pointDataSchema,
        z.string()
    ]),
    endPoint: z.union([
        pointDataSchema,
        z.string()
    ])
});

export const takeScreenshotInputSchema = z.object({
    imageName: z.string().optional(),
    imagePath: z.string().optional(),
    imageFormat: z.nativeEnum(ImageResourceFormat),
    region: z.union([
        regionDataSchema,
        z.string()
    ]).optional()
});

export const readTextFromImageInputSchema = z.object({
    imageFullPath: z.string(),
    language: z.nativeEnum(Language)
});

export async function preprocessImage(imagePath: string, logger: RunboticsLogger): Promise<string> {
    const tempProcessedPath = path.join(tmpdir(), `processed_${uuidv4()}.png`);

    try {
        const image = sharp(imagePath);
        const metadata = await image.metadata();
        const originalWidth = metadata.width ?? 0;
        const originalHeight = metadata.height ?? 0;

        if (!originalWidth || !originalHeight) {
            logger.error(`Image metadata missing width/height for ${imagePath}. Skipping preprocessing.`);
            return imagePath;
        }

        const scale = 1;
        const scaledWidth = Math.round(originalWidth * scale);
        const scaledHeight = Math.round(originalHeight * scale);

        const processedBuffer = await image
            .greyscale()
            .resize({
                width: scaledWidth,
                height: scaledHeight,
                kernel: sharp.kernel.lanczos3,
            })
            .normalize()
            .raw()
            .toBuffer();

        const pixels = new Uint8ClampedArray(processedBuffer);

        const threshold = 120;
        const minHorizontalLineLength = Math.floor(scaledWidth * 0.02);
        const minVerticalLineLength = Math.floor(scaledHeight * 0.02);
        const lineThickness = 10;
        const lineDetectionTolerance = 20;

        logger.log(
            `Preprocessing: ${scaledWidth}x${scaledHeight}, minH: ${minHorizontalLineLength}, minV: ${minVerticalLineLength}`
        );

        let verticalLinesRemoved = 0;
        
        for (let x = 0; x < scaledWidth; x++) {
            for (let startY = 0; startY < scaledHeight; startY++) {
                let consecutiveDarkPixels = 0;
                const lineStart = startY;

                for (let y = startY; y < scaledHeight; y++) {
                    const idx = y * scaledWidth + x;
                    const pixelValue = pixels[idx];

                    if (pixelValue < threshold) {
                        consecutiveDarkPixels++;
                    } else {
                        break;
                    }
                }
                
                if (consecutiveDarkPixels >= minVerticalLineLength) {
                    let darkNeighborColumns = 0;
                    for (let dx = -3; dx <= 3; dx++) {
                        if (dx === 0) continue;
                        const checkX = x + dx;
                        if (checkX >= 0 && checkX < scaledWidth) {
                            let darkPixelsInColumn = 0;
                            for (
                                let checkY = lineStart;
                                checkY < lineStart + consecutiveDarkPixels;
                                checkY++
                            ) {
                                const checkIdx = checkY * scaledWidth + checkX;
                                if (
                                    pixels[checkIdx] <
                                    threshold + lineDetectionTolerance
                                ) {
                                    darkPixelsInColumn++;
                                }
                            }
                            if (
                                darkPixelsInColumn >
                                consecutiveDarkPixels * 0.3
                            ) {
                                darkNeighborColumns++;
                            }
                        }
                    }
                    
                    if (darkNeighborColumns >= 3) {
                        verticalLinesRemoved++;

                        for (
                            let dx = -lineThickness;
                            dx <= lineThickness;
                            dx++
                        ) {
                            const clearX = x + dx;
                            if (clearX >= 0 && clearX < scaledWidth) {
                                for (
                                    let clearY = Math.max(0, lineStart - 2);
                                    clearY <
                                    Math.min(
                                        scaledHeight,
                                        lineStart + consecutiveDarkPixels + 2
                                    );
                                    clearY++
                                ) {
                                    const clearIdx =
                                    clearY * scaledWidth + clearX;
                                    pixels[clearIdx] = 255;
                                }
                            }
                        }
                    }
                }
                
                startY += Math.max(1, consecutiveDarkPixels);
            }
        }
        
        let horizontalLinesRemoved = 0;
        for (let y = 0; y < scaledHeight; y++) {
            let lineStart = -1;
            let consecutiveDarkPixels = 0;

            for (let x = 0; x < scaledWidth; x++) {
                const idx = y * scaledWidth + x;
                const pixelValue = pixels[idx];

                if (pixelValue < threshold) {
                    if (lineStart === -1) {
                        lineStart = x;
                    }
                    consecutiveDarkPixels++;
                } else {
                    if (consecutiveDarkPixels >= minHorizontalLineLength) {
                        let isReallyLine = true;

                        for (let dy = -2; dy <= 2; dy++) {
                            const checkY = y + dy;
                            if (checkY >= 0 && checkY < scaledHeight) {
                                let darkPixelsInRow = 0;
                                for (
                                    let checkX = lineStart;
                                    checkX < lineStart + consecutiveDarkPixels;
                                    checkX++
                                ) {
                                    const checkIdx =
                                        checkY * scaledWidth + checkX;
                                    if (
                                        pixels[checkIdx] <
                                        threshold + lineDetectionTolerance
                                    ) {
                                        darkPixelsInRow++;
                                    }
                                }
                                if (
                                    darkPixelsInRow <
                                    consecutiveDarkPixels * 0.3
                                ) {
                                    isReallyLine = false;
                                    break;
                                }
                            }
                        }

                        if (isReallyLine) {
                            horizontalLinesRemoved++;
                            for (
                                let dy = -lineThickness;
                                dy <= lineThickness;
                                dy++
                            ) {
                                const clearY = y + dy;
                                if (clearY >= 0 && clearY < scaledHeight) {
                                    for (
                                        let clearX = Math.max(0, lineStart - 2);
                                        clearX <
                                        Math.min(
                                            scaledWidth,
                                            lineStart +
                                                consecutiveDarkPixels +
                                                2
                                        );
                                        clearX++
                                    ) {
                                        const clearIdx =
                                            clearY * scaledWidth + clearX;
                                        pixels[clearIdx] = 255;
                                    }
                                }
                            }
                        }
                    }

                    lineStart = -1;
                    consecutiveDarkPixels = 0;
                }
            }
        }

        logger.debug(
            `Lines removed - horizontal: ${horizontalLinesRemoved}, vertical: ${verticalLinesRemoved}`
        );

        const rawBuffer = Buffer.from(new Uint8Array(pixels));
        const newImage = sharp(rawBuffer, {
            raw: {
                width: scaledWidth,
                height: scaledHeight,
                channels: 1,
            },
        })
            .sharpen({ sigma: 1 })
            .normalise()
            .erode(1)
            .dilate(1)
            .median(2)
            .threshold(180)
            .withMetadata({ density: 550 });
        
        await newImage
            // .resize({
            //     width: originalWidth,
            //     height: originalHeight,
            //     kernel: sharp.kernel.lanczos3,
            // })
            .png({
                quality: 100,
                compressionLevel: 0,
            })

            .toFile(tempProcessedPath);

        logger.log(
            `Image preprocessed successfully: ${tempProcessedPath}`
        );
        return tempProcessedPath;
    } catch (error) {
        logger.error('Error during image preprocessing:', error);
        return imagePath;
    }
}
