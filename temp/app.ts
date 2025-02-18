type Cell = string;
type Infrastructure = string;
type Industry = string;
const PL = "pl";
const EN = "en";
type Language = typeof PL | typeof EN;

interface RawSourceData extends Record<string, any> {
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
    industries: Industry[];
    infrastructures?: Infrastructure[];
    languages: Language[];
}

interface SourceData {
    industries: Industry[];
    infrastructures: Infrastructure[];
    plUrl: string;
    enUrl: string;
}

const userInput: UserInput = {
    industries: ["automotive"],
    infrastructures: [],
    languages: [PL],
};

const sourceDataWithMeta: RawSourceData = {
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
const rawSourceDataWithoutHeader = rawSourceData;

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

const sourceData: SourceData[] = rawSourceDataWithoutHeader.map((row) => {
    const {
        [SourceColumnNumber.INDUSTRY]: industryCell,
        [SourceColumnNumber.INFRASTRUCTURE]: infrastructureCell,
        [SourceColumnNumber.PL_URL]: plUrl,
        [SourceColumnNumber.EN_URL]: enUrl,
    } = row;

    const industries = getDividedData(
        industryCell,
        SourceColumnNumber.INDUSTRY
    );

    const infrastructures = getDividedData(
        infrastructureCell,
        SourceColumnNumber.INFRASTRUCTURE
    );

    // Return the object only if either plUrl or enUrl is not empty
    return (plUrl || enUrl) ? {
        infrastructures,
        industries,
        plUrl,
        enUrl,
    } : null;
}).filter(Boolean) as SourceData[]; // Filter out null values

const simplifyValue = (value: string) => value.replace(/\s+/g, "").toLowerCase();

// poniżej dzieje się temporary matching
const aiImprovedUserInput: UserInput = {
    industries: userInput.industries.map(simplifyValue),
    infrastructures: userInput.infrastructures?.map(simplifyValue),
    languages: userInput.languages,
};
// ----- tu się dzieje AI - dopasowuje user input do nazw infrastruktury i branży z sourceData i zwraca matchedData

// const aiImprovedUserInput: UserInput = {
//     industries: ["automotive"],
//     infrastructures: ["rockawork(dawniejecm)", "beeoffice"],
//     languages: [PL, EN],
// };

const matchedData = sourceData.filter((sourceData) => {
    const isIndustryMatched = aiImprovedUserInput.industries.some((industry) =>
        sourceData.industries.includes(industry)
    );

    const isInfrastructureMatched =
        aiImprovedUserInput.infrastructures?.some((infrastructure) =>
            sourceData.infrastructures.includes(infrastructure)
        ) ?? true;

    return isIndustryMatched || isInfrastructureMatched;
}, []);

interface MatchedDataByInfrastructures {
    [infrastructure: string]: SourceData[];
}

const matchedDataByInfrastructures = matchedData.reduce(
    (acc, curr) =>
        curr.infrastructures.reduce((acc, infrastructure) => {
            return {
                ...acc,
                [infrastructure]: [
                    ...(acc[infrastructure] ?? []),
                    { ...curr, infrastructures: undefined },
                ],
            };
        }, acc),
    {}
);

const mapToLinksOnly = (language: Language) => {
    const langUrlProp = `${language}Url`;
    return Object.keys(matchedDataByInfrastructures).reduce((acc, infrastructure) => {
        acc[infrastructure] = matchedDataByInfrastructures[infrastructure].map(data => data[langUrlProp]);
        return acc;
    }, {});
};

const links: Array<Record<Infrastructure, string[]>> = aiImprovedUserInput.languages.map(lang => mapToLinksOnly(lang));
const linksFlat = links.map(link => Object.values(link).flat());

// console.log(JSON.stringify(linksFlat, null, 2));

const check = sourceData.filter(data => linksFlat.flat().some(link => link === data.plUrl))

console.log(check)