var _a;
const PL = "pl";
const EN = "en";
var SourceColumnNumber;
(function (SourceColumnNumber) {
    SourceColumnNumber[SourceColumnNumber["INFRASTRUCTURE"] = 1] = "INFRASTRUCTURE";
    SourceColumnNumber[SourceColumnNumber["INDUSTRY"] = 4] = "INDUSTRY";
    SourceColumnNumber[SourceColumnNumber["PL_URL"] = 14] = "PL_URL";
    SourceColumnNumber[SourceColumnNumber["EN_URL"] = 15] = "EN_URL";
})(SourceColumnNumber || (SourceColumnNumber = {}));
var DataDividers;
(function (DataDividers) {
    DataDividers["FORWARD_SLASH"] = "/";
    DataDividers["COMMA"] = ",";
})(DataDividers || (DataDividers = {}));
const CELL_DATA_DIVIDERS = {
    [SourceColumnNumber.INFRASTRUCTURE]: [DataDividers.COMMA],
    [SourceColumnNumber.INDUSTRY]: [DataDividers.FORWARD_SLASH],
};
const userInput = {
    industries: ["automotive"],
    infrastructures: [],
    languages: [PL],
};
const sourceDataWithMeta = {
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
const getDividedData = (text, column) => {
    const simplifiedText = text.replace(/\s+/g, "").toLowerCase();
    const dividers = CELL_DATA_DIVIDERS[column];
    const dividedData = dividers.reduce((acc, divider) => {
        return acc.flatMap((item) => item.split(divider));
    }, [simplifiedText]);
    return dividedData;
};
const sourceData = rawSourceDataWithoutHeader.map((row) => {
    const { [SourceColumnNumber.INDUSTRY]: industryCell, [SourceColumnNumber.INFRASTRUCTURE]: infrastructureCell, [SourceColumnNumber.PL_URL]: plUrl, [SourceColumnNumber.EN_URL]: enUrl, } = row;
    const industries = getDividedData(industryCell, SourceColumnNumber.INDUSTRY);
    const infrastructures = getDividedData(infrastructureCell, SourceColumnNumber.INFRASTRUCTURE);
    // Return the object only if either plUrl or enUrl is not empty
    return (plUrl || enUrl) ? {
        infrastructures,
        industries,
        plUrl,
        enUrl,
    } : null;
}).filter(Boolean); // Filter out null values
const simplifyValue = (value) => value.replace(/\s+/g, "").toLowerCase();
// poniżej dzieje się temporary matching
const aiImprovedUserInput = {
    industries: userInput.industries.map(simplifyValue),
    infrastructures: (_a = userInput.infrastructures) === null || _a === void 0 ? void 0 : _a.map(simplifyValue),
    languages: userInput.languages,
};
// ----- tu się dzieje AI - dopasowuje user input do nazw infrastruktury i branży z sourceData i zwraca matchedData
// const aiImprovedUserInput: UserInput = {
//     industries: ["automotive"],
//     infrastructures: ["rockawork(dawniejecm)", "beeoffice"],
//     languages: [PL, EN],
// };
const matchedData = sourceData.filter((sourceData) => {
    var _a, _b;
    const isIndustryMatched = aiImprovedUserInput.industries.some((industry) => sourceData.industries.includes(industry));
    const isInfrastructureMatched = (_b = (_a = aiImprovedUserInput.infrastructures) === null || _a === void 0 ? void 0 : _a.some((infrastructure) => sourceData.infrastructures.includes(infrastructure))) !== null && _b !== void 0 ? _b : true;
    return isIndustryMatched || isInfrastructureMatched;
}, []);
const matchedDataByInfrastructures = matchedData.reduce((acc, curr) => curr.infrastructures.reduce((acc, infrastructure) => {
    var _a;
    return Object.assign(Object.assign({}, acc), { [infrastructure]: [
            ...((_a = acc[infrastructure]) !== null && _a !== void 0 ? _a : []),
            Object.assign(Object.assign({}, curr), { infrastructures: undefined }),
        ] });
}, acc), {});
const mapToLinksOnly = (language) => {
    const langUrlProp = `${language}Url`;
    return Object.keys(matchedDataByInfrastructures).reduce((acc, infrastructure) => {
        acc[infrastructure] = matchedDataByInfrastructures[infrastructure].map(data => data[langUrlProp]);
        return acc;
    }, {});
};
const links = aiImprovedUserInput.languages.map(lang => mapToLinksOnly(lang));
const linksFlat = links.map(link => Object.values(link).flat());
// console.log(JSON.stringify(linksFlat, null, 2));
const check = sourceData.filter(data => linksFlat.flat().some(link => link === data.plUrl));
console.log(check);
