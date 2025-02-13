type Cell = string;
type Infrastructure = string;
type Industry = string;
const PL = "pl";
const EN = "en";
type Language = typeof PL | typeof EN;

interface SourceDataWithMeta {
    text: string[][];
}

enum SourceColumnNumber {
    INFRASTRUCTURE = 1,
    INDUSTRY = 4,
    PL_URL = 14,
    EN_URL = 15,
}

enum DataDividers {
    FORWARD_SLASH = "/",
    COMMA = ",",
}

const CELL_DATA_DIVIDERS = {
    [SourceColumnNumber.INFRASTRUCTURE]: [DataDividers.COMMA],
    [SourceColumnNumber.INDUSTRY]: [DataDividers.FORWARD_SLASH],
};

interface UserInput {
    industry: Industry[];
    infrastructure?: Infrastructure[];
    language?: language;
};

const userInput: UserInput = { // co jeśli po angielsku? co z nieunikalnymi/minimalnie różniącymi się wartościami? -> może pobrać te wszystkie unikalne wartości i podać chatowi i niech dopasuje user input do nich?
    infrastructure: "Rockawork", // czy mogą podać kilka?
    industry: "automotive", // czy mogą podać kilka?
    language: "pl",// czy mogą podać kilka?
};

const sourceDataWithMeta: SourceDataWithMeta = {
    startCell: "A1",
    endCell: "Q342",
    columnCount: 17,
    rowCount: 342,
    cellCount: 5814,
    text: [
        [
            "Ba Glass Poland",
            "Rockawork (dawniej ECM)",
            "",
            "",
            "Produkcyjna / Metalurgiczna / Automotive / Opakowania / Przemysł obronny",
            "Polska",
            "2023",
            "…",
            "Aplikacje All for One Poland",
            "gotowy",
            "",
            "Brak zakazu w umowie wdrożeniowej ECM",
            "",
            "brak zakazu",
            "https://url-do-prezentacji1",
            "https://some-url-to-presentation1",
            "",
        ],
        [
            "Bakalland / Foodwell",
            "BeeOffice",
            "",
            "",
            "Spożywcza",
            "Polska",
            "2018",
            "…",
            "Aplikacje All for One Poland",
            "gotowy",
            "",
            "",
            " ",
            "domniemana - case study",
            "https://url-do-prezentacji2",
            "https://some-url-to-presentation2",
            "",
        ],
    ],
};

const { text: rawSourceData } = sourceDataWithMeta;
// const rawSourceDataWithoutHeader = rawSourceData.slice(1); // for production replace next line with this
const rawSourceDataWithoutHeader = rawSourceData

const getDividedData = (
    text: Cell,
    column: SourceColumnNumber
): Array<Infrastructure | Industry> => {
    const simplifiedText = text.replace(/\s+/g, "").toLowerCase();
    const dividers = CELL_DATA_DIVIDERS[column];
    const dividedData = dividers.reduce(
        (acc, divider) => {
            return acc.flatMap((item) => item.split(divider));
        },
        [simplifiedText]
    );
    return dividedData;
};

const sourceData = rawSourceDataWithoutHeader.map((row) => {
    const {
        [SourceColumnNumber.INDUSTRY]: industryCell,
        [SourceColumnNumber.INFRASTRUCTURE]: infrastructureCell,
        [SourceColumnNumber.PL_URL]: plUrl,
        [SourceColumnNumber.EN_URL]: enUrl
    } = row;

    const industries = getDividedData(
        industryCell,
        SourceColumnNumber.INDUSTRY
    );

    const infrastructures = getDividedData(
        infrastructureCell,
        SourceColumnNumber.INFRASTRUCTURE
    );

    return {
        infrastructures,
        industries,
        plUrl,
        enUrl,
    };
});

const filterDuplicatedLinks = (sourceData: any) => {
    throw new Error("Not implemented");
}

console.log(sourceData);