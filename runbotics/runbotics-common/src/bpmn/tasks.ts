export enum BpmnElementType {
  SUBPROCESS = 'bpmn:SubProcess',
  START_EVENT = 'bpmn:StartEvent',
  END_EVENT = 'bpmn:EndEvent',
  ACTIVITY = 'bpmn:Activity',
  SERVICE_TASK = 'bpmn:ServiceTask',
  EXCLUSIVE_GATEWAY = 'bpmn:ExclusiveGateway',
  INCLUSIVE_GATEWAY = 'bpmn:InclusiveGateway',
  COMPLEX_GATEWAY = 'bpmn:ComplexGateway',
  ASSOCIATION = 'bpmn:Association',
  SEQUENCE_FLOW = 'bpmn:SequenceFlow',
  INTERMEDIATE_THROW_EVENT = 'bpmn:IntermediateThrowEvent',
  TASK = 'bpmn:Task',
  ERROR_EVENT_DEFINITION = 'bpmn:ErrorEventDefinition',
  BOUNDARY_EVENT = 'bpmn:BoundaryEvent'
}