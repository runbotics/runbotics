package com.runbotics.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.JsonNode;
import com.runbotics.modules.bot.entity.ProcessInstanceStatus;
import com.vladmihalcea.hibernate.type.json.JsonType;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

/**
 * A ProcessInstance.
 */
@Entity
@Table(name = "process_instance")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@TypeDef(name = "json", typeClass = JsonType.class)
public class ProcessInstance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private UUID id;

    @Column(name = "root_process_instance_id")
    private UUID rootProcessInstanceId;

    @Column(name = "parent_process_instance_id")
    private UUID parentProcessInstanceId;

    @Column(name = "orchestrator_process_instance_id")
    private String orchestratorProcessInstanceId;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ProcessInstanceStatus status;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "updated")
    private ZonedDateTime updated;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "input")
    private String input;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "output")
    private String output;

    @Column(name = "step")
    private String step;

    @ManyToOne
    private User user;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "createdBy" }, allowSetters = true)
    private Process process;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private Bot bot;

    @Formula(
        "(SELECT CASE WHEN EXISTS (SELECT id FROM process_instance WHERE process_instance.parent_process_instance_id = id OR process_instance.root_process_instance_id = id) THEN 'TRUE' ELSE 'FALSE' END)"
    )
    private boolean hasSubprocesses;

    @Column(name = "error")
    private String error;

    @Column(name = "warning")
    private Boolean warning;

    @ManyToOne
    @JoinColumn(name = "trigger", referencedColumnName = "name")
    private TriggerEvent trigger;

    @Type(type = "json")
    @Column(name = "trigger_data", columnDefinition = "json")
    private JsonNode triggerData;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public ProcessInstance id(UUID id) {
        this.id = id;
        return this;
    }

    public UUID getRootProcessInstanceId() {
        return this.rootProcessInstanceId;
    }

    public void setRootProcessInstanceId(UUID rootProcessInstanceId) {
        this.rootProcessInstanceId = rootProcessInstanceId;
    }

    public UUID getParentProcessInstanceId() {
        return this.parentProcessInstanceId;
    }

    public void setParentProcessInstanceId(UUID parentProcessInstanceId) {
        this.parentProcessInstanceId = parentProcessInstanceId;
    }

    public String getOrchestratorProcessInstanceId() {
        return this.orchestratorProcessInstanceId;
    }

    public ProcessInstance orchestratorProcessInstanceId(String orchestratorProcessInstanceId) {
        this.orchestratorProcessInstanceId = orchestratorProcessInstanceId;
        return this;
    }

    public void setOrchestratorProcessInstanceId(String orchestratorProcessInstanceId) {
        this.orchestratorProcessInstanceId = orchestratorProcessInstanceId;
    }

    public ProcessInstanceStatus getStatus() {
        return this.status;
    }

    public ProcessInstance status(ProcessInstanceStatus status) {
        this.status = status;
        return this;
    }

    public void setStatus(ProcessInstanceStatus status) {
        this.status = status;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public ProcessInstance created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getUpdated() {
        return this.updated;
    }

    public ProcessInstance updated(ZonedDateTime updated) {
        this.updated = updated;
        return this;
    }

    public void setUpdated(ZonedDateTime updated) {
        this.updated = updated;
    }

    public String getInput() {
        return this.input;
    }

    public ProcessInstance input(String input) {
        this.input = input;
        return this;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public String getOutput() {
        return this.output;
    }

    public ProcessInstance output(String output) {
        this.output = output;
        return this;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public String getStep() {
        return this.step;
    }

    public ProcessInstance step(String step) {
        this.step = step;
        return this;
    }

    public void setStep(String step) {
        this.step = step;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Process getProcess() {
        return this.process;
    }

    public ProcessInstance process(Process process) {
        this.setProcess(process);
        return this;
    }

    public void setProcess(Process process) {
        this.process = process;
    }

    public Bot getBot() {
        return this.bot;
    }

    public ProcessInstance bot(Bot bot) {
        this.setBot(bot);
        return this;
    }

    public void setBot(Bot bot) {
        this.bot = bot;
    }

    public boolean getHasSubprocesses() {
        return hasSubprocesses;
    }

    public void setHasSubprocesses(boolean hasSubprocesses) {
        this.hasSubprocesses = hasSubprocesses;
    }

    public String getError() {
        return this.error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public TriggerEvent getTrigger() {
        return trigger;
    }

    public void setTrigger(TriggerEvent trigger) {
        this.trigger = trigger;
    }

    public JsonNode getTriggerData() {
        return triggerData;
    }

    public void setTriggerData(JsonNode triggerData) {
        this.triggerData = triggerData;
    }

    public Boolean getWarning() {
        return this.warning;
    }

    public void setWarning(Boolean warning) {
        this.warning = warning;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ProcessInstance)) {
            return false;
        }
        return id != null && id.equals(((ProcessInstance) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProcessInstance{" +
            "id=" + getId() +
            ", parentId='" + getParentProcessInstanceId() + "'" +
            ", rootId='" + getRootProcessInstanceId() + "'" +
            ", orchestratorProcessInstanceId='" + getOrchestratorProcessInstanceId() + "'" +
            ", status='" + getStatus() + "'" +
            ", created='" + getCreated() + "'" +
            ", updated='" + getUpdated() + "'" +
            ", input='" + getInput() + "'" +
            ", output='" + getOutput() + "'" +
            ", step='" + getStep() + "'" +
            ", user='" + getUser().getEmail() + "'" +
            ", error='" + getError() + "'" +
            ", trigger='" + getTrigger() + "'" +
            ", triggerData='" + getTriggerData() + "'" +
            ", hasSubprocesses='" + getHasSubprocesses() + "'" +
            "}";
    }
}
