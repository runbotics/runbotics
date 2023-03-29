package com.runbotics.domain;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Set;
import java.util.HashSet;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Type;
import com.runbotics.domain.GlobalVariable;

/**
 * A Process.
 */
@Entity
@Table(name = "process")
public class Process implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "description")
    private String description;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "definition")
    private String definition;

    @Column(name = "is_public")
    private Boolean isPublic;

    @Column(name = "is_attended")
    private Boolean isAttended;

    @Column(name = "is_triggerable")
    private Boolean isTriggerable;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "updated")
    private ZonedDateTime updated;

    @Column(name = "executions_count")
    private Long executionsCount;

    @Column(name = "execution_info")
    private String executionInfo;

    @Column(name = "success_executions_count")
    private Long successExecutionsCount;

    @Column(name = "failure_executions_count")
    private Long failureExecutionsCount;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "system", referencedColumnName = "name")
    private BotSystem system;

    @OneToMany(mappedBy = "process")
    private Set<ScheduleProcess> schedules;

    @ManyToOne
    @JoinColumn(name = "bot_collection")
    private BotCollection botCollection;


    @ManyToMany
    @JoinTable(
        name = "process_global_variable",
        joinColumns = @JoinColumn(name = "process_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "global_variable_id", referencedColumnName = "id"))
    private Set<GlobalVariable> globalVariables = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Process id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Process name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Process description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDefinition() {
        return this.definition;
    }

    public Process definition(String definition) {
        this.definition = definition;
        return this;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public Boolean getIsPublic() {
        return this.isPublic;
    }

    public Boolean getIsAttended() {
        return this.isAttended;
    }
    public Boolean getIsTriggerable() {
        return this.isTriggerable;
    }

    public Set<GlobalVariable> getGlobalVariables() {
        return this.globalVariables;
    }

    public Process isPublic(Boolean isPublic) {
        this.isPublic = isPublic;
        return this;
    }

    public Process isAttended(Boolean isAttended) {
        this.isAttended = isAttended;
        return this;
    }

    public Process isTriggerable(Boolean isTriggerable) {
        this.isTriggerable = isTriggerable;
        return this;
    }
    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public void setIsAttended(Boolean isAttended) {
        this.isAttended = isAttended;
    }

    public void setIsTriggerable(Boolean isTriggerable) {
        this.isTriggerable = isTriggerable;
    }

    public ZonedDateTime getCreated() {
        return this.created;
    }

    public Process created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getUpdated() {
        return this.updated;
    }

    public Process updated(ZonedDateTime updated) {
        this.updated = updated;
        return this;
    }

    public void setUpdated(ZonedDateTime updated) {
        this.updated = updated;
    }

    public Long getExecutionsCount() {
        return this.executionsCount;
    }

    public Process executionsCount(Long executionsCount) {
        this.executionsCount = executionsCount;
        return this;
    }

    public void setExecutionsCount(Long executionsCount) {
        this.executionsCount = executionsCount;
    }

    public Long getSuccessExecutionsCount() {
        return this.successExecutionsCount;
    }

    public Process successExecutionsCount(Long successExecutionsCount) {
        this.successExecutionsCount = successExecutionsCount;
        return this;
    }

    public void setSuccessExecutionsCount(Long successExecutionsCount) {
        this.successExecutionsCount = successExecutionsCount;
    }

    public Long getFailureExecutionsCount() {
        return this.failureExecutionsCount;
    }

    public String getExecutionInfo() {
        return this.executionInfo;
    }

    public Set<GlobalVariable> setGlobalVariables(Set<GlobalVariable> globalVariables) {
        this.globalVariables = globalVariables;
        return this.globalVariables;
    }

    public Process failureExecutionsCount(Long failureExecutionsCount) {
        this.failureExecutionsCount = failureExecutionsCount;
        return this;
    }

    public Process executionInfo(String executionInfo) {
        this.executionInfo = executionInfo;
        return this;
    }

    public void setFailureExecutionsCount(Long failureExecutionsCount) {
        this.failureExecutionsCount = failureExecutionsCount;
    }

    public void setExecutionInfo(String executionInfo) {
        this.executionInfo = executionInfo;
    }

    public User getCreatedBy() {
        return this.createdBy;
    }

    public Process createdBy(User user) {
        this.setCreatedBy(user);
        return this;
    }

    public void setCreatedBy(User user) {
        this.createdBy = user;
    }

    public Boolean getPublic() {
        return isPublic;
    }

    public Boolean getAttended() {
        return isAttended;
    }

    public void setPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public BotSystem getSystem() {
        return system;
    }

    public void setSystem(BotSystem system) {
        this.system = system;
    }

    public BotCollection getBotCollection() {
        return botCollection;
    }

    public void setBotCollection(BotCollection botCollection) {
        this.botCollection = botCollection;
    }

    public Set<ScheduleProcess> getSchedules() {
        return schedules;
    }

    public void setSchedules(Set<ScheduleProcess> schedules) {
        this.schedules = schedules;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Process)) {
            return false;
        }
        return id != null && id.equals(((Process) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore

    @Override
    public String toString() {
        return "Process{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", description='" + description + '\'' +
            ", definition='" + definition + '\'' +
            ", isPublic=" + isPublic +
            ", isAttended=" + isAttended +
            ", isTriggerable=" + isTriggerable +
            ", created=" + created +
            ", updated=" + updated +
            ", executionsCount=" + executionsCount +
            ", successExecutionsCount=" + successExecutionsCount +
            ", failureExecutionsCount=" + failureExecutionsCount +
            ", executionInfo=" + executionInfo +
            ", createdBy=" + createdBy +
            ", system=" + system +
            ", schedules=" + schedules +
            ", botCollection=" + botCollection +
            '}';
    }
}
