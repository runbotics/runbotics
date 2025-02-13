var _a;
var PL = "pl";
var EN = "en";
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
var CELL_DATA_DIVIDERS = (_a = {},
    _a[SourceColumnNumber.INFRASTRUCTURE] = [DataDividers.COMMA],
    _a[SourceColumnNumber.INDUSTRY] = [DataDividers.FORWARD_SLASH],
    _a);
;
var userInput = {
    infrastructure: "Rockawork", // czy mogą podać kilka?
    industry: "automotive", // czy mogą podać kilka?
    language: "pl", // czy mogą podać kilka?
};
var sourceDataWithMeta = {
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
var rawSourceData = sourceDataWithMeta.text;
// const rawSourceDataWithoutHeader = rawSourceData.slice(1); // for production replace next line with this
var rawSourceDataWithoutHeader = rawSourceData;
var getDividedData = function (text, column) {
    var simplifiedText = text.replace(/\s+/g, "").toLowerCase();
    var dividers = CELL_DATA_DIVIDERS[column];
    var dividedData = dividers.reduce(function (acc, divider) {
        return acc.flatMap(function (item) { return item.split(divider); });
    }, [simplifiedText]);
    return dividedData;
};
var sourceData = rawSourceDataWithoutHeader.map(function (row) {
    var _a = row, _b = SourceColumnNumber.INDUSTRY, industryCell = _a[_b], _c = SourceColumnNumber.INFRASTRUCTURE, infrastructureCell = _a[_c], _d = SourceColumnNumber.PL_URL, plUrl = _a[_d], _e = SourceColumnNumber.EN_URL, enUrl = _a[_e];
    var industries = getDividedData(industryCell, SourceColumnNumber.INDUSTRY);
    var infrastructures = getDividedData(infrastructureCell, SourceColumnNumber.INFRASTRUCTURE);
    return {
        infrastructures: infrastructures,
        industries: industries,
        plUrl: plUrl,
        enUrl: enUrl,
    };
});
var filterDuplicatedLinks = function (sourceData) {
    throw new Error("Not implemented");
};
console.log(sourceData);
