import { RunboticsLogger } from '#logger';
import { Injectable } from '@nestjs/common';
import { DesktopRunRequest, StatelessActionHandler } from '@runbotics/runbotics-sdk';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';

export type XmlToJsonInput = { xml: string };
export type JsonToXmlInput = { json: any };
export type XmlActionRequest =
    | DesktopRunRequest<'xml.xmlToJson', XmlToJsonInput>
    | DesktopRunRequest<'xml.jsonToXml', JsonToXmlInput>;

@Injectable()
export default class XmlActionHandler extends StatelessActionHandler {
    private readonly logger = new RunboticsLogger(XmlActionHandler.name);

    async xmlToJson(input: XmlToJsonInput) {
        try {
            const parser = new XMLParser();
            const json = parser.parse(input.xml);
            const jsonString = JSON.stringify(json, null, 2);
            return jsonString;
        } catch (error) {
            this.logger.error('Failed to parse XML to JSON', error);
            throw new Error('Invalid XML format');
        }
    }

    async jsonToXml(input: JsonToXmlInput) {
        try {
            const builder = new XMLBuilder();
            const xml = builder.build(input.json);
            return xml;
        } catch (error) {
            this.logger.error('Failed to build XML from JSON', error);
            throw new Error('Invalid JSON format');
        }
    }

    run(request: XmlActionRequest) {
        this.logger.log(`Running action: ${request.script}`);
        switch (request.script) {
            case 'xml.xmlToJson':
                return this.xmlToJson(request.input);
            case 'xml.jsonToXml':
                return this.jsonToXml(request.input);
            default:
                throw new Error('Action not found');
        }
    }
    
}