package com.runbotics.domain;

public class ProcessConstants {

    public static String emptyProcessDefinition = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<bpmn2:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn2=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xmlns:camunda=\"http://camunda.org/schema/1.0/bpmn\" id=\"sample-diagram\" targetNamespace=\"http://bpmn.io/schema/bpmn\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\">\n" +
        "  <bpmn2:process id=\"Process_1\" isExecutable=\"true\">\n" +
        "    <bpmn2:startEvent id=\"StartEvent_1\">\n" +
        "      <bpmn2:outgoing>Flow_1o48sj4</bpmn2:outgoing>\n" +
        "    </bpmn2:startEvent>\n" +
        "    <bpmn2:endEvent id=\"Event_0ddt043\">\n" +
        "      <bpmn2:incoming>Flow_1syiccm</bpmn2:incoming>\n" +
        "    </bpmn2:endEvent>\n" +
        "    <bpmn2:sequenceFlow id=\"Flow_1o48sj4\" sourceRef=\"StartEvent_1\" targetRef=\"Activity_0a1ma4g\" />\n" +
        "    <bpmn2:serviceTask id=\"Activity_0vl0npo\" camunda:actionId=\"browser.read.text\" camunda:label=\"Read definition\" camunda:processOutput=\"true\" implementation=\"${environment.services.desktop()}\">\n" +
        "      <bpmn2:extensionElements>\n" +
        "        <camunda:inputOutput>\n" +
        "          <camunda:inputParameter name=\"target\">xpath=#{rpaParagraphXpath}</camunda:inputParameter>\n" +
        "          <camunda:inputParameter name=\"script\">browser.read.text</camunda:inputParameter>\n" +
        "          <camunda:outputParameter name=\"variableName\">rpaDefinition</camunda:outputParameter>\n" +
        "          <camunda:outputParameter name=\"rpaDefinition\">${content.output[0]}</camunda:outputParameter>\n" +
        "        </camunda:inputOutput>\n" +
        "      </bpmn2:extensionElements>\n" +
        "      <bpmn2:incoming>Flow_0n8djek</bpmn2:incoming>\n" +
        "      <bpmn2:outgoing>Flow_1syiccm</bpmn2:outgoing>\n" +
        "    </bpmn2:serviceTask>\n" +
        "    <bpmn2:sequenceFlow id=\"Flow_1syiccm\" sourceRef=\"Activity_0vl0npo\" targetRef=\"Event_0ddt043\" />\n" +
        "    <bpmn2:serviceTask id=\"Activity_06vjg41\" camunda:actionId=\"variables.assign\" camunda:label=\"Assign RPA paragraph XPath variable\" implementation=\"${environment.services.desktop()}\">\n" +
        "      <bpmn2:extensionElements>\n" +
        "        <camunda:inputOutput>\n" +
        "          <camunda:inputParameter name=\"variable\">rpaParagraphXpath</camunda:inputParameter>\n" +
        "          <camunda:inputParameter name=\"value\">//*[@id=\"mw-content-text\"]/div[1]/p[1]</camunda:inputParameter>\n" +
        "          <camunda:inputParameter name=\"script\">variables.assign</camunda:inputParameter>\n" +
        "        </camunda:inputOutput>\n" +
        "      </bpmn2:extensionElements>\n" +
        "      <bpmn2:incoming>Flow_0b6s1l5</bpmn2:incoming>\n" +
        "      <bpmn2:outgoing>Flow_0ntigx6</bpmn2:outgoing>\n" +
        "    </bpmn2:serviceTask>\n" +
        "    <bpmn2:sequenceFlow id=\"Flow_0ntigx6\" sourceRef=\"Activity_06vjg41\" targetRef=\"Activity_0x92hir\" />\n" +
        "    <bpmn2:serviceTask id=\"Activity_0x92hir\" camunda:actionId=\"browser.selenium.open\" camunda:label=\"Open RPA wiki site\" implementation=\"${environment.services.desktop()}\">\n" +
        "      <bpmn2:extensionElements>\n" +
        "        <camunda:inputOutput>\n" +
        "          <camunda:inputParameter name=\"target\">https://en.wikipedia.org/wiki/Robotic_process_automation</camunda:inputParameter>\n" +
        "          <camunda:inputParameter name=\"script\">browser.selenium.open</camunda:inputParameter>\n" +
        "        </camunda:inputOutput>\n" +
        "      </bpmn2:extensionElements>\n" +
        "      <bpmn2:incoming>Flow_0ntigx6</bpmn2:incoming>\n" +
        "      <bpmn2:outgoing>Flow_0n8djek</bpmn2:outgoing>\n" +
        "    </bpmn2:serviceTask>\n" +
        "    <bpmn2:sequenceFlow id=\"Flow_0n8djek\" sourceRef=\"Activity_0x92hir\" targetRef=\"Activity_0vl0npo\" />\n" +
        "    <bpmn2:serviceTask id=\"Activity_0a1ma4g\" camunda:actionId=\"browser.launch\" camunda:label=\"\" implementation=\"${environment.services.desktop()}\">\n" +
        "      <bpmn2:extensionElements>\n" +
        "        <camunda:inputOutput>\n" +
        "          <camunda:inputParameter name=\"headless\" type=\"Boolean\">${true}</camunda:inputParameter>\n" +
        "          <camunda:inputParameter name=\"target\" />\n" +
        "          <camunda:inputParameter name=\"script\">browser.launch</camunda:inputParameter>\n" +
        "        </camunda:inputOutput>\n" +
        "      </bpmn2:extensionElements>\n" +
        "      <bpmn2:incoming>Flow_1o48sj4</bpmn2:incoming>\n" +
        "      <bpmn2:outgoing>Flow_0b6s1l5</bpmn2:outgoing>\n" +
        "    </bpmn2:serviceTask>\n" +
        "    <bpmn2:sequenceFlow id=\"Flow_0b6s1l5\" sourceRef=\"Activity_0a1ma4g\" targetRef=\"Activity_06vjg41\" />\n" +
        "    <bpmn2:boundaryEvent id=\"Event_0wmbw75\" attachedToRef=\"Activity_0a1ma4g\">\n" +
        "      <bpmn2:outgoing>Flow_1bt45yr</bpmn2:outgoing>\n" +
        "      <bpmn2:errorEventDefinition id=\"ErrorEventDefinition_0py8vol\" />\n" +
        "    </bpmn2:boundaryEvent>\n" +
        "    <bpmn2:serviceTask id=\"Activity_159qjss\" camunda:actionId=\"general.console.log\" camunda:label=\"Browser error info\" implementation=\"${environment.services.desktop()}\">\n" +
        "      <bpmn2:extensionElements>\n" +
        "        <camunda:inputOutput>\n" +
        "          <camunda:inputParameter name=\"script\">general.console.log</camunda:inputParameter>\n" +
        "          <camunda:inputParameter name=\"variables\">\n" +
        "            <camunda:map>\n" +
        "              <camunda:entry key=\"Could not open browser\">New Value</camunda:entry>\n" +
        "            </camunda:map>\n" +
        "          </camunda:inputParameter>\n" +
        "        </camunda:inputOutput>\n" +
        "      </bpmn2:extensionElements>\n" +
        "      <bpmn2:incoming>Flow_1bt45yr</bpmn2:incoming>\n" +
        "      <bpmn2:outgoing>Flow_13dy3rl</bpmn2:outgoing>\n" +
        "    </bpmn2:serviceTask>\n" +
        "    <bpmn2:sequenceFlow id=\"Flow_1bt45yr\" sourceRef=\"Event_0wmbw75\" targetRef=\"Activity_159qjss\" />\n" +
        "    <bpmn2:endEvent id=\"Event_1pvszau\">\n" +
        "      <bpmn2:incoming>Flow_13dy3rl</bpmn2:incoming>\n" +
        "    </bpmn2:endEvent>\n" +
        "    <bpmn2:sequenceFlow id=\"Flow_13dy3rl\" sourceRef=\"Activity_159qjss\" targetRef=\"Event_1pvszau\" />\n" +
        "    <bpmn2:textAnnotation id=\"TextAnnotation_0maqani\">\n" +
        "      <bpmn2:text>Assign value to variable</bpmn2:text>\n" +
        "    </bpmn2:textAnnotation>\n" +
        "    <bpmn2:association id=\"Association_1yez41b\" sourceRef=\"Activity_06vjg41\" targetRef=\"TextAnnotation_0maqani\" />\n" +
        "    <bpmn2:textAnnotation id=\"TextAnnotation_07dcb4q\">\n" +
        "      <bpmn2:text>Open site</bpmn2:text>\n" +
        "    </bpmn2:textAnnotation>\n" +
        "    <bpmn2:association id=\"Association_1hdfrxc\" sourceRef=\"Activity_0x92hir\" targetRef=\"TextAnnotation_07dcb4q\" />\n" +
        "    <bpmn2:textAnnotation id=\"TextAnnotation_1ssy5gv\">\n" +
        "      <bpmn2:text>Read text</bpmn2:text>\n" +
        "    </bpmn2:textAnnotation>\n" +
        "    <bpmn2:association id=\"Association_1lebmml\" sourceRef=\"Activity_0vl0npo\" targetRef=\"TextAnnotation_1ssy5gv\" />\n" +
        "    <bpmn2:textAnnotation id=\"TextAnnotation_0qlpf1n\">\n" +
        "      <bpmn2:text>Console log</bpmn2:text>\n" +
        "    </bpmn2:textAnnotation>\n" +
        "    <bpmn2:association id=\"Association_04hwvai\" sourceRef=\"Activity_159qjss\" targetRef=\"TextAnnotation_0qlpf1n\" />\n" +
        "  </bpmn2:process>\n" +
        "  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n" +
        "    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1\">\n" +
        "      <bpmndi:BPMNEdge id=\"Flow_13dy3rl_di\" bpmnElement=\"Flow_13dy3rl\">\n" +
        "        <di:waypoint x=\"620\" y=\"430\" />\n" +
        "        <di:waypoint x=\"752\" y=\"430\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "      <bpmndi:BPMNEdge id=\"Flow_1bt45yr_di\" bpmnElement=\"Flow_1bt45yr\">\n" +
        "        <di:waypoint x=\"390\" y=\"316\" />\n" +
        "        <di:waypoint x=\"390\" y=\"430\" />\n" +
        "        <di:waypoint x=\"520\" y=\"430\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "      <bpmndi:BPMNEdge id=\"Flow_0b6s1l5_di\" bpmnElement=\"Flow_0b6s1l5\">\n" +
        "        <di:waypoint x=\"390\" y=\"258\" />\n" +
        "        <di:waypoint x=\"520\" y=\"258\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "      <bpmndi:BPMNEdge id=\"Flow_0n8djek_di\" bpmnElement=\"Flow_0n8djek\">\n" +
        "        <di:waypoint x=\"850\" y=\"258\" />\n" +
        "        <di:waypoint x=\"980\" y=\"258\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "      <bpmndi:BPMNEdge id=\"Flow_0ntigx6_di\" bpmnElement=\"Flow_0ntigx6\">\n" +
        "        <di:waypoint x=\"620\" y=\"258\" />\n" +
        "        <di:waypoint x=\"750\" y=\"258\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "      <bpmndi:BPMNEdge id=\"Flow_1syiccm_di\" bpmnElement=\"Flow_1syiccm\">\n" +
        "        <di:waypoint x=\"1080\" y=\"258\" />\n" +
        "        <di:waypoint x=\"1192\" y=\"258\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "      <bpmndi:BPMNEdge id=\"Flow_1o48sj4_di\" bpmnElement=\"Flow_1o48sj4\">\n" +
        "        <di:waypoint x=\"178\" y=\"258\" />\n" +
        "        <di:waypoint x=\"290\" y=\"258\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n" +
        "        <dc:Bounds x=\"142\" y=\"240\" width=\"36\" height=\"36\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"Event_0ddt043_di\" bpmnElement=\"Event_0ddt043\">\n" +
        "        <dc:Bounds x=\"1192\" y=\"240\" width=\"36\" height=\"36\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"Activity_0vl0npo_di\" bpmnElement=\"Activity_0vl0npo\">\n" +
        "        <dc:Bounds x=\"980\" y=\"218\" width=\"100\" height=\"80\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"Activity_06vjg41_di\" bpmnElement=\"Activity_06vjg41\">\n" +
        "        <dc:Bounds x=\"520\" y=\"218\" width=\"100\" height=\"80\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"Activity_0x92hir_di\" bpmnElement=\"Activity_0x92hir\">\n" +
        "        <dc:Bounds x=\"750\" y=\"218\" width=\"100\" height=\"80\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"Activity_0a1ma4g_di\" bpmnElement=\"Activity_0a1ma4g\">\n" +
        "        <dc:Bounds x=\"290\" y=\"218\" width=\"100\" height=\"80\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"Activity_159qjss_di\" bpmnElement=\"Activity_159qjss\">\n" +
        "        <dc:Bounds x=\"520\" y=\"390\" width=\"100\" height=\"80\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"Event_1pvszau_di\" bpmnElement=\"Event_1pvszau\">\n" +
        "        <dc:Bounds x=\"752\" y=\"412\" width=\"36\" height=\"36\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"TextAnnotation_0maqani_di\" bpmnElement=\"TextAnnotation_0maqani\">\n" +
        "        <dc:Bounds x=\"620\" y=\"130\" width=\"130\" height=\"41\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"TextAnnotation_07dcb4q_di\" bpmnElement=\"TextAnnotation_07dcb4q\">\n" +
        "        <dc:Bounds x=\"850\" y=\"130\" width=\"140\" height=\"30\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"TextAnnotation_1ssy5gv_di\" bpmnElement=\"TextAnnotation_1ssy5gv\">\n" +
        "        <dc:Bounds x=\"1080\" y=\"130\" width=\"100\" height=\"30\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"TextAnnotation_0qlpf1n_di\" bpmnElement=\"TextAnnotation_0qlpf1n\">\n" +
        "        <dc:Bounds x=\"650\" y=\"510\" width=\"130\" height=\"30\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNShape id=\"Event_1ks1a0f_di\" bpmnElement=\"Event_0wmbw75\">\n" +
        "        <dc:Bounds x=\"372\" y=\"280\" width=\"36\" height=\"36\" />\n" +
        "      </bpmndi:BPMNShape>\n" +
        "      <bpmndi:BPMNEdge id=\"Association_1yez41b_di\" bpmnElement=\"Association_1yez41b\">\n" +
        "        <di:waypoint x=\"605\" y=\"218\" />\n" +
        "        <di:waypoint x=\"647\" y=\"171\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "      <bpmndi:BPMNEdge id=\"Association_1hdfrxc_di\" bpmnElement=\"Association_1hdfrxc\">\n" +
        "        <di:waypoint x=\"835\" y=\"218\" />\n" +
        "        <di:waypoint x=\"887\" y=\"160\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "      <bpmndi:BPMNEdge id=\"Association_1lebmml_di\" bpmnElement=\"Association_1lebmml\">\n" +
        "        <di:waypoint x=\"1065\" y=\"218\" />\n" +
        "        <di:waypoint x=\"1117\" y=\"160\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "      <bpmndi:BPMNEdge id=\"Association_04hwvai_di\" bpmnElement=\"Association_04hwvai\">\n" +
        "        <di:waypoint x=\"619\" y=\"466\" />\n" +
        "        <di:waypoint x=\"679\" y=\"510\" />\n" +
        "      </bpmndi:BPMNEdge>\n" +
        "    </bpmndi:BPMNPlane>\n" +
        "  </bpmndi:BPMNDiagram>\n" +
        "</bpmn2:definitions>\n";
}
