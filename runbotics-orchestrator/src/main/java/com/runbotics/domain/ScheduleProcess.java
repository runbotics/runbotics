package com.runbotics.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * A ScheduleProcess.
 */
@Entity
@Table(name = "schedule_process")
public class ScheduleProcess implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "cron", nullable = false)
    private String cron;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "createdBy" }, allowSetters = true)
    private Process process;

    @ManyToOne(optional = false)
    @NotNull
    private User user;

    @Column(name = "input_variables")
    private String inputVariables;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ScheduleProcess id(Long id) {
        this.id = id;
        return this;
    }

    public String getCron() {
        return this.cron;
    }

    public ScheduleProcess cron(String cron) {
        this.cron = cron;
        return this;
    }

    public void setCron(String cron) {
        this.cron = cron;
    }

    public Process getProcess() {
        return this.process;
    }

    public ScheduleProcess process(Process process) {
        this.setProcess(process);
        return this;
    }

    public void setProcess(Process process) {
        this.process = process;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getInputVariables() {
        return inputVariables;
    }

    public void setInputVariables(String inputVariables) {
        this.inputVariables = inputVariables;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ScheduleProcess)) {
            return false;
        }
        return id != null && id.equals(((ScheduleProcess) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ScheduleProcess{" +
            "id=" + getId() +
            ", cron='" + getCron() + "'" +
            ", inputVariables='" + getInputVariables() + "'" +
            "}";
    }
}
