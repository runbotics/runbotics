package com.runbotics.domain;

import com.fasterxml.jackson.annotation.*;
import com.runbotics.modules.bot.entity.ProcessInstanceStatus;
import com.runbotics.service.impl.ProcessInstanceEntityListener;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Set;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Type;

/**
 * A ProcessInstance.
 */
@Entity
@Table(name = "process_instance")
@EntityListeners(ProcessInstanceEntityListener.class)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ProcessInstance implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private UUID id;

    @Column(name = "root_process_instance_id")
    private UUID rootProcessInstanceId;

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
    @NotNull
    private User user;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "createdBy" }, allowSetters = true)
    private Process process;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private Bot bot;

    @Column
    private boolean scheduled;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "root_process_instance_id", referencedColumnName = "id")
    private Set<ProcessInstance> subProcesses;

    @Column(name = "error")
    private String error;

    // jhipster-needle-entity-add-field - JHipster will add fields here
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

    public boolean isScheduled() {
        return scheduled;
    }

    public void setScheduled(boolean scheduled) {
        this.scheduled = scheduled;
    }

    public Set<ProcessInstance> getSubProcesses() {
        return subProcesses;
    }

    public void setSubProcesses(Set<ProcessInstance> subProcesses) {
        this.subProcesses = subProcesses;
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
            ", parentId='" + getRootProcessInstanceId() + "'" +
            ", orchestratorProcessInstanceId='" + getOrchestratorProcessInstanceId() + "'" +
            ", status='" + getStatus() + "'" +
            ", created='" + getCreated() + "'" +
            ", updated='" + getUpdated() + "'" +
            ", input='" + getInput() + "'" +
            ", output='" + getOutput() + "'" +
            ", step='" + getStep() + "'" +
            ", user='" + getUser().getEmail() + "'" +
            ", scheduled='" + isScheduled() + "'" +
            ", error='" + getError() + "'" +
            "}";
    }
}
