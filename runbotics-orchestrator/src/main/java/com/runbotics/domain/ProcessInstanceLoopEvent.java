package com.runbotics.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.runbotics.modules.bot.entity.ProcessInstanceEventStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Type;

/**
 * A ProcessInstanceLoopEvent.
 */
@Entity
@Table(name = "process_instance_loop_event")
public class ProcessInstanceLoopEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "created")
    private ZonedDateTime created;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "log")
    private String log;

    @Column(name = "step")
    private String step;

    @ManyToOne
    @JsonIgnoreProperties(value = { "process", "bot" }, allowSetters = true)
    private ProcessInstance processInstance;

    @Column(name = "execution_id")
    private String executionId;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "input")
    private String input;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "output")
    private String output;

    @Column(name = "finished")
    private ZonedDateTime finished;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ProcessInstanceEventStatus status;

    @Column(name = "error")
    private String error;

    @Column(name = "script")
    private String script;

    @Column(name = "iteration_number")
    private Integer iterationNumber;

    @Column(name = "loop_id")
    private String loopId;

    @Column(name = "iteration_element")
    private String iterationElement;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProcessInstanceLoopEvent id(Long id) {
        this.id = id;
        return this;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public ProcessInstanceLoopEvent created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public String getLog() {
        return this.log;
    }

    public ProcessInstanceLoopEvent log(String log) {
        this.log = log;
        return this;
    }

    public void setLog(String log) {
        this.log = log;
    }

    public String getStep() {
        return this.step;
    }

    public Integer getIterationNumber() {
        return this.iterationNumber;
    }

    public String getLoopId() {
        return this.loopId;
    }

    public String getIterationElement() {
        return this.iterationElement;
    }

    public ProcessInstanceLoopEvent step(String step) {
        this.step = step;
        return this;
    }

    public void setStep(String step) {
        this.step = step;
    }

    public ProcessInstance getProcessInstance() {
        return this.processInstance;
    }

    public ProcessInstanceLoopEvent processInstance(ProcessInstance processInstance) {
        this.setProcessInstance(processInstance);
        return this;
    }

    public void setProcessInstance(ProcessInstance processInstance) {
        this.processInstance = processInstance;
    }

    public String getExecutionId() {
        return this.executionId;
    }

    public String getScript() { return this.script; }

    public ProcessInstanceLoopEvent executionId(String executionId) {
        this.executionId = executionId;
        return this;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }

    public String getInput() {
        return this.input;
    }

    public ProcessInstanceLoopEvent input(String input) {
        this.input = input;
        return this;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getOutput() {
        return this.output;
    }

    public ProcessInstanceLoopEvent output(String output) {
        this.output = output;
        return this;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public ZonedDateTime getFinished() {
        return this.finished;
    }

    public ProcessInstanceLoopEvent finished(ZonedDateTime finished) {
        this.finished = finished;
        return this;
    }

    public void setFinished(ZonedDateTime finished) {
        this.finished = finished;
    }

    public ProcessInstanceEventStatus getStatus() {
        return this.status;
    }

    public ProcessInstanceLoopEvent status(ProcessInstanceEventStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ProcessInstanceEventStatus status) {
        this.status = status;
    }

    public void setIterationNumber(Integer iterationNumber) {
        this.iterationNumber = iterationNumber;
    }

    public void setLoopId(String loopId) {
        this.loopId = loopId;
    }

    public void setIterationElement(String iterationElement) {
        this.iterationElement = iterationElement;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public String getError() {
        return this.error;
    }

    public void setError(String error) {
        this.error = error;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProcessInstanceLoopEvent)) {
            return false;
        }
        return id != null && id.equals(((ProcessInstanceLoopEvent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessInstanceLoopEvent{" +
            "id=" + getId() +
            ", created='" + getCreated() + "'" +
            ", log='" + getLog() + "'" +
            ", step='" + getStep() + "'" +
            ", script='" + getScript() + "'" +
            ", iterationNumber='" + getIterationNumber() + "'" +
            ", loopId='" + getLoopId() + "'" +
            ", iterationElement='" + getIterationElement() + "'" +
            ", executionId='" + getExecutionId() + "'" +
            ", input='" + getInput() + "'" +
            ", output='" + getOutput() + "'" +
            ", finished='" + getFinished() + "'" +
            ", status='" + getStatus() + "'" +
            ", error='" + getError() + "'" +
            "}";
    }
}
