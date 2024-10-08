const EMPTY_PROCESS_DEFINITION = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="Process_1" isExecutable="true">
    <bpmn2:startEvent id="StartEvent_1">
      <bpmn2:outgoing>Flow_1o48sj4</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:endEvent id="Event_0ddt043">
      <bpmn2:incoming>Flow_1syiccm</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_1o48sj4" sourceRef="StartEvent_1" targetRef="Activity_0a1ma4g" />
    <bpmn2:serviceTask id="Activity_0vl0npo" camunda:actionId="browser.read.text" camunda:label="Read definition" camunda:processOutput="true" implementation="\${environment.services.desktop()}">
      <bpmn2:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="target">xpath=#{rpaParagraphXpath}</camunda:inputParameter>
          <camunda:inputParameter name="script">browser.read.text</camunda:inputParameter>
          <camunda:outputParameter name="variableName">rpaDefinition</camunda:outputParameter>
          <camunda:outputParameter name="rpaDefinition">\${content.output[0]}</camunda:outputParameter>
        </camunda:inputOutput>
      </bpmn2:extensionElements>
      <bpmn2:incoming>Flow_0n8djek</bpmn2:incoming>
      <bpmn2:outgoing>Flow_1syiccm</bpmn2:outgoing>
    </bpmn2:serviceTask>
    <bpmn2:sequenceFlow id="Flow_1syiccm" sourceRef="Activity_0vl0npo" targetRef="Event_0ddt043" />
    <bpmn2:serviceTask id="Activity_06vjg41" camunda:actionId="variables.assign" camunda:label="Assign RPA paragraph XPath variable" implementation="\${environment.services.desktop()}">
      <bpmn2:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="variable">rpaParagraphXpath</camunda:inputParameter>
          <camunda:inputParameter name="value">//*[@id="mw-content-text"]/div[1]/p[1]</camunda:inputParameter>
          <camunda:inputParameter name="script">variables.assign</camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn2:extensionElements>
      <bpmn2:incoming>Flow_0b6s1l5</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0ntigx6</bpmn2:outgoing>
    </bpmn2:serviceTask>
    <bpmn2:sequenceFlow id="Flow_0ntigx6" sourceRef="Activity_06vjg41" targetRef="Activity_0x92hir" />
    <bpmn2:serviceTask id="Activity_0x92hir" camunda:actionId="browser.selenium.open" camunda:label="Open RPA wiki site" implementation="\${environment.services.desktop()}">
      <bpmn2:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="target">https://en.wikipedia.org/wiki/Robotic_process_automation</camunda:inputParameter>
          <camunda:inputParameter name="script">browser.selenium.open</camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn2:extensionElements>
      <bpmn2:incoming>Flow_0ntigx6</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0n8djek</bpmn2:outgoing>
    </bpmn2:serviceTask>
    <bpmn2:sequenceFlow id="Flow_0n8djek" sourceRef="Activity_0x92hir" targetRef="Activity_0vl0npo" />
    <bpmn2:serviceTask id="Activity_0a1ma4g" camunda:actionId="browser.launch" camunda:label="" implementation="\${environment.services.desktop()}">
      <bpmn2:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="headless" type="Boolean">${true}</camunda:inputParameter>
          <camunda:inputParameter name="target" />
          <camunda:inputParameter name="script">browser.launch</camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn2:extensionElements>
      <bpmn2:incoming>Flow_1o48sj4</bpmn2:incoming>
      <bpmn2:outgoing>Flow_0b6s1l5</bpmn2:outgoing>
    </bpmn2:serviceTask>
    <bpmn2:sequenceFlow id="Flow_0b6s1l5" sourceRef="Activity_0a1ma4g" targetRef="Activity_06vjg41" />
    <bpmn2:boundaryEvent id="Event_0wmbw75" attachedToRef="Activity_0a1ma4g">
      <bpmn2:outgoing>Flow_1bt45yr</bpmn2:outgoing>
      <bpmn2:errorEventDefinition id="ErrorEventDefinition_0py8vol" />
    </bpmn2:boundaryEvent>
    <bpmn2:serviceTask id="Activity_159qjss" camunda:actionId="general.console.log" camunda:label="Browser error info" implementation="\${environment.services.desktop()}">
      <bpmn2:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="script">general.console.log</camunda:inputParameter>
          <camunda:inputParameter name="variables">
            <camunda:map>
              <camunda:entry key="Could not open browser">New Value</camunda:entry>
            </camunda:map>
          </camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn2:extensionElements>
      <bpmn2:incoming>Flow_1bt45yr</bpmn2:incoming>
      <bpmn2:outgoing>Flow_13dy3rl</bpmn2:outgoing>
    </bpmn2:serviceTask>
    <bpmn2:sequenceFlow id="Flow_1bt45yr" sourceRef="Event_0wmbw75" targetRef="Activity_159qjss" />
    <bpmn2:endEvent id="Event_1pvszau">
      <bpmn2:incoming>Flow_13dy3rl</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:sequenceFlow id="Flow_13dy3rl" sourceRef="Activity_159qjss" targetRef="Event_1pvszau" />
    <bpmn2:textAnnotation id="TextAnnotation_0maqani">
      <bpmn2:text>Assign value to variable</bpmn2:text>
    </bpmn2:textAnnotation>
    <bpmn2:association id="Association_1yez41b" sourceRef="Activity_06vjg41" targetRef="TextAnnotation_0maqani" />
    <bpmn2:textAnnotation id="TextAnnotation_07dcb4q">
      <bpmn2:text>Open site</bpmn2:text>
    </bpmn2:textAnnotation>
    <bpmn2:association id="Association_1hdfrxc" sourceRef="Activity_0x92hir" targetRef="TextAnnotation_07dcb4q" />
    <bpmn2:textAnnotation id="TextAnnotation_1ssy5gv">
      <bpmn2:text>Read text</bpmn2:text>
    </bpmn2:textAnnotation>
    <bpmn2:association id="Association_1lebmml" sourceRef="Activity_0vl0npo" targetRef="TextAnnotation_1ssy5gv" />
    <bpmn2:textAnnotation id="TextAnnotation_0qlpf1n">
      <bpmn2:text>Console log</bpmn2:text>
    </bpmn2:textAnnotation>
    <bpmn2:association id="Association_04hwvai" sourceRef="Activity_159qjss" targetRef="TextAnnotation_0qlpf1n" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_13dy3rl_di" bpmnElement="Flow_13dy3rl">
        <di:waypoint x="620" y="430" />
        <di:waypoint x="752" y="430" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1bt45yr_di" bpmnElement="Flow_1bt45yr">
        <di:waypoint x="390" y="316" />
        <di:waypoint x="390" y="430" />
        <di:waypoint x="520" y="430" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0b6s1l5_di" bpmnElement="Flow_0b6s1l5">
        <di:waypoint x="390" y="258" />
        <di:waypoint x="520" y="258" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0n8djek_di" bpmnElement="Flow_0n8djek">
        <di:waypoint x="850" y="258" />
        <di:waypoint x="980" y="258" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0ntigx6_di" bpmnElement="Flow_0ntigx6">
        <di:waypoint x="620" y="258" />
        <di:waypoint x="750" y="258" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1syiccm_di" bpmnElement="Flow_1syiccm">
        <di:waypoint x="1080" y="258" />
        <di:waypoint x="1192" y="258" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1o48sj4_di" bpmnElement="Flow_1o48sj4">
        <di:waypoint x="178" y="258" />
        <di:waypoint x="290" y="258" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="142" y="240" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0ddt043_di" bpmnElement="Event_0ddt043">
        <dc:Bounds x="1192" y="240" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0vl0npo_di" bpmnElement="Activity_0vl0npo">
        <dc:Bounds x="980" y="218" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_06vjg41_di" bpmnElement="Activity_06vjg41">
        <dc:Bounds x="520" y="218" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0x92hir_di" bpmnElement="Activity_0x92hir">
        <dc:Bounds x="750" y="218" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0a1ma4g_di" bpmnElement="Activity_0a1ma4g">
        <dc:Bounds x="290" y="218" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_159qjss_di" bpmnElement="Activity_159qjss">
        <dc:Bounds x="520" y="390" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1pvszau_di" bpmnElement="Event_1pvszau">
        <dc:Bounds x="752" y="412" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="TextAnnotation_0maqani_di" bpmnElement="TextAnnotation_0maqani">
        <dc:Bounds x="620" y="130" width="130" height="41" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="TextAnnotation_07dcb4q_di" bpmnElement="TextAnnotation_07dcb4q">
        <dc:Bounds x="850" y="130" width="140" height="30" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="TextAnnotation_1ssy5gv_di" bpmnElement="TextAnnotation_1ssy5gv">
        <dc:Bounds x="1080" y="130" width="100" height="30" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="TextAnnotation_0qlpf1n_di" bpmnElement="TextAnnotation_0qlpf1n">
        <dc:Bounds x="650" y="510" width="130" height="30" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1ks1a0f_di" bpmnElement="Event_0wmbw75">
        <dc:Bounds x="372" y="280" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Association_1yez41b_di" bpmnElement="Association_1yez41b">
        <di:waypoint x="605" y="218" />
        <di:waypoint x="647" y="171" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_1hdfrxc_di" bpmnElement="Association_1hdfrxc">
        <di:waypoint x="835" y="218" />
        <di:waypoint x="887" y="160" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_1lebmml_di" bpmnElement="Association_1lebmml">
        <di:waypoint x="1065" y="218" />
        <di:waypoint x="1117" y="160" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Association_04hwvai_di" bpmnElement="Association_04hwvai">
        <di:waypoint x="619" y="466" />
        <di:waypoint x="679" y="510" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
`;
