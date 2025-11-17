import { describe, it, expect } from 'vitest';
import {
    parseHOCR,
    filterLinesByConfidence,
    filterWordsByConfidence,
    findTextInRegion,
    findWordCordinate,
    searchForAnchorSentence,
    getDataFromAnchorSentence,
} from './desktop.utils';
import {
    DirectionOfSearching,
    ParsedOCRResult,
    RawHOCRResult,
} from './types';

describe('OCR Utility Functions', () => {
    describe('parseHOCR', () => {
        it('should parse valid HOCR data correctly', () => {
            const mockHOCR: RawHOCRResult[] = [
                {
                    hocr: `
                        <div class="ocr_page">
                            <div class="ocr_line" title="bbox 100 100 200 120; x_wconf 95">
                                <span class="ocrx_word" id="word_1" title="bbox 100 100 150 120; x_wconf 95">Hello</span>
                                <span class="ocrx_word" id="word_2" title="bbox 160 100 200 120; x_wconf 90">World</span>
                            </div>
                        </div>
                    `,
                    pageDimensions: { width: 1000, height: 1000 },
                },
            ];

            const result = parseHOCR(mockHOCR);

            expect(result.pages).toHaveLength(1);
            expect(result.pages[0].lines).toHaveLength(1);
            expect(result.pages[0].lines[0].words).toHaveLength(2);
            expect(result.pages[0].lines[0].words[0].text).toBe('Hello');
            expect(result.pages[0].lines[0].words[1].text).toBe('World');
            expect(result.fullText).toContain('Hello World');
        });

        it('should handle multiple pages', () => {
            const mockHOCR: RawHOCRResult[] = [
                {
                    hocr: `
                        <div class="ocr_page">
                            <div class="ocr_line" title="bbox 100 100 200 120; x_wconf 95">
                                <span class="ocrx_word" id="word_1" title="bbox 100 100 150 120; x_wconf 95">Page1</span>
                            </div>
                        </div>
                    `,
                    pageDimensions: { width: 1000, height: 1000 },
                },
                {
                    hocr: `
                        <div class="ocr_page">
                            <div class="ocr_line" title="bbox 100 100 200 120; x_wconf 95">
                                <span class="ocrx_word" id="word_2" title="bbox 100 100 150 120; x_wconf 95">Page2</span>
                            </div>
                        </div>
                    `,
                    pageDimensions: { width: 1000, height: 1000 },
                },
            ];

            const result = parseHOCR(mockHOCR);

            expect(result.pages).toHaveLength(2);
            expect(result.pages[0].pageNumber).toBe(1);
            expect(result.pages[1].pageNumber).toBe(2);
        });

        it('should handle empty HOCR data', () => {
            const result = parseHOCR([]);

            expect(result.pages).toHaveLength(0);
            expect(result.fullText).toBe('');
            expect(result.totalAverageConfidence).toBe(0);
        });

        it('should skip pages without ocr_page element', () => {
            const mockHOCR: RawHOCRResult[] = [
                {
                    hocr: '<div>No OCR data</div>',
                    pageDimensions: { width: 1000, height: 1000 },
                },
            ];

            const result = parseHOCR(mockHOCR);

            expect(result.pages).toHaveLength(0);
        });
    });

    describe('filterLinesByConfidence', () => {
        const mockResult: ParsedOCRResult = {
            pages: [
                {
                    pageNumber: 1,
                    lines: [
                        {
                            text: 'High confidence',
                            confidence: 95,
                            words: [],
                            bbox: { x0: 0, y0: 0, x1: 100, y1: 20 },
                            pageNumber: 1,
                        },
                        {
                            text: 'Low confidence',
                            confidence: 50,
                            words: [],
                            bbox: { x0: 0, y0: 30, x1: 100, y1: 50 },
                            pageNumber: 1,
                        },
                    ],
                    fullText: 'High confidence\nLow confidence',
                    averageConfidence: 72,
                },
            ],
            fullText: 'High confidence\nLow confidence',
            totalAverageConfidence: 72,
        };

        it('should filter lines by minimum confidence', () => {
            const filtered = filterLinesByConfidence(mockResult, 80);

            expect(filtered.pages[0].lines).toHaveLength(1);
            expect(filtered.pages[0].lines[0].text).toBe('High confidence');
        });

        it('should keep all lines if minConfidence is 0', () => {
            const filtered = filterLinesByConfidence(mockResult, 0);

            expect(filtered.pages[0].lines).toHaveLength(2);
        });

        it('should return empty lines if confidence threshold is too high', () => {
            const filtered = filterLinesByConfidence(mockResult, 100);

            expect(filtered.pages[0].lines).toHaveLength(0);
        });
    });

    describe('filterWordsByConfidence', () => {
        const mockResult: ParsedOCRResult = {
            pages: [
                {
                    pageNumber: 1,
                    lines: [
                        {
                            text: 'High Low',
                            confidence: 80,
                            words: [
                                {
                                    text: 'High',
                                    confidence: 95,
                                    bbox: { x0: 0, y0: 0, x1: 50, y1: 20 },
                                    id: 'word_1',
                                    pageNumber: 1,
                                },
                                {
                                    text: 'Low',
                                    confidence: 40,
                                    bbox: { x0: 60, y0: 0, x1: 100, y1: 20 },
                                    id: 'word_2',
                                    pageNumber: 1,
                                },
                            ],
                            bbox: { x0: 0, y0: 0, x1: 100, y1: 20 },
                            pageNumber: 1,
                        },
                    ],
                    fullText: 'High Low',
                    averageConfidence: 80,
                },
            ],
            fullText: 'High Low',
            totalAverageConfidence: 80,
        };

        it('should filter words by minimum confidence', () => {
            const filtered = filterWordsByConfidence(mockResult, 80);

            expect(filtered.pages[0].lines).toHaveLength(1);
            expect(filtered.pages[0].lines[0].words).toHaveLength(1);
            expect(filtered.pages[0].lines[0].words[0].text).toBe('High');
        });

        it('should remove lines with no words after filtering', () => {
            const filtered = filterWordsByConfidence(mockResult, 100);

            expect(filtered.pages[0].lines).toHaveLength(0);
        });
    });

    describe('findTextInRegion', () => {
        const mockResult: ParsedOCRResult = {
            pages: [
                {
                    pageNumber: 1,
                    lines: [
                        {
                            text: 'Inside Outside',
                            confidence: 90,
                            words: [
                                {
                                    text: 'Inside',
                                    confidence: 90,
                                    bbox: { x0: 10, y0: 10, x1: 30, y1: 20 },
                                    id: 'word_1',
                                    pageNumber: 1,
                                },
                                {
                                    text: 'Outside',
                                    confidence: 90,
                                    bbox: { x0: 60, y0: 10, x1: 80, y1: 20 },
                                    id: 'word_2',
                                    pageNumber: 1,
                                },
                            ],
                            bbox: { x0: 10, y0: 10, x1: 80, y1: 20 },
                            pageNumber: 1,
                        },
                    ],
                    fullText: 'Inside Outside',
                    averageConfidence: 90,
                },
            ],
            fullText: 'Inside Outside',
            totalAverageConfidence: 90,
        };

        it('should find words within specified region', () => {
            const region = { x0: 5, y0: 5, x1: 29, y1: 19};
            const words = findTextInRegion(mockResult, region);

            expect(words).toHaveLength(1);
            expect(words[0].text).toBe('Inside');
        });

        it('should find words on specific page', () => {
            const region = { x0: 0, y0: 0, x1: 100, y1: 100 };
            const words = findTextInRegion(mockResult, region, 1);

            expect(words).toHaveLength(2);
        });

        it('should return empty array if no words in region', () => {
            const region = { x0: 90, y0: 90, x1: 100, y1: 100 };
            const words = findTextInRegion(mockResult, region);

            expect(words).toHaveLength(0);
        });
    });

    describe('findWordCordinate', () => {
        const mockResult: ParsedOCRResult = {
            pages: [
                {
                    pageNumber: 1,
                    lines: [
                        {
                            text: 'Hello World Hello',
                            confidence: 90,
                            words: [
                                {
                                    text: 'Hello',
                                    confidence: 90,
                                    bbox: { x0: 0, y0: 0, x1: 50, y1: 20 },
                                    id: 'word_1',
                                    pageNumber: 1,
                                },
                                {
                                    text: 'World',
                                    confidence: 90,
                                    bbox: { x0: 60, y0: 0, x1: 100, y1: 20 },
                                    id: 'word_2',
                                    pageNumber: 1,
                                },
                                {
                                    text: 'Hello',
                                    confidence: 90,
                                    bbox: { x0: 110, y0: 0, x1: 160, y1: 20 },
                                    id: 'word_3',
                                    pageNumber: 1,
                                },
                            ],
                            bbox: { x0: 0, y0: 0, x1: 160, y1: 20 },
                            pageNumber: 1,
                        },
                    ],
                    fullText: 'Hello World Hello',
                    averageConfidence: 90,
                },
            ],
            fullText: 'Hello World Hello',
            totalAverageConfidence: 90,
        };

        it('should find all occurrences of a word', () => {
            const words = findWordCordinate(mockResult, 'Hello');

            expect(words).toHaveLength(2);
            expect(words?.[0].text).toBe('Hello');
            expect(words?.[1].text).toBe('Hello');
        });

        it('should return null if word not found', () => {
            const words = findWordCordinate(mockResult, 'NotExisting');

            expect(words).toBeNull();
        });

        it('should search on specific page', () => {
            const words = findWordCordinate(mockResult, 'Hello', 1);

            expect(words).toHaveLength(2);
        });
    });

    describe('searchForAnchorSentence', () => {
        const mockResult: ParsedOCRResult = {
            pages: [
                {
                    pageNumber: 1,
                    lines: [
                        {
                            text: 'The quick brown fox',
                            confidence: 90,
                            words: [
                                {
                                    text: 'The',
                                    confidence: 90,
                                    bbox: { x0: 0, y0: 0, x1: 30, y1: 20 },
                                    id: 'word_1',
                                    pageNumber: 1,
                                },
                                {
                                    text: 'quick',
                                    confidence: 90,
                                    bbox: { x0: 40, y0: 0, x1: 80, y1: 20 },
                                    id: 'word_2',
                                    pageNumber: 1,
                                },
                                {
                                    text: 'brown',
                                    confidence: 90,
                                    bbox: { x0: 90, y0: 0, x1: 130, y1: 20 },
                                    id: 'word_3',
                                    pageNumber: 1,
                                },
                                {
                                    text: 'fox',
                                    confidence: 90,
                                    bbox: { x0: 140, y0: 0, x1: 170, y1: 20 },
                                    id: 'word_4',
                                    pageNumber: 1,
                                },
                            ],
                            bbox: { x0: 0, y0: 0, x1: 170, y1: 20 },
                            pageNumber: 1,
                        },
                    ],
                    fullText: 'The quick brown fox',
                    averageConfidence: 90,
                },
            ],
            fullText: 'The quick brown fox',
            totalAverageConfidence: 90,
        };

        it('should find exact sentence match', () => {
            const words = searchForAnchorSentence(
                mockResult,
                'quick brown',
                0
            );

            expect(words).toHaveLength(2);
            expect(words?.[0].text).toBe('quick');
            expect(words?.[1].text).toBe('brown');
        });

        it('should find sentence with acceptable Levenshtein distance', () => {
            const words = searchForAnchorSentence(
                mockResult,
                'quik brown',
                2
            );

            expect(words).not.toBeNull();
            expect(words).toHaveLength(2);
        });

        it('should return null if sentence not found', () => {
            const words = searchForAnchorSentence(
                mockResult,
                'not existing sentence',
                0
            );

            expect(words).toBeNull();
        });

        it('should return null for empty or whitespace anchor sentence', () => {
            expect(searchForAnchorSentence(mockResult, '', 0)).toBeNull();
            expect(searchForAnchorSentence(mockResult, '   ', 0)).toBeNull();
        });

        it('should search on specific page', () => {
            const words = searchForAnchorSentence(
                mockResult,
                'quick brown',
                0,
                1
            );

            expect(words).toHaveLength(2);
        });
    });

    describe('getDataFromAnchorSentence', () => {
        const mockResult: ParsedOCRResult = {
            pages: [
                {
                    pageNumber: 1,
                    lines: [
                        {
                            text: 'Name: John Doe',
                            confidence: 90,
                            words: [
                                {
                                    text: 'Name:',
                                    confidence: 90,
                                    bbox: { x0: 10, y0: 10, x1: 30, y1: 20 },
                                    id: 'word_1',
                                    pageNumber: 1,
                                },
                                {
                                    text: 'John',
                                    confidence: 90,
                                    bbox: { x0: 40, y0: 10, x1: 60, y1: 20 },
                                    id: 'word_2',
                                    pageNumber: 1,
                                },
                                {
                                    text: 'Doe',
                                    confidence: 90,
                                    bbox: { x0: 70, y0: 10, x1: 90, y1: 20 },
                                    id: 'word_3',
                                    pageNumber: 1,
                                },
                            ],
                            bbox: { x0: 10, y0: 10, x1: 90, y1: 20 },
                            pageNumber: 1,
                        },
                    ],
                    fullText: 'Name: John Doe',
                    averageConfidence: 90,
                },
            ],
            fullText: 'Name: John Doe',
            totalAverageConfidence: 90,
        };

        it('should find data to the right of anchor', () => {
            const words = getDataFromAnchorSentence(
                mockResult,
                'Name:',
                0,
                {
                    direction: DirectionOfSearching.RIGHT,
                    heightPercentage: 10,
                    widthPercentage: 70,
                }
            );

            expect(words).not.toBeNull();
            expect(words?.some((w) => w.text === 'John')).toBe(true);
        });

        it('should throw error for negative percentageMarginOfError', () => {
            expect(() =>
                getDataFromAnchorSentence(
                    mockResult,
                    'Name:',
                    -5,
                    {
                        direction: DirectionOfSearching.RIGHT,
                        heightPercentage: 10,
                        widthPercentage: 50,
                    }
                )
            ).toThrow('percentageMarginOfError must be non-negative');
        });

        it('should return null if anchor sentence not found', () => {
            const words = getDataFromAnchorSentence(
                mockResult,
                'NotExisting',
                0,
                {
                    direction: DirectionOfSearching.RIGHT,
                    heightPercentage: 10,
                    widthPercentage: 50,
                }
            );

            expect(words).toBeNull();
        });

        it('should return null if no words in search region', () => {
            const words = getDataFromAnchorSentence(
                mockResult,
                'Doe',
                0,
                {
                    direction: DirectionOfSearching.RIGHT,
                    heightPercentage: 5,
                    widthPercentage: 5,
                }
            );

            expect(words).toBeNull();
        });

        it('should handle LEFT direction', () => {
            const words = getDataFromAnchorSentence(
                mockResult,
                'John',
                0,
                {
                    direction: DirectionOfSearching.LEFT,
                    heightPercentage: 10,
                    widthPercentage: 50,
                }
            );

            expect(words?.some((w) => w.text === 'Name:')).toBe(true);
        });

        it('should return null for empty anchor sentence', () => {
            const words = getDataFromAnchorSentence(
                mockResult,
                '',
                0,
                {
                    direction: DirectionOfSearching.RIGHT,
                    heightPercentage: 10,
                    widthPercentage: 50,
                }
            );

            expect(words).toBeNull();
        });
    });
});