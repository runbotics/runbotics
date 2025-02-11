import { IBpmnConnection, IBpmnGateway } from '../../../helpers/elementParameters';

export const getOutgoingById = (gateway: IBpmnGateway, id: string) =>
    gateway.outgoing.find((outgoing) => outgoing.id === id);

export const isSequenceWithExpression = (gateway: IBpmnGateway, outgoing: IBpmnConnection) =>
    gateway.businessObject.default?.id === outgoing.id || Boolean(outgoing.businessObject.conditionExpression?.body?.trim());



