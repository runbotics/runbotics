package com.runbotics.domain;

public class ProcessConstants {

    public static String emptyProcessDefinition =
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<bpmn2:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn2=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" id=\"sample-diagram\" targetNamespace=\"http://bpmn.io/schema/bpmn\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\">\n" +
            "  <bpmn2:process id=\"Process_1\" isExecutable=\"true\">\n" +
            "    <bpmn2:startEvent id=\"StartEvent_1\">\n" +
            "      <bpmn2:outgoing>Flow_1o48sj4</bpmn2:outgoing>\n" +
            "    </bpmn2:startEvent>\n" +
            "    <bpmn2:endEvent id=\"Event_0ddt043\">\n" +
            "      <bpmn2:incoming>Flow_1o48sj4</bpmn2:incoming>\n" +
            "    </bpmn2:endEvent>\n" +
            "    <bpmn2:sequenceFlow id=\"Flow_1o48sj4\" sourceRef=\"StartEvent_1\" targetRef=\"Event_0ddt043\" />\n" +
            "  </bpmn2:process>\n" +
            "  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n" +
            "    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1\">\n" +
            "      <bpmndi:BPMNEdge id=\"Flow_1o48sj4_di\" bpmnElement=\"Flow_1o48sj4\">\n" +
            "        <di:waypoint x=\"448\" y=\"258\" />\n" +
            "        <di:waypoint x=\"902\" y=\"258\" />\n" +
            "      </bpmndi:BPMNEdge>\n" +
            "      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n" +
            "        <dc:Bounds x=\"412\" y=\"240\" width=\"36\" height=\"36\" />\n" +
            "      </bpmndi:BPMNShape>\n" +
            "      <bpmndi:BPMNShape id=\"Event_0ddt043_di\" bpmnElement=\"Event_0ddt043\">\n" +
            "        <dc:Bounds x=\"902\" y=\"240\" width=\"36\" height=\"36\" />\n" +
            "      </bpmndi:BPMNShape>\n" +
            "    </bpmndi:BPMNPlane>\n" +
            "  </bpmndi:BPMNDiagram>\n" +
            "</bpmn2:definitions>";
}
