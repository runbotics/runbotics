package com.runbotics.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.runbotics.modules.bot.entity.ProcessInstanceEventStatus;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Type;

/**
 * A ProcessInstanceEvent.
 */
@Entity
@Table(name = "process_instance_event")
public class ProcessInstanceEvent implements Serializable {

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

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProcessInstanceEvent id(Long id) {
        this.id = id;
        return this;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public ProcessInstanceEvent created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public String getLog() {
        return this.log;
    }

    public ProcessInstanceEvent log(String log) {
        this.log = log;
        return this;
    }

    public void setLog(String log) {
        this.log = log;
    }

    public String getStep() {
        return this.step;
    }

    public String getScript() { return this.script; }

    public ProcessInstanceEvent step(String step) {
        this.step = step;
        return this;
    }

    public void setStep(String step) {
        this.step = step;
    }

    public void setScript(String script) {
        this.step = script;
    }

    public ProcessInstance getProcessInstance() {
        return this.processInstance;
    }

    public ProcessInstanceEvent processInstance(ProcessInstance processInstance) {
        this.setProcessInstance(processInstance);
        return this;
    }

    public void setProcessInstance(ProcessInstance processInstance) {
        this.processInstance = processInstance;
    }

    public String getExecutionId() {
        return this.executionId;
    }

    public ProcessInstanceEvent executionId(String executionId) {
        this.executionId = executionId;
        return this;
    }

    public void setExecutionId(String executionId) {
        this.executionId = executionId;
    }

    public String getInput() {
        return this.input;
    }

    public ProcessInstanceEvent input(String input) {
        this.input = input;
        return this;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getOutput() {
        return this.output;
    }

    public ProcessInstanceEvent output(String output) {
        this.output = output;
        return this;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public ZonedDateTime getFinished() {
        return this.finished;
    }

    public ProcessInstanceEvent finished(ZonedDateTime finished) {
        this.finished = finished;
        return this;
    }

    public void setFinished(ZonedDateTime finished) {
        this.finished = finished;
    }

    public ProcessInstanceEventStatus getStatus() {
        return this.status;
    }

    public ProcessInstanceEvent status(ProcessInstanceEventStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ProcessInstanceEventStatus status) {
        this.status = status;
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
        if (!(o instanceof ProcessInstanceEvent)) {
            return false;
        }
        return id != null && id.equals(((ProcessInstanceEvent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessInstanceEvent{" +
            "id=" + getId() +
            ", created='" + getCreated() + "'" +
            ", log='" + getLog() + "'" +
            ", step='" + getStep() + "'" +
            ", script='" + getScript() + "'" +
            ", executionId='" + getExecutionId() + "'" +
            ", input='" + getInput() + "'" +
            ", output='" + getOutput() + "'" +
            ", finished='" + getFinished() + "'" +
            ", status='" + getStatus() + "'" +
            ", error='" + getError() + "'" +
            "}";
    }
}
