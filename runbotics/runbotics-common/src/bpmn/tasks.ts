export enum BpmnElement {
  SUBPROCESS = 'bpmn:SubProcess',
  START_EVENT = 'bpmn:StartEvent',
  END_EVENT = 'bpmn:EndEvent',
  ACTIVITY = 'bpmn:Activity',
  SERVICE_TASK = 'bpmn:ServiceTask',
  EXCLUSIVE_GATEWAY = 'bpmn:ExclusiveGateway',
  INCLUSIVE_GATEWAY = 'bpmn:InclusiveGateway',
  COMPLEX_GATEWAY = 'bpmn:ComplexGateway'
}