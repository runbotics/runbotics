import z from 'zod';
import {
    BboxCordinates,
    ClickTarget,
    CredentialAttribute,
    DirectionOfSearching,
    ImageResourceFormat,
    Language,
    MouseButton,
    ParsedOCRLine,
    ParsedOCRPage,
    ParsedOCRResult,
    ParsedOCRWord,
    RawHOCRResult,
    SearchingAreaData,
} from './types';
import path from 'path';
import { tmpdir } from 'os';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { RunboticsLogger } from '#logger';
import parse, { HTMLElement } from 'node-html-parser';
import levenshtein from 'js-levenshtein';

const coordinateSchema = z.union([z.string(), z.number()]);

export const pointDataSchema = z.object({
    x: coordinateSchema,
    y: coordinateSchema,
});

export const regionDataSchema = z.object({
    left: coordinateSchema,
    top: coordinateSchema,
    width: coordinateSchema,
    height: coordinateSchema,
});

export const clickInputSchema = z.object({
    clickTarget: z.nativeEnum(ClickTarget),
    point: z.union([pointDataSchema, z.string()]).optional(),
    region: z.union([regionDataSchema, z.string()]).optional(),
    mouseButton: z.nativeEnum(MouseButton),
    doubleClick: z.boolean(),
});

export const typeInputSchema = z.object({
    text: z.string(),
});

export const typeCredentialsInputSchema = z.object({
    credentialAttribute: z.nativeEnum(CredentialAttribute),
});

export const performKeyboardShortcutInputSchema = z.object({
    shortcut: z.string(),
});

export const copyInputSchema = z.object({
    text: z.string().optional(),
});

export const cursorSelectInputSchema = z.object({
    startPoint: z.union([pointDataSchema, z.string()]),
    endPoint: z.union([pointDataSchema, z.string()]),
});

export const takeScreenshotInputSchema = z.object({
    imageName: z.string().optional(),
    imagePath: z.string().optional(),
    imageFormat: z.nativeEnum(ImageResourceFormat),
    region: z.union([regionDataSchema, z.string()]).optional(),
});

export const readTextFromImageInputSchema = z.object({
    imageFullPath: z.string().refine(
        (path) => {
            const ext = path.toLowerCase().match(/\.(png|jpeg|jpg)$/);
            return ext !== null;
        },
        {
            message: 'Image file must have .png, .jpeg, or .jpg extension',
        }
    ),
    language: z.nativeEnum(Language),
});

export const readTextFromPdfInputSchema = z.object({
    imageFullPath: z.string().refine(
        (path) => {
            const ext = path.toLowerCase().match(/\.(pdf)$/);
            return ext !== null;
        },
        {
            message: 'Path must point to a .pdf file',
        }
    ),
    language: z.nativeEnum(Language),
});

export async function preprocessImage(
    imagePath: string,
    logger: RunboticsLogger
): Promise<string> {
    const tempProcessedPath = path.join(tmpdir(), `processed_${uuidv4()}.png`);

    try {
        const image = sharp(imagePath);

        const metadata = await image.metadata();
        const originalWidth = metadata.width ?? 0;
        const originalHeight = metadata.height ?? 0;

        if (!originalWidth || !originalHeight) {
            logger.error(
                `Image metadata missing width/height for ${imagePath}. Skipping preprocessing.`
            );
            return imagePath;
        }

        const scale = 1.5;
        const scaledWidth = Math.round(originalWidth * scale);
        const scaledHeight = Math.round(originalHeight * scale);

        const processedBuffer = await image
            .greyscale()
            .resize({
                width: scaledWidth,
                height: scaledHeight,
                kernel: sharp.kernel.lanczos3,
            })
            .normalise()
            .raw()
            .toBuffer();

        const pixels = new Uint8ClampedArray(processedBuffer);

        const threshold = 135;
        const minHorizontalLineLength = Math.floor(scaledWidth * 0.03);
        const minVerticalLineLength = Math.floor(scaledHeight * 0.03);
        const lineThickness = 6;
        const lineDetectionTolerance = 30;

        logger.log(
            `Preprocessing: ${scaledWidth}x${scaledHeight}, minH: ${minHorizontalLineLength}, minV: ${minVerticalLineLength}`
        );

        const linesToRemove: Set<number> = new Set();

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
                    for (let dx = -4; dx <= 4; dx++) {
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
                                consecutiveDarkPixels * 0.35
                            ) {
                                darkNeighborColumns++;
                            }
                        }
                    }

                    if (darkNeighborColumns >= 2) {
                        verticalLinesRemoved++;

                        for (
                            let dx = -lineThickness;
                            dx <= lineThickness;
                            dx++
                        ) {
                            const clearX = x + dx;
                            if (clearX >= 0 && clearX < scaledWidth) {
                                for (
                                    let clearY = Math.max(0, lineStart - 3);
                                    clearY <
                                    Math.min(
                                        scaledHeight,
                                        lineStart + consecutiveDarkPixels + 3
                                    );
                                    clearY++
                                ) {
                                    const clearIdx =
                                        clearY * scaledWidth + clearX;
                                    linesToRemove.add(clearIdx);
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

                        for (let dy = -3; dy <= 3; dy++) {
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
                                    consecutiveDarkPixels * 0.6
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
                                        let clearX = Math.max(0, lineStart - 3);
                                        clearX <
                                        Math.min(
                                            scaledWidth,
                                            lineStart +
                                                consecutiveDarkPixels +
                                                3
                                        );
                                        clearX++
                                    ) {
                                        const clearIdx =
                                            clearY * scaledWidth + clearX;
                                        linesToRemove.add(clearIdx);
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

        for (const idx of linesToRemove) {
            pixels[idx] = 255;
        }

        const rawBuffer = Buffer.from(new Uint8Array(pixels));
        const newImage = sharp(rawBuffer, {
            raw: {
                width: scaledWidth,
                height: scaledHeight,
                channels: 1,
            },
            limitInputPixels: 500000000,
        })
            .sharpen({ sigma: 1.2 })
            .normalise()
            .median(2)
            .threshold(165)
            .autoOrient();

        await newImage
            .resize({
                width: originalWidth,
                height: originalHeight,
                kernel: sharp.kernel.lanczos3,
            })
            .withMetadata({ density: 330 })
            .png({
                quality: 100,
                compressionLevel: 6,
            })
            .toFile(tempProcessedPath);

        logger.log(`Image preprocessed successfully: ${tempProcessedPath}`);
        return tempProcessedPath;
    } catch (error) {
        logger.error('Error during image preprocessing:', error);
        return imagePath;
    }
}

function normaliseCoordinate(value: number, maxDimension: number): number {
    return Math.round((value / maxDimension) * 100);
}

function parseBbox(
    title: string,
    documentDimensions: { height: number; width: number }
): { x0: number; y0: number; x1: number; y1: number } | null {
    const bboxMatch = title.match(/bbox (\d+) (\d+) (\d+) (\d+)/);
    if (!bboxMatch) return null;

    const rawX0 = parseInt(bboxMatch[1]);
    const rawY0 = parseInt(bboxMatch[2]);
    const rawX1 = parseInt(bboxMatch[3]);
    const rawY1 = parseInt(bboxMatch[4]);

    return {
        x0: normaliseCoordinate(rawX0, documentDimensions.width),
        y0: normaliseCoordinate(rawY0, documentDimensions.height),
        x1: normaliseCoordinate(rawX1, documentDimensions.width),
        y1: normaliseCoordinate(rawY1, documentDimensions.height),
    };
}

function parseConfidence(title: string): number {
    const confMatch = title.match(/x_wconf (\d+)/);
    return confMatch ? parseInt(confMatch[1]) : 0;
}

function parseWord(
    pageNumber: number,

    wordElement: HTMLElement,
    documentDimensions: { height: number; width: number }
): ParsedOCRWord | null {
    const title = wordElement.getAttribute('title') || '';
    const bbox = parseBbox(title, documentDimensions);
    const confidence = parseConfidence(title);
    const text = wordElement.text.trim();
    const id = wordElement.getAttribute('id') || 'unknown_id';

    if (!bbox || !text) return null;

    return {
        text,
        confidence,
        bbox,
        id,
        pageNumber,
    };
}

function parseLine(
    pageNumber: number,
    lineElement: HTMLElement,
    documentDimensions: { height: number; width: number }
): ParsedOCRLine | null {
    const title = lineElement.getAttribute('title') || '';
    const bbox = parseBbox(title, documentDimensions);

    if (!bbox) return null;

    const wordElements = lineElement.querySelectorAll('.ocrx_word');
    const words: ParsedOCRWord[] = [];

    for (const wordElement of wordElements) {
        const word = parseWord(pageNumber, wordElement, documentDimensions);
        if (word) {
            words.push(word);
        }
    }

    if (words.length === 0) return null;

    const text = words.map((w) => w.text).join(' ');
    const avgConfidence =
        words.reduce((sum, w) => sum + w.confidence, 0) / words.length;

    return {
        text,
        confidence: Math.round(avgConfidence),
        words,
        bbox,
        pageNumber,
    };
}

function parsePage(
    pageElement: HTMLElement,
    pageNumber: number,
    documentDimensions: { height: number; width: number }
): ParsedOCRPage {
    const lineElements = pageElement.querySelectorAll('.ocr_line');
    const lines: ParsedOCRLine[] = [];

    for (const lineElement of lineElements) {
        const line = parseLine(pageNumber, lineElement, documentDimensions);
        if (line) {
            lines.push(line);
        }
    }

    const fullText = lines.map((l) => l.text).join('\n');
    const avgConfidence =
        lines.length > 0
            ? Math.round(
                lines.reduce((sum, l) => sum + l.confidence, 0) / lines.length
            )
            : 0;

    return {
        pageNumber,
        lines,
        fullText,
        averageConfidence: avgConfidence,
    };
}

export function parseHOCR(hocrPages: RawHOCRResult[]): ParsedOCRResult {
    const pages: ParsedOCRPage[] = [];

    for (let i = 0; i < hocrPages.length; i++) {
        const section = hocrPages[i].hocr.trim();
        if (!section) continue;

        const root = parse(section, {
            fixNestedATags: true,
            parseNoneClosedTags: true,
        });
        const pageElement = root.querySelector('.ocr_page');

        if (pageElement) {
            const page = parsePage(
                pageElement,
                i + 1,
                hocrPages[i].pageDimensions
            );
            pages.push(page);
        }
    }

    const fullText = pages.map((p) => p.fullText).join('\n\n\n\n');
    const totalAvgConfidence =
        pages.length > 0
            ? Math.round(
                pages.reduce((sum, p) => sum + p.averageConfidence, 0) /
                      pages.length
            )
            : 0;

    return {
        pages,
        fullText,
        totalAverageConfidence: totalAvgConfidence,
    };
}

export function filterLinesByConfidence(
    result: ParsedOCRResult,
    minConfidence: number
): ParsedOCRResult {
    const filteredPages = result.pages.map((page) => ({
        ...page,
        lines: page.lines.filter((line) => line.confidence >= minConfidence),
    }));

    return {
        pages: filteredPages,
        fullText: filteredPages
            .map((p) => p.lines.map((l) => l.text).join('\n'))
            .join('\n\n--- PAGE BREAK ---\n\n'),
        totalAverageConfidence: result.totalAverageConfidence,
    };
}

export function filterWordsByConfidence(
    result: ParsedOCRResult,
    minConfidence: number
): ParsedOCRResult {
    const filteredPages = result.pages.map((page) => ({
        ...page,
        lines: page.lines
            .map((line) => ({
                ...line,
                words: line.words.filter(
                    (word) => word.confidence >= minConfidence
                ),
            }))
            .filter((line) => line.words.length > 0),
    }));

    return {
        pages: filteredPages,
        fullText: filteredPages
            .map((p) => p.lines.map((l) => l.text).join('\n'))
            .join('\n\n--- PAGE BREAK ---\n\n'),
        totalAverageConfidence: result.totalAverageConfidence,
    };
}

export function findTextInRegion(
    result: ParsedOCRResult,
    region: { x0: number; y0: number; x1: number; y1: number },
    pageNumber?: number
): ParsedOCRWord[] {
    const pagesToSearch = pageNumber
        ? result.pages.filter((p) => p.pageNumber === pageNumber)
        : result.pages;

    const wordsInRegion: ParsedOCRWord[] = [];

    for (const page of pagesToSearch) {
        for (const line of page.lines) {
            for (const word of line.words) {
                const bbox = word.bbox;
                const overlaps = !(
                    bbox.x1 < region.x0 ||
                    bbox.x0 > region.x1 ||
                    bbox.y1 < region.y0 ||
                    bbox.y0 > region.y1
                );

                if (overlaps) {
                    wordsInRegion.push(word);
                }
            }
        }
    }

    return wordsInRegion;
}

export function findWordCordinate(
    result: ParsedOCRResult,
    searchText: string,
    searchOnPage?: number
): ParsedOCRWord[] | null {
    const foundWords: ParsedOCRWord[] = [];
    const isSpecificPageSearch = searchOnPage !== undefined;
    for (const page of result.pages) {
        if (isSpecificPageSearch && searchOnPage !== page.pageNumber) continue;
        for (const line of page.lines) {
            for (const word of line.words) {
                if (word.text === searchText) {
                    foundWords.push(word);
                }
            }
        }
    }
    return foundWords.length > 0 ? foundWords : null;
}

function sliceSentenceIntoWords(sentence: string): string[] {
    return sentence
        .split(' ')
        .map((word) => word.trim())
        .filter((word) => word.length > 0);
}

function findSentenceInLine(
    line: ParsedOCRLine,
    anchorWords: string[],
    acceptableLevenshteinDistance: number
): ParsedOCRWord[] | null {
    const anchorLength = anchorWords.length;

    if (line.words.length < anchorLength) {
        return null;
    }

    for (let i = 0; i <= line.words.length - anchorLength; i++) {
        let currentLevenshteinDistance = 0;
        const matchedWords: ParsedOCRWord[] = [];
        let foundMatch = true;

        for (let j = 0; j < anchorLength; j++) {
            const lineWord = line.words[i + j].text.toLowerCase();
            const anchorWord = anchorWords[j].toLowerCase();

            if (lineWord !== anchorWord) {
                const distance = levenshtein(lineWord, anchorWord);
                currentLevenshteinDistance += distance;

                if (
                    currentLevenshteinDistance > acceptableLevenshteinDistance
                ) {
                    foundMatch = false;
                    break;
                }
            }

            matchedWords.push(line.words[i + j]);
        }

        if (
            foundMatch &&
            matchedWords.length === anchorLength &&
            currentLevenshteinDistance <= acceptableLevenshteinDistance
        ) {
            return matchedWords;
        }
    }

    return null;
}

function calculateAcceptableLevenshteinDistance(
    anchorWords: string[],
    percentageMarginOfError: number
): number {
    const totalChars = anchorWords.reduce((sum, word) => sum + word.length, 0);
    return Math.floor((percentageMarginOfError / 100) * totalChars);
}

export function searchForAnchorSentence(
    result: ParsedOCRResult,
    anchorSentence: string,
    acceptableLevenshteinDistance: number,
    searchOnPage?: number
): ParsedOCRWord[] | null {
    if (!anchorSentence?.trim()) {
        return null;
    }

    const anchorWords = sliceSentenceIntoWords(anchorSentence);

    if (anchorWords.length === 0) {
        return null;
    }

    const isSpecificPageSearch = searchOnPage !== undefined;

    for (const page of result.pages) {
        if (isSpecificPageSearch && searchOnPage !== page.pageNumber) continue;
        for (const line of page.lines) {
            const matchedWords = findSentenceInLine(
                line,
                anchorWords,
                acceptableLevenshteinDistance
            );
            if (matchedWords) {
                return matchedWords;
            }
        }
    }

    return null;
}

function getBboxFromWords(words: ParsedOCRWord[]): BboxCordinates {
    if (!words || words.length === 0) {
        throw new Error('getBboxFromWords requires a non-empty words array');
    }

    const bboxes = words.map((w) => w.bbox);

    return {
        x0: Math.min(...bboxes.map((b) => b.x0)),
        y0: Math.min(...bboxes.map((b) => b.y0)),
        x1: Math.max(...bboxes.map((b) => b.x1)),
        y1: Math.max(...bboxes.map((b) => b.y1)),
    };
}

function calculateSearchRegion(
    anchorBbox: BboxCordinates,
    searchingAreaData: SearchingAreaData
): BboxCordinates {
    switch (searchingAreaData.direction) {
        case DirectionOfSearching.LEFT:
            return {
                x0: Math.max(
                    0,
                    anchorBbox.x0 - searchingAreaData.widthPercentage
                ),
                y0: anchorBbox.y0,
                x1: anchorBbox.x0 - 1,
                y1: anchorBbox.y1,
            };
        case DirectionOfSearching.RIGHT:
            return {
                x0: anchorBbox.x1 + 1,
                y0: anchorBbox.y0,
                x1: Math.min(
                    100,
                    anchorBbox.x1 + 1 + searchingAreaData.widthPercentage
                ),
                y1: Math.min(
                    100,
                    anchorBbox.y1 + searchingAreaData.heightPercentage
                ),
            };
        case DirectionOfSearching.UP:
            return {
                x0: anchorBbox.x0,
                y0: Math.max(
                    0,
                    anchorBbox.y0 - searchingAreaData.heightPercentage
                ),
                x1: Math.min(
                    100,
                    anchorBbox.x1 + searchingAreaData.widthPercentage
                ),
                y1: anchorBbox.y0 - 1,
            };
        case DirectionOfSearching.DOWN:
            return {
                x0: anchorBbox.x0,
                y0: anchorBbox.y1 + 1,
                x1: Math.min(
                    100,
                    anchorBbox.x1 + searchingAreaData.widthPercentage
                ),
                y1: Math.min(
                    100,
                    anchorBbox.y1 + searchingAreaData.heightPercentage
                ),
            };
        default:
            throw new Error('Invalid direction for searching area');
    }
}

export function getDataFromAnchorSentence(
    result: ParsedOCRResult,
    anchorSentence: string,
    percentageMarginOfError: number,
    searchingAreaData: SearchingAreaData,
    searchOnPage?: number
): ParsedOCRWord[] | null {
    if (percentageMarginOfError < 0) {
        throw new Error('percentageMarginOfError must be non-negative');
    }

    const anchorWords = sliceSentenceIntoWords(anchorSentence);
    
    if (anchorWords.length === 0) {
        return null;
    }

    const acceptableLevenshteinDistance = calculateAcceptableLevenshteinDistance(
        anchorWords,
        percentageMarginOfError
    );

    const matchedWords = searchForAnchorSentence(
        result,
        anchorSentence,
        acceptableLevenshteinDistance,
        searchOnPage
    );

    if (!matchedWords) {
        return null;
    }

    const anchorBbox = getBboxFromWords(matchedWords);
    const searchRegion = calculateSearchRegion(anchorBbox, searchingAreaData);

    const pageNumber = searchOnPage ? searchOnPage : matchedWords[0].pageNumber;

    const wordsInRegion = findTextInRegion(result, searchRegion, pageNumber);
    return wordsInRegion.length > 0 ? wordsInRegion : null;
}